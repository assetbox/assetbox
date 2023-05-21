import { Button, ButtonVariantProps } from "./Button";
import { Modal } from "./Modal";

export type ConfirmModalProps<T = unknown> = {
  open: boolean;
  confirmText?: string;
  data?: T | undefined;
  confirmVariant?: ButtonVariantProps["variant"];
  cancelText?: string;
  cancelVariant?: ButtonVariantProps["variant"];
  onConfirm?: () => void;
  onCancel: () => void;
  children?: React.ReactNode | React.ReactNode[];
};

export function ConfirmModal<T>({
  open,
  confirmText = "Confirm",
  confirmVariant = "primary",
  cancelText = "Cancel",
  cancelVariant = "danger",
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps<T>) {
  return (
    <Modal open={open} onClose={onCancel}>
      <Modal.Panel className={"w-80 p-5"}>
        <div className="mb-5">{children}</div>
        <div className="flex justify-end gap-1">
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            className="text-sm w-14"
          >
            {confirmText}
          </Button>
          <Button
            variant={cancelVariant}
            onClick={onCancel}
            className="text-sm w-14"
          >
            {cancelText}
          </Button>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
