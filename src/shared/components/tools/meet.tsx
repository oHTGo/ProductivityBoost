import Toggle from '@shared/components/toggle';
import common from '@shared/constants/common';
import { useChromeStorageLocal } from 'use-chrome-storage';
import type { IMeet } from '@shared/types/tools';
import type { FC } from 'react';

const Meet: FC = () => {
  const [config, setConfig] = useChromeStorageLocal<IMeet>(common.MEET, {
    turnOffMicro: true,
    turnOffCamera: true,
  });

  const toggles = [
    {
      label: 'Automate turn off micro',
      isChecked: config.turnOffMicro,
      onChange: () => setConfig({ ...config, turnOffMicro: !config.turnOffMicro }),
    },
    {
      label: 'Automate turn off camera',
      isChecked: config.turnOffCamera,
      onChange: () => setConfig({ ...config, turnOffCamera: !config.turnOffCamera }),
    },
  ];

  return (
    <div>
      <span className="inline-block prose prose-sm font-semibold ml-2">Google Meet</span>
      <div className="w-full border-1 border-gray-300 rounded-md">
        {toggles.map(({ isChecked, onChange, label }) => (
          <div key={label} className="flex items-center m-3">
            <Toggle isChecked={isChecked} onChange={onChange} />
            <div className="ml-3 text-gray-700 font-medium">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meet;
