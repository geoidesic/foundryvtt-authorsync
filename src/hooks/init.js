import WelcomeApplication from '~/src/components/pages/WelcomeApplication.js';
import { MODULE_ID } from '~/src/helpers/constants';
import { log, safeGetSetting } from '~/src/helpers/utility';
import { registerSettings } from '~/src/settings';
import {
  createAuthorSyncActionButton,
  pushJournalContextOption,
  runAuthorSyncExport,
  runAuthorSyncImport
} from '~/src/helpers/authorsync-ui';

/**
 * @param {JournalEntry} journal
 * @returns {Promise<void>}
 */
async function handleExport(journal) {
  try {
    await runAuthorSyncExport(journal);
  } catch (err) {
    console.error(err);
    ui.notifications.error(`AuthorSync export failed: ${err.message}`);
  }
}

/**
 * @returns {Promise<void>}
 */
async function handleImport() {
  try {
    await runAuthorSyncImport();
  } catch (err) {
    console.error(err);
    ui.notifications.error(`AuthorSync import failed: ${err.message}`);
  }
}

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

  Hooks.on('renderJournalEntrySheet', (app, html) => {
    const header = html.querySelector('.journal-header');
    if (!header) return;
    if (header.querySelector('.authorsync-export-btn')) return;

    const exportButton = createAuthorSyncActionButton('export', async () => {
      await handleExport(app.document);
    });

    header.append(exportButton);
  });

  Hooks.on('renderJournalDirectory', (app, html) => {
    const header = html.querySelector('.directory-header .header-actions')
      ?? html.querySelector('.directory-header .action-buttons')
      ?? html.querySelector('.directory-header');
    if (!header) return;
    if (header.querySelector('.authorsync-import-btn')) return;

    const importButton = createAuthorSyncActionButton('import', async () => {
      await handleImport();
    });
    header.append(importButton);
  });

  Hooks.on('getJournalEntryContextOptions', (directory, options) => {
    pushJournalContextOption(options, {
      label: 'Export to AuthorSync',
      visible: li => {
        const entryId = li.dataset.entryId;
        const entry = directory.collection.get(entryId);
        return entry?.isOwner;
      },
      onClick: async (_event, li) => {
        const entryId = li.dataset.entryId;
        const journal = directory.collection.get(entryId);
        if (!journal) return;
        await handleExport(journal);
      }
    });
  });
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
