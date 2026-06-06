import '~/src/styles/Variables.sass'; // Import any styles as this includes them in the build.
import '~/src/styles/init.sass'; // Import any styles as this includes them in the build.

import { MODULE_ID } from '~/src/helpers/constants';
import { log } from '~/src/helpers/utility';
import { init, ready } from '~/src/hooks/init.js';

window.log = log;
log.level = log.DEBUG;

Hooks.once("init", init);
Hooks.once("ready", ready);

// If your module registers event listeners or global state, clean them up here
// so the world can be reloaded or the module disabled without leaving handlers attached.
// Hooks.once("disableModule", (module) => { if (module.id === MODULE_ID) { /* cleanup */ } });
// Hooks.once("unloadModule", (module) => { if (module.id === MODULE_ID) { /* cleanup */ } });
