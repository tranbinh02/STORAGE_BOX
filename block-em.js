// ==UserScript==
// @name         Remove ADS Elements
// @version      0.2
// @description  Removes specific elements from the page
// @author       baopingsheng, origin: sharmanhall
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
        '.maintable.wp',
        '.thread-side',
        '#headerpcads',
        '#catfishs_content',
        '#annoying-ad',
        '#pm_quangcao',
        '#chilladv',
        '.gnarty-offads',
    ];

    const observer = new MutationObserver((mutations) => {
        const elementsFound = new Set();

        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    for (const selector of elementsToRemove) {
                        if (node.matches(selector) || node.querySelector(selector)) {
                            elementsFound.add(selector);
                            break;
                        }
                    }
                }
            }
        }

        if (elementsFound.size > 0) {
            removeElements(Array.from(elementsFound));
        }
    });

    function removeElements(selectors) {
        const fragment = document.createDocumentFragment();
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => fragment.appendChild(element));
        }
        fragment.textContent = '';
    }

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial removal
    removeElements(elementsToRemove);
})();
