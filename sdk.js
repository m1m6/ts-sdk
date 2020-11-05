"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}!function(e){"object"==("undefined"==typeof module?"undefined":_typeof(module))&&module.exports?module.exports=e():"function"==typeof define&&define.amd?define(e):(void 0).findAndReplaceDOMText=e()}(function(){var o="retain",m=document,a={}.hasOwnProperty;function d(){return function(e,t,n,r,o){if(t&&!t.nodeType&&arguments.length<=2)return!1;var a,i="function"==typeof n;i&&(a=n,n=function(e,t){return a(e.text,t.startIndex)});var s=l(t,{find:e,wrap:i?null:n,replace:i?n:"$"+(r||"&"),prepMatch:function(e,t){if(!e[0])throw"findAndReplaceDOMText cannot handle zero-length matches";var n;return 0<r&&(n=e[r],e.index+=e[0].indexOf(n),e[0]=n),e.endIndex=e.index+e[0].length,e.startIndex=e.index,e.index=t,e},filterElements:o});return d.revert=function(){return s.revert()},!0}.apply(null,arguments)||l.apply(null,arguments)}function l(e,t){return new n(e,t)}function n(e,t){var n=t.preset&&d.PRESETS[t.preset];if(t.portionMode=t.portionMode||o,n)for(var r in n)a.call(n,r)&&!a.call(t,r)&&(t[r]=n[r]);this.node=e,this.options=t,this.prepMatch=t.prepMatch||this.prepMatch,this.reverts=[],this.matches=this.search(),this.matches.length&&this.processMatches()}return d.NON_PROSE_ELEMENTS={br:1,hr:1,script:1,style:1,img:1,video:1,audio:1,canvas:1,svg:1,map:1,object:1,input:1,textarea:1,select:1,option:1,optgroup:1,button:1},d.NON_CONTIGUOUS_PROSE_ELEMENTS={address:1,article:1,aside:1,blockquote:1,dd:1,div:1,dl:1,fieldset:1,figcaption:1,figure:1,footer:1,form:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,header:1,hgroup:1,hr:1,main:1,nav:1,noscript:1,ol:1,output:1,p:1,pre:1,section:1,ul:1,br:1,li:1,summary:1,dt:1,details:1,rp:1,rt:1,rtc:1,script:1,style:1,img:1,video:1,audio:1,canvas:1,svg:1,map:1,object:1,input:1,textarea:1,select:1,option:1,optgroup:1,button:1,table:1,tbody:1,thead:1,th:1,tr:1,td:1,caption:1,col:1,tfoot:1,colgroup:1},d.NON_INLINE_PROSE=function(e){return a.call(d.NON_CONTIGUOUS_PROSE_ELEMENTS,e.nodeName.toLowerCase())},d.PRESETS={prose:{forceContext:d.NON_INLINE_PROSE,filterElements:function(e){return!a.call(d.NON_PROSE_ELEMENTS,e.nodeName.toLowerCase())}}},(d.Finder=n).prototype={search:function(){var a,i=0,s=0,d=this.options.find,e=this.getAggregateText(),l=[],p=this,d="string"==typeof d?RegExp(String(d).replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1"),"g"):d;return function e(t){for(var n=0,r=t.length;n<r;++n){var o=t[n];if("string"==typeof o){if(d.global)for(;a=d.exec(o);)l.push(p.prepMatch(a,i++,s));else(a=o.match(d))&&l.push(p.prepMatch(a,0,s));s+=o.length}else e(o)}}(e),l},prepMatch:function(e,t,n){if(!e[0])throw new Error("findAndReplaceDOMText cannot handle zero-length matches");return e.endIndex=n+e.index+e[0].length,e.startIndex=n+e.index,e.index=t,e},getAggregateText:function(){var a=this.options.filterElements,i=this.options.forceContext;return function e(t){if(t.nodeType===Node.TEXT_NODE)return[t.data];if(a&&!a(t))return[];var n,r=[""],o=0;if(t=t.firstChild)do{t.nodeType!==Node.TEXT_NODE?(n=e(t),i&&t.nodeType===Node.ELEMENT_NODE&&(!0===i||i(t))?(r[++o]=n,r[++o]=""):("string"==typeof n[0]&&(r[o]+=n.shift()),n.length&&(r[++o]=n,r[++o]=""))):r[o]+=t.data}while(t=t.nextSibling);return r}(this.node)},processMatches:function(){var e,t,n,r=this.matches,o=this.node,a=this.options.filterElements,i=[],s=o,d=r.shift(),l=0,p=0,c=[o];e:for(;;){if(s.nodeType===Node.TEXT_NODE&&(!t&&s.length+l>=d.endIndex?t={node:s,index:p++,text:s.data.substring(d.startIndex-l,d.endIndex-l),indexInMatch:0===l?0:l-d.startIndex,indexInNode:d.startIndex-l,endIndexInNode:d.endIndex-l,isEnd:!0}:e&&i.push({node:s,index:p++,text:s.data,indexInMatch:l-d.startIndex,indexInNode:0}),!e&&s.length+l>d.startIndex&&(e={node:s,index:p++,indexInMatch:0,indexInNode:d.startIndex-l,endIndexInNode:d.endIndex-l,text:s.data.substring(d.startIndex-l,d.endIndex-l)}),l+=s.data.length),n=s.nodeType===Node.ELEMENT_NODE&&a&&!a(s),e&&t){if(s=this.replaceMatch(d,e,i,t),l-=t.node.data.length-t.endIndexInNode,t=e=null,i=[],p=0,!(d=r.shift()))break}else if(!n&&(s.firstChild||s.nextSibling)){s=s.firstChild?(c.push(s),s.firstChild):s.nextSibling;continue}for(;;){if(s.nextSibling){s=s.nextSibling;break}if((s=c.pop())===o)break e}}},revert:function(){for(var e=this.reverts.length;e--;)this.reverts[e]();this.reverts=[]},prepareReplacementString:function(e,t,r){var n=this.options.portionMode;return"first"===n&&0<t.indexInMatch?"":(e=e.replace(/\$(\d+|&|`|')/g,function(e,t){var n;switch(t){case"&":n=r[0];break;case"`":n=r.input.substring(0,r.startIndex);break;case"'":n=r.input.substring(r.endIndex);break;default:n=r[+t]||""}return n}),"first"===n?e:t.isEnd?e.substring(t.indexInMatch):e.substring(t.indexInMatch,t.indexInMatch+t.text.length))},getPortionReplacementNode:function(e,t){var n,r=this.options.replace||"$&",o=this.options.wrap,a=this.options.wrapClass;if(o&&o.nodeType&&((n=m.createElement("div")).innerHTML=o.outerHTML||(new XMLSerializer).serializeToString(o),o=n.firstChild),"function"==typeof r)return(r=r(e,t))&&r.nodeType?r:m.createTextNode(String(r));var i="string"==typeof o?m.createElement(o):o;return i&&a&&(i.className=a),(r=m.createTextNode(this.prepareReplacementString(r,e,t))).data&&i?(i.appendChild(r),i):r},replaceMatch:function(e,t,n,r){var o,a,i=t.node,s=r.node;if(i===s){var d=i;0<t.indexInNode&&(o=m.createTextNode(d.data.substring(0,t.indexInNode)),d.parentNode.insertBefore(o,d));var l=this.getPortionReplacementNode(r,e);return d.parentNode.insertBefore(l,d),r.endIndexInNode<d.length&&(a=m.createTextNode(d.data.substring(r.endIndexInNode)),d.parentNode.insertBefore(a,d)),d.parentNode.removeChild(d),this.reverts.push(function(){o===l.previousSibling&&o.parentNode.removeChild(o),a===l.nextSibling&&a.parentNode.removeChild(a),l.parentNode.replaceChild(d,l)}),l}o=m.createTextNode(i.data.substring(0,t.indexInNode)),a=m.createTextNode(s.data.substring(r.endIndexInNode));for(var p=this.getPortionReplacementNode(t,e),c=[],u=0,h=n.length;u<h;++u){var f=n[u],g=this.getPortionReplacementNode(f,e);f.node.parentNode.replaceChild(g,f.node),this.reverts.push(function(e,t){return function(){t.parentNode.replaceChild(e.node,t)}}(f,g)),c.push(g)}var x=this.getPortionReplacementNode(r,e);return i.parentNode.insertBefore(o,i),i.parentNode.insertBefore(p,i),i.parentNode.removeChild(i),s.parentNode.insertBefore(x,s),s.parentNode.insertBefore(a,s),s.parentNode.removeChild(s),this.reverts.push(function(){o.parentNode.removeChild(o),p.parentNode.replaceChild(i,p),a.parentNode.removeChild(a),x.parentNode.replaceChild(s,x)}),x}},d}),function(u){var e=setInterval(function(){/loaded|complete/.test(document.readyState)&&(clearInterval(e),function(){for(var e=document.querySelectorAll("body script"),t=0;t<e.length;t++)e[t].remove();var n=document.body.innerText.split("\n"),r=document.getElementById("tss-script").getAttribute("src"),o=r.substring(r.indexOf("=")+1),a={apiKey:o,pageText:n,pathname:u.location.pathname,origin:u.location.origin,href:u.location.href},i=new XMLHttpRequest;function s(){if(u.__tsStack){var e=document.createElement("div");e.className="custom-select";var t=u.__tsStack.populatedLanguages,n=u.__tsStack.customizer;n&&"WITH_BRANDING"===n.appearance&&t.unshift("⚡ by translatestack"),t.unshift("Select Language");for(var r,o=document.createElement("select"),a=0;a<t.length;a++){var i,s,d,l=t[a],p=document.createElement("option");!function(e){{if(0===e)return!1;var t=u.__tsStack.customizer;if(t&&"WITH_BRANDING"===t.appearance&&1===e)return!1}return!0}(a)?(p.value=0,p.text=l):((i=document.createElement("div")).setAttribute("data-value",l.id),i.style.setProperty("font-size","14px"),i.style.setProperty("color","#0a2540"),i.style.setProperty("border","unset"),i.style.setProperty("padding-left","8px"),i.style.setProperty("padding-right","8px"),(s=document.createElement("img")).src=l.flag,s.style.setProperty("width","23px"),s.style.setProperty("height","23px"),s.style.setProperty("border-radius","50px"),(d=document.createElement("span")).style.setProperty("margin-left","10px"),"SHORTENED"===n.text?d.textContent=l.iso2.toUpperCase():"FULL"===n.text?d.textContent=l.language:"FLAG_ONLY"===n.text&&(d.textContent=""),i.appendChild(s),i.appendChild(d),p.value=l.id,p.appendChild(i)),o.appendChild(p)}e.appendChild(o),n&&"LEFT"===n.position?(e.style.setProperty("left","1vw"),document.body.appendChild(e)):n&&"RIGHT"===n.position?(e.style.setProperty("right","1vw"),document.body.appendChild(e)):!n||"CUSTOM"!==n.position||""===n.customDivId&&"null"===n.customDivId||((r=document.getElementById(n.customDivId))?(e.style.position="relative",r.append(e)):(e.style.setProperty("left","1vw"),document.body.appendChild(e))),function(){var e,t,n,r,o,a,i,s,d;for(e=document.getElementsByClassName("custom-select"),r=e.length,t=0;t<r;t++){for(a=e[t].getElementsByTagName("select")[0],o=a.length,(i=document.createElement("DIV")).setAttribute("class","select-selected"),i.innerHTML=a.options[a.selectedIndex].innerHTML,e[t].appendChild(i),(s=document.createElement("DIV")).setAttribute("class","select-items select-hide"),n=1;n<o;n++)(d=document.createElement("DIV")).innerHTML=a.options[n].innerHTML,"⚡ by translatestack"===d.innerHTML?(d.className="select-header",d.style.backgroundColor="white",d.style.setProperty("font-size","9px"),d.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation()})):d.addEventListener("click",function(e){for(var t,n,r,o=this.parentNode.parentNode.getElementsByTagName("select")[0],a=o.length,i=this.parentNode.previousSibling,s=0;s<a;s++)if(o.options[s].innerHTML==this.innerHTML){for(o.selectedIndex=s,i.innerHTML=this.innerHTML,r=(t=this.parentNode.getElementsByClassName("same-as-selected")).length,n=0;n<r;n++)t[n].removeAttribute("class");this.setAttribute("class","same-as-selected");break}i.click();try{!function(n){if(console.log("languageId",n),0!==u.translatedStringsMap.length){for(var e=0;e<u.translatedStringsMap.length;e++){var t=u.translatedStringsMap[e];findAndReplaceDOMText(document.body,{find:t.to,replace:t.original})}u.translatedStringsMap=[]}{u.__tsStack&&u.__tsStack.pageStrings.forEach(function(t){t.translations&&t.translations.length&&t.translations.forEach(function(e){e.languageId===parseInt(n)&&(u.translatedStringsMap.push({original:t.original,to:e.translatedString}),findAndReplaceDOMText(document.body,{find:t.original,replace:e.translatedString}))})})}}(this.children[0].getAttribute("data-value"))}catch(e){console.log("unable to apply translations",e)}}),s.appendChild(d);e[t].appendChild(s),i.addEventListener("click",function(e){e.stopPropagation(),c(this),this.nextSibling.classList.toggle("select-hide"),this.classList.toggle("select-arrow-active")})}}()}}function c(e){for(var t=[],n=document.getElementsByClassName("select-items"),r=document.getElementsByClassName("select-selected"),o=n.length,a=r.length,i=0;i<a;i++)e==r[i]?t.push(i):r[i].classList.remove("select-arrow-active");for(i=0;i<o;i++)t.indexOf(i)&&n[i].classList.add("select-hide")}i.onreadystatechange=function(){if(i.readyState==XMLHttpRequest.DONE){var e,t=i.responseText;try{e=JSON.parse(t),u.__tsStack=e}catch(e){console.log(e)}e&&e.pageStrings&&e.pageStrings.length?s():setTimeout(function(){var e=new XMLHttpRequest;e.onload=function(){},e.onerror=function(){},e.open("POST","https://app.translatestack.com/graphql/save-strings",!0),e.setRequestHeader("Content-Type","application/json"),e.send(JSON.stringify(a))},5e3)}},i.onerror=function(e){console.log(e)},i.open("GET","https://app.translatestack.com/graphql/get-strings?apiKey=".concat(o,"&href=").concat(u.location.href),!0),i.setRequestHeader("Content-Type","application/json"),i.send(),function(e){var t=document.createElement("style");t.textContent=e,document.head.append(t)}('\n    .custom-select {\n        font-family: Arial;\n        z-index: 1;\n        position: fixed;\n        bottom: 0px;\n        // left: 500px;\n        width: 149px;\n        color: #0a2540;\n        border-radius: 4px;\n        box-shadow: 0 2px 20px -5px #e8eaef;\n        border: solid 1px #e8eaef;\n      }\n      \n      .custom-select select {\n        display: none;\n      }\n      \n      .select-selected {\n        background-color: white;\n        border-radius: 4px;\n        box-shadow: 0 2px 20px -5px #e8eaef;\n        border: solid 1px #e8eaef;\n        color: #0a2540;\n        padding: 8px 16px;\n      }\n      \n      .select-selected:after {\n        position: absolute;\n        content: "";\n        top: 18px;\n        right: 10px;\n        width: 0;\n        height: 0;\n        border: 6px solid #ccc;\n        border-color: #ccc transparent transparent transparent;\n      }\n      \n      .select-selected.select-arrow-active:after {\n        border-color: transparent transparent #ccc transparent;\n        top: 10px;\n      }\n      \n      .select-items div,.select-selected {\n        color: #0a2540;\n        padding: 8px 16px;\n        border: 1px solid transparent;\n        border-color: transparent transparent rgba(0, 0, 0, 0.1) transparent;\n        cursor: pointer;\n        user-select: none;\n        font-size: 14px;\n      }\n      \n      .select-items {\n        position: absolute;\n        background-color: white;\n        left: 0;\n        right: 0;\n        z-index: 99;\n        bottom: 40px;\n        box-shadow: 0 2px 20px -5px #e8eaef;\n        border: solid 1px #e8eaef;\n        border-top-left-radius: 4px;\n        border-top-right-radius: 4px;\n      }\n      \n      .select-hide {\n        display: none;\n      }\n      \n      .select-items div:hover, .same-as-selected {\n        background-color: #f9f9fb;\n      }\n      \n      .select-header {\n          color: #0a2540 !important;\n          padding: 20px !important;\n          background-color: white;\n          font-size: 9px;\n          padding-top: 10px !important;\n          padding-bottom: 6px !important;\n          border-bottom: unset !important;\n      }\n\n      .select-header:hover {\n        background-color: white !important;\n        opacity: 1 !important;\n      }'),u.translatedStringsMap=[],u.document.addEventListener("click",c)}())},50)}(window);