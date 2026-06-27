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

window.GAS = window.GAS || {};

export function init(app, html, data) {
  window.GAS.log = log;
  window.GAS.log.level = log.DEBUG;

  window.GAS.log.i('init() entry point');
  if (safeGetSetting(MODULE_ID, 'debug.hooks', false)) {
    CONFIG.debug.hooks = true;
  }

  if (game.version > 13) {
    window.MIN_WINDOW_WIDTH = 200;
    window.MIN_WINDOW_HEIGHT = 50;
  }

  registerSettings(app);

  const debugEnabled = safeGetSetting(MODULE_ID, 'debug', false);
  if (debugEnabled) {
    window.GAS.log.level = log.DEBUG;
  }
  window.GAS.log.i('Debug setting value:', debugEnabled, 'log.level now:', window.GAS.log.level);

  // v12 uses JournalSheet; v13+ introduced JournalEntrySheet — use the correct hook for each
  const journalSheetHook = (game.version >= 13) ? 'renderJournalEntrySheet' : 'renderJournalSheet';
  window.GAS.log.i('Registering journal sheet hook as:', journalSheetHook);
  Hooks.on(journalSheetHook, (app, html) => {
    window.GAS.log.i(`${journalSheetHook} hook fired`, { appId: app?.id, docName: app?.document?.name });
    // v12 passes jQuery; v13+ passes raw HTMLElement
    const root = html instanceof HTMLElement ? html : (html && html[0]);
    const header = root?.querySelector?.('.journal-header');
    window.GAS.log.i(`${journalSheetHook} header found?`, !!header);
    if (!header) return;
    if (header.querySelector('.authorsync-export-btn')) return;

    const exportButton = createAuthorSyncActionButton('export', async () => {
      await handleExport(app.document);
    });

    header.append(exportButton);
    window.GAS.log.i(`${journalSheetHook} appended export button`);
  });
  window.GAS.log.i('About to register renderJournalDirectory hook');

  Hooks.on('renderJournalDirectory', (app, html) => {
    window.GAS.log.i('renderJournalDirectory hook fired');
    // v12 passes jQuery; v13+ passes raw HTMLElement
    const root = html instanceof HTMLElement ? html : html[0];
    const header = root?.querySelector?.('.directory-header .header-actions')
      ?? root?.querySelector?.('.directory-header .action-buttons')
      ?? root?.querySelector?.('.directory-header');
    window.GAS.log.i('renderJournalDirectory header found?', !!header);
    if (!header) return;
    if (header.querySelector('.authorsync-import-btn')) return;

    const importButton = createAuthorSyncActionButton('import', async () => {
      await handleImport();
    });
    header.append(importButton);
  });
  window.GAS.log.i('About to register getJournalEntryContextOptions hook');

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
  window.GAS.log.i('init() complete — all hooks registered');
}

export function ready(app, html, data) {
  if (!game.modules.get(MODULE_ID).active) {
    window.GAS.log.w('Module is not active');
    return;
  }
  if (!safeGetSetting(MODULE_ID, 'dontShowWelcome', false)) {
    new WelcomeApplication().render(true, { focus: true });
  }
}
