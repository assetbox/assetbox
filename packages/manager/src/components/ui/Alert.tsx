import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { match } from "ts-pattern";

import AlertInformationIcon from "../../assets/alert-information.svg";
import DangerInformationIcon from "../../assets/danger-information.svg";
import { cn } from "../../utils";

export type AlertVariantProps = VariantProps<typeof alertVariants>;
type AlertProps = React.HTMLAttributes<HTMLDivElement> & AlertVariantProps;

const alertVariants = cva("flex py-4 gap-3 items-center", {
  variants: {
    variant: {
      danger: ["bg-[rgba(255,54,122,0.1)]"],
      info: ["bg-blue bg-opacity-10"],
    },
  },
});

export const Alert = ({ variant, children, ...props }: AlertProps) => {
  const icon = ({ variant }: AlertVariantProps) => {
    return match(variant)
      .with("danger", () => <DangerInformationIcon className="ml-3" />)
      .with("info", () => <AlertInformationIcon className="ml-3" />)
      .otherwise(() => <AlertInformationIcon className="ml-3" />);
  };

  return (
    <div {...props} className={cn(alertVariants({ variant }))}>
      {icon({ variant })}
      <p className="text-xs">{children}</p>
    </div>
  );
};
