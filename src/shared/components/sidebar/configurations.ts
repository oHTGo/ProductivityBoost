import { EmailIcon, CalendarIcon, TranslatorIcon } from '@shared/components/sidebar/icons';
import type { IconProps } from '@shared/components/sidebar/icons';
import type { Feature } from '@shared/types/commons';
import type { FC } from 'react';

export const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '-100%' },
};

export const sizes = {
  sm: '24rem',
  md: '32rem',
  lg: '48rem',
};

export const sidebarFeatures: {
  Icon: FC<IconProps>;
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
