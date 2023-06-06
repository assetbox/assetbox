export const InfoItem = ({
  label,
  children,
}: React.PropsWithChildren<Record<"label", string>>) => (
  <div className="flex mb-2 last:mb-0">
    <p className="text-sm font-bold text-gray w-28">{label}</p>
    <p className="text-sm font-bold">{children}</p>
  </div>
);
