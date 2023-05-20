import BlueCheckIcon from "../assets/blue-check.svg";

export const DupePage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center">
        <BlueCheckIcon className="mb-5 w-28 h-28" />
        <p className="text-3xl font-normal">All files are unique</p>
      </div>
    </div>
  );
};
