import { EmailIcon, CalendarIcon, TranslatorIcon } from '@shared/components/icons/outline';
import type { Feature } from '@shared/types/commons';
import type { FC, SVGProps } from 'react';

export const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '-100%' },
};

export const sizes = {
  sm: '384px',
  md: '512px',
  lg: '768px',
};

export const sidebarFeatures: {
  Icon: FC<SVGProps<SVGSVGElement>>;
  feature: Feature;
}[] = [
  {
    Icon: EmailIcon,
    feature: 'email',
  },
  {
    Icon: CalendarIcon,
    feature: 'calendar',
  },
  {
    Icon: TranslatorIcon,
    feature: 'translator',
  },
];
