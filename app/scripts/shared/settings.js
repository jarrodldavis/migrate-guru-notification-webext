import { readable } from "svelte/store";

export function create_setting_store(key, default_value) {
  async function initialize(set) {
    const { [key]: value } = await browser.storage.local.get({ [key]: default_value });
    set(value);
  }

  function update(set, { [key]: change } = {}) {
    if (!change) {
      return;
    }

    if (!('newValue' in change)) {
      return;
    }

    if ('oldValue' in change && change.newValue === change.oldValue) {
      return;
    }

    set(change.newValue);
  }

  function start(set) {
    const listener = update.bind(null, set);
    browser.storage.onChanged.addListener(listener);

    initialize(set);

    return function stop() {
      browser.storage.onChanged.removeListener(listener)
    }
  }

  const { subscribe } = readable(default_value, start);

  return {
    subscribe,
    set(value) {
      browser.storage.local.set({ [key]: value });
    }
  }
}
