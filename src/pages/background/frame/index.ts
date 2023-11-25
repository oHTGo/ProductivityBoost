const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType);

const requestHeaders = [
  {
    operation: chrome.declarativeNetRequest.HeaderOperation.SET,
    header: 'sec-fetch-dest',
    value: 'empty',
  },
];
const responseHeaders = [
  {
    operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE,
    header: 'x-frame-options',
  },
  {
    operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE,
    header: 'content-security-policy',
  },
];

const requestHeaderRules: chrome.declarativeNetRequest.Rule[] = requestHeaders.map((header, index) => ({
  id: index + 1,
  priority: 1,
  action: {
    type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
    requestHeaders: [header],
  },
  condition: {
    initiatorDomains: [chrome.runtime.id],
    urlFilter: 'http*://*/*',
    resourceTypes: allResourceTypes,
  },
}));
const responseHeaderRules: chrome.declarativeNetRequest.Rule[] = responseHeaders.map((header, index) => ({
  id: index + requestHeaderRules.length + 1,
  priority: 1,
  action: {
    type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
    responseHeaders: [header],
  },
  condition: {
    initiatorDomains: [chrome.runtime.id],
    urlFilter: 'http*://*/*',
    resourceTypes: allResourceTypes,
  },
}));
const rules = [...requestHeaderRules, ...responseHeaderRules];

export const setupFrame = () => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map((rule) => rule.id),
    addRules: rules,
  });
};
