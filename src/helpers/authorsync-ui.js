import AuthorSyncAdapter from '~/src/helpers/AuthorSyncAdapter';

export const AUTHORSYNC_LOGO_ICON_CLASS = 'authorsync-logo-icon';

/**
 * @param {string} label
 * @returns {string}
 */
export function authorsyncButtonHtml(label) {
  return `<i class="${AUTHORSYNC_LOGO_ICON_CLASS}"></i> ${label}`;
}

/**
 * @returns {Promise<File|null>}
 */
export function pickAuthorSyncImportFile() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip,.json,application/zip,application/json';
    input.addEventListener('change', () => resolve(input.files?.[0] ?? null));
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}

/**
 * @param {HTMLElement} button
 * @param {string} label
 */
export function decorateAuthorSyncButton(button, label) {
  button.type = 'button';
  button.classList.add('button', 'authorsync-action-btn');
  button.setAttribute('data-tooltip', label);
  button.innerHTML = authorsyncButtonHtml(label);
}

/**
 * @param {Array<Record<string, unknown>>} options
 * @param {{
 *   label: string,
 *   iconClass?: string,
 *   visible?: (li: HTMLElement) => boolean,
 *   onClick: (event: Event, li: HTMLElement) => void | Promise<void>
 * }} config
 */
export function pushJournalContextOption(options, config) {
  const iconClass = config.iconClass ?? AUTHORSYNC_LOGO_ICON_CLASS;
  const visible = config.visible ?? (() => true);
  const onClick = config.onClick;

  if (Number(game.version) >= 13) {
    options.push({
      name: config.label,
      icon: `<i class="${iconClass}"></i>`,
      condition: visible,
      callback: (li) => onClick(new Event('click'), li)
    });
    return;
  }

  options.push({
    label: config.label,
    icon: iconClass,
    visible,
    onClick
  });
}

/**
 * @returns {Promise<void>}
 */
export async function runAuthorSyncImport() {
  const file = await pickAuthorSyncImportFile();
  if (!file) return;

  const created = await AuthorSyncAdapter.importFromFile(file, {
    parentFolderId: null,
    createImportFolder: true
  });
  const count = created.length;
  ui.notifications.info(
    count === 1
      ? `Imported 1 item from AuthorSync`
      : `Imported ${count} items from AuthorSync`
  );
}

/**
 * @param {JournalEntry} journal
 * @returns {Promise<void>}
 */
export async function runAuthorSyncExport(journal) {
  const zipBlob = await AuthorSyncAdapter.exportJournalAsZip(journal);
  AuthorSyncAdapter.downloadBlob(zipBlob, `authorsync-${journal.name.slugify()}.zip`);
  ui.notifications.info(`Exported "${journal.name}" to AuthorSync zip`);
}

/**
 * @param {string} action - export | import
 * @param {(event: Event) => void | Promise<void>} handler
 * @returns {HTMLButtonElement}
 */
export function createAuthorSyncActionButton(action, handler) {
  const button = document.createElement('button');
  decorateAuthorSyncButton(button, action === 'export' ? 'Export' : 'Import');
  button.classList.add(`authorsync-${action}-btn`);
  button.addEventListener('click', handler);
  return button;
}
