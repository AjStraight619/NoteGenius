import { useEffect, useState } from "react";

// Define interfaces for the pod and subpod objects
type ImageInfo = {
  src: string;
  [key: string]: any; // This line is optional, to allow for additional, unknown properties
};

type Subpod = {
  img: ImageInfo;
  [key: string]: any; // This line is optional
};

type Pod = {
  subpods: Subpod[];
  [key: string]: any; // This line is optional
};

export default function Math(equations: string[]) {
  const [images, setImages] = useState<string[]>([]); // Specify type for useState
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/wolfram-alpha", {
        method: "GET",
        body: JSON.stringify(equations),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      } else {
      }
    };
    fetchData();
  }, [equations]);

  return <div>Math</div>;
}
