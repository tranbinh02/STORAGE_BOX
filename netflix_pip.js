// ==UserScript==
// @name         Netflix Picture-in-Picture Button (Robust)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds a reliable Picture-in-Picture button to Netflix video player
// @author       YourName
// @match        https://www.netflix.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to the page
    function addStyles() {
        const css = `
               .custom-pip-button {
                position: fixed;
                background: transparent;
                border: 0;
                z-index:10;
                bottom: 0;
                right: 0;
                margin: 33px 398px;
                cursor: pointer;
                display: flex;
                align-items: center;
                height: auto!important;
            }
               .custom-pip-button .pip-icon svg {
                width: 46px;
                height: 46px;
                display: inline-block;
                transition: transform 0.1s ease-in-out;
            }
               .custom-pip-button:hover .pip-icon svg {
                transform: scale(1.15);
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Create PiP button element
    function createPipButton() {
        const button = document.createElement('button');
        button.className = 'custom-pip-button';
        button.title = 'Toggle Picture-in-Picture';

        // Create icon div
        const iconDiv = document.createElement('div');
        iconDiv.className = 'pip-icon';

        // Use a simple CSS square for the icon instead of SVG
        iconDiv.innerHTML = `
<svg fill='none' height='800px' viewBox='0 0 24 24' width='800px' xmlns='http://www.w3.org/2000/svg'>
<path d='M11 21H10C6.22876 21 4.34315 21 3.17157 19.8284C2 18.6569 2 16.7712 2 13V11C2 7.22876 2 5.34315 3.17157 4.17157C4.34315 3 6.22876 3 10 3H14C17.7712 3 19.6569 3 20.8284 4.17157C22 5.34315 22 7.22876 22 11' stroke='#fff' stroke-linecap='round' stroke-width='1.8'/>
<path d='M13 17C13 15.1144 13 14.1716 13.5858 13.5858C14.1716 13 15.1144 13 17 13H18C19.8856 13 20.8284 13 21.4142 13.5858C22 14.1716 22 15.1144 22 17C22 18.8856 22 19.8284 21.4142 20.4142C20.8284 21 19.8856 21 18 21H17C15.1144 21 14.1716 21 13.5858 20.4142C13 19.8284 13 18.8856 13 17Z' stroke='#fff' stroke-width='1.8'/>
</svg>
        `;

        // Create text node
        const textNode = document.createTextNode('');

        // Append icon and text to button
        button.appendChild(iconDiv);
        button.appendChild(textNode);

        return button;
    }

    // Toggle Picture-in-Picture mode
    async function togglePiP() {
        const video = document.querySelector('video');
        if (!video) return;

        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await video.requestPictureInPicture();
            }
        } catch (error) {
            console.error('PiP error:', error);
        }
    }

    // Main function to add the button
    function addPipButton() {
        // Exit if already added
        if (document.querySelector('.custom-pip-button')) return;

        // Find the Netflix control bar
        const controlBar = document.querySelector('.PlayerControlsNeo__button-control-row, .watch-video--back-container');
        if (!controlBar) return;

        // Create button and add event listener
        const pipButton = createPipButton();
        pipButton.addEventListener('click', togglePiP);

        // Insert at appropriate position
        if (controlBar.classList.contains('PlayerControlsNeo__button-control-row')) {
            // For regular player
            const firstButton = controlBar.querySelector('button');
            if (firstButton) {
                controlBar.insertBefore(pipButton, firstButton);
            } else {
                controlBar.appendChild(pipButton);
            }
        } else {
            // For back container (when controls are showing)
            controlBar.appendChild(pipButton);
        }
    }

    // Initialize with retry mechanism
    function initialize() {
        // Add styles immediately
        addStyles();

        // Try to add button immediately
        addPipButton();

        // Set up periodic checks
        const checkInterval = setInterval(() => {
            const video = document.querySelector('video');
            const controlBar = document.querySelector('.PlayerControlsNeo__button-control-row, .watch-video--back-container');

            if (video && controlBar) {
                addPipButton();
            }
        }, 1000);

        // Clean up interval after 30 seconds
        setTimeout(() => clearInterval(checkInterval), 30000);

        // Set up mutation observer for dynamic changes
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    addPipButton();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Check browser support before initializing
    if ('pictureInPictureEnabled' in document) {
        // Run on load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    } else {
        console.warn('Picture-in-Picture is not supported in this browser');
    }
})();
