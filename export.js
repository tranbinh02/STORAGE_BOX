// ==UserScript==
// @name         Export Image URLs (2024)
// @version      0.0.2
// @description  Extracts image URLs from a web page and copies them to the clipboard when a button is clicked.
// @author       tranbinh, Origin: sharmanhall
// @supportURL   *
// @namespace    *
// @license      MIT
// @connect      greasyfork.org
// @connect      sleazyfork.org
// @connect      github.com
// @connect      openuserjs.org
// @match        *://*/*
// @exclude      *://*.youtube.com/*
// @exclude      *://*.blogger.com/*
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

    const SECONDS_TO_WAIT_FOR_SCROLL = 1; // adjust as needed

    // function to get all image link elements
    function getImageLinks() {
        const imageLinks = document.querySelectorAll('img[src]');
        return Array.from(imageLinks).map(img => img.getAttribute('src'));
    }

    // function to scroll to the bottom of the page and wait for new images to load
    async function waitForImagesToLoad() {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, SECONDS_TO_WAIT_FOR_SCROLL * 1000));
    }

    // create an array to hold the image URLs
    let imageUrls = [];

    // add a button to the page that will copy the image URLs to the clipboard when clicked
    const copyButton = document.createElement('button');
    copyButton.classList.add('copy-urls-button');
    copyButton.textContent = 'Copy all URLs';
    copyButton.style.position = 'fixed';
    copyButton.style.background = '#efefef';
    copyButton.style.color = 'black';
    copyButton.style.padding = '3px 7px';
    copyButton.style.bottom = '20px';
    copyButton.style.right = '20px';
    copyButton.style.zIndex = '1000';
    copyButton.style.cursor = 'pointer';
    copyButton.style.border = '1px solid #767676';
    copyButton.style.borderRadius = '3px';
    copyButton.style.boxShadow = 'none';
    copyButton.style.font = '12px sans-serif';
    copyButton.style.userSelect = 'none';
    document.body.appendChild(copyButton);

    // add a click event listener to the button
    copyButton.addEventListener('click', async function() {
        let finished = false;
        let numUrls = 0;
        while (!finished) {
            // scroll to the bottom of the page and wait for new images to load
            await waitForImagesToLoad();

            // get the newly loaded image URLs
            const newImageUrls = getImageLinks().filter(url => !imageUrls.includes(url));
            imageUrls.push(...newImageUrls);

            // check if all images have been loaded
            finished = newImageUrls.length === 0;

            numUrls += newImageUrls.length;
        }

        // join the image URLs into a string separated by newlines
        const imageUrlString = imageUrls.join('\n');

        // copy the image URL string to the clipboard
        GM_setClipboard(imageUrlString, 'text');

        // disable the button and change the text to indicate that the URLs have been copied
        copyButton.disabled = true;
        copyButton.textContent = `${numUrls} URL(s) copied to clipboard`;

        // enable the button again after 3 seconds
        setTimeout(function() {
            imageUrls = [];
            copyButton.disabled = false;
            copyButton.textContent = 'Copy all URLs';
        }, 3000);
    });
})();
