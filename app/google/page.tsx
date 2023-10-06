import React, { useState } from "react";

type TextAnnotation = {
  description: string;
};

export default function ImageUpload() {
  const [detections, setDetections] = useState<TextAnnotation[] | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const image = files[0];
      console.log("Uploading image:", image.name);

      const formData = new FormData();
      formData.append("image", image);

      try {
        const response = await fetch("/api/google", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        setDetections(data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
      />
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
