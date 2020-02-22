function getAllOrigins(domains) {
    var origins = []
    for(var i=0; i<domains.length; i++) {
        let currentDomain = Array.from(domains[i]);
        origins.concat(currentDomain['origins']);
    }
    return origins;
}

export function getAllDomains(domains) {
    var domainUrls = []
    for(var i=0; i<domains.length; i++) {
        domainUrls.push(domains[i]);
    }
    return domainUrls;
}

function originToDomain(origin) {
    var domain = origin.replace('https://', '');
    domain = domain.replace('www.', '');
    domain = domain.replace('subscribe.', '');
    domain = domain.replace('beta.', '');
    return domain;
}

function getDomainIndex(domainStr, domains) {
    var found = false;
    var i = 0;
    while(i < domains.length && !found) {
        var currentDomain = domains[i];
        found = Boolean(currentDomain['domain'] == domainStr);
        i++;
    }
    if(found) {
        i--;
    } else {
        i = -1;
    }
    return i;
}

export function removeCookies() {
    chrome.storage.sync.get(["domains"], function (result) {
      let domains = result['domains'];
      var origins = getAllOrigins(domains);
      chrome.browsingData.remove({
        "origins": origins
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

function trimURL(site) {
    let siteExtensions = ['.com', '.org', '.us', '.io'];
    var i = 0;
    var actualSplit = false;
    while(i < siteExtensions.length && !actualSplit) {
        site = site.split(siteExtensions[i]);
        site = site[0]
        if (site.length > 1) {
            site = site + siteExtensions[i];
            actualSplit = true
        }
        i++;
    }
    return site;
}

export function addSite(site) {
    site = trimURL(site);
    var domain = originToDomain(site);
    chrome.storage.sync.get(['domains'], function (result) {
        var sites = result['domains']
        let index = getDomainIndex(domain, result['domains']);
        if(index == -1) {
            sites.push({'domain': domain, 'origins': [site]});
        } else {
            var siteObj = sites[index];
            var origins = siteObj['origins'];
            if(origins.indexOf(site) == -1) {
                origins.push(site);
            }
        }
        chrome.storage.sync.set({'domains': sites}, function() {});
    })
}

export function addCurrentSite() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
        if(tab && 'url' in tab[0]) {
            tab = tab[0]
            addSite(tab['url']);
        }
    });
}

export function removeSite(site) {
    site = trimURL(site);
    var domain = originToDomain(site);
    chrome.storage.sync.get(['domains'], function (result) {
        var sites = result['domains']
        let index = getDomainIndex(domain, result['domains']);
        if(index != -1) {
            sites.splice(index, 1);
        }
        chrome.storage.sync.set({'domains': sites}, function() {});
    })
}

export function removeCurrentSite() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
        if(tab && 'url' in tab[0]) {
            tab = tab[0]
            removeSite(tab['url']);
        }
    });
}

function cookiesFromStore(cookieStore) {
    chrome.cookies.getAll({
      "storeId": cookieStore['id']
    }, function(cookies) {
        chrome.storage.sync.get(['domains'], function (result) {
            var origins = getAllOrigins(result['domains']);
            var domains = getAllDomains(result['domains']);
            for(var index=0; index<cookies.length; index++) {
                var currentCookie = cookies[index]
                var cookieOrigin = currentCookie['domain'];
                var cookieDomain = originToDomain(cookieOrigin);
                if (domains.indexOf(cookieDomain) != -1 && origins.indexOf(cookieOrigin) == -1) {
                    let domainIndex = domainObj.indexOf(cookieDomain);
                    var domainObjs = result['domains']
                    var domainObj = domainObjs[domainIndex];
                    domainObj['origins'].push(cookieOrigin);
                }
            }
            chrome.storage.sync.set({'domains': result['domains']}, function() {});
        });   
    });
}

export function originScan() {
    chrome.cookies.getAllCookieStores(function(stores) {
        for(var index=0; index<stores.length; index++) {
          var currentStore = stores[index]
          cookiesFromStore(currentStore)
        }
    })
}

export function linkOptions() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
}