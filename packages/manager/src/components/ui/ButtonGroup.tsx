import * as RadioGroup from "@radix-ui/react-radio-group";

import { cn } from "../../utils";
import { Button } from "./Button";

export const ButtonGroup = ({
  className,
  ...props
}: RadioGroup.RadioGroupProps) => {
  return (
    <RadioGroup.Root className={cn("inline-block", className)} {...props} />
  );
};

ButtonGroup.Button = ({
  children,
  className,
  ...props
}: RadioGroup.RadioGroupItemProps) => {
  return (
    <RadioGroup.Item
      className={cn(
        "first:rounded-l first:border-r last:rounded-r last:border-r-0 border-r border-gray-border border-collapse data-[state=checked]:bg-blue data-[state=checked]:bg-opacity-100 bg-gray bg-opacity-40 transition",
        className
      )}
      {...props}
    >
      <Button variant={"group"} className={"w-full h-full"}>
        {children}
      </Button>
    </RadioGroup.Item>
  );
};
