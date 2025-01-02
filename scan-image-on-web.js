// ==UserScript==
// @name         Image Link Scraper
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Extracts images and their links from elements with class "images"
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function createResultsDisplay() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        return container;
    }

    function getImageInfo() {
        const imageContainers = document.getElementsByClassName('images');
        const results = [];
        let totalImages = 0;

        Array.from(imageContainers).forEach(container => {
            const links = container.getElementsByTagName('a');

            Array.from(links).forEach(link => {
                const images = link.getElementsByTagName('img');
                Array.from(images).forEach(img => {
                    totalImages++;
                    results.push({
                        imageUrl: img.src,
                        linkUrl: link.href
                    });
                });
            });
        });

        return { totalImages, results };
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('All URLs copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy URLs. Please check console for details.');
        });
    }

    function displayResults(data) {
        const container = createResultsDisplay();

        // Create header with count
        const header = document.createElement('h3');
        header.textContent = `Found ${data.totalImages} images`;
        header.style.marginTop = '0';
        container.appendChild(header);

        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy All URLs';
        copyButton.style.cssText = `
            padding: 5px 10px;
            margin: 10px 0;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        copyButton.onclick = () => {
            const allUrls = data.results.map(item => item.linkUrl).join('\n');
            copyToClipboard(allUrls);
        };
        container.appendChild(copyButton);

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
            background: none;
            border: none;
            font-weight: bold;
        `;
        closeButton.onclick = () => container.remove();
        container.appendChild(closeButton);

        // Create list of images
        const list = document.createElement('ul');
        list.style.cssText = `
            list-style: none;
            padding: 0;
            margin: 0;
        `;

        data.results.forEach(item => {
            const listItem = document.createElement('li');
            listItem.style.marginBottom = '10px';
            listItem.innerHTML = `
                <div style="margin-bottom: 5px;">
                    <a href="${item.linkUrl}" target="_blank">${item.linkUrl}</a>
                </div>
                <hr style="margin: 5px 0;">
            `;
            list.appendChild(listItem);
        });

        container.appendChild(list);
        document.body.appendChild(container);
    }

    // Create trigger button
    const button = document.createElement('button');
    button.textContent = 'Scan Images';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 9999;
    `;
    button.onclick = () => {
        const data = getImageInfo();
        displayResults(data);
    };

    document.body.appendChild(button);
})();
