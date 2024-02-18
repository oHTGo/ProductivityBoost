import classNames from 'classnames';
import type { FC } from 'react';

type GroupButtonProps = {
  buttons: {
    label: string;
    onClick: HTMLButtonElement['click'];
    active?: boolean;
    disabled?: boolean;
  }[];
  className?: string;
};

const GroupButton: FC<GroupButtonProps> = ({ buttons, className }) => {
  return (
    <div className={classNames('inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1', className)}>
      {buttons.map(({ label, onClick, active, disabled }) => (
        <button
          key={label}
          className={classNames(
            'inline-block rounded-md px-4 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative',
            active ? 'bg-white text-blue-500 shadow-sm' : '',
            disabled ? 'cursor-default' : '',
          )}
          onClick={onClick}
          disabled={disabled}>
          {label}
        </button>
      ))}
    </div>
  );
};

export default GroupButton;
