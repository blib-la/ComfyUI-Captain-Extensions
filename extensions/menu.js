/**
 * Coded with love by Blibla
 * LICENSE: AGPL 3.0
 *
 * Homepage:  https://blib.la
 * GitHub: https://github.com/blib-la
 * Discord: https://discord.com/invite/m3TBB9XEkb
 */
import { app as originalApp } from "/scripts/app.js";
import { $el } from "/scripts/ui.js";

const name = "Captain.menu";

/**
 * @typedef {Object} ComfyUI
 * @property {HTMLDivElement} menuContainer - UI of ComfyUI
 */

/**
 * @typedef {Object} ComfyPrompt
 * @property {Record<string, unknown>} workflow - The workflow as a chain of nodes
 * @property {Record<string, unknown>} output - The output data of the workflow
 */

/**
 * @typedef {Object} ComfyApp
 * @property {ComfyUI} ui - UI of ComfyUI
 * @property {() => Promise<ComfyPrompt>} graphToPrompt - Downloads the graph
 */

/**
 * @typedef {Object} Extension
 * @property {string} name - The name of the extension
 * @property {(app: ComfyApp) => Promise<void>} setup - The setup function for the extension
 */

/**
 * @typedef {Object} GlobalApp
 * @property {(extension: Extension) => void} registerExtension - Method to register an extension
 */

/**
 * Downloads a file with the given filename and JSON content.
 *
 * @param {string} filename - The name of the file to be downloaded.
 * @param {Record<string, unknown>} data - The JSON content to be included in the file.
 * @returns {void}
 */
async function downloadFile(filename, data) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = $el("a", {
        href: url,
        download: filename,
        style: { display: "none" },
        parent: document.body,
    });

    await new Promise((resolve) => {
        a.click();
        resolve(true);
    });

    a.remove();
    window.URL.revokeObjectURL(url);
}


/**
 * @type {GlobalApp}
 */
originalApp.registerExtension({
    name,
    /**
     *
     * @param {ComfyApp} app
     * @returns {Promise<void>}
     */
    async setup(app) {
        const menu = app.ui.menuContainer;
        if (!menu) {
            console.error(
                "Error: cannot find element: app.ui.menuContainer"
            );
            return;
        }

        const saveButton = menu.querySelector("#comfy-save-button");

        if (saveButton) {
            menu.insertBefore(
                $el("button", {
                    id: "comfy-save-button",
                    textContent: "Save",
                    onclick: async () => {
                        const filename = `workflow_${Date.now().toString()}.json`;
                        const prompt = await app.graphToPrompt();
                        downloadFile(filename, prompt.workflow);
                    },
                }),
                saveButton
            );
            saveButton.remove();
        }

        const devSaveAPIButton = menu.querySelector("#comfy-dev-save-api-button");

        if (devSaveAPIButton) {
            menu.insertBefore(
                $el("button", {
                    id: "comfy-dev-save-api-button",
                    textContent: "Save (API Format)",
                    style: { width: "100%" },
                    onclick: async () => {
                        const filename = `workflow_api_${Date.now().toString()}.json`;
                        const prompt = await app.graphToPrompt();
                        downloadFile(filename, prompt.output);
                    },
                }),
                devSaveAPIButton
            );
            devSaveAPIButton.remove();
        }
    },
})
