import WelcomeApplication from '~/src/components/pages/WelcomeApplication.js';
import { MODULE_ID } from '~/src/helpers/constants';
import { log, safeGetSetting } from '~/src/helpers/utility';
import { registerSettings } from '~/src/settings';

export function init(app, html, data) {
  log.i('Initialising');
  if (safeGetSetting(MODULE_ID, 'debug.hooks', false)) {
    CONFIG.debug.hooks = true;
  }

  if (game.version > 13) {
    window.MIN_WINDOW_WIDTH = 200;
    window.MIN_WINDOW_HEIGHT = 50;
  }

  registerSettings(app);
}

export function ready(app, html, data) {
  if (!game.modules.get(MODULE_ID).active) {
    log.w('Module is not active');
    return;
  }
  if (!safeGetSetting(MODULE_ID, 'dontShowWelcome', false)) {
    new WelcomeApplication().render(true, { focus: true });
  }
}
