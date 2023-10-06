"client component";
import React, { useState } from "react";
declare var ImageCapture: any;
import { CameraIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
function CaptureAndProcessImageButton() {
  const [processing, setProcessing] = useState(false);
  const [text, setText] = useState<string | null>(null);

  async function handleCaptureAndProcessImage() {
    setProcessing(true);
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
      const detectedText = data[0]?.description || "No text detected";
      setText(detectedText);
    } catch (error) {
      console.error("Error:", error);
      setText("Error processing image");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div>
      <IconButton onClick={handleCaptureAndProcessImage} disabled={processing}>
        <CameraIcon />
        {processing ? "Processing..." : "Capture and Process Image"}
      </IconButton>
      {text && (
        <div>
          <h2>Detected Text:</h2>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default CaptureAndProcessImageButton;
