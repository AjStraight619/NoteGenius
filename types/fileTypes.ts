export type FileProps = {
  id: string;
  file: File;
  content: string;
  name: string;
};

export type ProcessImageResponse = {
  detectedText: string;
  jpegUrl?: string;
};
