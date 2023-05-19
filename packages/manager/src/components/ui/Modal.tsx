import {
  Dialog,
  type DialogPanelProps,
  type DialogProps,
  Transition,
} from "@headlessui/react";

import { cn } from "../../utils";

export const Modal = ({ open, children, ...props }: DialogProps<"div">) => {
  return (
    <Transition
      className={"relative z-50"}
      show={open}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      as={"div"}
    >
      <Dialog {...props}>
        <>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          {children}
        </>
      </Dialog>
    </Transition>
  );
};

Modal.Panel = ({ className, ...props }: DialogPanelProps<"div">) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Dialog.Panel
        className={(bag) =>
          cn(
            "w-full max-w-sm bg-white rounded-md shadow",
            typeof className === "function" ? className(bag) : className
          )
        }
        {...props}
      />
    </div>
  );
};
