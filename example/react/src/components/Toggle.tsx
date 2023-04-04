import { cloneElement } from "react";

export type ToggleProps = {
  active: boolean;
  onClick?: () => void;
  activeComponent: React.ReactElement;
  component: React.ReactElement;
};

export const Toggle = ({
  active,
  onClick,
  activeComponent,
  component,
}: ToggleProps) => {
  return (
    <>
      {active
        ? cloneElement(activeComponent, { onClick })
        : cloneElement(component, { onClick })}
    </>
  );
};
