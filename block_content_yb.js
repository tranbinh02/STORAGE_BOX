// ==UserScript==
// @name         YouTube Content Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks YouTube videos containing specific words in the title
// @author       baopingsheng
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // CSS custom
    function addCustomStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = `
            ytd-rich-section-renderer.ytd-rich-grid-renderer,
            ytd-guide-section-renderer.style-scope ytd-guide-entry-renderer:nth-child(2) {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addCustomStyles);
    } else {
        addCustomStyles();
    }

    // List of blocked words (all lowercase for case-insensitive matching)
    const BLOCKED_WORDS = ['ma', 'quỷ', 'kinh dị', 'ám ảnh', 'yêu quái', 'quái vật', 'siêu nhiên', 'bóng tối', 'lời thuật', 'ác quỷ', 'tử thần', 'địa vô', 'huyền bí', 'rùng', 'thây ma', 'xác sống', 'hắc trầm', 'nghi lễ', 'bùa chú', 'oan linh hồn', 'hoang đường', 'huyễn hoặc'];

    // Track if we're currently in a blocked state
    let isCurrentlyBlocked = false;

    // Function to check for shorts in URL and redirect
    function checkAndRedirectShorts() {
        const currentUrl = window.location.href.toLowerCase();
        if (currentUrl.includes('/shorts') || currentUrl.includes('/short')) {
            // Redirect to homepage
            window.location.href = 'https://www.youtube.com/';
        }
    }

    // Execute as early as possible and continue checking
    function initialize() {
        // Check for shorts URL immediately
        checkAndRedirectShorts();

        // Immediately check URL for potential blocked content
        if (window.location.pathname.includes('/watch')) {
            const videoId = new URLSearchParams(window.location.search).get('v');
            if (videoId) {
                // Preemptively block if we're loading a video page
                // Will be restored later if title doesn't contain blocked words
                preemptivelyBlock();

                // Set up checks for when the title becomes available
                watchForTitle();
            }
        }

        // Set up URL change detection for SPA navigation
        setupURLChangeDetection();

        // Wait for DOM to be ready for full checks
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDOMReady);
        } else {
            onDOMReady();
        }
    }

    // Function to preemptively block content before we even know the title
    function preemptivelyBlock() {
        // Add a style tag to hide video and prevent playback
        const style = document.createElement('style');
        style.id = 'preemptive-block-style';
        style.textContent = `
            video, #movie_player {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        // We'll also need to continually intercept any video/audio that might start
        startAudioVideoBlockingInterval();
    }

    // Intercept any attempt to play audio/video
    function startAudioVideoBlockingInterval() {
        if (window._blockingInterval) {
            clearInterval(window._blockingInterval);
        }

        window._blockingInterval = setInterval(() => {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                if (!video.paused) {
                    video.pause();
                }
                if (!video.muted) {
                    video.muted = true;
                }
                video.volume = 0;

                // Add event listeners to prevent playing
                if (!video.dataset.blockListenersAdded) {
                    video.dataset.blockListenersAdded = 'true';
                    video.addEventListener('play', function(e) {
                        if (isCurrentlyBlocked) {
                            e.preventDefault();
                            e.stopPropagation();
                            this.pause();
                        }
                    }, true);

                    // Intercept play attempts
                    const originalPlay = video.play;
                    video.play = function() {
                        if (isCurrentlyBlocked) {
                            return Promise.reject(new DOMException('NotAllowedError'));
                        }
                        return originalPlay.apply(this, arguments);
                    };
                }
            });

            // Try to access YouTube player API if available
            const player = document.querySelector('#movie_player');
            if (player && typeof player.pauseVideo === 'function') {
                player.pauseVideo();
                player.mute();
                player.setVolume(0);
            }
        }, 100); // Check very frequently during page load
    }

    // Wait for title element to become available
    function watchForTitle() {
        if (window._titleCheckInterval) {
            clearInterval(window._titleCheckInterval);
        }

        window._titleCheckInterval = setInterval(() => {
            const titleElement = document.querySelector('h1.ytd-watch-metadata,.ytd-channel-name yt-formatted-string a');
            if (titleElement && titleElement.textContent.trim()) {
                clearInterval(window._titleCheckInterval);
                checkAndBlockContent();
            }
        }, 50); // Check very frequently until title is available
    }

    // When DOM is fully loaded
    function onDOMReady() {
        // Do a full check immediately
        checkAndBlockContent();

        // Set up observation for DOM changes
        observePageChanges();
    }

    // Main function to check and block content
    function checkAndBlockContent() {
        // Get the video title element
        const titleElement = document.querySelector('h1.ytd-watch-metadata,.ytd-channel-name yt-formatted-string a');

        // If we're on a video page and title exists
        if (window.location.pathname.includes('/watch') && titleElement && titleElement.textContent.trim()) {
            const title = titleElement.textContent.toLowerCase();

            // Check if any blocked word is in the title
            const containsBlockedWord = BLOCKED_WORDS.some(word => title.includes(word));

            if (containsBlockedWord) {
                blockContent();
            } else {
                unblockContent();
            }
        } else if (!window.location.pathname.includes('/watch')) {
            // Not on a video page, make sure nothing is blocked
            unblockContent();
        }
    }

