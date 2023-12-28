import classNames from 'classnames';
import type { FC, PropsWithChildren, SVGProps } from 'react';

type MenuItem = {
  Icon: FC<SVGProps<SVGSVGElement>>;
  onClick: SVGProps<SVGSVGElement>['onClick'];
  isHide?: boolean;
};
type SidebarViewProps = PropsWithChildren & {
  startMenu?: MenuItem[];
  endMenu?: MenuItem[];
};

const DEFAULT_MENU_ITEM_STYLE = 'cursor-pointer w-4 h-4 hover:scale-110 mx-1';
const SidebarView: FC<SidebarViewProps> = ({ startMenu, endMenu, children }) => {
  const renderStartMenu = () => {
    if (!startMenu) return null;

    return (
      <div className="flex justify-start items-center">
        {startMenu
          .filter(({ isHide }) => !isHide)
          .map(({ Icon, onClick }, index) => (
            <Icon key={index} className={classNames(DEFAULT_MENU_ITEM_STYLE)} onClick={onClick} />
          ))}
      </div>
    );
  };

  const renderEndMenu = () => {
    if (!endMenu) return null;

    return (
      <div className="flex justify-end items-center">
        {endMenu
          .filter(({ isHide }) => !isHide)
          .map(({ Icon, onClick }, index) => (
            <Icon key={index} className={classNames(DEFAULT_MENU_ITEM_STYLE)} onClick={onClick} />
          ))}
      </div>
    );
  };

  return (
    <>
      {startMenu || endMenu ? (
        <div className="h-5 border-b-2 px-5 flex justify-between items-center">
          {renderStartMenu()}
          {renderEndMenu()}
        </div>
      ) : null}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">{children}</div>
    </>
  );
};

export default SidebarView;
