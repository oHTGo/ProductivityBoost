import { defineConfig } from '@twind/core';
import presetAutoprefix from '@twind/preset-autoprefix';
import presetTailwind from '@twind/preset-tailwind';
import presetTypography from '@twind/preset-typography';
import type { Preset } from '@twind/core';

const presetRemToPx = ({ baseValue = 16 } = {}): Preset => {
  return {
    finalize(rule) {
      return {
        ...rule,
        d: rule.d?.replace(/"[^"]+"|'[^']+'|url\([^)]+\)|(-?\d*\.?\d+)rem/g, (match, p1) => {
          if (!p1) return match;
          return `${p1 * baseValue}${p1 == 0 ? '' : 'px'}`;
        }),
      };
    },
  };
};

export const DEFAULT_STYLES = 'font-mono text-black bg-white';

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind(), presetTypography(), presetRemToPx()],
});
