const TS_STACK_SELECTED_LANG = 'ts-stack-sl';

(function () {
    window.siteStrings = [];
    window.pageTitle = '';
    window.pageDescription = '';
    window.isHeadContentReplaced = false;

    // var everythingLoaded = setTimeout(function () {
    //     if (/loaded|complete/.test(document.readyState)) {
    //         clearInterval(everythingLoaded);
    //         init();
    //     }
    // }, 1000);

    function init() {
        var head = document.getElementsByTagName('head')[0];

        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap';

        head.appendChild(link);

        // get header and description content
        window.document.querySelectorAll('meta').forEach((element) => {
            if (element.name === 'description') {
                const trimmedText = element.content.trim();
                if (trimmedText.length > 0) {
                    window.siteStrings.push(trimmedText);
                    pageTitle = trimmedText;
                }
            }
        });

        window.document.querySelectorAll('head').forEach((element) => {
            const trimmedText = element.textContent.trim();
            if (trimmedText.length > 0) {
                window.siteStrings.push(trimmedText);
                pageDescription = trimmedText;
            }
        });

        walk(document.body, true);

        var tssScript = document.getElementById('tss-script');
        var tssScriptSrc = tssScript.getAttribute('src');
        var apiKey = tssScriptSrc.substring(tssScriptSrc.indexOf('=') + 1);

        var data = {
            apiKey: apiKey,
            pageText: window.siteStrings,
            pathname: window.location.pathname,
            origin: window.location.origin,
            href: window.location.href,
        };

        var xhrGet = new XMLHttpRequest();
        xhrGet.onreadystatechange = function () {
            if (xhrGet.readyState == XMLHttpRequest.DONE) {
                var responseString = xhrGet.responseText;
                var response;
                try {
                    response = JSON.parse(responseString);
                    window.__tsStack = response;
                } catch (e) {}

                if (response && response.pageStrings && response.pageStrings.length) {
                    var prevLang = localStorage.getItem(TS_STACK_SELECTED_LANG);
                    var langId = null;

                    if (prevLang /*&& window.location.search.includes('?language')*/) {
                        var parsedLangObject = JSON.parse(prevLang);
                        if (parsedLangObject) {
                            langId = parsedLangObject.id;
                        }
                    } else {
                        var browserLanguage = getFirstBrowserLanguage();
                        if (browserLanguage && browserLanguage.length >= 2) {
                            var languageIso2 = browserLanguage.split('-')[0];

                            if (languageIso2.length === 2) {
                                window.__tsStack.populatedLanguages.forEach((l) => {
                                    if (l.iso2 === languageIso2) {
                                        langId = l.id;
                                    }
                                });
                            }
                        }
                    }

                    buildSelect(langId);

                    if (langId) {
                        applyTranslations(langId);
                    }
                } else {
                    setTimeout(() => {
                        var xhr = new XMLHttpRequest();
                        xhr.onload = function () {}; // success case
                        xhr.onerror = function () {}; // failure case

                        xhr.open(
                            'POST',
                            'https://app.translatestack.com/graphqlsave-strings',
                            true
                        );
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify(data));
                    }, 5000);
                }
            }
        };
        xhrGet.onerror = function (err) {};

        xhrGet.open(
            'GET',
            `https://app.translatestack.com/graphqlget-strings?apiKey=${apiKey}&href=${window.location.href}`,
            true
        );
        xhrGet.setRequestHeader('Content-Type', 'application/json');
        xhrGet.send();

        function buildSelect(langId) {
            if (window.__tsStack) {
                var customSelectWrapperDiv;
                var customizer = window.__tsStack.customizer;

                customSelectWrapperDiv = document.getElementById('ts-select-wrapper');

                if (customSelectWrapperDiv) {
                    customSelectWrapperDiv.innerHTML = '';
                } else {
                    customSelectWrapperDiv = document.createElement('div');

                    customSelectWrapperDiv.id = 'ts-select-wrapper';
                    customSelectWrapperDiv.style.padding = '0px';
                    customSelectWrapperDiv.style.margin = '0px';
                    customSelectWrapperDiv.style.textAlign = 'left';
                    customSelectWrapperDiv.style.zIndex = '2147483647';
                    customSelectWrapperDiv.style.direction = 'ltr';
                    customSelectWrapperDiv.style.position = 'fixed';
                    customSelectWrapperDiv.style.bottom = '0px';
                    customSelectWrapperDiv.style.fontFamily = 'Open Sans';
                }

                var listContainSourceLang = false;

                window.__tsStack.populatedLanguages.forEach((l) => {
                    if (l.isSource) {
                        listContainSourceLang = true;
                    }
                });

                if (window.__tsStack.sourceLanguage && !listContainSourceLang) {
                    window.__tsStack.populatedLanguages.unshift({
                        ...window.__tsStack.sourceLanguage,
                        isActive: true,
                        isSource: true,
                    });
                }

                if (langId) {
                    window.__tsStack.populatedLanguages = window.__tsStack.populatedLanguages.map(
                        (l) => {
                            return {
                                ...l,
                                isActive: l.id === langId,
                            };
                        }
                    );
                }

                document.body.appendChild(customSelectWrapperDiv);

                var otherOptionsElement = document.createElement('div');
                otherOptionsElement.style.display = 'none';
                otherOptionsElement.style.fontFamily = 'Open Sans';

                var buttonLikeElement = document.createElement('div');
                buttonLikeElement.style.cursor = 'pointer';
                buttonLikeElement.style.backgroundColor = 'white';
                buttonLikeElement.style.border = 'solid 1px #e8eaef';
                buttonLikeElement.style.padding = '0px';
                buttonLikeElement.style.margin = '0px';
                buttonLikeElement.style.fontFamily = 'Open Sans';

                buttonLikeElement.style.width =
                    customizer.text === 'TEXT_ONLY' || customizer.text === 'SHORTENED'
                        ? '120px'
                        : customizer.text === 'FLAG_ONLY'
                        ? '110px'
                        : '170px';

                customSelectWrapperDiv.appendChild(buttonLikeElement);

                var activeLanguage = document.createElement('div');
                activeLanguage.id = 'ts-active-language';
                activeLanguage.style.width = '100%';
                activeLanguage.style.fontFamily = 'Open Sans';

                var customElement = document.getElementById(customizer.customDivId);

                if (customizer.customDivId && customizer.position === 'CUSTOM' && customElement) {
                    customElement.style.fontFamily = 'Open Sans';
                    // customSelectWrapperDiv.style.position = 'absolute';
                    customSelectWrapperDiv.style.position = 'relative';
                    if (customizer.customDivDirection === 'UP')
                        customSelectWrapperDiv.style.bottom = '0px';
                    else customSelectWrapperDiv.style.top = '0px';

                    var customOuterWrapper = document.createElement('div');
                    customOuterWrapper.appendChild(customSelectWrapperDiv);
                    customOuterWrapper.style.position = 'relative';
                    customOuterWrapper.style.display = 'inline-block';
                    customOuterWrapper.style.height = '36px';
                    customOuterWrapper.style.verticalAlign = 'middle';
                    customOuterWrapper.style.fontFamily = 'Open Sans';

                    if (customizer.customDivDirection === 'UP') {
                        buttonLikeElement.appendChild(otherOptionsElement);
                        buttonLikeElement.appendChild(activeLanguage);
                    } else {
                        buttonLikeElement.appendChild(activeLanguage);
                        buttonLikeElement.appendChild(otherOptionsElement);
                    }

                    customElement.appendChild(customOuterWrapper);
                } else if (customizer && customizer.position === 'LEFT') {
                    buttonLikeElement.appendChild(otherOptionsElement);
                    buttonLikeElement.appendChild(activeLanguage);

                    customSelectWrapperDiv.style.setProperty('left', '100px');
                } else {
                    window.__tsStack.customizer.position = 'RIGHT';
                    buttonLikeElement.appendChild(otherOptionsElement);
                    buttonLikeElement.appendChild(activeLanguage);

                    customSelectWrapperDiv.style.setProperty('right', '100px');
                }

                window.__tsStack.populatedLanguages.forEach((language, index) => {
                    var languageWrapper = document.createElement('div');
                    languageWrapper.className = 'ts-language-wrapper';
                    languageWrapper.style.height = '36px';
                    languageWrapper.style.fontFamily = 'Open Sans';

                    languageWrapper.onmouseover = function () {
                        languageWrapper.style.backgroundColor = '#e8eaef';
                    };
                    languageWrapper.onmouseout = function () {
                        languageWrapper.style.backgroundColor = '#fff';
                    };

                    // icon
                    var iconWrapper = document.createElement('div');
                    iconWrapper.style.height = '24px';
                    iconWrapper.style.width = '24px';
                    iconWrapper.style.borderRadius = '50%';
                    iconWrapper.style.backgroundSize = 'contain';
                    iconWrapper.style.backgroundImage = `url('${language.flag}')`;
                    iconWrapper.style.display = 'inline-block';
                    iconWrapper.style.backgroundPosition = '50% 50%';
                    iconWrapper.style.backgroundRepeat = 'no-repeat';
                    iconWrapper.style.backgroundColor = 'transparent';
                    iconWrapper.style.marginLeft = '10px';
                    iconWrapper.style.marginTop = '5px';

                    if (customizer.text !== 'TEXT_ONLY') {
                        languageWrapper.appendChild(iconWrapper);
                    }

                    // lang title
                    var titleElement = document.createElement('div');
                    titleElement.style.lineHeight = '36px';
                    titleElement.style.height = '36px';
                    titleElement.style.display = 'inline-block';
                    titleElement.style.marginLeft = '10px';
                    titleElement.style.verticalAlign = 'top';
                    titleElement.style.fontSize = '14px';
                    titleElement.style.textAlign = 'left';
                    titleElement.style.color = '#0a2540';
                    titleElement.style.fontFamily = 'Open Sans';

                    titleElement.style.userSelect = 'none';

                    if (customizer.text === 'SHORTENED') {
                        titleElement.innerText = language.iso2.toUpperCase();
                    } else if (customizer.text === 'FULL' || customizer.text === 'TEXT_ONLY') {
                        titleElement.innerText = language.localName;
                    } else if (customizer.text === 'FLAG_ONLY') {
                        titleElement.innerText = '';
                    }

                    var arrowElement = document.createElement('div');
                    arrowElement.style.top = '7px';
                    arrowElement.style.border = '6px solid transparent';
                    arrowElement.style.borderColor = 'transparent transparent #ccc transparent';
                    arrowElement.style.fontFamily = 'Open Sans';

                    if (
                        customizer.customDivDirection === 'UP' &&
                        customizer.position === 'CUSTOM'
                    ) {
                        arrowElement.style.top = '7px';
                        arrowElement.style.border = '6px solid transparent';
                        arrowElement.style.borderColor = 'transparent transparent #ccc transparent';
                    } else if (
                        customizer.customDivDirection === 'DOWN' &&
                        customizer.position === 'CUSTOM'
                    ) {
                        arrowElement.style.top = '15px';
                        arrowElement.style.border = '6px solid transparent';
                        arrowElement.style.borderColor = '#ccc transparent transparent transparent';
                    }

                    arrowElement.style.right = '10px';
                    arrowElement.style.position = 'absolute';
                    arrowElement.style.width = '0px';
                    arrowElement.style.height = '0px';

                    languageWrapper.appendChild(titleElement);

                    languageWrapper.onclick = function () {
                        if (otherOptionsElement.style.display === 'none') {
                            otherOptionsElement.style.display = 'block';

                            arrowElement.style.top = '15px';
                            arrowElement.style.border = '6px solid transparent';
                            arrowElement.style.borderColor =
                                '#ccc transparent transparent transparent';

                            if (
                                customizer.customDivDirection === 'UP' &&
                                customizer.position === 'CUSTOM'
                            ) {
                                arrowElement.style.top = '15px';
                                arrowElement.style.border = '6px solid transparent';
                                arrowElement.style.borderColor =
                                    '#ccc transparent transparent transparent';
                            } else if (
                                customizer.customDivDirection === 'DOWN' &&
                                customizer.position === 'CUSTOM'
                            ) {
                                arrowElement.style.top = '7px';
                                arrowElement.style.border = '6px solid transparent';
                                arrowElement.style.borderColor =
                                    'transparent transparent #ccc transparent';
                            }
                        } else {
                            otherOptionsElement.style.display = 'none';

                            applyTranslations(language.id);
                            buildSelect(language.id);
                            // applyHeaderTranslations(langId);
                        }
                    };

                    if (language.isActive) {
                        languageWrapper.style.position = 'relative';
                        languageWrapper.appendChild(arrowElement);
                        activeLanguage.appendChild(languageWrapper);
                    } else {
                        otherOptionsElement.appendChild(languageWrapper);
                    }
                });

                if (customizer && customizer.appearance === 'WITH_BRANDING') {
                    var branding = document.createElement('div');
                    branding.style.fontFamily = 'Open Sans';

                    branding.className = 'select-header';
                    branding.innerHTML = '⚡ by translatestack';
                    branding.style.backgroundColor = 'white';
                    branding.style.setProperty('font-size', '10px');
                    branding.style.setProperty('font-family', 'Open Sans');

                    branding.style.setProperty('line-height', '36px');
                    branding.style.setProperty('text-align', 'center');
                    branding.style.setProperty('user-select', 'none');
                    branding.style.color = '#0a2540';

                    branding.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open('https://translatestack.com/', '_blank');
                    });

                    otherOptionsElement.insertBefore(branding, otherOptionsElement.children[0]);

                    if (
                        customizer.customDivDirection === 'UP' &&
                        customizer.position === 'CUSTOM'
                    ) {
                        otherOptionsElement.insertBefore(branding, otherOptionsElement.children[0]);
                    } else if (
                        customizer.customDivDirection === 'DOWN' &&
                        customizer.position === 'CUSTOM'
                    ) {
                        otherOptionsElement.appendChild(branding);
                    }
                }
            }
        }

        window.translatedStringsMap = [];

        function applyTranslations(languageId) {
            var languageObject = window.__tsStack.populatedLanguages.filter((lang) => {
                if (lang.id === parseInt(languageId)) {
                    return true;
                }
            });

            if (languageObject && languageObject.length > 0) {
                if (window.__tsStack.sourceLanguage.id !== languageObject[0].id) {
                    localStorage.setItem(TS_STACK_SELECTED_LANG, JSON.stringify(languageObject[0]));

                    const params = new URLSearchParams(location.search);
                    params.set('language', languageObject[0].iso2);

                    window.history.replaceState(
                        {},
                        '',
                        `${location.pathname}?${params}${location.hash}`
                    );
                } else {
                    localStorage.removeItem(TS_STACK_SELECTED_LANG);
                    window.history.replaceState({}, '', `${location.pathname}?${location.hash}`);
                }
            }

            if (window.translatedStringsMap.length !== 0) {
                for (var i = 0; i < window.translatedStringsMap.length; i++) {
                    var value = window.translatedStringsMap[i];
                    walk(document.body, false, value.to, value.original, i, true);
                    walk(document.head, false, value.to, value.original, i, true);
                }

                window.translatedStringsMap = [];
            }

            if (window.__tsStack) {
                var pageStrings = window.__tsStack.pageStrings;
                pageStrings.forEach((translatedString, index) => {
                    if (translatedString.translations && translatedString.translations.length) {
                        translatedString.translations.forEach((translation) => {
                            if (translation.languageId === parseInt(languageId)) {
                                var itemIndex = window.translatedStringsMap.push({
                                    original: translatedString.original,
                                    to: translation.translatedString,
                                });

                                walk(
                                    document.body,
                                    false,
                                    translatedString.original,
                                    translation.translatedString,
                                    itemIndex - 1
                                );

                                walk(
                                    document.head,
                                    false,
                                    translatedString.original,
                                    translation.translatedString,
                                    itemIndex - 1
                                );

                            }
                        });
                    }
                });
            }
        }
    }

    window.initTsStackTranslator = init();

    function walk(element, onlyExtract = true, from, to, globalIndex, shouldReturnBack = false) {
        if (element && element.childNodes) {
            for (let node of element.childNodes) {
                switch (node.nodeType) {
                    case Node.ELEMENT_NODE:
                        var obj = node.attributes;
                        var array = obj ? Array.prototype.slice.call(obj) : [];

                        if (onlyExtract) {
                            for (var i = 0; i < array.length; i++) {
                                var nodeAttr = array[i];

                                if (nodeAttr && nodeAttr.nodeName.includes('placeholder')) {
                                    window.siteStrings.push(nodeAttr.nodeValue.trim());
                                }
                            }

                            walk(node, true, from, to, globalIndex, shouldReturnBack);
                        } else {
                            for (var i = 0; i < array.length; i++) {
                                var nodeAttr = array[i];

                                if (nodeAttr.nodeName.includes('placeholder')) {
                                    if (nodeAttr.textContent.trim() === from.trim()) {
                                        if (
                                            globalIndex >= 0 &&
                                            window.translatedStringsMap[globalIndex] &&
                                            !window.translatedStringsMap[globalIndex].isReplaced
                                        ) {
                                            nodeAttr.textContent = nodeAttr.textContent.replace(
                                                from,
                                                to
                                            );
                                        }

                                        if (shouldReturnBack) {
                                            nodeAttr.textContent = nodeAttr.textContent.replace(
                                                from,
                                                to
                                            );
                                        }

                                        if (
                                            globalIndex >= 0 &&
                                            window.translatedStringsMap[globalIndex]
                                        ) {
                                            window.translatedStringsMap[
                                                globalIndex
                                            ].isReplaced = true;
                                        }
                                        return;
                                    }
                                }
                            }

                            walk(node, false, from, to, globalIndex, shouldReturnBack);
                        }
                        break;
                    case Node.TEXT_NODE:
                        var parentNodeName = node.parentNode.nodeName.toUpperCase();
                        if (
                            parentNodeName !== 'SCRIPT' &&
                            parentNodeName !== 'STYLE' &&
                            parentNodeName !== 'NOSCRIPT' &&
                            parentNodeName !== 'IFRAME' &&
                            parentNodeName !== 'HEAD'
                        ) {
                            // console.log("ATTRIBUTE", );

                            var trimmedString = node.textContent ? node.textContent.trim() : '';
                            if (trimmedString.length > 0) {
                                if (onlyExtract) {
                                    window.siteStrings.push(trimmedString);
                                } else {
                                    if (trimmedString === from.trim()) {
                                        if (
                                            globalIndex >= 0 &&
                                            window.translatedStringsMap[globalIndex] &&
                                            !window.translatedStringsMap[globalIndex].isReplaced
                                        ) {
                                            node.textContent = node.textContent.replace(from, to);
                                        }

                                        if (shouldReturnBack) {
                                            node.textContent = node.textContent.replace(from, to);
                                        }

                                        if (
                                            globalIndex >= 0 &&
                                            window.translatedStringsMap[globalIndex]
                                        ) {
                                            window.translatedStringsMap[
                                                globalIndex
                                            ].isReplaced = true;
                                        }

                                        return;
                                    }
                                }
                            }
                        }
                        break;

                    // case Node.ATTRIBUTE_NODE:
                    //     console.log(' node.textContent', node.textContent);
                    //     console.log(' node.textContent', node);

                    case Node.DOCUMENT_NODE:
                        if (onlyExtract) {
                            walk(node, true, from, to, globalIndex, shouldReturnBack);
                        } else {
                            walk(node, false, from, to, globalIndex, shouldReturnBack);
                        }
                }
            }
        }
    }

    var getFirstBrowserLanguage = function () {
        var nav = window.navigator,
            browserLanguagePropertyKeys = [
                'language',
                'browserLanguage',
                'systemLanguage',
                'userLanguage',
            ],
            i,
            language;

        // support for HTML 5.1 "navigator.languages"
        if (Array.isArray(nav.languages)) {
            for (i = 0; i < nav.languages.length; i++) {
                language = nav.languages[i];
                if (language && language.length) {
                    return language;
                }
            }
        }

        // support for other well known properties in browsers
        for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
            language = nav[browserLanguagePropertyKeys[i]];
            if (language && language.length) {
                return language;
            }
        }

        return null;
    };

    // function applyHeaderTranslations(langId) {
        

    //     pageStrings.forEach((translatedString, index) => {
    //         if (translatedString.translations && translatedString.translations.length) {
    //             translatedString.translations.forEach((translation) => {
    //                 if (translation.languageId === parseInt(languageId)) {
    //                     var itemIndex = window.translatedStringsMap.push({
    //                         original: translatedString.original,
    //                         to: translation.translatedString,
    //                     });

    //                     walk(
    //                         document.body,
    //                         false,
    //                         translatedString.original,
    //                         translation.translatedString,
    //                         itemIndex - 1
    //                     );
    //                 }
    //             });
    //         }
    //     });

    // }
})();
