export type BlobData = {
  blob: Blob;
  filename: string;
};

export const fileToBlob = (file: File): Promise<BlobData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (!reader.result) {
        reject(new Error("Unable to convert file to blob"));
        return;
      }
      const blob = new Blob([reader.result], {
        type: file.type,
      });

      resolve({
        blob,
        filename: file.name,
      });
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
