import { FileProps } from "@/types/fileTypes";

export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
};

export const isPDF = (file: File): boolean => {
  return file.type === "application/pdf";
};
export const isHEIC = (file: File): boolean => {
  return (
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  );
};

export const isImageType = (file: File): boolean => {
  return (
    file.type.startsWith("image/") ||
    /\.(jpeg|jpg|gif|png|bmp|tiff|webp|heic)$/i.test(file.name.toLowerCase())
  );
};

export const isDuplicateFile = (
  selectedFile: File,
  files: FileProps[]
): boolean | undefined => {
  return files.some((file) => selectedFile.name === file.name);
};
