import { STATUS } from './constants';
import { outputs as icons } from '../images.json';

console.log(`'Allo 'Allo! Content script`)

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

function updateFavicon(status) {
  switch (status) {
    case STATUS.NOT_STARTED:
    case STATUS.IN_PROGRESS:
      SUCCESS_FAVICON_ELEMENT.remove();
      FAILURE_FAVICON_ELEMENT.remove();
      headElement.append(defaultFaviconElement);
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

const observer = new MutationObserver(function mutationCallback() {
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

  browser.runtime.sendMessage({ id, status, source, destination });
  updateFavicon(status);
});

observer.observe(appElement, { childList: true, subtree: true });
