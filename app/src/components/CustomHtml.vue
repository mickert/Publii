<template>
    <section class="content tools-custom-html">
        <p-header title="Custom HTML">
            <p-button
                @click.native="goBack"
                slot="buttons"
                type="outline"
                :disabled="buttonsLocked">
                Back to tools
            </p-button>

            <p-button
                @click.native="save(false, false)"
                slot="buttons"
                type="secondary"
                :disabled="buttonsLocked">
                Save changes
            </p-button>

            <btn-dropdown
                slot="buttons"
                buttonColor="green"
                :items="dropdownItems"
                :disabled="!siteHasTheme || buttonsLocked"
                :previewIcon="true"
                localStorageKey="publii-preview-mode"
                defaultValue="full-site" />
        </p-header>

        <fields-group>
            <tabs
                id="custom-html-tabs"
                :items="tabs"
                :onToggle="refreshEditors">
                <codemirror-editor
                    v-for="(editor, index) in Object.keys(editors)"
                    :slot="'tab-' + index"
                    :id="editor"
                    :key="editor"
                    :ref="editor"
                    editorLoadedEventName="custom-html-editor-loaded"
                    mode="xml">
                </codemirror-editor>
                <small
                    v-for="(editor, index) in Object.keys(editors)"
                    class="editor-note"
                    :slot="'tab-' + index"
                    :key="'note-' + editor">
                    <span>
                        Find:
                        <template v-if="!isMac">Ctrl + F</template>
                        <template v-if="isMac">Cmd + F</template>
                    </span>
                    <span>
                        Find and replace:
                        <template v-if="!isMac">Ctrl + Alt + F</template>
                        <template v-if="isMac">Cmd + Alt + F</template>
                    </span>
                </small>
            </tabs>
        </fields-group>
    </section>
</template>

<script>
import fs from 'fs';
import { ipcRenderer } from 'electron';
import Utils from '../helpers/utils.js';
import BackToTools from './mixins/BackToTools.js';

