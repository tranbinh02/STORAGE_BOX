// ==UserScript==
// @name         Remove ADS Elements
// @version      0.2
// @description  Removes specific elements from the page
// @author       tranbinh02, origin: sharmanhall
// @supportURL   *
// @namespace    *
// @license      MIT
// @connect      greasyfork.org
// @connect      sleazyfork.org
// @connect      github.com
// @connect      openuserjs.org
// @match        *://*/*
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
    const elementsToRemove = [
        '.ad-container',
        '.watch-banner-2',
        '#catfish_content',
        '.ads',
        '#ads',
        '.promotion-popup-content',
        '.promotion-popup',
        '.ad-floater',
        '.no-ads',
        '.popUpBannerBox',
        '#catfish',
        '',
        '',
        '',
        '',
        '',
        '',
    ];
    function removeElements() {
        elementsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
            });
        });
    }
    removeElements();
})();
