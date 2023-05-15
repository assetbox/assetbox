import * as RadioGroup from "@radix-ui/react-radio-group";

import { Button } from "./Button";

interface ButtonGroupProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  defaultValue?: string;
}

export const ButtonGroup = ({ children, defaultValue }: ButtonGroupProps) => {
  return (
    <RadioGroup.Root defaultValue={defaultValue}>{children}</RadioGroup.Root>
  );
};

ButtonGroup.Button = ({ children, ...rest }: ButtonGroupProps) => {
  return (
    <RadioGroup.Item
      className="first:rounded-l fisrt:border-r last:rounded-r last:border-r-0 border-r border-gray-border border-collapse data-[state=checked]:bg-blue data-[state=checked]:bg-opacity-100 bg-gray bg-opacity-40"
      value={children as string}
    >
      <Button variant="group" {...rest}>
        {children}
      </Button>
    </RadioGroup.Item>
  );
};
