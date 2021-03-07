class Gdpr {
    static popupHtmlOutput (configuration, renderer) {

        let groups = ``;
        for (let i = 0; i < configuration.groups.length; i++) {
            if (configuration.groups[i].id === '-' || configuration.groups[i].id === '') {
                groups += /*html*/`
                <input
                    id="gdpr-necessary"
                    name="gdpr-necessary"
                    checked="checked"
                    disabled="disabled"
                    type="checkbox">
                <label for="gdpr-necessary">
                    ${configuration.groups[i].name}
                </label>`;
                continue;
            }

            groups += /*html*/`
            <input
                id="gdpr-${configuration.groups[i].id}"
                name="gdpr-${configuration.groups[i].id}"
                type="checkbox">
            <label for="gdpr-${configuration.groups[i].id}">
                ${configuration.groups[i].name}
            </label>`;
        }

        let output = /*html*/`
        <div class="privc-popup js-privc-popup ${configuration.behaviour !== 'badge' ? 'privc-popup--uses-link' : ''} ${configuration.behaviour !== 'link' ? 'privc-popup--uses-badge' : ''}">
            ${configuration.popupTitlePrimary !== '' ? '<h2>' + configuration.popupTitlePrimary + '</h2>' : ''}
            
            <p>
                ${configuration.popupDesc}
                <a href="${Gdpr.getPrivacyPolicyUrl(configuration, renderer)}">
                    ${configuration.readMoreLinkLabel}
                </a>
            </p>

            <form>
                ${groups}

                <p class="privc-popup__save-wrapper">
                <button type="submit" class="privc-popup__save">
                    ${configuration.saveButtonLabel}
                </button>
                <button type="submit" class="privc-popup__allowAll">
                    ${configuration.allowAllButtonLabel || 'Toestaan'}
                </button>
                </p>
            </form>

            ${configuration.behaviour !== 'link' ? '<span class="privc-popup-label">' + configuration.badgeLabel + '</span>' : ''}
        </div>
        `;

        return output;
    }

    static popupCssOutput () {
        let output = /*css*/`
        .privc-popup {
            background: #fff;
            border-radius: 2px;
            bottom: 1rem;
            -webkit-box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
            font-size: 15px;
            left: 16px;
            right: 16px;
            max-width: 600px;
            padding: 2rem;
            position: fixed;
            -webkit-transform: translateY(100%);
            -ms-transform: translateY(100%);
            transform: translateY(100%);
            -webkit-transition: -webkit-transform 0.8s ease 0s;
            transition: -webkit-transform 0.8s ease 0s;
            -o-transition: transform 0.8s ease 0s;
            transition: transform 0.8s ease 0s;
            transition: transform 0.8s ease 0s, -webkit-transform 0.8s ease 0s;
            will-change: transform;
            z-index: 1000;
        }

        .privc-popup--uses-badge {
            background: #24a931;
            border-radius: 6px 6px 0 0;
            bottom: 0.6rem;
            height: 2rem;
            padding: 0;
            -webkit-transition: all 0.24s ease-out;
            transition: all 0.24s ease-out;
            width: 8rem;
        }

        .privc-popup.privc-popup--uses-badge:hover,
        .privc-popup.privc-popup--uses-badge.privc-popup--uses-link:hover {
            bottom: 2rem;
        }

        .privc-popup.privc-popup--uses-badge.privc-popup--uses-link.privc-popup--is-sticky {
            bottom: .6rem;
        }

        .privc-popup--uses-badge > h2,
        .privc-popup--uses-badge > p,
        .privc-popup--uses-badge > form {
            display: none;
        }

        .privc-popup--is-sticky {
            border-radius: 2px;
            -webkit-transform: translateY(0);
            -ms-transform: translateY(0);
            transform: translateY(0);
            -webkit-transition: transform .8s ease 0s;
            transition: transform .8s ease 0s;
        }

        .privc-popup--uses-badge.privc-popup--is-sticky {
            background: #ffffff;
            bottom: 1rem;
            height: auto;
            padding: 2rem;
            width: 100%;
        }

        @media (max-width:600px) {
            .privc-popup--uses-badge.privc-popup--is-sticky {
                 bottom: 0 !important;
                 left: 0;
                 right: 0;
            }
        }

        @media (min-width:600px) {
            .privc-popup--uses-badge.privc-popup--is-sticky:hover {
                 bottom: 1rem;
            }
        }

        .privc-popup--uses-badge.privc-popup--is-sticky > h2,
        .privc-popup--uses-badge.privc-popup--is-sticky > p,
        .privc-popup--uses-badge.privc-popup--is-sticky > form {
            display: block;
        }

        .privc-popup.privc-popup--uses-link {
            background: #fff;
            bottom: 0;
        }

        .privc-popup.privc-popup--uses-badge.privc-popup--uses-link {
            background: #24a931;
            bottom: 0.6rem;
        }

        .privc-popup.privc-popup--uses-badge.privc-popup--uses-link.privc-popup--is-sticky {
            background: #fff;
        }

        .privc-popup--is-sticky.privc-popup--uses-link {
            -webkit-transform: translateY(-1rem);
            -ms-transform: translateY(-1rem);
            transform: translateY(-1rem);
        }

        .privc-popup > h2 {
            font-size: 20px;
            margin: 0;
        }

        .privc-popup > p {
            margin: 1rem 0 0;
        }

        .privc-popup input[type="checkbox"] + label {
            margin-right: 0.53333rem;
            white-space: nowrap;
        }

        .privc-popup input[type="checkbox"] + label::before {
            height: 20px;
            line-height: 20px;
            width: 20px;
            margin-right: 0.26667rem;
        }

        .privc-popup input[type="checkbox"]:disabled + label:before {
            content: "";
            background-color: #f6f6f6;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 11 8'%3e%3cpolygon points='9.53 0 4.4 5.09 1.47 2.18 0 3.64 2.93 6.54 4.4 8 5.87 6.54 11 1.46 9.53 0' fill='%23999999'/%3e%3c/svg%3e");
        }

        .privc-popup__save, 
        .privc-popup__allowAll {
            border: none !important;
            border-radius: 3px;
            -webkit-box-shadow: none;
            box-shadow: none;
            color: #ffffff !important;
            font-size: 13px;
            padding: 0.666rem 1.2rem;
        }
        .privc-popup__save {
            background: #6c757d;
        }
        .privc-popup__allowAll {
            background: #24a931;
            float: right;
        }

        .privc-popup > form,
        .privc-popup__save-wrapper {
            margin-top: 1.06667rem
        }

        .privc-popup__save:hover,
        .privc-popup__save:active {
            opacity: 0.85;
        }

        .privc-popup-label {
            color: #fff;
            cursor: pointer;
            left: 50%;
            position: absolute;
            top: 50%;
            -webkit-transform: translateX(-50%) translateY(-50%);
            -ms-transform: translateX(-50%) translateY(-50%);
            transform: translateX(-50%) translateY(-50%);
            white-space: nowrap;
        }

        .privc-popup--is-sticky .privc-popup-label {
            display: none;
        }
        `;

        return output;
    }

    static popupJsOutput (configuration) {
        let linkCode = '';

        if (configuration.behaviour !== 'badge') {
            linkCode = `
                var triggerLinks = document.querySelectorAll('a[href*="${configuration.behaviourLink}"]');

                for (var i = 0; i < triggerLinks.length; i++) {
                    triggerLinks[i].addEventListener('click', function(e) {
                        if (e) e.preventDefault();
                        popup.classList.add('privc-popup--is-sticky');
                    });
                }
            `;
        }

        let output = /*html*/`
        <script>
            (function() {
                var w = window,
                    d = document,
                    DQSA = d.querySelectorAll.bind(d)
                    ;

                if (!Array.isArray) Array.isArray = function(arg) {
                    return Object.prototype.toString.call(arg) === '[object Array]';
                }
                
                function isNodeList(arg) {
                    return typeof arg === 'object' &&
                        /^\\\[object (HTMLCollection|NodeList|Object)\\\]$/.test(Object.prototype.toString.call(arg)) &&
                        (typeof arg.length === 'number') &&
                        (arg.length === 0 || (typeof arg[0] === 'object' && arg[0].nodeType > 0));
                }

                if (typeof Node.prototype.contains !== 'function') Node.prototype.contains = function contains(node) {
                    if (!(0 in arguments)) throw new TypeError('1 argument is required');
                    do { if (this === node) return true; }
                    while (node = node && node.parentNode);
                    return false;
                }
                if (typeof Element.prototype.contains !== 'function') Element.prototype.contains = Node.prototype.contains;
                if (typeof d.contains !== 'function') d.contains = Node.prototype.contains;

                function addScript (src, inline, options) {
                    var argObjArr,
                        _options = options || {};
                    if (typeof src === 'object') {
                        if (Array.isArray(src) || isNodeList(src)) {
                            if (!src.length) return;
                            argObjArr = src;
                        } else argObjArr = [src];
                    } else argObjArr = [{ src: src, text: inline}];
                    
                    for (var i = 0; i < argObjArr.length; i++) {
                        if (argObjArr[i].src || argObjArr[i].text ) {
                            var newScript = d.createElement('script');
                            if (argObjArr[i].src) newScript.setAttribute('src', argObjArr[i].src);
                            if (argObjArr[i].text) newScript.text = argObjArr[i].text;
                            if (argObjArr[i].async) newScript.setAttribute('async', 'async');
                            if (argObjArr[i].defer) newScript.setAttribute('defer', 'defer');
                            if (argObjArr[i].crossorigin) newScript.setAttribute('crossorigin', argObjArr[i].crossorigin);
                            if (_options.atOriginalLocation && d.contains(argObjArr[i])) {
                                if(argObjArr[i].nextSibling) argObjArr[i].parentNode.insertBefore(newScript, argObjArr[i].nextSibling);
                                else argObjArr[i].parentNode.appendChild(newScript);
                            }
                            else d.body.appendChild(newScript);
                        }
                    }
                }

                var popup = d.querySelector('.js-privc-popup'),
                    currentConfig = localStorage.getItem('publii-gdpr-allowed-cookies'),
                    consentJson = localStorage.getItem('publii-gdpr-consent-json') || '{}',
                    allowedGroups = w.publii_gdpr_allowed_cookies = (currentConfig) ? currentConfig.split(',') : [],
                    blockedScripts = DQSA('script[type^="gdpr-blocker/"], script[type^="{{"][type*="gdprScriptBlocker"][type$="}}"]'),
                    hasNewConsentChoices = false
                    addScriptsBySelector =  function (sel) {
                        var scr = (sel) ? DQSA(sel) : null;
                        if (scr && scr.length) addScript(scr, void(0), { atOriginalLocation: true });
                    },
                    getScriptSelector = function (grName) {
                        return 'script[type="gdpr-blocker/' + grName + '"], script[type^="{{"][type*="gdprScriptBlocker"][type*=\\\'"' + grName + '"\\\'][type$="}}"]';
                    }
                    ;

                ${linkCode}
                
                if (popup) {
                    var cbs = popup.querySelectorAll('input[type="checkbox"]'),
                        btnSave = popup.querySelector('button.privc-popup__save'),
                        btnAllowAll = popup.querySelector('button.privc-popup__allowAll'),
                        consent = (consentJson && JSON) ? JSON.parse(consentJson) : {},
                        consentJsonUpdated = false,
                        dateNow = new Date(),
                        allowsTracking = (function () {
                            var dnt =
                                w.doNotTrack ||
                                navigator.doNotTrack ||
                                navigator.msDoNotTrack
                            return !(dnt === 1 || dnt === '1' || dnt === 'yes' 
                                || (w.external && typeof w.external.msTrackingProtectionEnabled === 'function' && w.external.msTrackingProtectionEnabled()));
                        })()
                        ;
                    if (!consent.group) consent.group = {};

                    if (cbs.length) for (var i = 0; i < cbs.length; i++) {
                        var groupName = cbs[i].getAttribute('name').replace('gdpr-', ''),
                            cg = consent.group[groupName]
                            ;
                        if (groupName && !cg) {
                            if (allowedGroups.includes(groupName)) {
                                consent.group[groupName] = {
                                    consent: true,
                                    consentDate: dateNow
                                };
                                consentJsonUpdated = true;
                            }
                            else hasNewConsentChoices = true;
                        }
                        if (groupName && (allowsTracking && !(cg && cg.consent === false)) || allowedGroups.includes(groupName)) cbs[i].checked = true;
                    }

                    popup.addEventListener('click', function() {
                        if (!popup.classList.contains('privc-popup--is-sticky')) popup.classList.add('privc-popup--is-sticky');
                    });

                    if (btnSave) btnSave.addEventListener('click', function(e) {
                        if (e) { 
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        popup.classList.remove('privc-popup--is-sticky');
                        var allowedGroups = [],
                            scriptsSelector = '',
                            dateNow = new Date()
                            ;
                        for (var i = 0; i < cbs.length; i++) {
                            var groupName = cbs[i].getAttribute('name').replace('gdpr-', '');
                            if (groupName) {
                                consent.group[groupName] = { 
                                    consent: !!(cbs[i].checked),
                                    consentDate: dateNow
                                };
                                if (cbs[i].checked) {
                                    allowedGroups.push(groupName);
                                    if (scriptsSelector !== '') scriptsSelector += ', '; 
                                    scriptsSelector += getScriptSelector(groupName);
                                    if (typeof gtag === 'function') {
                                        try {
                                            switch (groupName.toLowerCase()) {
                                                case 'analytics':
                                                    gtag('consent', 'update', {
                                                        'analytics_storage': 'granted'
                                                    });
                                                break;
                                                case 'advertising':
                                                    gtag('set', 'ads_data_redaction', false);
                                                    gtag('consent', 'update', {
                                                        'ad_storage': 'granted'
                                                    });
                                                break;
                                            }
                                        }
                                        catch {}
                                    }
                                }
                            } 
                        }
                        w.publii_gdpr_allowed_cookies = allowedGroups;
                        if (!consent.firstConsentDate) consent.firstConsentDate = dateNow;
                        consent.lastConsentDate = dateNow;
                        localStorage.setItem('publii-gdpr-allowed-cookies', allowedGroups.join(','));
                        localStorage.setItem('publii-gdpr-consent-json', JSON.stringify(consent));

                        addScriptsBySelector(scriptsSelector);
                        popup.classList.remove('privc-popup--is-sticky');

                        setTimeout(function () {
                            if (currentConfig !== null) w.location.reload();
                        }, 250);

                        return false;
                    });

                    if (btnAllowAll) btnAllowAll.addEventListener('click', function(e) {
                        if (e) { 
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        if (cbs.length) for (var i = 0; i < cbs.length; i++) cbs[i].checked = true;
                        btnSave.click();
                        return false;
                    });

                    if (currentConfig === null || hasNewConsentChoices) popup.classList.add('privc-popup--is-sticky');
                    if (consentJsonUpdated) localStorage.setItem('publii-gdpr-consent-json', JSON.stringify(consent));
                }

                if (currentConfig !== null && currentConfig !== '') {
                    var scriptsSelector = '';
                    for (var i = 0; i < allowedGroups.length; i++) {
                        if (scriptsSelector !== '') scriptsSelector += ', '; 
                        scriptsSelector += getScriptSelector(allowedGroups[i]);
                    }
                    addScriptsBySelector(scriptsSelector);
               }

            })();
        </script>`;

        return output;
    }

    static getPrivacyPolicyUrl (configuration, renderer) {
        if (configuration.articleLinkType === 'external') {
            return configuration.articleExternalUrl;
        }

        if (!configuration.articleId && configuration.articleLinkType === 'internal') {
            return '#not-specified';
        }

        var result = renderer.cachedItems.posts[configuration.articleId];

        if (!result) {
            return '#not-found';
        }

        return result.url;
    }
}

module.exports = Gdpr;
