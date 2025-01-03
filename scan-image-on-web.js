// ==UserScript==
// @name         Image Link Scraper
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Extracts images and their links from elements with class "images" and allows downloading
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
        const imageContainers = document.getElementsByTagName('body');
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
                        linkUrl: link.href,
                        altText: img.alt || 'No alt text'
                    });
                });
            });
        });

        return { totalImages, results };
    }

    async function downloadImage(url) {
        try {
            // Try to fetch with no-cors first
            const response = await fetch(url, { mode: 'no-cors' });

            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }

            const blob = await response.blob();
            const filename = url.split('/').pop() || 'image.jpg';

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.log('Direct download failed, opening in new tab:', error);
            // Fallback: Open image in new tab
            window.open(url, '_blank');
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('URLs copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy URLs. Please check console for details.');
        });
    }

    function displayResults(data) {
        const container = createResultsDisplay();

        // Create header with count and copy button
        const headerContainer = document.createElement('div');
        headerContainer.style.display = 'flex';
        headerContainer.style.justifyContent = 'space-between';
        headerContainer.style.alignItems = 'center';
        headerContainer.style.marginBottom = '15px';

        const header = document.createElement('h3');
        header.textContent = `Found ${data.totalImages} images`;
        header.style.margin = '0';

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy All URLs';
        copyButton.style.cssText = `
            padding: 5px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        copyButton.onclick = () => {
            const urls = data.results.map(item => item.imageUrl).join('\n');
            copyToClipboard(urls);
        };

        headerContainer.appendChild(header);
        headerContainer.appendChild(copyButton);
        container.appendChild(headerContainer);

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '✕';
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

            const downloadButton = document.createElement('button');
            downloadButton.textContent = '⬇️';
            downloadButton.style.cssText = `
                padding: 2px;
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                margin-left: 10px;
                font-size: 12px;
            `;
            downloadButton.onclick = () => downloadImage(item.imageUrl);

            listItem.innerHTML = `
                <div style="margin-bottom: 5px; display: flex; align-items: center; justify-content: space-between;">
                    <span style="word-break: break-all;">${item.imageUrl}</span>
                </div>
                <hr style="margin: 5px 0;">
            `;

            const buttonContainer = listItem.querySelector('div');
            buttonContainer.appendChild(downloadButton);

            list.appendChild(listItem);
        });

        container.appendChild(list);
        document.body.appendChild(container);
    }

    // Create trigger button
    const button = document.createElement('button');
    button.textContent = 'Scan Image...';
    button.style.cssText = `
        position: fixed;
        font-size: 12px;
        bottom: 12px;
        right: 12px;
        padding: 3px 8px;
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
