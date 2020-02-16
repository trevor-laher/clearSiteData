function removeCookies() {
  chrome.storage.sync.get(["cookieSiteOrigins"], function (result) {
    chrome.browsingData.remove({
      "origins": Array.from(result['cookieSiteOrigins'])
    }, {
      "cacheStorage": true,
      "cookies": true,
      "fileSystems": true,
      "indexedDB": true,
      "localStorage": true,
      "pluginData": true,
      "serviceWorkers": true,
      "webSQL": true
    }, function () {}
    );
  });
}

chrome.runtime.onStartup.addListener(function() {
    chrome.browserAction.setBadgeText({text: 'ON'});
    chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
    removeCookies()
});
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ 'cookieSiteOrigins': ["https://nytimes.com", "https://www.nytimes.com", "https://washingtonpost.com", "https://www.washingtonpost.com", "https://subscribe.washingtonpost.com", "https://www.bloomberg.com"]
  }, function() {});
    removeCookies()
});