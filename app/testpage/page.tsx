// "use client";
// import useMathResponse from "@/hooks/useMathResponse";

// const TestComponent = () => {
//   const { mathState, isLoadingMath, isError, mathResponse } = useMathResponse({
//     equations: ["x^2 + y^2 = 1"],
//   });
//   console.log(mathResponse);
//   return (
//     <div>
//       {mathResponse.pods.map((pod: any) => (
//         <div key={pod.id}>
//           <h3>{pod.title}</h3>
//           <p>{pod.subpods[0].plaintext}</p>
//           {/* More rendering based on pod content */}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TestComponent;

"use client";
import { useEffect, useState } from "react";

type ImageInfo = {
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  type: string;
  themes: string;
  colorinvertable: boolean;
  contenttype: string;
};

type Subpod = {
  title: string;
  img: ImageInfo;
  plaintext: string;
};

type Pod = {
  title: string;
  scanner: string;
  id: string;
  position: number;
  error: boolean;
  numsubpods: number;
  subpods: Subpod[];
  expressiontypes?: { name: string };
  states?: { name: string; input: string }[];
};

type QueryResult = {
  success: boolean;
  error: boolean;
  numpods: number;
  datatypes: string;
  timedout: string;
  timedoutpods: string;
  timing: number;
  parsetiming: number;
  parsetimedout: boolean;
  recalculate: string;
  id: string;
  host: string;
  server: string;
  related: string;
  version: string;
  inputstring: string;
  pods: Pod[];
};

type WolframAlphaResponse = {
  queryresult: QueryResult;
};
const TestComponent = () => {
  const [mathResponse, setMathResponse] = useState<WolframAlphaResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMathData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "/api/wolfram-alpha?equation=" + encodeURIComponent("x^2 + y^2 = 1")
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: WolframAlphaResponse = await response.json();
        setMathResponse(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMathData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!mathResponse) {
    return <div>No data available</div>;
  }

  console.log(mathResponse);

  return (
    <div>
      <h2>Math Response</h2>
      <pre>{JSON.stringify(mathResponse, null, 2)}</pre>
      {mathResponse.queryresult.pods.map((pod) => (
        <div key={pod.title}>
          <h3>{pod.title}</h3>
          {pod.subpods.map((subpod, index) => (
            <div key={index}>
              <img src={subpod.img.src} alt={subpod.img.alt} />
              <p>{subpod.plaintext}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TestComponent;