export default {
    name: 'custom-html',
    mixins: [
        BackToTools
    ],
    data: function() {
        return {
            buttonsLocked: false,
            tabs: [
                'Head',
                'Body',
                'Footer',
                'AMP Head',
                'AMP Footer'
            ],
            editors: {},
            loadedEditors: 0
        };
    },
    computed: {
        siteHasTheme: function() {
            return !!this.$store.state.currentSite.config.theme;
        },
        isMac: function () {
            return window.process.platform === 'darwin';
        },
        dropdownItems () {
            return [
                {
                    label: 'Render full website',
                    activeLabel: 'Save & Preview',
                    value: 'full-site',
                    icon: 'full-preview-monitor',
                    isVisible: () => true,
                    onClick: this.saveAndPreview.bind(this, 'full-site')
                },
                {
                    label: 'Render front page only',
                    activeLabel: 'Save & Preview',
                    value: 'homepage',
                    icon: 'quick-preview',
                    isVisible: () => true,
                    onClick: this.saveAndPreview.bind(this, 'homepage')
                }
            ]
        }
    },
    mounted: function() {
        this.getEditorsList();

        this.$bus.$on('custom-html-editor-loaded', () => {
            this.loadedEditors++;

            if(this.loadedEditors === Object.keys(this.editors).length) {
                this.initEditors();
            }
        });
    },
    methods: {
        getEditorsList: function() {
            let customHtml = {
                'custom-head-code': this.$store.state.currentSite.config.advanced.customHeadCode,
                'custom-body-code': this.$store.state.currentSite.config.advanced.customBodyCode,
                'custom-footer-code': this.$store.state.currentSite.config.advanced.customFooterCode,
                'custom-head-amp-code': this.$store.state.currentSite.config.advanced.customHeadAmpCode,
                'custom-footer-amp-code': this.$store.state.currentSite.config.advanced.customFooterAmpCode
            };

            if(
                this.siteHasTheme &&
                this.$store.state.currentSite.themeSettings &&
                this.$store.state.currentSite.themeSettings.renderer &&
                this.$store.state.currentSite.themeSettings.renderer.customHTML
            ) {
                let customHtmlCodes = Object.keys(this.$store.state.currentSite.themeSettings.renderer.customHTML);

                for(let i = 0; i < customHtmlCodes.length; i++) {
                    let id = customHtmlCodes[i];
                    customHtml[id] = this.getCustomHtmlCode(id);
                    this.tabs.push(this.$store.state.currentSite.themeSettings.renderer.customHTML[id]);
                }
            }

            this.editors = customHtml;
        },
        getCustomHtmlCode: function(id) {
            if(
                this.$store.state.currentSite.config.advanced.customHTML &&
                this.$store.state.currentSite.config.advanced.customHTML[id]
            ) {
                return this.$store.state.currentSite.config.advanced.customHTML[id];
            }

            return ;
        },
        initEditors: function() {
            let refIDs = Object.keys(this.$refs);

            for(let refID of refIDs) {
                if(this.editors[refID]) {
                    this.$refs[refID][0].editor.setValue(this.editors[refID]);
                }

                this.$refs[refID][0].editor.refresh();
            }
        },
        refreshEditors: function() {
            setTimeout(() => {
                let refIDs = Object.keys(this.$refs);

                for(let refID of refIDs) {
                    this.$refs[refID][0].editor.refresh();
                }
            }, 0);
        },
        save (showPreview = false, renderingType = false) {
            let customCodeEditors = document.querySelectorAll('.tools-custom-html textarea');

            for(let editor of Object.keys(this.editors)) {
                this.$refs[editor][0].editor.save();
            }

            let newSettings = {
                advanced: {
                    customHeadCode: document.getElementById('custom-head-code').value,
                    customHeadAmpCode: document.getElementById('custom-head-amp-code').value,
                    customBodyCode: document.getElementById('custom-body-code').value,
                    customFooterCode: document.getElementById('custom-footer-code').value,
                    customFooterAmpCode: document.getElementById('custom-footer-amp-code').value,
                    customHTML: {}
                }
            };

            for(let customCodeEditor of customCodeEditors) {
                let id = customCodeEditor.getAttribute('id');
                let excludedIDs = [
                    'custom-head-code',
                    'custom-head-amp-code',
                    'custom-body-code',
                    'custom-footer-code',
                    'custom-footer-amp-code'
                ];

                if(!id || excludedIDs.indexOf(id) > -1) {
                    continue;
                }

                newSettings.advanced.customHTML[id] = customCodeEditor.value;
            }

            // Merge new settings with existing settings
            let currentSiteConfigCopy = JSON.parse(JSON.stringify(this.$store.state.currentSite.config));
            newSettings = Utils.deepMerge(currentSiteConfigCopy, newSettings);

            // Send request to the back-end
            ipcRenderer.send('app-site-config-save', {
                site: this.$store.state.currentSite.config.name,
                settings: newSettings
            });

            // Settings saved
            ipcRenderer.once('app-site-config-saved', (event, data) => {
                if(data.status === true) {
                    this.saved (newSettings, showPreview, renderingType);

                    if(data.newThemeConfig) {
                        this.$store.commit('refreshSiteThemeConfig', data);
                    }
                }

                if(data.message === 'success-save') {
                    this.$bus.$emit('message-display', {
                        message: 'Site settings has been successfully saved.',
                        type: 'success',
                        lifeTime: 3
                    });
                }

                ipcRenderer.send('app-site-reload', {
                    siteName: this.$store.state.currentSite.config.name
                });

                ipcRenderer.once('app-site-reloaded', (event, result) => {
                    this.$store.commit('setSiteConfig', result);
                    this.$store.commit('switchSite', result.data);
                });
            });
        },
        saveAndPreview (renderingType = false) {
            this.save(true, renderingType);
        },
        saved (newSettings, showPreview, renderingType = false) {
            let siteName = this.$store.state.currentSite.config.name;

            this.$store.commit('refreshSiteConfig', {
                newSettings: newSettings,
                siteName: siteName
            });

            if (showPreview) {
                if (this.$store.state.app.config.previewLocation !== '' && !fs.existsSync(this.$store.state.app.config.previewLocation)) {
                    this.$bus.$emit('confirm-display', {
                        message: 'The preview catalog does not exist. Please go to the App Settings and select the correct preview directory first.',
                        okLabel: 'Go to app settings',
                        okClick: () => {
                            this.$router.push(`/app-settings/`);
                        }
                    });
                    return;
                }

                if (renderingType === 'homepage') {
                    this.$bus.$emit('rendering-popup-display', {
                        homepageOnly: true
                    });
                } else {
                    this.$bus.$emit('rendering-popup-display');
                }
            }
        }
    },
    beforeDestroy () {
        this.$bus.$off('custom-html-editor-loaded');
    }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

.editor-note {
   color: var(--gray-4);

    span {
        display: inline-block;
        margin: .5rem 2rem 0 0;
    }
}
</style>
