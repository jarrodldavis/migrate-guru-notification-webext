import { STATUS } from './constants.json';
import { outputs as icons } from '../images.json';

const APP_ROOT_SELECTOR = '#app';
const URL_SELECTOR = '.bv-plan-container p > strong, .bv-landing-para';
const SUCCESS_ICON_SELECTOR = '.mdi-check-circle-outline';
const FAILURE_ICON_SELECTOR = '.mdi-close-circle-outline';

const SUCCESS_FAVICON_ELEMENT = document.createElement('link');
SUCCESS_FAVICON_ELEMENT.relList.add('shortcut', 'icon');
SUCCESS_FAVICON_ELEMENT.type = 'image/x-icon';
SUCCESS_FAVICON_ELEMENT.href = browser.runtime.getURL(icons.SUCCESS_FAVICON.filePath);

const FAILURE_FAVICON_ELEMENT = document.createElement('link');
FAILURE_FAVICON_ELEMENT.relList.add('shortcut', 'icon');
SUCCESS_FAVICON_ELEMENT.type = 'image/x-icon';
FAILURE_FAVICON_ELEMENT.href = browser.runtime.getURL(icons.FAILURE_FAVICON.filePath);

const defaultFaviconElement = document.querySelector('link[rel="shortcut icon"]');
const headElement = document.querySelector('head');

const appElement = document.querySelector(APP_ROOT_SELECTOR);

let faviconsEnabled = true;

browser.storage.onChanged.addListener(function(changes) {
  if (changes.favicons === undefined) {
    return;
  }

  faviconsEnabled = changes.favicons.newValue;
  updateFavicon(getMigrationData().status);
});

browser.storage.local.get({ favicons: true }).then(({ favicons }) => faviconsEnabled = favicons);

function getMigrationId() {
  // get the last non-empty path segment
  return window.location.pathname.split('/').reverse().find(segment => segment.length > 0);
}

function getUrls() {
  const [sourceElement, destinationElement] = appElement.querySelectorAll(URL_SELECTOR);

  if (sourceElement == null || destinationElement == null) {
    return { source: null, destination: null };
  }

  const source = [...sourceElement.childNodes]
    .find(node => node.nodeType === Node.TEXT_NODE)
    .textContent;

  const destination = [...destinationElement.childNodes]
    .find(node => node.nodeType === Node.TEXT_NODE)
    .textContent;

  return { source, destination };
}

function restoreFavicon() {
  SUCCESS_FAVICON_ELEMENT.remove();
  FAILURE_FAVICON_ELEMENT.remove();
  headElement.append(defaultFaviconElement);
}

async function updateFavicon(status) {
  if (!faviconsEnabled) {
    restoreFavicon();
    return;
  }

  switch (status) {
    case STATUS.NOT_STARTED:
    case STATUS.IN_PROGRESS:
      restoreFavicon();
      return;
    case STATUS.SUCCESS:
      defaultFaviconElement.remove();
      FAILURE_FAVICON_ELEMENT.remove();
      headElement.append(SUCCESS_FAVICON_ELEMENT);
      return;
    case STATUS.FAILURE:
      defaultFaviconElement.remove();
      SUCCESS_FAVICON_ELEMENT.remove();
      headElement.append(FAILURE_FAVICON_ELEMENT);
      return;
    default:
      throw new Error(`Unexpected status '${status}'.`);

  }
}

function getMigrationData() {
  const id = getMigrationId();
  const { source, destination } = getUrls();
  const success = appElement.querySelector(SUCCESS_ICON_SELECTOR);
  const failure = appElement.querySelector(FAILURE_ICON_SELECTOR);

  let status;
  if (source === null || destination === null) {
    status = STATUS.NOT_STARTED;
  } else if (success != null) {
    status = STATUS.SUCCESS;
  } else if (failure != null) {
    status = STATUS.FAILURE;
  } else {
    status = STATUS.IN_PROGRESS;
  }

  return { id, status, source, destination };
}

const observer = new MutationObserver(function mutationCallback() {
  const data = getMigrationData();
  browser.runtime.sendMessage(data);
  updateFavicon(data.status);
});

browser.runtime.onMessage.addListener(async function() {
  return getMigrationData();
});

observer.observe(appElement, { childList: true, subtree: true });
