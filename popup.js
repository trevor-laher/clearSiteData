import { addCurrentSite, removeCurrentSite, removeCookies, originScan, linkOptions } from './clearData.js';

document.querySelector('#addSite').addEventListener("click", function() {addCurrentSite();});

document.querySelector('#removeSite').addEventListener("click", function() {removeCurrentSite();});

document.querySelector('#manageSites').addEventListener("click", function() {linkOptions();});

document.querySelector('#clearCookies').addEventListener("click", function() {removeCookies();});

document.querySelector('#scanCookies').addEventListener("click", function() {originScan();});

//For some reason imported functions fire immediately