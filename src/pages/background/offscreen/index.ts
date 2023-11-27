export const setupOffscreen = async () => {
  if (await chrome.offscreen.hasDocument()) return;

  await chrome.offscreen.createDocument({
    url: chrome.runtime.getURL('src/pages/offscreen/index.html'),
    reasons: [chrome.offscreen.Reason.DOM_PARSER],
    justification: 'Dom parser',
  });
};
