import JSZip from 'jszip';
import { log } from '~/src/helpers/utility';
import { looksLikeTiptapJson, tiptapJsonToHtml } from '~/src/helpers/tiptap-to-html';

/**
 * Adapter for synchronizing content between Foundry VTT and AuthorSync.
 * Handles the mapping between Foundry's JournalEntry/Page structure and AuthorSync's Tree nodes.
 */
export default class AuthorSyncAdapter {
    /**
     * Converts a Foundry JournalEntry into an AuthorSync-compatible tree node array.
     * @param {JournalEntry} journalEntry - The Foundry JournalEntry to export.
     * @returns {Array<Object>} The AuthorSync tree node array.
     */
    static exportJournal(journalEntry) {
        log.i(`Exporting JournalEntry "${journalEntry.name}" to AuthorSync format`);

        const rootNode = {
            id: journalEntry.id,
            label: journalEntry.name,
            type: 'branch',
            children: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        const pages = journalEntry.pages.contents.sort((a, b) => (a.sort || 0) - (b.sort || 0));

        rootNode.children = pages.map(page => {
            const isMarkdown = page.text.format === CONST.JOURNAL_ENTRY_PAGE_FORMATS.MARKDOWN;
            return {
                id: page.id,
                label: page.name,
                type: 'leaf',
                content: isMarkdown
                    ? (page.text.markdown || page.text.content || '')
                    : (page.text.content || ''),
                contentType: isMarkdown ? 'markdown' : 'html',
                order: page.sort || 0,
                createdAt: page._stats?.createdTime || Date.now(),
                updatedAt: page._stats?.modifiedTime || Date.now()
            };
        });

        return [rootNode];
    }

    /**
     * Export a JournalEntry as a zip bundle that includes exported data and referenced assets.
     * @param {JournalEntry} journalEntry
     * @returns {Promise<Blob>} Zip blob containing the export
     */
    static async exportJournalAsZip(journalEntry) {
        const exportData = this.exportJournal(journalEntry);
        const zip = new JSZip();
        zip.file('data.json', JSON.stringify(exportData, null, 2));

        const assetUrls = this.extractAssetUrlsFromJournal(journalEntry);
        if (assetUrls.size > 0) {
            const assetsFolder = zip.folder('assets');
            await Promise.all(Array.from(assetUrls, async (assetUrl) => {
                try {
                    const blob = await this.downloadAssetBlob(assetUrl);
                    const filename = this.assetFilename(assetUrl);
                    assetsFolder.file(filename, blob);
                } catch (error) {
                    console.warn('AuthorSyncAdapter: failed to bundle asset', assetUrl, error);
                }
            }));
        }

        return zip.generateAsync({ type: 'blob' });
    }

    static extractAssetUrlsFromJournal(journalEntry) {
        const urls = new Set();
        const markdownImageRegex = /!\[[^\]]*]\(([^)]+)\)/g;
        const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/gi;

        for (const page of journalEntry.pages.contents) {
            const content = page.text.content || '';
            if (page.text.format === 1) {
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(content, 'text/html');
                    doc.querySelectorAll('img').forEach((img) => {
                        if (img.src) urls.add(img.src);
                    });
                } catch (error) {
                    console.warn('AuthorSyncAdapter: HTML parse failed', error);
                }
            }

