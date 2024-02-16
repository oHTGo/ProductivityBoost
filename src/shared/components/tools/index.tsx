import SidebarView from '@shared/components/sidebar/view';
import Meet from '@shared/components/tools/meet';
import { type FC } from 'react';

const Tools: FC = () => {
  return (
    <SidebarView className="mx-3">
      <Meet />
    </SidebarView>
  );
};

export default Tools;
