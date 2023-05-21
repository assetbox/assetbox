import { cva, type VariantProps } from "class-variance-authority";

import DangerInformationIcon from "../../assets/danger-information.svg";
import { cn } from "../../utils";

export type AlertVariantProps = VariantProps<typeof alertVariants>;
type AlertProps = React.HTMLAttributes<HTMLDivElement> & AlertVariantProps;

const alertVariants = cva("flex py-4 gap-3 items-center", {
  variants: {
    variant: {
      danger: ["bg-[rgba(255,54,122,0.1)]"],
    },
  },
});

export const Alert = ({ variant, children, ...props }: AlertProps) => {
  return (
    <div {...props} className={cn(alertVariants({ variant }))}>
      <DangerInformationIcon className="ml-3" />
      <p className="text-xs">{children}</p>
    </div>
  );
};
