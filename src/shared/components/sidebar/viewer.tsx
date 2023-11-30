import type { FC, ReactNode } from 'react';

type SidebarViewerProps = {
  menu: ReactNode;
  content: ReactNode;
};

const SidebarViewer: FC<SidebarViewerProps> = ({ menu, content }) => (
  <>
    <div className="h-5 border-b-2 flex justify-evenly items-center">{menu}</div>
    <div className="flex-1 overflow-x-hidden overflow-y-auto">{content}</div>
  </>
);

export default SidebarViewer;
