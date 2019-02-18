import { STATUS } from './constants.json';
import { outputs as icons } from '../images.json';

const MIGRATE_GURU_HOSTNAME = 'mg.blogvault.net';
const MIGRATE_GURU_PATHNAME = '/migration/';

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
})

let notificationsEnabled = true;

browser.storage.onChanged.addListener(function(changes) {
  if (changes.notifications === undefined) {
    return;
  }

  notificationsEnabled = changes.notifications.newValue;
  if (!notificationsEnabled) {
    browser.notifications.getAll().then(notifications => {
      for (const id of Object.keys(notifications)) {
        browser.notifications.clear(id);
      }
    });
  }
});

browser.storage.local.get({ notifications: true }).then(({ notifications }) => notificationsEnabled = notifications);

function displaySuccessNotification(id, source, destination) {
  if (!notificationsEnabled) {
    return;
  }

  browser.notifications.create(id, {
    type: 'basic',
    title: browser.i18n.getMessage("notificationSuccessTitle"),
    message: browser.i18n.getMessage("notificationSuccessMessage", [source, destination]),
    iconUrl: browser.runtime.getURL(icons.SUCCESS_NOTIFICATION.filePath)
  });
}

function displayFailureNotification(id, source, destination) {
  if (!notificationsEnabled) {
    return;
  }

  browser.notifications.create(id, {
    type: 'basic',
    title: browser.i18n.getMessage("notificationFailureTitle"),
    message: browser.i18n.getMessage("notificationFailureMessage", [source, destination]),
    iconUrl: browser.runtime.getURL(icons.FAILURE_NOTIFICATION.filePath)
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
