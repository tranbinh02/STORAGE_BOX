// ==UserScript==
// @name         TikTok Background Play
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Giữ video TikTok phát trong nền khi chuyển tab
// @author       baopingsheng
// @match        https://www.tiktok.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Override the document's hidden property to always appear visible
    Object.defineProperty(document, 'hidden', {
        get: function() {
            return false;
        }
    });

    // Override the document's visibilityState property to always appear visible
    Object.defineProperty(document, 'visibilityState', {
        get: function() {
            return 'visible';
        }
    });

    // Prevent the browser from firing visibilitychange events
    const originalAddEventListener = document.addEventListener;
    document.addEventListener = function(type, listener, options) {
        if (type === 'visibilitychange') {
            // Skip adding visibility change listeners
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // Console log to verify the script is running
    console.log('TikTok Background Play script is active');

    // Additional fix for video elements to prevent automatic pausing
    const observeVideoElements = () => {
        const observer = new MutationObserver((mutations) => {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                if (!video.hasAttribute('data-background-play-enabled')) {
                    video.setAttribute('data-background-play-enabled', 'true');

                    // Save the original pause method
                    const originalPause = video.pause;
                    video.pause = function() {
                        // Only pause if it's not due to visibility change
                        if (document.visibilityState === 'visible') {
                            originalPause.apply(this);
                        }
                    };
                }
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    };

    // Start observing once the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeVideoElements);
    } else {
        observeVideoElements();
    }
})();
