// ==UserScript==
// @name         Get image speed
// @version      0.2
// @description  Get image speed
// @author       baopingsheng
// @supportURL   *
// @namespace    *
// @license      MIT
// @connect      greasyfork.org
// @connect      sleazyfork.org
// @connect      github.com
// @connect      openuserjs.org
// @match        *://*/*
// @exclude      *://*.youtube.com/*
// @exclude      *://docs.google.com/
// @grant        GM_setClipboard
// @grant        GM_log
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @compatible   safari
// @run-at       document-idle
// @icon         *
// ==/UserScript==

(function() {
    'use strict';

    function handleContextMenu(e) {
        let imageUrl = null;
        let target = e.target;
        while (target && !imageUrl) {
            if (target.tagName && target.tagName.toLowerCase() === 'img') {
                imageUrl = target.src;
            } else {
                const computedStyle = window.getComputedStyle(target);
                const backgroundImage = computedStyle.getPropertyValue('background-image');
                if (backgroundImage !== 'none') {
                    imageUrl = backgroundImage.slice(4, -1).replace(/['"]/g, "");
                }
            }
            target = target.parentElement;
        }
        if (imageUrl) {
            e.preventDefault();
            window.open(imageUrl, '_blank');
        }
    }

    if (document.addEventListener) {
        document.addEventListener('contextmenu', handleContextMenu, false);
    } else if (document.attachEvent) {
        document.attachEvent('oncontextmenu', handleContextMenu);
    }
})();
