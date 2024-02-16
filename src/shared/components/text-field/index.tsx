import classNames from 'classnames';
import type { FC, InputHTMLAttributes } from 'react';

type TextFieldProps = {
  id: string;
  label: string;
  value: HTMLInputElement['value'];
  onChange: InputHTMLAttributes<HTMLInputElement>['onChange'];
  className?: HTMLDivElement['className'];
};

const TextField: FC<TextFieldProps> = ({ id, label, value, onChange, className }) => {
  return (
    <div className={classNames('w-96', className)}>
      <label htmlFor={id} className="block text-xs font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        className="mt-1 w-full rounded-md border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-800 shadow-sm sm:text-sm"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default TextField;
