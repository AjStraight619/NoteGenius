import { useEffect } from "react";

// custom hook for POST request for adding folder or notes
export default function useApi(name: string, itemType: "folder" | "note") {
  useEffect(() => {
    const apiUrl = itemType === "folder" ? "/api/folders" : "/api/notes";

    const addItems = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });

        if (!response.ok) {
          // Handle non-2xx response here
          console.error("Error:", response.status, response.statusText);
        } else {
          // Handle successful response here
          // You can do something after the POST request succeeds
        }
      } catch (error) {
        // Handle network or other errors
        console.error("Error:", error);
      }
    };

    // Call the addItems function to trigger the API request
    if (name) {
      addItems();
    }
  }, [name, itemType]);
}
