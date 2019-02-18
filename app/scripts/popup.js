console.log(`'Allo 'Allo! Popup`)

import Popup from './popup.svelte';

new Popup({ target: document.querySelector('main') });
