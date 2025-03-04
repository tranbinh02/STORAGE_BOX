// ==UserScript==
// @name         Facebook Content Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Chặn post Facebook có chứa các từ cụ thể
// @author       baopingsheng
// @match        https://www.facebook.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==


(function() {
    'use strict';

    // Configuration
    const BLOCKED_WORDS = ['negav','chê','review','nêu bật','anti','friendlyrivalry','friendly rivalry']; // Word to block (lowercase for case-insensitive matching)
    let isObserving = false;
    let observer = null;

    // Add custom CSS to hide blocked content
    function addCustomStyles() {
        const style = document.createElement('style');
        style.id = 'facebook-content-blocker-styles';
        style.textContent = `
            .fb-post-blocked {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Main function to check and block content
    function checkAndBlockContent() {
        // Select all potential post containers in the newsfeed
        // Facebook's structure might change, so we're targeting multiple common containers
        const postElements = document.querySelectorAll('[role="feed"] > div, [data-pagelet="FeedUnit"], div[data-testid="fbfeed_story"]');

        postElements.forEach(post => {
            // Skip already processed posts
            if (post.dataset.contentChecked === 'true') {
                return;
            }

            // Get the text content of the post
            const postText = post.textContent.toLowerCase();

            // Check if any blocked word is in the post
            const containsBlockedWord = BLOCKED_WORDS.some(word => postText.includes(word));

            if (containsBlockedWord) {
                // Add a class to hide the post
                post.classList.add('fb-post-blocked');

                // Mark as blocked for debugging
                post.dataset.blockedReason = 'Contained blocked word: ' + BLOCKED_WORDS.find(word => postText.includes(word));
            }

            // Mark as processed to avoid repeated checks
            post.dataset.contentChecked = 'true';
        });
    }

    // Create and set up MutationObserver to detect new posts
    function setupMutationObserver() {
        if (isObserving) {
            return; // Observer already running
        }

        // Target the main feed container
        const feedContainer = document.querySelector('[role="feed"], [data-pagelet="FeedUnit"]');

        if (!feedContainer) {
            // If feed container not found, retry after a delay
            setTimeout(setupMutationObserver, 1000);
            return;
        }

        // Create observer configuration
        const config = {
            childList: true,
            subtree: true,
            characterData: true
        };

        // Create observer instance
        observer = new MutationObserver((mutations) => {
            let shouldCheck = false;

            for (let mutation of mutations) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    shouldCheck = true;
                    break;
                }
            }

            if (shouldCheck) {
                // Delay slightly to allow Facebook to finish rendering
                setTimeout(checkAndBlockContent, 100);
            }
        });

        // Start observing
        observer.observe(feedContainer, config);
        isObserving = true;

        // Do an initial check
        checkAndBlockContent();
    }

    // Handle scrolling to check for dynamically loaded content
    function handleScroll() {
        // Debounce scroll event to improve performance
        clearTimeout(window._scrollTimeout);
        window._scrollTimeout = setTimeout(() => {
            checkAndBlockContent();
        }, 200);
    }

    // Detect URL changes for SPA navigation
    function setupURLChangeDetection() {
        let lastUrl = location.href;

        // Create observer for URL changes
        const urlObserver = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;

                // Reset observer when URL changes
                if (observer) {
                    observer.disconnect();
                    isObserving = false;
                }

                // Wait for new page to load
                setTimeout(() => {
                    setupMutationObserver();
                }, 1000);
            }
        });

        // Start observing
        urlObserver.observe(document, {subtree: true, childList: true});

        // Also intercept history API for more reliable detection
        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(this, arguments);

            // Reset observer when navigation happens
            if (observer) {
                observer.disconnect();
                isObserving = false;
            }

            // Wait for new page to load
            setTimeout(() => {
                setupMutationObserver();
            }, 1000);
        };

        // Handle back/forward navigation
        window.addEventListener('popstate', () => {
            // Reset observer
            if (observer) {
                observer.disconnect();
                isObserving = false;
            }

            // Wait for new page to load
            setTimeout(() => {
                setupMutationObserver();
            }, 1000);
        });
    }

    // Initialize everything
    function initialize() {
        // Add custom styles
        addCustomStyles();

        // Set up observers
        setupMutationObserver();
        setupURLChangeDetection();

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll, {passive: true});

        // Initial content check
        checkAndBlockContent();

        // Log initialization
        console.log('Facebook content blocker initialized. Blocking posts containing:', BLOCKED_WORDS);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
