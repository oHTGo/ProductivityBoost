import type { ChangeEventHandler, FC } from 'react';

type ToggleProps = {
  isChecked: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const Toggle: FC<ToggleProps> = ({ isChecked, onChange }) => {
  return (
    <input
      type="checkbox"
      className="text-black focus:ring-transparent rounded-sm"
      checked={isChecked}
      onChange={onChange}
    />
  );
};

export default Toggle;