            let match;
            while ((match = markdownImageRegex.exec(content)) !== null) {
                if (match[1]) urls.add(match[1]);
            }
            while ((match = htmlImageRegex.exec(content)) !== null) {
                if (match[1]) urls.add(match[1]);
            }
        }

        return urls;
    }

    static assetFilename(assetUrl) {
        try {
            const url = new URL(assetUrl, window.location.href);
            return url.pathname.split('/').pop() || `asset-${Date.now()}`;
        } catch {
            return `asset-${Date.now()}`;
        }
    }

    static async downloadAssetBlob(assetUrl) {
        const resolvedUrl = new URL(assetUrl, window.location.href).toString();
        const response = await fetch(resolvedUrl);
        if (!response.ok) {
            throw new Error(`Failed to download asset ${resolvedUrl}: ${response.statusText}`);
        }
        return await response.blob();
    }

    static downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Parse AuthorSync export JSON into a node array (tree or single node).
     * @param {unknown} authorSyncJson
     * @returns {Array<Object>}
     */
    static parseImportNodes(authorSyncJson) {
        if (Array.isArray(authorSyncJson)) {
            return authorSyncJson;
        }

        if (authorSyncJson && typeof authorSyncJson === 'object') {
            if (Array.isArray(authorSyncJson.tree)) {
                return authorSyncJson.tree;
            }
            if (authorSyncJson.type === 'branch' || authorSyncJson.type === 'leaf') {
                return [authorSyncJson];
            }
        }

        throw new Error('Invalid AuthorSync JSON format');
    }

    /**
     * Import an AuthorSync .zip or .json file into Foundry journals.
     * @param {File|Blob} file
     * @param {{ parentFolderId?: string|null, createImportFolder?: boolean }} [options]
     * @returns {Promise<Array<JournalEntry|Folder>>}
     */
    static async importFromFile(file, options = {}) {
        const name = file.name?.toLowerCase?.() ?? '';
        if (name.endsWith('.zip')) {
            return this.importFromZip(file, options);
        }

        const text = await file.text();
        const parsed = JSON.parse(text);
        const nodes = this.parseImportNodes(parsed);
        const preparedNodes = await this.prepareNodesForFoundry(nodes, new Map());
        return this.importToJournal(preparedNodes, options);
    }

    /**
     * Import an AuthorSync zip bundle (data.json plus images/assets).
     * @param {Blob|File} zipBlob
     * @param {{ parentFolderId?: string|null, createImportFolder?: boolean }} [options]
     * @returns {Promise<Array<JournalEntry|Folder>>}
     */
    static async importFromZip(zipBlob, options = {}) {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(zipBlob);

        const dataFile = zipContent.file('data.json');
        if (!dataFile) {
            throw new Error('Invalid AuthorSync export: missing data.json');
        }

        const parsed = JSON.parse(await dataFile.async('string'));
        const nodes = this.parseImportNodes(parsed);
        const imageBlobs = await this.extractImageBlobsFromZip(zipContent);
        const preparedNodes = await this.prepareNodesForFoundry(nodes, imageBlobs);
        return this.importToJournal(preparedNodes, options);
    }

    /**
     * @param {JSZip} zipContent
     * @returns {Promise<Map<string, Blob>>}
     */
    static async extractImageBlobsFromZip(zipContent) {
        const images = new Map();

        for (const folderName of ['images', 'assets']) {
            const prefix = `${folderName}/`;
            await Promise.all(
                Object.keys(zipContent.files).map(async (fullPath) => {
                    if (!fullPath.startsWith(prefix) || fullPath.endsWith('/')) return;

                    const file = zipContent.file(fullPath);
                    if (!file) return;

                    const blob = await file.async('blob');
                    const storageKey = fullPath.slice(prefix.length);
                    if (!storageKey) return;

                    images.set(storageKey, blob);
                    const withoutExt = storageKey.replace(/\.[^/.]+$/, '');
                    if (withoutExt !== storageKey) {
                        images.set(withoutExt, blob);
                    }
                    const basename = storageKey.split('/').pop();
                    if (basename) {
                        images.set(basename, blob);
                        const basenameNoExt = basename.replace(/\.[^/.]+$/, '');
                        if (basenameNoExt !== basename) {
                            images.set(basenameNoExt, blob);
                        }
                    }
                })
            );
        }

        return images;
    }

    /**
     * @param {string} src
     * @returns {string|null}
     */
    static parseImageStorageKey(src) {
        if (!src || typeof src !== 'string') return null;

        const apiPathMatch = src.match(/\/api\/images\/[^/]+\/([^/"'\s)?]+)/);
        if (apiPathMatch) return apiPathMatch[1];

        const queryMatch = src.match(/[?&]imageId=([^&"'\s)]+)/);
        if (queryMatch) {
            const imageId = queryMatch[1];
            return imageId.includes('.') ? imageId : `${imageId}.jpg`;
        }

        const legacyPathMatch = src.match(/\/api\/images\/(.+?)(?:\.|$|[)"'])/);
        if (legacyPathMatch) {
            const segment = legacyPathMatch[1].split('/').pop() || legacyPathMatch[1];
            return segment.includes('.') ? segment : `${segment}.jpg`;
        }

        const assetMatch = src.match(
            /(?:^|\/)assets\/([^/"'\s)?]+\.[a-zA-Z0-9]+)|(?:images\/)([^/"'\s)?]+\.[a-zA-Z0-9]+)/
        );
        if (assetMatch) return assetMatch[1] || assetMatch[2];

        const filenameMatch = src.match(/([^/"'\s)?]+\.(?:png|jpe?g|gif|webp|svg))/i);
        if (filenameMatch) return filenameMatch[1];

        return null;
    }

    /**
     * @param {Map<string, Blob>} imageBlobs
     * @returns {Promise<Map<string, string>>}
     */
    static async uploadImportImages(imageBlobs) {
        const uploaded = new Map();
        if (!imageBlobs.size) return uploaded;

        const basePath = `worlds/${game.world.id}/authorsync-import`;
        const uploadedByFilename = new Map();

        for (const [storageKey, blob] of imageBlobs.entries()) {
            const filename = storageKey.includes('/') ? storageKey.split('/').pop() : storageKey;
            if (!filename) continue;

            let path = uploadedByFilename.get(filename);
            if (!path) {
                const file = new File([blob], filename, { type: blob.type || 'application/octet-stream' });
                const targetPath = `${basePath}/${filename}`;
                const response = await FilePicker.upload('data', targetPath, file, {}, { notify: false });
                path = response?.path ?? targetPath;
                uploadedByFilename.set(filename, path);
            }

            uploaded.set(storageKey, path);
            const withoutExt = storageKey.replace(/\.[^/.]+$/, '');
            if (withoutExt !== storageKey) uploaded.set(withoutExt, path);
            uploaded.set(filename, path);
            uploaded.set(`assets/${filename}`, path);
            uploaded.set(`images/${filename}`, path);
        }

        return uploaded;
    }

    /**
     * @param {string} src
     * @param {Map<string, string>} uploadedImages
     * @returns {string}
     */
    static rewriteImageReference(src, uploadedImages) {
        const storageKey = this.parseImageStorageKey(src);
        if (!storageKey) return src;

        for (const candidate of [
            storageKey,
            storageKey.replace(/\.[^/.]+$/, ''),
            storageKey.split('/').pop()
        ]) {
            if (candidate && uploadedImages.has(candidate)) {
                return uploadedImages.get(candidate);
            }
        }

        return src;
    }

    /**
     * @param {string} content
     * @param {Map<string, string>} uploadedImages
     * @returns {string}
     */
    static rewriteImageUrlsInContent(content, uploadedImages) {
        if (!content || uploadedImages.size === 0) return content;

        if (looksLikeTiptapJson(content)) {
            const doc = JSON.parse(content);
            const rewriteNode = (node) => {
                if (!node || typeof node !== 'object') return;
                if (node.type === 'image' && node.attrs?.src) {
                    node.attrs.src = this.rewriteImageReference(node.attrs.src, uploadedImages);
                }
                for (const child of node.content ?? []) {
                    rewriteNode(child);
                }
            };
            rewriteNode(doc);
            return JSON.stringify(doc);
        }

        return content
            .replace(/!\[[^\]]*]\(([^)]+)\)/g, (match, src) => {
                const rewritten = this.rewriteImageReference(src, uploadedImages);
                return rewritten === src ? match : `![](${rewritten})`;
            })
            .replace(/<img([^>]+)src=["']([^"']+)["']/gi, (match, attrs, src) => {
                const rewritten = this.rewriteImageReference(src, uploadedImages);
                return rewritten === src ? match : `<img${attrs}src="${rewritten}"`;
            });
    }

    /**
     * @param {Array<Object>} nodes
     * @param {Map<string, Blob>} imageBlobs
     * @returns {Promise<Array<Object>>}
     */
    static async prepareNodesForFoundry(nodes, imageBlobs) {
        const uploadedImages = await this.uploadImportImages(imageBlobs);

        const prepareNode = async (node) => {
            if (!node || typeof node !== 'object') return null;

            const copy = { ...node };

            if (copy.type === 'leaf' && copy.content) {
                let content = this.rewriteImageUrlsInContent(copy.content, uploadedImages);

                if (looksLikeTiptapJson(content)) {
                    copy.content = tiptapJsonToHtml(content);
                    copy.contentType = 'html';
                } else if (!copy.contentType) {
                    copy.contentType = content.trim().startsWith('<') ? 'html' : 'markdown';
                }
            }

            if (Array.isArray(copy.children)) {
                const children = [];
                for (const child of copy.children) {
                    const preparedChild = await prepareNode(child);
                    if (preparedChild) children.push(preparedChild);
                }
                copy.children = children;
            }

            return copy;
        };

        const prepared = [];
        for (const node of nodes) {
            const preparedNode = await prepareNode(node);
            if (preparedNode) prepared.push(preparedNode);
        }
        return prepared;
    }

    /**
     * @param {Array<Object>|Object} authorSyncJson
     * @param {{ parentFolderId?: string|null, createImportFolder?: boolean }} [options]
     * @returns {Promise<Array<JournalEntry|Folder>>}
     */
    static async importToJournal(authorSyncJson, options = {}) {
        log.i(`Importing AuthorSync tree to Foundry`);

        const nodes = Array.isArray(authorSyncJson)
            ? authorSyncJson
            : this.parseImportNodes(authorSyncJson);

        let parentFolderId = options.parentFolderId ?? null;
        if (options.createImportFolder !== false && parentFolderId == null) {
            const importFolder = await Folder.create({
                name: 'AuthorSync Import',
                type: 'JournalEntry',
                parent: null
            });
            parentFolderId = importFolder.id;
        }

        const createdItems = [];
        for (const node of nodes) {
            const item = await this.importNodeRecursive(node, parentFolderId);
            if (item) createdItems.push(item);
        }

        log.i(`Successfully imported ${createdItems.length} top-level AuthorSync node(s)`);
        return createdItems;
    }

    static async importNodeRecursive(node, parentFolderId) {
        if (!node) return null;

        if (node.type === 'branch') {
            const branchLeaves = (node.children || []).filter(child => child.type === 'leaf');
            const branchBranches = (node.children || []).filter(child => child.type === 'branch');

            if (branchBranches.length === 0 && branchLeaves.length > 0) {
                const journalEntry = await JournalEntry.create({
                    name: node.label || 'Imported from AuthorSync',
                    folder: parentFolderId
                });

                const pageData = branchLeaves.map((child, index) =>
                    this.buildJournalPageData(child, index)
                );

                if (pageData.length > 0) {
                    await journalEntry.createEmbeddedDocuments('JournalEntryPage', pageData);
                }

                return journalEntry;
            }

            const folder = await Folder.create({
                name: node.label || 'Imported Branch',
                type: 'JournalEntry',
                parent: parentFolderId
            });

            for (const child of node.children || []) {
                await this.importNodeRecursive(child, folder.id);
            }

            return folder;
        }

        if (node.type === 'leaf') {
            const journalEntry = await JournalEntry.create({
                name: node.label || 'Imported from AuthorSync',
                folder: parentFolderId
            });

            const pageData = [this.buildJournalPageData(node, node.order || 0)];

            await journalEntry.createEmbeddedDocuments('JournalEntryPage', pageData);
            return journalEntry;
        }

        return null;
    }

    /**
     * Build Foundry journal page data from an AuthorSync leaf node.
     * @param {Object} node
     * @param {number} sort
     * @returns {Object}
     */
    static buildJournalPageData(node, sort = 0) {
        const isMarkdown = node.contentType === 'markdown';
        const source = node.content || '';
        const text = {
            format: isMarkdown
                ? CONST.JOURNAL_ENTRY_PAGE_FORMATS.MARKDOWN
                : CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML,
            content: isMarkdown ? '' : source
        };

        if (isMarkdown) {
            text.markdown = source;
            const converter = foundry.applications.sheets.journal.JournalEntryPageProseMirrorSheet?._converter;
            if (converter?.makeHTML) {
                text.content = converter.makeHTML(source);
            }
        }

        return {
            name: node.label || 'Page',
            type: 'text',
            text,
            sort: node.order ?? sort
        };
    }
}
