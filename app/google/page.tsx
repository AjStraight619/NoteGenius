"use client";
import { useState } from "react";

export default function ImageUpload() {
  const [refinedText, setRefinedText] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      let image = files[0];
      console.log("Uploading image:", image.name);

      const formData = new FormData();
      formData.append("image", image);

      try {
        const res = await fetch("/api/google-vision", {
          method: "POST",
          body: formData,
        });

        const data = await res.text(); // assuming the response is plain text
        setRefinedText(data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*,.heic"
        capture="environment"
        onChange={handleImageChange}
      />
      {refinedText &&
        refinedText
          .replace(/\\n/g, "\n")
          .split("\n")
          .map((line, index) => (
            <div key={index}>
              {line}
              <br />
            </div>
          ))}
    </div>
  );
}
