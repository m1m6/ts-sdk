!(function (e, t) {
    'object' == typeof module && module.exports
        ? (module.exports = t())
        : 'function' == typeof define && define.amd
        ? define(t)
        : (e.findAndReplaceDOMText = t());
})(this, function () {
    var e = 'retain',
        t = document,
        n = {}.hasOwnProperty;
    function r() {
        return (
            function (e, t, n, o, d) {
                if (t && !t.nodeType && arguments.length <= 2) return !1;
                var a = 'function' == typeof n;
                a &&
                    ((s = n),
                    (n = function (e, t) {
                        return s(e.text, t.startIndex);
                    }));
                var s;
                var p = i(t, {
                    find: e,
                    wrap: a ? null : n,
                    replace: a ? n : '$' + (o || '&'),
                    prepMatch: function (e, t) {
                        if (!e[0]) throw 'findAndReplaceDOMText cannot handle zero-length matches';
                        if (o > 0) {
                            var n = e[o];
                            (e.index += e[0].indexOf(n)), (e[0] = n);
                        }
                        return (
                            (e.endIndex = e.index + e[0].length),
                            (e.startIndex = e.index),
                            (e.index = t),
                            e
                        );
                    },
                    filterElements: d,
                });
                return (
                    (r.revert = function () {
                        return p.revert();
                    }),
                    !0
                );
            }.apply(null, arguments) || i.apply(null, arguments)
        );
    }
    function i(e, t) {
        return new o(e, t);
    }
    function o(t, i) {
        var o = i.preset && r.PRESETS[i.preset];
        if (((i.portionMode = i.portionMode || e), o))
            for (var d in o) n.call(o, d) && !n.call(i, d) && (i[d] = o[d]);
        (this.node = t),
            (this.options = i),
            (this.prepMatch = i.prepMatch || this.prepMatch),
            (this.reverts = []),
            (this.matches = this.search()),
            this.matches.length && this.processMatches();
    }
    return (
        (r.NON_PROSE_ELEMENTS = {
            br: 1,
            hr: 1,
            script: 1,
            style: 1,
            img: 1,
            video: 1,
            audio: 1,
            canvas: 1,
            svg: 1,
            map: 1,
            object: 1,
            input: 1,
            textarea: 1,
            select: 1,
            option: 1,
            optgroup: 1,
            button: 1,
        }),
        (r.NON_CONTIGUOUS_PROSE_ELEMENTS = {
            address: 1,
            article: 1,
            aside: 1,
            blockquote: 1,
            dd: 1,
            div: 1,
            dl: 1,
            fieldset: 1,
            figcaption: 1,
            figure: 1,
            footer: 1,
            form: 1,
            h1: 1,
            h2: 1,
            h3: 1,
            h4: 1,
            h5: 1,
            h6: 1,
            header: 1,
            hgroup: 1,
            hr: 1,
            main: 1,
            nav: 1,
            noscript: 1,
            ol: 1,
            output: 1,
            p: 1,
            pre: 1,
            section: 1,
            ul: 1,
            br: 1,
            li: 1,
            summary: 1,
            dt: 1,
            details: 1,
            rp: 1,
            rt: 1,
            rtc: 1,
            script: 1,
            style: 1,
            img: 1,
            video: 1,
            audio: 1,
            canvas: 1,
            svg: 1,
            map: 1,
            object: 1,
            input: 1,
            textarea: 1,
            select: 1,
            option: 1,
            optgroup: 1,
            button: 1,
            table: 1,
            tbody: 1,
            thead: 1,
            th: 1,
            tr: 1,
            td: 1,
            caption: 1,
            col: 1,
            tfoot: 1,
            colgroup: 1,
        }),
        (r.NON_INLINE_PROSE = function (e) {
            return n.call(r.NON_CONTIGUOUS_PROSE_ELEMENTS, e.nodeName.toLowerCase());
        }),
        (r.PRESETS = {
            prose: {
                forceContext: r.NON_INLINE_PROSE,
                filterElements: function (e) {
                    return !n.call(r.NON_PROSE_ELEMENTS, e.nodeName.toLowerCase());
                },
            },
        }),
        (r.Finder = o),
        (o.prototype = {
            search: function () {
                var e,
                    t = 0,
                    n = 0,
                    r = this.options.find,
                    i = this.getAggregateText(),
                    o = [],
                    d = this;
                return (
                    (r =
                        'string' == typeof r
                            ? RegExp(String(r).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1'), 'g')
                            : r),
                    (function i(a) {
                        for (var s = 0, p = a.length; s < p; ++s) {
                            var h = a[s];
                            if ('string' == typeof h) {
                                if (r.global)
                                    for (; (e = r.exec(h)); ) o.push(d.prepMatch(e, t++, n));
                                else (e = h.match(r)) && o.push(d.prepMatch(e, 0, n));
                                n += h.length;
                            } else i(h);
                        }
                    })(i),
                    o
                );
            },
            prepMatch: function (e, t, n) {
                if (!e[0])
                    throw new Error('findAndReplaceDOMText cannot handle zero-length matches');
                return (
                    (e.endIndex = n + e.index + e[0].length),
                    (e.startIndex = n + e.index),
                    (e.index = t),
                    e
                );
            },
            getAggregateText: function () {
                var e = this.options.filterElements,
                    t = this.options.forceContext;
                return (function n(r) {
                    if (r.nodeType === Node.TEXT_NODE) return [r.data];
                    if (e && !e(r)) return [];
                    var i = [''];
                    var o = 0;
                    if ((r = r.firstChild))
                        do {
                            if (r.nodeType !== Node.TEXT_NODE) {
                                var d = n(r);
                                t && r.nodeType === Node.ELEMENT_NODE && (!0 === t || t(r))
                                    ? ((i[++o] = d), (i[++o] = ''))
                                    : ('string' == typeof d[0] && (i[o] += d.shift()),
                                      d.length && ((i[++o] = d), (i[++o] = '')));
                            } else i[o] += r.data;
                        } while ((r = r.nextSibling));
                    return i;
                })(this.node);
            },
            processMatches: function () {
                var e,
                    t,
                    n,
                    r = this.matches,
                    i = this.node,
                    o = this.options.filterElements,
                    d = [],
                    a = i,
                    s = r.shift(),
                    p = 0,
                    h = 0,
                    l = [i];
                e: for (;;) {
                    if (
                        (a.nodeType === Node.TEXT_NODE &&
                            (!t && a.length + p >= s.endIndex
                                ? (t = {
                                      node: a,
                                      index: h++,
                                      text: a.data.substring(s.startIndex - p, s.endIndex - p),
                                      indexInMatch: 0 === p ? 0 : p - s.startIndex,
                                      indexInNode: s.startIndex - p,
                                      endIndexInNode: s.endIndex - p,
                                      isEnd: !0,
                                  })
                                : e &&
                                  d.push({
                                      node: a,
                                      index: h++,
                                      text: a.data,
                                      indexInMatch: p - s.startIndex,
                                      indexInNode: 0,
                                  }),
                            !e &&
                                a.length + p > s.startIndex &&
                                (e = {
                                    node: a,
                                    index: h++,
                                    indexInMatch: 0,
                                    indexInNode: s.startIndex - p,
                                    endIndexInNode: s.endIndex - p,
                                    text: a.data.substring(s.startIndex - p, s.endIndex - p),
                                }),
                            (p += a.data.length)),
                        (n = a.nodeType === Node.ELEMENT_NODE && o && !o(a)),
                        e && t)
                    ) {
                        if (
                            ((a = this.replaceMatch(s, e, d, t)),
                            (p -= t.node.data.length - t.endIndexInNode),
                            (e = null),
                            (t = null),
                            (d = []),
                            (h = 0),
                            0,
                            !(s = r.shift()))
                        )
                            break;
                    } else if (!n && (a.firstChild || a.nextSibling)) {
                        a.firstChild ? (l.push(a), (a = a.firstChild)) : (a = a.nextSibling);
                        continue;
                    }
                    for (;;) {
                        if (a.nextSibling) {
                            a = a.nextSibling;
                            break;
                        }
                        if ((a = l.pop()) === i) break e;
                    }
                }
            },
            revert: function () {
                for (var e = this.reverts.length; e--; ) this.reverts[e]();
                this.reverts = [];
            },
            prepareReplacementString: function (e, t, n) {
                var r = this.options.portionMode;
                return 'first' === r && t.indexInMatch > 0
                    ? ''
                    : ((e = e.replace(/\$(\d+|&|`|')/g, function (e, t) {
                          var r;
                          switch (t) {
                              case '&':
                                  r = n[0];
                                  break;
                              case '`':
                                  r = n.input.substring(0, n.startIndex);
                                  break;
                              case "'":
                                  r = n.input.substring(n.endIndex);
                                  break;
                              default:
                                  r = n[+t] || '';
                          }
                          return r;
                      })),
                      'first' === r
                          ? e
                          : t.isEnd
                          ? e.substring(t.indexInMatch)
                          : e.substring(t.indexInMatch, t.indexInMatch + t.text.length));
            },
            getPortionReplacementNode: function (e, n) {
                var r = this.options.replace || '$&',
                    i = this.options.wrap,
                    o = this.options.wrapClass;
                if (i && i.nodeType) {
                    var d = t.createElement('div');
                    (d.innerHTML = i.outerHTML || new XMLSerializer().serializeToString(i)),
                        (i = d.firstChild);
                }
                if ('function' == typeof r)
                    return (r = r(e, n)) && r.nodeType ? r : t.createTextNode(String(r));
                var a = 'string' == typeof i ? t.createElement(i) : i;
                return (
                    a && o && (a.className = o),
                    (r = t.createTextNode(this.prepareReplacementString(r, e, n))).data && a
                        ? (a.appendChild(r), a)
                        : r
                );
            },
            replaceMatch: function (e, n, r, i) {
                var o,
                    d,
                    a = n.node,
                    s = i.node;
                if (a === s) {
                    var p = a;
                    n.indexInNode > 0 &&
                        ((o = t.createTextNode(p.data.substring(0, n.indexInNode))),
                        p.parentNode.insertBefore(o, p));
                    var h = this.getPortionReplacementNode(i, e);
                    return (
                        p.parentNode.insertBefore(h, p),
                        i.endIndexInNode < p.length &&
                            ((d = t.createTextNode(p.data.substring(i.endIndexInNode))),
                            p.parentNode.insertBefore(d, p)),
                        p.parentNode.removeChild(p),
                        this.reverts.push(function () {
                            o === h.previousSibling && o.parentNode.removeChild(o),
                                d === h.nextSibling && d.parentNode.removeChild(d),
                                h.parentNode.replaceChild(p, h);
                        }),
                        h
                    );
                }
                (o = t.createTextNode(a.data.substring(0, n.indexInNode))),
                    (d = t.createTextNode(s.data.substring(i.endIndexInNode)));
                for (
                    var l = this.getPortionReplacementNode(n, e), c = [], f = 0, u = r.length;
                    f < u;
                    ++f
                ) {
                    var x = r[f],
                        N = this.getPortionReplacementNode(x, e);
                    x.node.parentNode.replaceChild(N, x.node),
                        this.reverts.push(
                            (function (e, t) {
                                return function () {
                                    t.parentNode.replaceChild(e.node, t);
                                };
                            })(x, N)
                        ),
                        c.push(N);
                }
                var g = this.getPortionReplacementNode(i, e);
                return (
                    a.parentNode.insertBefore(o, a),
                    a.parentNode.insertBefore(l, a),
                    a.parentNode.removeChild(a),
                    s.parentNode.insertBefore(g, s),
                    s.parentNode.insertBefore(d, s),
                    s.parentNode.removeChild(s),
                    this.reverts.push(function () {
                        o.parentNode.removeChild(o),
                            l.parentNode.replaceChild(a, l),
                            d.parentNode.removeChild(d),
                            g.parentNode.replaceChild(s, g);
                    }),
                    g
                );
            },
        }),
        r
    );
});

