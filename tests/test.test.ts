import axios from "axios";
import fs from "fs"; // Import Node.js File System API

describe("Equation API Tests", () => {
  it("should return equations from provided content", async () => {
    const sampleContent = "x^2 + 3x - 4 = 0";

    // Write the sample content to a temporary text file
    const txtFile = "sample.txt";
    fs.writeFileSync(txtFile, sampleContent, "utf8");

    // Read the file content and create a Blob
    const fileContent = fs.readFileSync(txtFile);
    const fileBlob = new Blob([fileContent], { type: "text/plain" });

    // Sample FormData setup with the Blob
    const formData = new FormData();
    formData.append("filename", fileBlob, "sample.txt"); // Use fileBlob and specify the filename

    try {
      // Make the API call
      const response = await axios.post(
        "http://localhost:3000/app/api/equation-parse",
        formData
      );

      // Check the response (modify as per your requirements)
      expect(response.data).toEqual(expect.arrayContaining([sampleContent]));

      // Cleanup: Delete the temporary text file
      fs.unlinkSync(txtFile);
    } catch (error) {
      throw new Error(`API call failed: ${error}`);
    }
  });
});
