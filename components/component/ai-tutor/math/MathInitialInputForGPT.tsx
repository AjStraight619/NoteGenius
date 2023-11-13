// "use client";
// import useMathResponse from "@/hooks/useMathResponse";
// import { Pod, Subpod } from "@/types/wolframAlphaTypes";

// const TestComponent = () => {
//   const { mathState, isLoadingMath, isError, mathResponse } = useMathResponse({
//     equations: ["x^2 + y^2 = 1"],
//   });

//   if (isLoadingMath) {
//     return <div>Loading...</div>;
//   }

//   if (
//     isError ||
//     !mathResponse ||
//     !mathResponse.queryresult ||
//     !mathResponse.queryresult.pods
//   ) {
//     return <div>Error: Could not load data</div>;
//   }

//   return (
//     <div>
//       <h2>Math Response</h2>
//       <pre>{JSON.stringify(mathResponse, null, 2)}</pre>
//       {mathResponse.queryresult.pods.length > 0 ? (
//         mathResponse.queryresult.pods.map((pod: Pod, index: number) => (
//           <div key={`${pod.title}-${index}`}>
//             <h3>{pod.title}</h3>
//             {pod.subpods.map((subpod: Subpod, subIndex: number) => (
//               <div key={subIndex}>
//                 <img src={subpod.img.src} alt={subpod.img.alt} />
//                 <p>{subpod.plaintext}</p>
//               </div>
//             ))}
//           </div>
//         ))
//       ) : (
//         <div>No data available</div>
//       )}
//     </div>
//   );
// };

// export default TestComponent;
