"use client";
import React, { useState } from "react";
declare var ImageCapture: any;

type TextAnnotation = {
  description: string;
};

export default function ImageUpload() {
  const [detections, setDetections] = useState<TextAnnotation[] | null>(null);

  async function handleCaptureAndProcessImage() {
    try {
      // Capture image
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const photo = await imageCapture.takePhoto();
      track.stop();

      // Upload image to server
      const formData = new FormData();
      formData.append("image", photo);
      const response = await fetch("/api/google", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      // Update UI with detected text
      const detectedText = data || "No text detected";
      setDetections(detectedText);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div>
      <button onClick={handleCaptureAndProcessImage}>
        Capture and Process Image
      </button>
      {detections && (
        <div className="flex items-center">
          <h3>Detected Text:</h3>
          <ul>
            {detections.map((text, index) => (
              <li key={index}>{text.description}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
