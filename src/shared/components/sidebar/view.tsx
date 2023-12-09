import classNames from 'classnames';
import type { FC, ReactNode, SVGProps } from 'react';

type MenuItem = {
  Icon: FC<SVGProps<SVGSVGElement>>;
  onClick: SVGProps<SVGSVGElement>['onClick'];
  isHide?: boolean;
};
type SidebarViewProps = {
  startMenu?: MenuItem[];
  endMenu?: MenuItem[];
  content: ReactNode;
};

const DEFAULT_MENU_ITEM_STYLE = 'cursor-pointer w-4 h-4 hover:scale-110 mx-1';
const SidebarView: FC<SidebarViewProps> = ({ startMenu, endMenu, content }) => {
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
      <div className="h-5 border-b-2 px-5 flex justify-between items-center">
        {renderStartMenu()}
        {renderEndMenu()}
      </div>
      <div className="flex-1 overflow-x-hidden overflow-y-auto">{content}</div>
    </>
  );
};

export default SidebarView;
