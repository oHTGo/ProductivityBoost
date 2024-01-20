import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';

type IconButtonProps = PropsWithChildren & {
  className?: HTMLButtonElement['className'];
  onClick?: HTMLButtonElement['click'];
};

const IconButton: FC<IconButtonProps> = ({ children, className, onClick }) => {
  return (
    <button
      className={classNames(
        'inline-block p-1 bg-white hover:bg-stone-200 outline-none',
        'rounded-full border border-gray-300',
        'flex justify-center items-center',
        className,
      )}
      onClick={onClick}>
      {children}
    </button>
  );
};

export default IconButton;
