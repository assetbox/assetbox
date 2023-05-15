import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import { useMemo } from "react";

import { cn } from "../../utils";

interface DropdownProps extends React.HTMLAttributes<HTMLSelectElement> {
  columns: string[];
  handleValue: (data: string) => void;
  selectedValue: string;
}
export const Dropdown = ({
  columns,
  className,
  selectedValue,
  handleValue,
}: DropdownProps) => {
  const items = useMemo(
    () =>
      columns.map((elem, idx) => (
        <>
          <SelectItem
            key={`select-${idx}-${elem}`}
            value={elem}
            className={className}
          >
            {elem}
          </SelectItem>
          <Select.Separator className={cn("h-[1px] bg-gray-light last:h-0")} />
        </>
      )),
    []
  );

  return (
    <div className="p-40">
      <Select.Root
        value={selectedValue}
        onValueChange={(value) => handleValue(value)}
      >
        <Select.Trigger
          className={cn(
            "flex items-center bg-white px-[20px] rounded",
            className
          )}
        >
          <Select.Value className="mr-auto" placeholder={"select"} />
          <Select.Icon className="ml-auto text-lg">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="SelectContent">
            <Select.ScrollUpButton className="SelectScrollButton">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="SelectViewport">
              <Select.Group>{items}</Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

const SelectItem = ({
  children,
  className,
  ...props
}: Select.SelectItemProps) => {
  return (
    <>
      <Select.Item
        className={cn(
          "flex items-center bg-white px-[20px] rounded",
          className
        )}
        {...props}
      >
        <Select.ItemText className="mr-auto">{children}</Select.ItemText>
        <Select.ItemIndicator className="ml-auto text-base">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    </>
  );
};
