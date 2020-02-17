import { removeCookies } from './clearData.js';

function initializeUI() {
  chrome.browserAction.setBadgeText({text: 'ON'});
  chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
}
  
chrome.runtime.onStartup.addListener(function() {
  initializeUI()
  removeCookies()
});

chrome.runtime.onInstalled.addListener(function() {
  initializeUI();
  chrome.storage.sync.set({'domains': [{'domain': 'nytimes.com', 'origins': ['https://nytimes.com', 'https://www.nytimes.com']}, {'domain': 'washingtonpost.com', 'origins': ['https://washingtonpost.com', 'https://www.washingtonpost.com', 'https://subscribe.washingtonpost.com']}, {'domain': 'bloomberg.com', 'origins': ['https://bloomberg.com', 'https://www.bloomberg.com']}]
  }, function() {});
    removeCookies()
});