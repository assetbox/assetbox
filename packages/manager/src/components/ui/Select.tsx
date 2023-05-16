import { Listbox } from "@headlessui/react";
import { ComponentProps } from "react";

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
        "w-[165px] h-12 flex items-center  rounded bg-white px-[10px] mb-1"
      )}
      {...props}
    >
      <>
        {children}
        <DownVector className="ml-auto" />
      </>
    </Listbox.Button>
  );
};
Select.Options = ({ ...props }: ComponentProps<typeof Listbox.Options>) => {
  return <Listbox.Options {...props} />;
};

type ClassNameArgs = {
  active: boolean;
  selected: boolean;
};

Select.Option = ({
  className,
  ...props
}: ComponentProps<typeof Listbox.Option> & {
  className?: (args: ClassNameArgs) => string | string;
}) => {
  return (
    <Listbox.Option
      {...props}
      className={({ active, selected }: ClassNameArgs) =>
        cn(
          "bg-white cursor-pointer text-base w-[165px] h-12 flex items-center border-b border-gray-light last:border-b-0 px-[10px]",
          "first:rounded last:rounded",
          active && "text-blue",
          typeof className === "function"
            ? className({ active, selected })
            : className
        )
      }
    />
  );
};
