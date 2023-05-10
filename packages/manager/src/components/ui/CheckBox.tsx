import * as Checkbox from "@radix-ui/react-checkbox";
import { nanoid } from "nanoid/non-secure";
import { useState } from "react";

import CheckedIcon from "../../assets/checked.svg";
import UnCheckedIcon from "../../assets/un-checked.svg";
import { cn } from "../../utils";

interface CheckBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  onToggle?: () => void;
  checked: boolean;
}

export const CheckBox = ({
  label,
  onToggle,
  checked,
  className,
  ...rest
}: CheckBoxProps) => {
  const [id] = useState(() => nanoid());

  return (
    <div className={cn("inline-flex items-center", className)} {...rest}>
      <Checkbox.Root checked={checked} onCheckedChange={onToggle} id={id}>
        <Checkbox.Indicator forceMount>
          {checked === true ? <CheckedIcon /> : <UnCheckedIcon />}
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label className="pl-2 cursor-pointer select-none text-gray" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
