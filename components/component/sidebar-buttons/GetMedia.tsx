"use client";
import React, { useState } from "react";
declare var ImageCapture: any;
import { CameraIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import { FileProps } from "./RefineButtonGroup";
import { v4 as uuidv4 } from "uuid";
import "./styles.css";

type ImageCapture = {
  setSelectedFile: React.Dispatch<React.SetStateAction<FileProps[] | null>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  isProcessing: boolean;
};

function CaptureAndProcessImageButton({
  setSelectedFile,
  setIsProcessing,
  isProcessing,
}: ImageCapture) {
  async function handleCaptureAndProcessImage() {
    setIsProcessing(true);
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
      const response = await fetch("/api/google-vision", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      const detectedText = data[0]?.description || "No text detected";

      const newFile = {
        id: uuidv4(),
        file: photo,
        content: detectedText,
        name: "image-text",
      };

      setSelectedFile((prevFiles) =>
        prevFiles ? [...prevFiles, newFile] : [newFile]
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div>
      <IconButton
        style={{ backgroundColor: "transparent" }}
        className={`${
          isProcessing ? "opacity-50 cursor-not-allowed" : ""
        } hide-on-large`}
        onClick={handleCaptureAndProcessImage}
        disabled={isProcessing}
      >
        <CameraIcon
          style={{
            width: "32px",
            height: "32px",
            color: "white",
          }}
          className="hover:shadow-lg appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] cursor-pointer"
        />
      </IconButton>
    </div>
  );
}

export default CaptureAndProcessImageButton;
