import {
  Listbox,
  ListboxButtonProps,
  ListboxOptionProps,
  ListboxOptionsProps,
  Transition,
} from "@headlessui/react";
import { ComponentProps, createContext } from "react";

import DownVector from "../../assets/down-vector.svg";
import { cn } from "../../utils/cn";

export const ListBox = ({ ...props }: ComponentProps<typeof Listbox>) => {
  return <Listbox {...props} />;
};

ListBox.Button = ({
  children,
  className,
  ...props
}: ListboxButtonProps<"button">) => {
  return (
    <Listbox.Button
      className={(bag) =>
        cn(
          "w-[165px] h-12 flex items-center rounded bg-white px-[10px] mb-1 outline-none",
          "group",
          typeof className === "function" ? className(bag) : className
        )
      }
      {...props}
    >
      <>
        {children}
        <DownVector
          className={cn(
            "ml-auto",
            "group-data-[headlessui-state=open]:rotate-180 transform"
          )}
        />
      </>
    </Listbox.Button>
  );
};

ListBox.Options = ({ ...props }: ListboxOptionsProps<"ul">) => {
  return (
    <Transition
      className={"inline-block"}
      enter="transition duration-100 ease-in"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-in"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Listbox.Options className={"outline-none"} {...props} />
    </Transition>
  );
};

ListBox.Option = ({ className, ...props }: ListboxOptionProps<"li", any>) => {
  return (
    <Listbox.Option
      {...props}
      className={(bag) =>
        cn(
          "bg-white cursor-pointer text-base w-[165px] h-12 flex items-center border-b border-gray-light last:border-b-0 px-[10px]",
          "first:rounded-t last:rounded-b",
          bag.active && "text-blue",
          typeof className === "function" ? className(bag) : className
        )
      }
    />
  );
};
