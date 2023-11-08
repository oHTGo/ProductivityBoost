import { context } from '@shared/hooks/use-sidebar-store';
import { motion } from 'framer-motion';
import { type FC, useContext } from 'react';
import { useStore } from 'zustand';

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '-100%' },
};

const Sidebar: FC = () => {
  const store = useContext(context);
  if (!store) throw new Error('Missing context in the tree');
  const { isOpen } = useStore(store, (state) => state);

  console.log(isOpen);

  return (
    <motion.div
      initial={'closed'}
      animate={isOpen ? 'open' : 'closed'}
      variants={variants}
      className="fixed ml-2 top-2 z-50 inline-flex h-[calc(100%-1rem)] w-11 flex-col items-center justify-center rounded-md border bg-stone-50 shadow-2xl">
      {Array.from({ length: 10 }).map((_, k) => (
        <div className="relative flex w-full items-center justify-center py-2" key={k}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={0.75}
            stroke="#000"
            className="h-7 w-7 cursor-pointer rounded-md p-1 hover:bg-stone-300">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
            />
          </svg>
        </div>
      ))}
    </motion.div>
  );
};

export default Sidebar;
