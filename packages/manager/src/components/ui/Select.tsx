import { Listbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
export const Select = () => {
  return (
    <Listbox>
      <Select.Button />
    </Listbox>
  );
};

Select.Button = () => {
  return <Listbox.Button></Listbox.Button>;
};

Select.Option = () => {
  return <Listbox.Options></Listbox.Options>;
};
