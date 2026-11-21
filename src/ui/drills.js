/* The Shift — UI: Drills. The rounds themselves live in src/drill.js (content, scoring and markup); this module plugs
   them into the game: their dr- handlers join the action table, and they read the profile, render and the shared
   art through the context below. */
import { reduced } from './actions.js';
import { DR, E, FX, G, ICON, R, TEL, esc, ui } from './ctx.js';
import { render } from './render.js';

export function plugDrills(handlers) {
  if (!DR) return;
  Object.assign(handlers, DR.handlers);
  DR.init({ ui, esc, render: (t) => render(t), prof: () => G.prof, saveProf: () => E.store.saveProfile(G.prof), R, FX, TEL, ICON, reduced: () => reduced() });
}
