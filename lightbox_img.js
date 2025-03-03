// ==UserScript==
// @name         Lightbox Image
// @namespace    Lightbox Image
// @version      1.0
// @description  Inject Lightbox easy into the page
// @author       baopingsheng
// @match        *://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_addElement
// ==/UserScript==
(function() {
    'use strict';

    // Function to add custom styles
    function addCustomStyles() {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css';
        document.head.appendChild(cssLink);

        const customStyle = document.createElement('style');
        customStyle.textContent = `
            .fancybox__container{z-index:10000}
            .fancybox__slide.has-image>.fancybox__content {
                width: 100%!important;
                height: 100%!important;
            }
        `;
        document.head.appendChild(customStyle);
    }

    // Function to load Fancybox and bind functionality
    function loadFancybox() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js';
        script.onload = () => {
            Fancybox.bind('[src]',{
                Toolbar: {
                    display: {
                        left: ["infobar"],
                        middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"],
                        right: ["slideshow", "download", "thumbs", "close"],
                    },
                },
            });
        };
        document.body.appendChild(script);
    }

    // Execute the functions when the page is loaded
    window.addEventListener('load', function() {
        addCustomStyles();
        loadFancybox();
    });

})();