(function (window) {
    var everythingLoaded = setInterval(function () {
        if (/loaded|complete/.test(document.readyState)) {
            clearInterval(everythingLoaded);
            init();
        }
    }, 50);

    function init() {
        var bodyScripts = document.querySelectorAll('body script');
        for (var i = 0; i < bodyScripts.length; i++) {
            bodyScripts[i].remove();
        }

        var pageText = document.body.innerText.split('\n');

        var tssScript = document.getElementById('tss-script');
        var tssScriptSrc = tssScript.getAttribute('src');
        var apiKey = tssScriptSrc.substring(tssScriptSrc.indexOf('=') + 1);

        var data = {
            apiKey: apiKey,
            pageText: pageText,
            pathname: window.location.pathname,
            origin: window.location.origin,
            href: window.location.href,
        };

        var xhrGet = new XMLHttpRequest();
        xhrGet.onreadystatechange = function () {
            // get the data
            // store it in global variable
            // then from the select options do the rest...
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
                    // if we don't have the site strings -> send them
                    setTimeout(() => {
                        var xhr = new XMLHttpRequest();
                        xhr.onload = function () {}; // success case
                        xhr.onerror = function () {}; // failure case

                        xhr.open('POST', 'https://app.translatestack.com/graphqlsave-strings', true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify(data));
                    }, 5000); //fine to get the strings after 5 seconds of loading the page!
                }
            }
        }; // success case

        xhrGet.onerror = function (err) {
            console.log(err);
        }; // failure case

        xhrGet.open(
            'GET',
            `https://app.translatestack.com/graphqlget-strings?apiKey=${apiKey}&href=${window.location.href}`,
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
                var wrapperDiv = document.createElement('div');
                wrapperDiv.className = 'custom-select';

                var populatedLanguages = window.__tsStack.populatedLanguages;
                var customizer = window.__tsStack.customizer;

                if (customizer && customizer.appearance === 'WITH_BRANDING') {
                    populatedLanguages.unshift('⚡ by translatestack');
                }

                populatedLanguages.unshift('Select Language');

                var select = document.createElement('select');

                for (var i = 0; i < populatedLanguages.length; i++) {
                    var val = populatedLanguages[i];

                    var option = document.createElement('option');
                    if (isLanguageOption(i)) {
                        //create image wrapper
                        var imgWrapper = document.createElement('div');
                        imgWrapper.setAttribute('data-value', val.id);
                        imgWrapper.style.setProperty('font-size', '14px');
                        imgWrapper.style.setProperty('color', '#0a2540');
                        imgWrapper.style.setProperty('border', 'unset');
                        imgWrapper.style.setProperty('padding-left', '8px');
                        imgWrapper.style.setProperty('padding-right', '8px');

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
                            imgSpan.textContent = val.language;
                        } else if (customizer.text === 'FLAG_ONLY') {
                            imgSpan.textContent = '';
                        }

                        imgWrapper.appendChild(img);
                        imgWrapper.appendChild(imgSpan);
                        option.value = val.id;
                        option.appendChild(imgWrapper);
                    } else {
                        option.value = 0;
                        option.text = val;
                    }

                    select.appendChild(option);
                }

                wrapperDiv.appendChild(select);

                if (customizer && customizer.position === 'LEFT') {
                    wrapperDiv.style.setProperty('left', '1vw');
                    document.body.appendChild(wrapperDiv);
                } else if (customizer && customizer.position === 'RIGHT') {
                    wrapperDiv.style.setProperty('right', '1vw');
                    document.body.appendChild(wrapperDiv);
                } else if (
                    customizer &&
                    customizer.position === 'CUSTOM' &&
                    (customizer.customDivId !== '' || customizer.customDivId !== 'null')
                ) {
                    var desiredDiv = document.getElementById(customizer.customDivId);
                    if (desiredDiv) {
                        wrapperDiv.style.position = 'relative';
                        desiredDiv.append(wrapperDiv);
                    } else {
                        wrapperDiv.style.setProperty('left', '1vw');
                        document.body.appendChild(wrapperDiv);
                    }
                }

                makeSelectWork();
            }
        }

        function isLanguageOption(i) {
            if (i === 0) return false;
            else {
                var customizer = window.__tsStack.customizer;
                if (customizer && customizer.appearance === 'WITH_BRANDING' && i === 1) {
                    return false;
                }
            }
            return true;
        }

        function addStyle(styleString) {
            var style = document.createElement('style');
            style.textContent = styleString;
            document.head.append(style);
        }

        function makeSelectWork() {
            var x, i, j, l, ll, selElmnt, a, b, c;
            x = document.getElementsByClassName('custom-select');
            l = x.length;
            for (i = 0; i < l; i++) {
                selElmnt = x[i].getElementsByTagName('select')[0];
                ll = selElmnt.length;

                a = document.createElement('DIV');
                a.setAttribute('class', 'select-selected');
                a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
                x[i].appendChild(a);

                b = document.createElement('DIV');
                b.setAttribute('class', 'select-items select-hide');

                for (j = 1; j < ll; j++) {
                    c = document.createElement('DIV');
                    c.innerHTML = selElmnt.options[j].innerHTML;

                    if (c.innerHTML === '⚡ by translatestack') {
                        c.className = 'select-header';

                        c.style.backgroundColor = 'white';
                        c.style.setProperty('font-size', '9px');
                        c.addEventListener('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        });
                    } else {
                        c.addEventListener('click', function (e) {
                            var y, i, k, s, h, sl, yl;
                            s = this.parentNode.parentNode.getElementsByTagName('select')[0];
                            sl = s.length;
                            h = this.parentNode.previousSibling;
                            for (i = 0; i < sl; i++) {
                                if (s.options[i].innerHTML == this.innerHTML) {
                                    s.selectedIndex = i;
                                    h.innerHTML = this.innerHTML;
                                    y = this.parentNode.getElementsByClassName('same-as-selected');
                                    yl = y.length;
                                    for (k = 0; k < yl; k++) {
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
                    }
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
        }

        window.translatedStringsMap = [];

        function applyTranslations(languageId) {
            //get  all translations for this lang
            console.log('languageId', languageId);

            if (window.translatedStringsMap.length !== 0) {
                // we have string, then return them to originals

                for (var i = 0; i < window.translatedStringsMap.length; i++) {
                    var value = window.translatedStringsMap[i];
                    findAndReplaceDOMText(document.body, {
                        find: value.to,
                        replace: value.original,
                    });
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

                                findAndReplaceDOMText(document.body, {
                                    find: translatedString.original,
                                    replace: translation.translatedString,
                                });
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
})(window, undefined);
