import * as Checkbox from "@radix-ui/react-checkbox";
import { useState } from "react";

import { ReactComponent as Checked } from "../assets/checked.svg";
import { ReactComponent as UnChecked } from "../assets/un-checked.svg";

export const CheckBox = ({
  label,
  onToggle,
  isChecked,
}: {
  label: string;
  onToggle?: () => void;
  isChecked: boolean;
}) => {
  const [checked, setChecked] =
    useState<Checkbox.CheckedState>("indeterminate");

  return (
    <form>
      <div className="flex items-center">
        <Checkbox.Root
          checked={checked}
          onCheckedChange={() =>
            checked === "indeterminate"
              ? setChecked(true)
              : setChecked("indeterminate")
          }
          id="c1"
        >
          <Checkbox.Indicator>
            {checked === true && <Checked />}
            {checked === "indeterminate" && <UnChecked />}
          </Checkbox.Indicator>
        </Checkbox.Root>
        <label className="pl-2" htmlFor="c1">
          {label}
        </label>
      </div>
    </form>
  );
};
