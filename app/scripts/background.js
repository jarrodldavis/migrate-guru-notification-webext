import { STATUS } from './constants';
import { SUCCESS_ICON_URL, FAILURE_ICON_URL } from './icons';

const MIGRATE_GURU_HOSTNAME = 'mg.blogvault.net';
const MIGRATE_GURU_PATHNAME = '/migration/';

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
})

function displaySuccessNotification(id, source, destination) {
  browser.notifications.create(id, {
    type: 'image',
    title: browser.i18n.getMessage("notificationSuccessTitle"),
    message: browser.i18n.getMessage("notificationSuccessMessage", [source, destination]),
    iconUrl: SUCCESS_ICON_URL
  });
}

function displayFailureNotification(id, source, destination) {
  browser.notifications.create(id, {
    type: 'image',
    title: browser.i18n.getMessage("notificationFailureTitle"),
    message: browser.i18n.getMessage("notificationFailureMessage", [source, destination]),
    iconUrl: FAILURE_ICON_URL
  });
}

if (process.env.VENDOR !== 'firefox') {
  browser.tabs.onUpdated.addListener(async (tabId, _change, tab) => {
    const url = new URL(tab.url)
    if (url.hostname === MIGRATE_GURU_HOSTNAME && url.pathname.startsWith(MIGRATE_GURU_PATHNAME)) {
      browser.pageAction.show(tabId);
    } else {
      browser.pageAction.hide(tabId);
    }
  });
}

browser.runtime.onMessage.addListener(function({ id, status, source, destination }) {
  switch (status) {
    case STATUS.NOT_STARTED:
    case STATUS.IN_PROGRESS:
      console.debug(`Migration '${id}' from '${source}' to '${destination}' not yet complete: '${status}'.`);
      return;
    case STATUS.SUCCESS:
      displaySuccessNotification(id, new URL(source).hostname, new URL(destination).hostname);
      console.debug(`Migration '${id}' from '${source}' to '${destination}' completed: '${status}'.`);
      return;
    case STATUS.FAILURE:
      displayFailureNotification(id, new URL(source).hostname, new URL(destination).hostname);
      console.debug(`Migration '${id}' from '${source}' to '${destination}' completed: '${status}'.`);
      return;
    default:
      throw new Error(`Unexpected status '${status}'.`);
  }
});

console.log(`'Allo 'Allo! Event Page for Page Action`)
