console.log(`'Allo 'Allo! Popup`)

import { STATUS } from './constants';
import { outputs as icons } from '../images.json';

const i18nMessageMap = {
  header: 'popupHeader',
  sourceSecondary: 'popupSourceListItem',
  destinationSecondary: 'popupDestinationListItem',
  statusSecondary: 'popupStatusListItem',
  notificationPrimary: 'popupNotificationListItem',
  notificationSecondary: 'popupEnabledListItem',
  faviconPrimary: 'popupFaviconListItem',
  faviconSecondary: 'popupEnabledListItem',
  openSource: 'popupSourceButton',
  openDestination: 'popupDestinationButton'
}

const i18nStatusMap = {
  [STATUS.NOT_STARTED]: 'statusNotStarted',
  [STATUS.IN_PROGRESS]: 'statusInProgress',
  [STATUS.SUCCESS]: 'statusSuccess',
  [STATUS.FAILURE]: 'statusFailure',
}

window.headerIcon.src = browser.runtime.getURL(icons.POPUP_HEADER.filePath);

for (const [id, messageName] of Object.entries(i18nMessageMap)) {
  document.getElementById(id).textContent = browser.i18n.getMessage(messageName);
}

const sourceListItem = window.sourceListItem;
const destinationListItem = window.destinationListItem;

const sourcePrimary = window.sourcePrimary;
const destinationPrimary = window.destinationPrimary;

const openSource = window.openSource;
const openDestination = window.openDestination;

const statusPrimary = window.statusPrimary;

function updatePageData(tabId, migrationData) {
  if (migrationData.status === STATUS.NOT_STARTED) {
    sourceListItem.classList.add('disabled');
    destinationListItem.classList.add('disabled');
    sourcePrimary.textContent = browser.i18n.getMessage(i18nStatusMap[migrationData.status]);
    destinationPrimary.textContent = browser.i18n.getMessage(i18nStatusMap[migrationData.status]);

    openSource.classList.add('disabled');
    openDestination.classList.add('disabled');
  } else {
    const openers = document.querySelectorAll('.url-opener');

    for (const element of openers) {
      element.classList.remove('disabled');
      element.dataset.url = migrationData[element.dataset.type];
      element.dataset.opener = tabId;
    }

    sourcePrimary.textContent = new URL(migrationData.source).hostname;
    destinationPrimary.textContent = new URL(migrationData.destination).hostname;
  }

  statusPrimary.textContent = browser.i18n.getMessage(i18nStatusMap[migrationData.status]);
}

async function getData() {
  const [{ id: tabId }] = await browser.tabs.query({ currentWindow: true, active: true });
  const migrationData = await browser.tabs.sendMessage(tabId, null);
  updatePageData(tabId, migrationData);
}

browser.runtime.onMessage.addListener(function(migrationData, { id: tabId }) {
  updatePageData(tabId, migrationData);
});

getData().catch(console.error.bind(console));

function handleOpenButtonClick() {
  if (this.classList.contains('disabled')) {
    return;
  }

  browser.tabs.create({
    openerTabId: parseInt(this.dataset.opener, 10),
    url: this.dataset.url
  });
}

for (const element of document.querySelectorAll('.url-opener')) {
  element.addEventListener('click', handleOpenButtonClick)
}
