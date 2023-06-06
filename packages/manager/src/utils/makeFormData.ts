export const makeFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  const append = (key: string, value: any) => {
    // @see Type is BlobData
    if (
      typeof value === "object" &&
      value.blob instanceof Blob &&
      value.filename
    ) {
      formData.append(key, value.blob, value.filename);
      return;
    }
    formData.append(key, value);
  };

  Object.entries(data).forEach(([key, value]) => {
    append(key, value);

    if (Array.isArray(value)) {
      value.forEach((item) => {
        append(key, item);
      });
    }
  });
  return formData;
};
