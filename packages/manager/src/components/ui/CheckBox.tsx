import * as Checkbox from "@radix-ui/react-checkbox";
import { nanoid } from "nanoid/non-secure";
import { useState } from "react";

import CheckedIcon from "../../assets/checked.svg";
import UnCheckedIcon from "../../assets/un-checked.svg";
import { cn } from "../../utils";

interface CheckBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  onCheckedChange?: () => void;
  checked: boolean;
}

export const CheckBox = ({
  label,
  onCheckedChange,
  checked,
  className,
  ...rest
}: CheckBoxProps) => {
  const [id] = useState(() => nanoid());

  return (
    <div className={cn("inline-flex items-center", className)} {...rest}>
      <Checkbox.Root
        className="outline-none"
        checked={checked}
        onCheckedChange={onCheckedChange}
        id={id}
      >
        <Checkbox.Indicator forceMount className="w-4 h-4">
          {checked === true ? <CheckedIcon /> : <UnCheckedIcon />}
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label
        className={cn(
          "pl-2 text-sm cursor-pointer select-none",
          checked ? "text-black" : "text-gray"
        )}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};
