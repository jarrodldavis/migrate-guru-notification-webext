import { mdiCheckCircleOutline, mdiCloseCircleOutline } from '@mdi/js';

const NATURAL_WIDTH = 24;
const NATURAL_HEIGHT = 24;
const SCALE_FACTOR = 4;
const SCALED_WIDTH = NATURAL_WIDTH * SCALE_FACTOR;
const SCALED_HEIGHT = NATURAL_HEIGHT * SCALE_FACTOR;

function svg(path, color) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${SCALED_WIDTH}" height="${SCALED_HEIGHT}">
  <path d="${path}" fill="${color}" transform="scale(${SCALE_FACTOR})" />
</svg>`
}

function dataUrl(svg) {
  return `data:image/svg+xml;utf8,${svg}`;
}

export const SUCCESS_ICON_URL = dataUrl(svg(mdiCheckCircleOutline, "rgb(36, 145, 130)"));
export const FAILURE_ICON_URL = dataUrl(svg(mdiCloseCircleOutline, "rgb(208, 2, 27)"));