// Function to block content
function blockContent() {
    isCurrentlyBlocked = true;

    // Get the video player
    const videoPlayer = document.querySelector('#player');
    if (videoPlayer) {
        // Save the original player for later restoration
        if (!videoPlayer.dataset.blocked) {
            // Mark as blocked and save original display style
            videoPlayer.dataset.blocked = 'true';
            videoPlayer.dataset.originalDisplay = videoPlayer.style.display || '';

            // Stop the video and audio playback
            stopVideoAndAudio();

            // Hide the player
            videoPlayer.style.display = 'none';

            // Remove any existing message first to prevent duplicates
            removeBlockedMessage();

            // Create and display the message
            const blockedMessage = document.createElement('div');
            blockedMessage.id = 'content-blocked-message';
            blockedMessage.style.cssText = `
                user-select: none;
                background-color: #000;
                display: flex;
                justify-content: center;
                place-items: center;
                text-align: center;
                border-radius: 12px;
                color: #fff;
                font-family: 'YouTube Sans', sans-serif;
                font-size: 22px;
                font-weight: 600;
                margin: 0 auto;
                margin-bottom: 16px;
                width: -webkit-fill-available;
                max-width: -webkit-fill-available;
                height: 708px;
                padding: 0;
            `;
            blockedMessage.textContent = 'Video không khả dụng ở khu vực của bạn.';

            // Insert the message before the h1 title
            const titleElement = document.querySelector('h1.ytd-watch-metadata');
            if (titleElement) {
                titleElement.parentNode.insertBefore(blockedMessage, titleElement);
            } else {
                // Fallback if title element not found
                videoPlayer.parentNode.insertBefore(blockedMessage, videoPlayer.nextSibling);
            }
        }
    }

    // Keep the preemptive style in place
    if (!document.getElementById('preemptive-block-style')) {
        preemptivelyBlock();
    }
}

    // Function to unblock content
    function unblockContent() {
        isCurrentlyBlocked = false;

        // Remove the preemptive blocking style
        const blockStyle = document.getElementById('preemptive-block-style');
        if (blockStyle) {
            blockStyle.remove();
        }

        // If no blocked words in the title, restore the player if it was blocked
        const videoPlayer = document.querySelector('#player');
        if (videoPlayer && videoPlayer.dataset.blocked === 'true') {
            // Restore the player
            videoPlayer.style.display = videoPlayer.dataset.originalDisplay;
            delete videoPlayer.dataset.blocked;

            // Remove the message
            removeBlockedMessage();
        }

        // Clear blocking interval if it exists
        if (window._blockingInterval) {
            clearInterval(window._blockingInterval);
            delete window._blockingInterval;
        }
    }

    // Function to remove any existing blocked message
    function removeBlockedMessage() {
        const blockedMessages = document.querySelectorAll('#content-blocked-message');
        blockedMessages.forEach(message => message.remove());
    }

    // Function to stop video and audio playback
    function stopVideoAndAudio() {
        // Method 1: Find and pause the HTML5 video element
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(videoElement => {
            if (videoElement) {
                videoElement.pause();
                videoElement.muted = true;
                videoElement.volume = 0;

                // Disconnect source if possible (more aggressive approach)
                try {
                    if (videoElement.srcObject) {
                        const tracks = videoElement.srcObject.getTracks();
                        tracks.forEach(track => track.stop());
                        videoElement.srcObject = null;
                    }
                } catch (e) {
                    console.log("Could not disconnect source object:", e);
                }
            }
        });

        // Method 2: Use YouTube's player API if available
        if (typeof document.querySelector('#movie_player') !== 'undefined') {
            const player = document.querySelector('#movie_player');
            if (player && typeof player.pauseVideo === 'function') {
                player.pauseVideo();
                player.mute();
                player.setVolume(0);
            }
        }

        // Continue blocking audio/video
        startAudioVideoBlockingInterval();
    }

    // Function to observe for changes in the DOM
    function observePageChanges() {
        // Options for the observer
        const config = {
            subtree: true,
            childList: true
        };

        // Create an observer instance
        const observer = new MutationObserver((mutations) => {
            // Check for title changes
            let shouldCheck = false;
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    shouldCheck = true;
                    break;
                }
            }

            if (shouldCheck) {
                checkAndBlockContent();
            }
        });

        // Start observing the document
        observer.observe(document.body, config);
    }

    // Function to detect URL changes for SPA navigation
    function setupURLChangeDetection() {
        let lastUrl = location.href;

        // Create an observer for URL changes
        const urlObserver = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;

                // Check for shorts first and redirect if needed
                checkAndRedirectShorts();

                // Clear previous checks
                if (window._titleCheckInterval) {
                    clearInterval(window._titleCheckInterval);
                }

                // If moving to a video page, preemptively block
                if (window.location.pathname.includes('/watch')) {
                    // Preemptively block content
                    preemptivelyBlock();

                    // Start watching for the title
                    watchForTitle();
                } else {
                    // Not on a video page, make sure to unblock
                    unblockContent();
                }
            }
        });

        // Start observing for URL changes
        urlObserver.observe(document, {subtree: true, childList: true});

        // Also use history API for more reliable detection
        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(this, arguments);

            // Check for shorts first and redirect if needed
            checkAndRedirectShorts();

            // If moving to a video page, preemptively block
            if (window.location.pathname.includes('/watch')) {
                preemptivelyBlock();
                watchForTitle();
            } else {
                unblockContent();
            }
        };

        // Handle back/forward navigation
        window.addEventListener('popstate', () => {
            // Check for shorts first and redirect if needed
            checkAndRedirectShorts();

            // If moving to a video page, preemptively block
            if (window.location.pathname.includes('/watch')) {
                preemptivelyBlock();
                watchForTitle();
            } else {
                unblockContent();
            }
        });
    }

    // Start immediately
    initialize();
})();
