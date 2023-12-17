import packageJson from './package.json';

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  minimum_chrome_version: '101',
  permissions: ['storage', 'identity', 'tabs', 'declarativeNetRequest', 'offscreen'],
  oauth2: {
    client_id: '',
    scopes: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/gmail.modify'],
  },
  options_page: 'src/pages/options/index.html',
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon-34.png',
  },
  chrome_url_overrides: {
    newtab: 'src/pages/newtab/index.html',
  },
  icons: {
    '128': 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/pages/content/index.js'],
      all_frames: true,
      match_about_blank: true,
      run_at: 'document_end',
    },
  ],
  content_security_policy: {
    extension_pages: "font-src 'self'; script-src 'self'; object-src 'self'; worker-src 'self'",
  },
  devtools_page: 'src/pages/devtools/index.html',
  host_permissions: ['<all_urls>'],
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
    {
      resources: ['src/pages/frame/index.html'],
      matches: ['*://*/*'],
    },
  ],
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn6REn9e7uC4UjnjgdXCzDwYhGB3WyhNGdE1ALl6HzRcYT0QDkxED3tg7tM4m7vErPTdc7cd6mTUZB4ZbZgyUpGJXMvHLUp7CNlK6BJGWsP80tzSFk+SvzlDQFY+Rn+PAIeag9p7zbuVqvoR6RRMyRn+KcmvvdRFE5yDImYoyiuA6bVODvyRWDy8B6I1MExWM96bFku/gzyY+zch3cnGFt+sFLbqRbmSVi53b+Td1CsFHKb0e9gB8u5yCboXQLEVV+AB41PzognYTieI+4+SqzaiDI4TTPbhfyhMlQmXieEv3JLNeD2Ssnrtk7RCJh7CVJ6Ayx1FR47yLHjwUGiU0SQIDAQAB"
};

export default manifest;
