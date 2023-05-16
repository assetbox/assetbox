import { Listbox, Transition } from "@headlessui/react";
import { ComponentProps, ReactNode } from "react";

import DownVector from "../../assets/down-vector.svg";
import { cn } from "../../utils/cn";
export interface SelectProps {
  selectedValue?: any;
  onChange: (value: any) => void;
}

export const Select = ({
  selectedValue,
  onChange,
  children,
}: React.PropsWithChildren<SelectProps>) => {
  return (
    <Listbox value={selectedValue} onChange={onChange}>
      {children}
    </Listbox>
  );
};

Select.Button = ({
  children,
  ...props
}: ComponentProps<typeof Listbox.Button>) => {
  return (
    <Listbox.Button
      className={cn(
        "w-[165px] h-12 flex items-center rounded bg-white px-[10px] mb-1"
      )}
      {...props}
    >
      {({ open }) => (
        <>
          {children}
          <DownVector
            className={cn("ml-auto", open && "rotate-180 transform")}
          />
        </>
      )}
    </Listbox.Button>
  );
};
Select.Options = ({ ...props }: ComponentProps<typeof Listbox.Options>) => {
  return (
    <Transition
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Listbox.Options {...props} />
    </Transition>
  );
};

type ClassNameArgs = {
  active: boolean;
  selected: boolean;
};

Select.Option = ({
  className,
  ...props
}: ComponentProps<typeof Listbox.Option> & {
  className?: ((args: ClassNameArgs) => string) | string;
}) => {
  return (
    <Listbox.Option
      {...props}
      className={({ active, selected }: ClassNameArgs) =>
        cn(
          "bg-white cursor-pointer text-base w-[165px] h-12 flex items-center border-b border-gray-light last:border-b-0 px-[10px]",
          "first:rounded-t last:rounded-b",
          active && "text-blue",
          typeof className === "function"
            ? className({ active, selected })
            : className
        )
      }
    />
  );
};
