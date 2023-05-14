import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import { useMemo } from "react";

import { cn } from "../../utils";

interface IDropdownProps extends React.HTMLAttributes<HTMLSelectElement> {
  columns: IColumn[];
  handleValue: (data: string) => void;
}
interface IColumn {
  title: string;
  value: string;
}

export const Dropdown = ({
  columns,
  className,
  handleValue,
}: IDropdownProps) => {
  const Items = () => {
    const generatedItems = useMemo(
      () =>
        columns.map((elem, idx) => (
          <>
            <SelectItem key={idx} value={elem.value} className={className}>
              {elem.title}
            </SelectItem>
            <Select.Separator
              className={cn(
                idx !== columns.length - 1 && "h-[1px] bg-gray-light"
              )}
            />
          </>
        )),
      []
    );
    return <>{generatedItems}</>;
  };

  return (
    <div className="p-40">
      <Select.Root onValueChange={(value) => handleValue(value)}>
        <Select.Trigger
          className={cn(
            "flex items-center bg-white px-[20px] rounded",
            className
          )}
        >
          <Select.Value className="mr-auto" placeholder={"select"} />
          <Select.Icon className="ml-auto text-lg">
            <ChevronDownIcon className="" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="SelectContent">
            <Select.ScrollUpButton className="SelectScrollButton">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="SelectViewport">
              <Select.Group>
                <Items />
              </Select.Group>
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
