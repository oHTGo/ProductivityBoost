import Email from '@shared/components/email';
import { variants, sizes, sidebarFeatures } from '@shared/components/sidebar/configurations';
import useAppDispatch from '@shared/hooks/use-app-dispatch';
import useAppSelector from '@shared/hooks/use-app-selector';
import { collapse, expand, getIsExpanded, getIsOpen, getUI, setUI } from '@shared/slices/sidebar';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useRef, type FC, useEffect } from 'react';

type SidebarProps = {
  onClickOutside?: () => void;
};
const Sidebar: FC<SidebarProps> = ({ onClickOutside }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = useAppSelector(getIsOpen);
  const isExpanded = useAppSelector(getIsExpanded);
  const ui = useAppSelector(getUI);
  const dispatch = useAppDispatch();

  const renderUI = () => {
    switch (ui) {
      case 'email':
        return <Email />;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent & { target?: Element }) => {
      if (event?.target?.tagName?.toLowerCase() === chrome.runtime.getManifest().name) return;

      if (ref.current && !ref.current.contains(event.target)) {
        if (onClickOutside) onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClickOutside]);

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
          'w-11 h-full inline-flex flex-col justify-center items-center border-solid border-0 border-r',
          isExpanded ? 'border-slate-300' : 'border-transparent',
        )}>
        {sidebarFeatures.map(({ Icon, feature }, key) => (
          <div
            className="flex items-center justify-center py-2"
            key={key}
            onClick={() => {
              if (isExpanded) return dispatch(collapse());

              dispatch(setUI(feature));
              dispatch(expand());
            }}>
            <Icon className="h-7 w-7 cursor-pointer rounded-md p-1 hover:bg-stone-300" />
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? sizes.md : '0' }}
        className={classNames('h-full flex-1', isExpanded ? 'ml-1' : '')}>
        {renderUI()}
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
