import { useCallback, useState } from "react";

export const useModal = <T = unknown>() => {
  const [modalData, setModal] = useState<{
    open: boolean;
    data?: T;
  }>({
    open: false,
  });

  const openModal = useCallback(
    (data: T) =>
      setModal({
        open: true,
        data,
      }),
    []
  );

  const closeModal = useCallback(
    () =>
      setModal((prev) => ({
        ...prev,
        open: false,
      })),
    []
  );
  return { openModal, closeModal, open: modalData.open, data: modalData.data };
};
