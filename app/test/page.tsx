"use client";
// Importing necessary libraries and components
import { Button, Flex } from "@radix-ui/themes";
import Image from "next/image";
import { useEffect, useState } from "react";

// Define interfaces for the pod and subpod objects
interface ImageInfo {
  src: string;
  [key: string]: any; // This line is optional, to allow for additional, unknown properties
}

interface Subpod {
  img: ImageInfo;
  [key: string]: any; // This line is optional
}

interface Pod {
  subpods: Subpod[];
  [key: string]: any; // This line is optional
}

export default function Page() {
  const [images, setImages] = useState<string[]>([]); // Specify type for useState
  useEffect(() => {
    console.log("images:", images);
  }, [images]);

  const handleApiCall = async () => {
    try {
      const res = await fetch("/api/wolfram-alpha", {
        method: "GET",
      });
      const data = await res.json();
      console.log(JSON.stringify(data.queryresult, null, 2));
      console.log(
        "Array.isArray(data.queryresult.pod):",
        Array.isArray(data.queryresult.pods)
      );

      const firstPod = data.queryresult.pods[0] as Pod;
      const firstSubpod = firstPod.subpods[0] as Subpod;
      const firstImage = firstSubpod.img.src;
      setImages((prev) => [...prev, firstImage]);
      console.log("firstImage:", firstImage);

      console.log("firstPod:", firstPod);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex justify={"center"} align={"center"} direction={"column"}>
      <Button onClick={handleApiCall}>Call Api</Button>
      {images.map((image) => (
        <Image key={image} src={image} alt="image" width="200" height="100" />
      ))}
    </Flex>
  );
}
