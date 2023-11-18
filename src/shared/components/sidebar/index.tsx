import Email from '@shared/components/email';
import { variants, sizes, sidebarFeatures } from '@shared/components/sidebar/configurations';
import useAppDispatch from '@shared/hooks/use-app-dispatch';
import useAppSelector from '@shared/hooks/use-app-selector';
import { getEmails } from '@shared/slices/email';
import { collapse, expand, getIsExpanded, getIsOpen, getUI, setUI } from '@shared/slices/sidebar';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useRef, type FC } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import type { Feature } from '@shared/types/commons';

type SidebarProps = {
  onClickOutside?: () => void;
};
const Sidebar: FC<SidebarProps> = ({ onClickOutside }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = useAppSelector(getIsOpen);
  const isExpanded = useAppSelector(getIsExpanded);
  const ui = useAppSelector(getUI);
  const emails = useAppSelector(getEmails);
  const dispatch = useAppDispatch();

  const renderUI = (feature: Feature) => {
    switch (feature) {
      case 'email':
        return <Email />;
      default:
        return <></>;
    }
  };
  const renderBadge = (feature: Feature) => {
    switch (feature) {
      case 'email':
        return `${emails.length}`;
      default:
        return '';
    }
  };

  useOnClickOutside(ref, (event: MouseEvent & { target?: Element }) => {
    if (event?.target?.tagName?.toLowerCase() === chrome.runtime.getManifest().name) return;
    if (onClickOutside) onClickOutside();
  });

  return (
    <motion.div
      ref={ref}
      initial={'closed'}
      animate={isOpen ? 'open' : 'closed'}
      variants={variants}
      className={classNames(
        'fixed ml-2 top-2 z-[1000] h-[calc(100%-1rem)] rounded-md border border-slate-300 border-solid bg-stone-50 shadow-2xl',
        'flex',
      )}>
      <div
        className={classNames(
          'w-11 h-full inline-flex flex-col justify-center items-center border-solid border-0',
          isExpanded ? 'border-slate-300' : 'border-transparent',
        )}>
        {sidebarFeatures.map(({ Icon, feature }, key) => (
          <div className="relative w-11 h-11 py-2" key={key}>
            <Icon
              className={classNames(
                'h-8 w-8 cursor-pointer rounded-md p-1 hover:bg-stone-300',
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              )}
              onClick={() => {
                if (isExpanded) return dispatch(collapse());

                dispatch(setUI(feature));
                dispatch(expand());
              }}
            />
            {renderBadge(feature) !== '' && (
              <span className="whitespace-nowrap w-4 h-4 rounded-sm bg-blue-300 text-sm text-white z-10 absolute top-1/2 left-1 inline-flex justify-center items-center">
                {renderBadge(feature)}
              </span>
            )}
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{
          opacity: isExpanded ? 1 : 0,
          width: isExpanded ? sizes.md : '0',
          borderLeftWidth: isExpanded ? '1px' : '0px',
        }}
        className={classNames('h-full flex-1 border-solid border-0 border-slate-300')}>
        {renderUI(ui as Feature)}
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
