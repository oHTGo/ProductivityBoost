import { CalendarIcon, EmailIcon, TranslatorIcon } from '@shared/components/sidebar/icons';
import useAppSelector from '@shared/hooks/use-app-selector';
import { getIsOpen } from '@shared/slices/sidebar';
import { motion } from 'framer-motion';
import { type FC } from 'react';

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '-100%' },
};

const Sidebar: FC = () => {
  const isOpen = useAppSelector(getIsOpen);

  return (
    <motion.div
      initial={'closed'}
      animate={isOpen ? 'open' : 'closed'}
      variants={variants}
      className="fixed ml-2 top-2 z-[1000] inline-flex h-[calc(100%-1rem)] w-11 flex-col items-center justify-center rounded-md border border-slate-300 border-solid bg-stone-50 shadow-2xl">
      {[EmailIcon, CalendarIcon, TranslatorIcon].map((Icon, key) => (
        <div className="relative flex w-full items-center justify-center py-2" key={key}>
          <Icon className="h-7 w-7 cursor-pointer rounded-md p-1 hover:bg-stone-300" />
        </div>
      ))}
    </motion.div>
  );
};

export default Sidebar;
