import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const sections = [
  {
    title: 'Introduction',
    content: ['Over the past few decades, space missions have exponentially increased, leading to a congested orbital environment filled with operational satellites, retired spacecraft, fragments from collisions, and rocket bodies. These objects, collectively termed space debris, pose a serious threat to both manned and unmanned missions. Even a small object moving at high orbital velocity can cause catastrophic damage to spacecraft.'
    
    ,'Traditional approaches for monitoring debris primarily involve manual inspection or semi-automated radar systems. However, these are resource-intensive and often lack the speed and precision needed for timely intervention. With the growing volume of satellite imagery being captured daily, there is an urgent need for an automated solution capable of detecting and classifying space debris efficiently.',]
  },
  {
    title: 'Key Objectives',
    content: [
      'Demonstrating the practical application of computer vision in space missions',
      'Providing a scalable framework for real-time space object detection.',
      'Exploring the possibility of integration with global space traffic management systems.'
    ]
  },
  {
    title: 'Methodology',
    content: [
    ' Dataset Preparation: Acquired and augmented SPARK 2022 Stream-1 dataset.',
    ' Model Training: Fine-tuned YOLOv8 using pre-trained weights and applied augmentations.',
    ' Evaluation Metrics: Used mAP, IoU, Precision, Recall, and visual analysis.'
    ]
  }
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <header className="project-header">
        <h1>Space Debris Detector &</h1>
        <h1>Space Craft Classification Using YOLOv8 </h1>
      </header>
      
      {sections.map((section, index) => (
        <div key={index} className="project-card">
          <h3>{section.title}</h3>
          {Array.isArray(section.content) ? (
            <ul>
              {section.content.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{section.content}</p>
          )}
        </div>
      ))}

      <div className="action-section">
        <button onClick={() => navigate('/upload')}>Enter</button>
        <p className="tech-tag">Powered By YOLOv8 technology</p>
      </div>
    </div>
  );
};

export default HomePage;