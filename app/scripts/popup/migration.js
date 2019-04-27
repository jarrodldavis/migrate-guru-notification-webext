import { readable } from "svelte/store";

import { STATUS } from '../constants.json';

export function create_migration_store() {
  let current_tab_id;

  async function initialize(set) {
    console.log('init');
    const [{ id: tab_id }] = await browser.tabs.query({ currentWindow: true, active: true });
    current_tab_id = tab_id;
    const { status, source, destination } = await browser.tabs.sendMessage(tab_id, null);
    set({ tab_id, status, source, destination });
  }

  function update(set, message, sender) {
    const { tab: { id: tab_id } = {} } = sender;

    if (tab_id !== current_tab_id) {
      return;
    }

    const { status, source, destination } = message;
    set({ tab_id, status, source, destination });
  }

  function start(set) {
    const listener = update.bind(null, set);
    browser.runtime.onMessage.addListener(listener);

    initialize(set);

    return function stop() {
      browser.runtime.onMessage.removeListener(listener)
    }
  }

  return readable({ status: STATUS.UNKNOWN, source: null, destination: null }, start);
}
