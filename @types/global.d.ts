/// <reference types="vite/client" />
/* eslint-disable no-var */

import Chrome from 'chrome';
import type { JestPuppeteerGlobal } from 'jest-environment-puppeteer';

declare global {
  // type for testing environment
  var jestPuppeteer: JestPuppeteerGlobal['jestPuppeteer'];
  var context: JestPuppeteerGlobal['context'];
  var browser: JestPuppeteerGlobal['browser'];
  var page: JestPuppeteerGlobal['page'];
}

declare namespace chrome {
  export default Chrome;
}

declare module 'virtual:reload-on-update-in-background-script' {
  export const reloadOnUpdate: (watchPath: string) => void;
  export default reloadOnUpdate;
}

declare module 'virtual:reload-on-update-in-view' {
  const refreshOnUpdate: (watchPath: string) => void;
  export default refreshOnUpdate;
}

declare module '*.svg' {
  import React = require('react');

  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: string;
  export default content;
}
