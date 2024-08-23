// ==UserScript==
// @name         Instant CSS Embed
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Instantly embed custom CSS for site styling
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const customCSS = `
        .pcb{z-index:1;width:100%;margin:0 auto;overflow:hidden;box-sizing:border-box;padding-top:10px;max-width:1300px;transition:opacity 0.3s ease-in-out}
        .pcb td{width:100%;float:left;display:grid;grid-template-columns:repeat(5,1fr);grid-gap:10px 10px;margin:20px 0;padding:0}
        .pcb img{float:left;width:-webkit-fill-available;height:-webkit-fill-available;max-height:200px;object-fit:cover;border-radius:10px;margin:0;padding:0;position:relative;cursor:pointer;break-inside:avoid;transition:all .6s ease;opacity:1}
        .pcb br,.pcb hr{display:none!important}
        .ct2 .mn,.post-list .post.first{width:100%!important}
        .first .post-bd{width:-webkit-fill-available!important}
    `;

    const style = document.createElement('style');
    style.textContent = customCSS;
    (document.head || document.documentElement).appendChild(style);
})();
