// import { useCallback, useEffect, useState } from "react";
// import useSWR, { mutate } from "swr";

// type ActionType = "CREATE" | "UPDATE" | "DELETE" | null;

// type Action = {
//   type: ActionType;
//   data: any;
// };

// function useManageData() {
//   const [action, setAction] = useState<Action | null>(null);

//   const { data: serverData, error } = useSWR("/api/data", fetch);

//   const manageData = useCallback((actionType: ActionType, data: any) => {
//     setAction({ type: actionType, data });
//   }, []);

//   useEffect(() => {
//     const manageAsyncOperations = async () => {
//       if (action) {
//         const { type, data } = action;
//         try {
//           switch (type) {
//             case "CREATE":
//               await createData(data);
//               break;
//             case "UPDATE":
//               await updateData(data);
//               break;
//             case "DELETE":
//               await deleteData(data);
//               break;
//             default:
//               throw new Error("Unknown action type");
//           }

//           mutate("/api/data");
//         } catch (error) {
//           console.error(error);
//         }

//         setAction(null);
//       }
//     };

//     manageAsyncOperations();
//   }, [action]);

//   return {
//     serverData,
//     error,
//     manageData,
//   };
// }

// async function createData(data: any) {}

// async function updateData(data: any) {}

// async function deleteData(data: any) {}

// export default useManageData;
