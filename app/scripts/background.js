import { STATUS } from './constants';

const MIGRATE_GURU_HOSTNAME = 'mg.blogvault.net';
const MIGRATE_GURU_PATHNAME = '/migration/';

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
})

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

browser.runtime.onMessage.addListener(function({ status, source, destination }) {
  const sourceHost = status === STATUS.NOT_STARTED ? null : new URL(source).hostname;
  const destinationHost = status === STATUS.NOT_STARTED ? null : new URL(destination).hostname;

  console.log('migration update:', status,
              'from:', sourceHost,
              'to:', destinationHost);
});

console.log(`'Allo 'Allo! Event Page for Page Action`)
