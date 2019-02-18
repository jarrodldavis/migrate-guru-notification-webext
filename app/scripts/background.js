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

console.log(`'Allo 'Allo! Event Page for Page Action`)
