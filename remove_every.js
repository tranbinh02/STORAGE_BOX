// ==UserScript==
// @name         Remove ADS Every time
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  A custom toggle switch that can hide/show specific page elements
// @exclude      *://drive.google.com/*
// @exclude      *://www.drive.google.com/*
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // List of elements to hide
    const elementsToHide = [
        'login-popbox-detail-new',
        'loginwrap-new',
        're-popbox',
        'loginwrap',
        'quangcao',
        'toastify',
        'floatads',
        'overlay',
        'header',
        'footer',
        'banner',
        '@login',
        'ads'
    ];

    // Inject CSS
    GM_addStyle(`
        @import url("https://fonts.googleapis.com/css2?family=Varela+Round&display=swap");

        body {
            transition: opacity 0.3s ease;
        }

        .hidden-elements .toggle-hidden {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }

        * {
            box-sizing: border-box;
        }

        .switch {
            width: -webkit-fill-available;
            height: 24px;
            position: fixed;
            bottom: 3px;
            right: 10px;
            z-index: 9999;
        }

        .switch input {
            display: block;
            appearance: none;
            position: absolute;
            width: 100%;
            height: 24px;
            border: 0;
            padding: 0;
            margin: 0;
            cursor: pointer;
            background: none;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
        }

        .switch input:checked ~ .on {
            transform: translateY(0) scale(1);
            opacity: 1;
            color: #000;
            filter: blur(0);
        }

        .switch input:checked ~ .on ~ span:after {
            transform: translateY(0);
        }

        .switch input:checked ~ .off {
            transform: translateY(16px) scale(0.8);
            opacity: 0;
            filter: blur(3px);
            color: rgba(92,58,255,0);
        }

        .switch label {
            position: absolute;
            right: 12px;
            display: block;
            font-size: 12.8px;
            font-weight: 400;
            line-height: 20px;
            user-select: none;
            transform-origin: right 16px;
            width: 100%;
            text-align: right;
            color: #000;
            text-transform:none;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            transition: all 0.3s ease;
            pointer-events: none;
        }

        .switch label.on {
            transform: translateY(-16px) scale(0.8);
            opacity: 0;
            filter: blur(3px);
        }

        .switch label.on ~ span:after {
            transform: translateY(7px);
        }

        .switch label.off {
            transform: translateY(0) scale(1);
            opacity: 1;
            color: #000;
            filter: blur(0);
        }

        .switch span {
            position: absolute;
            top: 5px;
            right: 0;
            width: 4px;
            height: 4px;
            background: #C7C7CB;
            border-radius: 50%;
            box-shadow: 0 7px 0 #C7C7CB;
            pointer-events: none;
        }

        .switch span:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
    `);

    // Create and inject the HTML
    function createToggleSwitch() {
        const switchDiv = document.createElement('div');
        switchDiv.className = 'switch';
        switchDiv.innerHTML = `
            <input id="tgl" type="checkbox"/>
            <label class="on" for="tgl">Hiện quảng cáo</label>
            <label class="off" for="tgl">Tắt quảng cáo</label>
            <span></span>
        `;
        return switchDiv;
    }

    // Function to toggle element visibility
    function toggleElementVisibility(checkbox) {
        checkbox.addEventListener('change', function() {
            const body = document.body;

            if (this.checked) {
                // Add a class to body to trigger hiding
                body.classList.add('hidden-elements');

                // Hide specific elements
                elementsToHide.forEach(selector => {
                    // Try multiple selection methods
                    const byId = document.getElementById(selector);
                    const byClass = document.getElementsByClassName(selector);
                    const byAttr = document.querySelector(`[id*="${selector}"]`);
                    const byDataAttr = document.querySelector(`[data-${selector}]`);

                    // Add toggle-hidden class to found elements
                    if (byId) byId.classList.add('toggle-hidden');

                    Array.from(byClass).forEach(el => {
                        el.classList.add('toggle-hidden');
                    });

                    if (byAttr) byAttr.classList.add('toggle-hidden');
                    if (byDataAttr) byDataAttr.classList.add('toggle-hidden');
                });
            } else {
                // Remove the hiding class from body
                body.classList.remove('hidden-elements');

                // Restore visibility of previously hidden elements
                document.querySelectorAll('.toggle-hidden').forEach(el => {
                    el.classList.remove('toggle-hidden');
                });
            }
        });
    }

    // Function to add the toggle switch to the page
    function addToggleSwitch() {
        const switchElement = createToggleSwitch();
        const checkbox = switchElement.querySelector('input');

        document.body.appendChild(switchElement);
        toggleElementVisibility(checkbox);
    }

    // Run the script
    addToggleSwitch();
})();
