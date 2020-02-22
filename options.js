//Function here to call removeSite from clearData
//Function to load all active domains
//Function to add additional domain
import { getAllDomains, addSite, removeSite } from './clearData.js';

function initializePage() {
    var domainsDiv = document.querySelector('#domainsDiv');
    var domainsHtmlList = document.querySelector('#domainsList');
    let form = document.createElement('FORM');
    let span = document.createElement('SPAN');
    let label = document.createElement('LABEL');
    label.setAttribute('for', 'domain');
    let inputField = document.createElement('INPUT');
    inputField.setAttribute('type', 'text');
    inputField.setAttribute('id', 'domainField');
    inputField.setAttribute('placeholder', 'Enter Domain...');
    let submit = document.createElement('INPUT');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('value', 'Add Domain');
    let br = document.createElement('BR');
    let header = document.createElement('H3');
    let headerText = document.createTextNode('Current Domains:');

    header.appendChild(headerText);
    span.appendChild(label);
    span.appendChild(inputField);
    span.appendChild(submit);
    form.appendChild(span);
    form.addEventListener('submit', function(event) {
        let newDomain = document.getElementById('domainField').value;
        addSite(newDomain);
        let node = document.createElement('TR');
        let td1 = document.createElement('TD');
        let td2 = document.createElement('TD');
        let text = document.createTextNode(newDomain);
        let removeButton = document.createElement('BUTTON');
        removeButton.addEventListener('click', function() {
            removeSite(newDomain);
            domainsHtmlList.removeChild(node);
        })
        let buttonText = document.createTextNode('Remove');

        removeButton.appendChild(buttonText);
        td1.appendChild(text);
        td2.appendChild(removeButton);
        node.appendChild(td1);
        node.appendChild(td2);
        domainsHtmlList.appendChild(node);
    });
    domainsDiv.appendChild(form);
    domainsDiv.appendChild(br);
    domainsDiv.appendChild(header);
}

function loadDomains() {
    chrome.storage.sync.get(['domains'], function (result) {
        let domainObjs = result['domains'];
        var domains =  getAllDomains(domainObjs);
        var domainsHtmlList = document.querySelector('#domainsList');
        //var listItems = []
        for(var i=0; i<domains.length; i++) {
            let currentDomain = domains[i];
            let node = document.createElement('TR');
            let td1 = document.createElement('TD');
            let td2 = document.createElement('TD');
            let text = document.createTextNode(currentDomain['domain']);
            let removeButton = document.createElement('BUTTON');
            removeButton.addEventListener('click', function() {
                removeSite(currentDomain['domain']);
                domainsHtmlList.removeChild(node);
            })
            let buttonText = document.createTextNode('Remove');

            removeButton.appendChild(buttonText);
            td1.appendChild(text);
            td2.appendChild(removeButton);
            node.appendChild(td1);
            node.appendChild(td2);
            //listItems.push(node);
            domainsHtmlList.appendChild(node);
        }
        //domainsHtmlList.append(listItems);
    });
}

//function addSite() {

//}

//function removeSite() {

//}
initializePage();
loadDomains();