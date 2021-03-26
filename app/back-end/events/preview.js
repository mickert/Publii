const fs = require('fs');
const path = require('path');
const electron = require('electron');
const shell = electron.shell;
const ipcMain = electron.ipcMain;
const childProcess = require('child_process');
const UtilsHelper = require('../helpers/utils.js');

class PreviewEvents {
    /**
     * Creates preview events
     *
     * @param appInstance
     */
    constructor(appInstance) {
        let self = this;
        this.app = appInstance;

        ipcMain.on('app-preview-render', function (event, siteData) {
            console.log('app-preview-render');
            debugger;
            if(siteData.site && siteData.theme) {
                let postID = false;
                let postData = false;

                if(siteData.postID !== false && typeof siteData.postID !== 'undefined') {
                    postID = siteData.postID;
                }

                if(siteData.postData) {
                    postData = siteData.postData;
                }

                self.renderSite(siteData.site, postID, postData, event);
            } else {
                event.sender.send('app-preview-rendered', {
                    status: false
                });
            }
        });
    }

    /**
     * Renders website
     *
     * @param site
     * @param pageToRender
     * @param postData
     * @param event
     */
    renderSite(site, pageToRender, postData, event) {
        console.log('* renderSite called with:');
        console.log('* * site:', site);
        console.log('* * pageToRender:', pageToRender);
        console.log('* * postData:', postData);
        console.log('* * event:', event);
        debugger;

        let self = this;
        let resultsRetrieved = false;
        let rendererProcess = childProcess.fork(__dirname + '/../workers/renderer/preview', {
            stdio: [
                null,
                fs.openSync(this.app.app.getPath('logs') + "/rendering-process.log", "w"),
                fs.openSync(this.app.app.getPath('logs') + "/rendering-errors.log", "w"),
                'ipc'
            ]
        });
        let previewMode = true;
        let singlePageMode = false;
        let homepageOnlyMode = false;

        if (pageToRender !== false) {
            if (pageToRender === 'home') {
                homepageOnlyMode = true;
            } else {
                singlePageMode = true;
            }
        }

        console.log('* * setting rendererProcess on disconnect handler');
        rendererProcess.on('disconnect', function(data) {
            setTimeout(function() {
                if(!resultsRetrieved) {
                    let errorDesc = 'Checkout the rendering-errors.log and rendering-process.log files under Tools -> Log viewer. ';
                    let errorTitle = 'Rendering process crashed';

                    console.log('\n* ! (on disconnect) rendering failed, data:\n', JSON.stringify(data));
                    
                    if (data && data.result && data.result[0] && data.result[0].message) {
                        errorTitle = 'Rendering process failed';
                        errorDesc = data.result[0].message + "\n\n" + data.result[0].desc;
                    }

                    event.sender.send('app-preview-render-error', {
                        message: [{
                            message: errorTitle,
                            desc: errorDesc
                        }]
                    });
                }
            }, 1000);
        });

        const rendererProcessSendObj = 
        {
            type: 'dependencies',
            appDir: this.app.appDir,
            sitesDir: this.app.sitesDir,
            siteConfig: this.app.sites[site],
            postID: pageToRender,
            postData: postData,
            previewMode: previewMode,
            singlePageMode: singlePageMode,
            homepageOnlyMode: homepageOnlyMode,
            previewLocation: this.app.appConfig.previewLocation
        }; 
        console.log('* * starting rendererProcess.send with object:\n', JSON.stringify(rendererProcessSendObj));
        rendererProcess.send(rendererProcessSendObj);
        // rendererProcess.send({
        //     type: 'dependencies',
        //     appDir: this.app.appDir,
        //     sitesDir: this.app.sitesDir,
        //     siteConfig: this.app.sites[site],
        //     postID: pageToRender,
        //     postData: postData,
        //     previewMode: previewMode,
        //     singlePageMode: singlePageMode,
        //     homepageOnlyMode: homepageOnlyMode,
        //     previewLocation: this.app.appConfig.previewLocation
        // });

        rendererProcess.on('message', function(data) {
            resultsRetrieved = true;

            if(data.type === 'app-rendering-results') {
                if(data.result === true) {
                    event.sender.send('app-preview-rendered', {
                        status: true
                    });

                    self.showPreview(site, singlePageMode);
                } else {
                    let errorDesc = 'Checkout the rendering-errors.log and rendering-process.log files under Tools -> Log viewer. ';
                    let errorTitle = 'Rendering process crashed';

                    console.log('\n* ! (on message) rendering failed, data:\n', JSON.stringify(data));

                    if (data.result && data.result[0] && data.result[0].message) {
                        errorTitle = 'Rendering process failed';
                        errorDesc = data.result[0].message + "\n\n" + data.result[0].desc;
                    }

                    event.sender.send('app-preview-render-error', {
                        message: [{
                            message: errorTitle,
                            desc: errorDesc
                        }]
                    });
                }
            } else {
                event.sender.send(data.type, {
                    progress: data.progress,
                    message: data.message
                });
            }
        });
    }

    /**
     * Displays preview
     *
     * @param siteData
     */
    showPreview(siteName, postPreview) {
        let basePath = path.join(this.app.sitesDir, siteName, 'preview');
        let previewLocation = '';

        if(this.app.appConfig.previewLocation) {
            previewLocation = this.app.appConfig.previewLocation.trim();
        }

        let url = '';

        if(previewLocation !== '' && UtilsHelper.dirExists(previewLocation)) {
            basePath = previewLocation;
        }

        url = path.join(basePath, 'index.html');

        if(postPreview) {
            url = path.join(basePath, 'preview.html');
        }

        setTimeout(function() {
            shell.openExternal('file://' + url);
        }, 1000);
    }
}

module.exports = PreviewEvents;
