"use client";
import useMathResponse from "@/hooks/useMathResponse";
import { useEffect } from "react";

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

export type QueryResult = {
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

export type WolframAlphaResponse = {
  queryresult: QueryResult;
};
const TestComponent = () => {
  const { mathState, isLoadingMath, isError, mathResponse, mathDispatch } =
    useMathResponse();

  useEffect(() => {
    mathDispatch({ type: "ADD_EQUATION", payload: "x^2 + y^2 = 1" });
  }, []);

  if (isLoadingMath) {
    return <div>Loading...</div>;
  }

  if (
    isError ||
    !mathResponse ||
    !mathResponse.queryresult ||
    !mathResponse.queryresult.pods
  ) {
    return <div>Error: Could not load data</div>;
  }

  return (
    <div>
      <h2>Math Response</h2>
      <pre>{JSON.stringify(mathResponse, null, 2)}</pre>
      {mathResponse.queryresult.pods.length > 0 ? (
        mathResponse.queryresult.pods.map((pod: Pod, index: number) => (
          <div key={`${pod.title}-${index}`}>
            <h3>{pod.title}</h3>
            {pod.subpods.map((subpod: Subpod, subIndex: number) => (
              <div key={subIndex}>
                <img src={subpod.img.src} alt={subpod.img.alt} />
                <p>{subpod.plaintext}</p>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default TestComponent;
