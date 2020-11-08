const TS_STACK_SELECTED_LANG = 'ts-stack-sl';

(function (window) {
    window.siteStrings = [];

    var everythingLoaded = setTimeout(function () {
        if (/complete/.test(document.readyState)) {
            clearInterval(everythingLoaded);
            init();
        }
    }, 100);

    function init() {
        var bodyScripts = document.querySelectorAll('body script');
        for (var i = 0; i < bodyScripts.length; i++) {
            bodyScripts[i].remove();
        }

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
                } catch (e) {
                    console.log(e);
                }

                if (response && response.pageStrings && response.pageStrings.length) {
                    buildSelect();
                } else {
                    setTimeout(() => {
                        var xhr = new XMLHttpRequest();
                        xhr.onload = function () {}; // success case
                        xhr.onerror = function () {}; // failure case

                        xhr.open('POST', 'http://localhost:4000/save-strings', true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify(data));
                    }, 5000);
                }
            }
        }; // success case

        xhrGet.onerror = function (err) {
            console.log(err);
        }; // failure case

        xhrGet.open(
            'GET',
            `http://localhost:4000/get-strings?apiKey=${apiKey}&href=${window.location.href}`,
            true
        );
        xhrGet.setRequestHeader('Content-Type', 'application/json');
        xhrGet.send();

        addStyle(`
    .custom-select {
        font-family: Arial;
        z-index: 1;
        position: fixed;
        bottom: 0px;
        // left: 500px;
        width: 149px;
        color: #0a2540;
        border-radius: 4px;
        box-shadow: 0 2px 20px -5px #e8eaef;
        border: solid 1px #e8eaef;
      }
      
      .custom-select select {
        display: none;
      }
      
      .select-selected {
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 2px 20px -5px #e8eaef;
        border: solid 1px #e8eaef;
        color: #0a2540;
        padding: 8px 16px;
      }
      
      .select-selected:after {
        position: absolute;
        content: "";
        top: 18px;
        right: 10px;
        width: 0;
        height: 0;
        border: 6px solid #ccc;
        border-color: #ccc transparent transparent transparent;
      }
      
      .select-selected.select-arrow-active:after {
        border-color: transparent transparent #ccc transparent;
        top: 10px;
      }
      
      .select-items div,.select-selected {
        color: #0a2540;
        padding: 8px 16px;
        border: 1px solid transparent;
        border-color: transparent transparent rgba(0, 0, 0, 0.1) transparent;
        cursor: pointer;
        user-select: none;
        font-size: 14px;
      }
      
      .select-items {
        position: absolute;
        background-color: white;
        left: 0;
        right: 0;
        z-index: 99;
        bottom: 40px;
        box-shadow: 0 2px 20px -5px #e8eaef;
        border: solid 1px #e8eaef;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      
      .select-hide {
        display: none;
      }
      
      .select-items div:hover, .same-as-selected {
        background-color: #f9f9fb;
      }
      
      .select-header {
          color: #0a2540 !important;
          padding: 20px !important;
          background-color: white;
          font-size: 9px;
          padding-top: 10px !important;
          padding-bottom: 6px !important;
          border-bottom: unset !important;
      }

      .select-header:hover {
        background-color: white !important;
        opacity: 1 !important;
      }`);

        function buildSelect() {
            if (window.__tsStack) {
                var customSelectWrapperDiv = document.createElement('div');


                var wrapperDiv = document.createElement('div');
                wrapperDiv.className = 'custom-select';

                var customizer = window.__tsStack.customizer;

                var prevLang = localStorage.getItem(TS_STACK_SELECTED_LANG);

                if (window.__tsStack.sourceLanguage) {
                    window.__tsStack.populatedLanguages.unshift({
                        ...window.__tsStack.sourceLanguage,
                        isSourceLanguage: true,
                    });
                }

                if (prevLang && window.location.search.includes('?language')) {
                    var parsedLangObject = JSON.parse(prevLang);
                    if (parsedLangObject) {
                        var restOfLanguages = window.__tsStack.populatedLanguages.filter((lang) => {
                            if (lang.id !== parseInt(parsedLangObject.id)) {
                                return true;
                            }
                        });

                        window.__tsStack.populatedLanguages = restOfLanguages;
                        window.__tsStack.populatedLanguages.unshift({
                            ...parsedLangObject,
                            isSelected: true,
                        });
                        applyTranslations(parsedLangObject.id);
                    }
                }

                var select = document.createElement('select');

                for (var i = 0; i < window.__tsStack.populatedLanguages.length; i++) {
                    var val = window.__tsStack.populatedLanguages[i];

                    var option = document.createElement('option');
                    if (val.value !== -1) {
                        //create image wrapper
                        var imgWrapper = document.createElement('div');
                        imgWrapper.setAttribute('data-value', val.id);
                        imgWrapper.style.setProperty('font-size', '14px');
                        imgWrapper.style.setProperty('color', '#0a2540');
                        imgWrapper.style.setProperty('border', 'unset');
                        imgWrapper.style.setProperty('padding-left', '8px');
                        imgWrapper.style.setProperty('padding-right', '8px');
                        imgWrapper.classList.add('source-lang');
                        // create img
                        var img = document.createElement('img');
                        img.src = val.flag;
                        img.style.setProperty('width', '23px');
                        img.style.setProperty('height', '23px');
                        img.style.setProperty('border-radius', '50px');

                        // create span
                        var imgSpan = document.createElement('span');
                        imgSpan.style.setProperty('margin-left', '10px');

                        if (customizer.text === 'SHORTENED') {
                            imgSpan.textContent = val.iso2.toUpperCase();
                        } else if (customizer.text === 'FULL') {
                            imgSpan.textContent = val.localName;
                        } else if (customizer.text === 'FLAG_ONLY') {
                            imgSpan.textContent = '';
                        }

                        imgWrapper.appendChild(img);
                        imgWrapper.appendChild(imgSpan);
                        option.value = val.id;
                        option.appendChild(imgWrapper);
                    } else {
                        option.value = 0;
                        option.text = val.label;
                    }

                    select.appendChild(option);
                }

                wrapperDiv.appendChild(select);
                customSelectWrapperDiv.appendChild(wrapperDiv)

                // customSelectWrapperDiv.classList("custom-select-wrapper")
                // customSelectWrapperDiv.style.setProperty('width', '200px')
                // customSelectWrapperDiv.style.setProperty('height', '300px')
                // customSelectWrapperDiv.style.setProperty('z-index', '1000000')
                // customSelectWrapperDiv.style.setProperty('background', 'red')

                if (customizer && customizer.position === 'LEFT') {
                    customSelectWrapperDiv.style.setProperty('left', '1vw');
                    document.body.appendChild(customSelectWrapperDiv);
                } else if (customizer && customizer.position === 'RIGHT') {
                    customSelectWrapperDiv.style.setProperty('right', '1vw');
                    document.body.appendChild(customSelectWrapperDiv);
                } else if (
                    customizer &&
                    customizer.position === 'CUSTOM' &&
                    (customizer.customDivId !== '' || customizer.customDivId !== 'null')
                ) {
                    var desiredDiv = document.getElementById(customizer.customDivId);
                    if (desiredDiv) {
                        debugger
                        customSelectWrapperDiv.style.position = 'relative';
                        desiredDiv.append(customSelectWrapperDiv);
                    } else {
                        customSelectWrapperDiv.style.setProperty('left', '1vw');
                        document.body.appendChild(customSelectWrapperDiv);
                    }
                }

                makeSelectWork();
            }
        }

        function addStyle(styleString) {
            var style = document.createElement('style');
            style.textContent = styleString;
            document.head.append(style);
        }

        function makeSelectWork() {
            var x, i, j, selElmnt, a, b, c;
            x = document.getElementsByClassName('custom-select');
            for (i = 0; i < x.length; i++) {
                selElmnt = x[i].getElementsByTagName('select')[0];

                a = document.createElement('DIV');
                a.setAttribute('class', 'select-selected');
                a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
                x[i].appendChild(a);

                b = document.createElement('DIV');
                b.setAttribute('class', 'select-items select-hide');

                for (j = 0; j < selElmnt.length; j++) {
                    c = document.createElement('DIV');
                    c.innerHTML = selElmnt.options[j].innerHTML;

                    c.addEventListener('click', function (e) {
                        var y, i, k, s, h;
                        s = this.parentNode.parentNode.getElementsByTagName('select')[0];
                        h = this.parentNode.previousSibling;
                        for (i = 0; i < s.length; i++) {
                            if (s.options[i].innerHTML == this.innerHTML) {
                                s.selectedIndex = i;
                                h.innerHTML = this.innerHTML;
                                y = this.parentNode.getElementsByClassName('same-as-selected');
                                for (k = 0; k < y.length; k++) {
                                    y[k].removeAttribute('class');
                                }
                                this.setAttribute('class', 'same-as-selected');
                                break;
                            }
                        }
                        h.click();

                        try {
                            applyTranslations(this.children[0].getAttribute('data-value'));
                        } catch (e) {
                            console.log('unable to apply translations', e);
                        }
                    });
                    b.appendChild(c);
                }

                x[i].appendChild(b);
                a.addEventListener('click', function (e) {
                    e.stopPropagation();
                    closeAllSelect(this);
                    this.nextSibling.classList.toggle('select-hide');
                    this.classList.toggle('select-arrow-active');
                });
            }

            if (
                window.__tsStack.customizer &&
                window.__tsStack.customizer.appearance === 'WITH_BRANDING'
            ) {
                var branding = document.createElement('div');

                branding.className = 'select-header';
                branding.innerHTML = '⚡ by translatestack';
                branding.style.backgroundColor = 'white';
                branding.style.setProperty('font-size', '9px');
                branding.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });

                b.insertBefore(branding, b.children[0]);
            }
        }

        window.translatedStringsMap = [];

        function applyTranslations(languageId) {
            var languageObject = window.__tsStack.populatedLanguages.filter((lang) => {
                if (typeof lang !== 'string') {
                    if (lang.id === parseInt(languageId)) {
                        return true;
                    }
                }
            });

            if (languageObject && languageObject.length > 0) {
                localStorage.setItem(TS_STACK_SELECTED_LANG, JSON.stringify(languageObject[0]));
                window.history.replaceState({}, '', `/?language=${languageObject[0].iso2}`);
            }

            if (window.translatedStringsMap.length !== 0) {
                // we have string, then return them to originals
                for (var i = 0; i < window.translatedStringsMap.length; i++) {
                    var value = window.translatedStringsMap[i];
                    walk(document.body, false, value.to, value.original);
                }

                window.translatedStringsMap = [];
            }

            if (window.__tsStack) {
                var pageStrings = window.__tsStack.pageStrings;
                pageStrings.forEach((translatedString) => {
                    if (translatedString.translations && translatedString.translations.length) {
                        translatedString.translations.forEach((translation) => {
                            if (translation.languageId === parseInt(languageId)) {
                                window.translatedStringsMap.push({
                                    original: translatedString.original,
                                    to: translation.translatedString,
                                });

                                walk(
                                    document.body,
                                    false,
                                    translatedString.original,
                                    translation.translatedString
                                );
                            }
                        });
                    }
                });
            }
        }

        function closeAllSelect(elmnt) {
            var x,
                y,
                i,
                xl,
                yl,
                arrNo = [];
            x = document.getElementsByClassName('select-items');
            y = document.getElementsByClassName('select-selected');
            xl = x.length;
            yl = y.length;
            for (i = 0; i < yl; i++) {
                if (elmnt == y[i]) {
                    arrNo.push(i);
                } else {
                    y[i].classList.remove('select-arrow-active');
                }
            }
            for (i = 0; i < xl; i++) {
                if (arrNo.indexOf(i)) {
                    x[i].classList.add('select-hide');
                }
            }
        }

        window.document.addEventListener('click', closeAllSelect);
    }

    function walk(element, onlyExtract = true, from, to) {
        if (element && element.childNodes) {
            for (let node of element.childNodes) {
                switch (node.nodeType) {
                    case Node.ELEMENT_NODE:
                        if (onlyExtract) {
                            walk(node, true, from, to);
                        } else {
                            walk(node, false, from, to);
                        }
                        break;
                    case Node.TEXT_NODE:
                        var trimmedString = node.textContent ? node.textContent.trim() : '';

                        if (onlyExtract) {
                            window.siteStrings.push(node.textContent);
                        } else {
                            if (trimmedString == from) {
                                node.textContent = node.textContent.replace(from, to);
                            }
                        }
                        break;
                    case Node.DOCUMENT_NODE:
                        if (onlyExtract) {
                            walk(node, true, from, to);
                        } else {
                            walk(node, false, from, to);
                        }
                }
            }
        }
    }
})(window, undefined);
