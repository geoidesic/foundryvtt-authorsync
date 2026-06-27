/**
 * Lightweight TipTap JSON → HTML converter for Foundry journal import.
 * Covers the node types AuthorSync exports without pulling in TipTap.
 */

/**
 * @param {string} content
 * @returns {boolean}
 */
export function looksLikeTiptapJson(content) {
  if (!content || typeof content !== 'string') return false;
  const trimmed = content.trim();
  if (!trimmed.startsWith('{')) return false;
  try {
    const parsed = JSON.parse(trimmed);
    return Boolean(parsed && typeof parsed === 'object' && parsed.type === 'doc');
  } catch {
    return false;
  }
}

/**
 * @param {Record<string, unknown>} mark
 * @param {string} text
 * @returns {string}
 */
function applyMark(mark, text) {
  switch (mark.type) {
    case 'bold':
    case 'strong':
      return `<strong>${text}</strong>`;
    case 'italic':
    case 'em':
      return `<em>${text}</em>`;
    case 'underline':
      return `<u>${text}</u>`;
    case 'strike':
      return `<s>${text}</s>`;
    case 'code':
      return `<code>${text}</code>`;
    case 'link': {
      const href = mark.attrs?.href ?? '#';
      return `<a href="${escapeAttr(href)}">${text}</a>`;
    }
    default:
      return text;
  }
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeAttr(value) {
  return escapeHtml(String(value)).replace(/"/g, '&quot;');
}

/**
 * @param {unknown} node
 * @returns {string}
 */
function renderNode(node) {
  if (!node || typeof node !== 'object') return '';

  if (node.type === 'text') {
    let text = escapeHtml(node.text ?? '');
    for (const mark of node.marks ?? []) {
      text = applyMark(mark, text);
    }
    return text;
  }

  const children = Array.isArray(node.content)
    ? node.content.map(renderNode).join('')
    : '';

  switch (node.type) {
    case 'doc':
      return children;
    case 'paragraph':
      return `<p>${children || '<br>'}</p>`;
    case 'heading': {
      const level = Math.min(6, Math.max(1, Number(node.attrs?.level) || 1));
      return `<h${level}>${children}</h${level}>`;
    }
    case 'bulletList':
      return `<ul>${children}</ul>`;
    case 'orderedList':
      return `<ol>${children}</ol>`;
    case 'listItem':
      return `<li>${children}</li>`;
    case 'blockquote':
      return `<blockquote>${children}</blockquote>`;
    case 'codeBlock':
      return `<pre><code>${children}</code></pre>`;
    case 'horizontalRule':
      return '<hr>';
    case 'hardBreak':
      return '<br>';
    case 'image': {
      const src = node.attrs?.src ?? '';
      const alt = node.attrs?.alt ?? '';
      const title = node.attrs?.title ?? '';
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
      return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${titleAttr}>`;
    }
    case 'table':
      return `<table>${children}</table>`;
    case 'tableRow':
      return `<tr>${children}</tr>`;
    case 'tableHeader':
      return `<th>${children}</th>`;
    case 'tableCell':
      return `<td>${children}</td>`;
    default:
      return children;
  }
}

/**
 * @param {string|object} content
 * @returns {string}
 */
export function tiptapJsonToHtml(content) {
  const parsed = typeof content === 'string' ? JSON.parse(content) : content;
  return renderNode(parsed);
}
