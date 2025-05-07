import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
import logging
from ultralytics import YOLO
from typing import Annotated
from pydantic import BaseModel
import time

# Initialize FastAPI app
app = FastAPI(title="Spacecraft Detection API",
              description="API for detecting spacecraft and debris using YOLOv8")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Load the YOLO model only once during app startup
try:
    model = YOLO(r"model/best.pt")
    # Warm up the model
    dummy_input = np.zeros((640, 640, 3), dtype=np.uint8)
    model(dummy_input, verbose=False)
    logging.info("Model loaded and warmed up successfully")
except Exception as e:
    logging.critical(f"Failed to load model: {e}")
    raise RuntimeError("Model initialization failed") from e

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ErrorResponse(BaseModel):
    error: str
    detail: str
    timestamp: str

@app.post("/process",
          response_class=StreamingResponse,
          responses={
              200: {"content": {"image/png": {}}},
              400: {"model": ErrorResponse},
              500: {"model": ErrorResponse}
          })
async def process_image(
    image: Annotated[UploadFile, File(description="Image file (JPEG, PNG) under 5MB")]
):
    """
    Process an image to detect spacecraft and debris.
    
    Returns:
        StreamingResponse: PNG image with detection annotations
    """
    start_time = time.time()
    
    try:
        # Validate input file
        if not image.content_type.startswith('image/'):
            raise HTTPException(400, "File must be an image (JPEG/PNG)")
        
        if image.size > 5 * 1024 * 1024:  # 5MB limit
            raise HTTPException(400, "Image too large (max 5MB)")

        # Read and decode image
        contents = await image.read()
        np_img = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(400, "Invalid image file - failed to decode")

        # Process image with YOLO
        results = model(img, imgsz=640, verbose=False)
        
        # Generate output image with annotations
        output_image = results[0].plot()
        
        # Encode as PNG
        success, buffer = cv2.imencode('.png', output_image)
        if not success:
            raise RuntimeError("Failed to encode output image")

        logger.info(f"Processed image in {time.time()-start_time:.2f}s")
        
        return StreamingResponse(
            BytesIO(buffer.tobytes()),
            media_type="image/png",
            headers={
                "X-Processing-Time": f"{time.time()-start_time:.3f}s",
                "X-Detections-Count": str(len(results[0].boxes))
            }
        )
    
    except HTTPException:
        raise  # Re-raise FastAPI HTTP exceptions
    
    except Exception as e:
        logger.error(f"Processing failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Image processing failed",
                "detail": str(e),
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            }
        ) from e