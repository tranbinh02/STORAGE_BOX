// ==UserScript==
// @name         Sparkle Fashion
// @version      0.2
// @description  Thay đổi style trang web, gỡ bỏ phần không cần thiết.
// @author       tranbinh02
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
    const customCSS = `
        .pcb td,#basicExample{width:100%;float:left;display:grid;grid-template-columns:repeat(5,1fr);grid-gap:12px 12px;margin:20px 0;padding:0}
        .pcb img,#basicExample img{float:left;width:-webkit-fill-available;height:-webkit-fill-available;max-height:180px;object-fit:cover;border-radius:12px;margin:0;padding:0;position:relative;cursor:pointer;break-inside:avoid;transition:all .6s ease;opacity:1}
        .pcb br,.pcb hr,#basicExample br,#basicExample hr{display:none!important}
        #basicExample img{max-height:220px!important}
        .ct2 .mn,.post-list .post.first{width:100%!important}
        .first .post-bd{width:-webkit-fill-available!important}
    `;
    const style = document.createElement('style');
    style.textContent = customCSS;
    (document.head || document.documentElement).appendChild(style);

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
