// ==UserScript==
// @name         Remove ADS Every time
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  A custom toggle switch that can remove specific page elements with local storage persistence
// @exclude      *://drive.google.com/*
// @exclude      *://www.drive.google.com/*
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // List of elements to remove
    const elementsToRemove = [
        'login-popbox-detail-new',
        'loginwrap-new',
        're-popbox',
        'loginwrap',
        'quangcao',
        'toastify',
        'floatads',
        'overlay',
        'gmp_header',
        'footer_container',
        'banner',
        '@login',
        'ads'
    ];

    // Inject CSS (same as previous script)
    GM_addStyle(`
        @import url("https://fonts.googleapis.com/css2?family=Varela+Round&display=swap");

        body {
            transition: opacity 0.3s ease;
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
            -webkit-tap-highlight-color: rgba(0,0,0,0);
        }
        [type=checkbox], [type=radio],[type=checkbox]:checked, [type=radio]:checked[type=checkbox]:checked, [type=radio]:checked{
            background:none!important;
            border:0!important;
        }
        [type=checkbox]:focus, [type=radio]:focus{
            border:0!important;
            outline:none!important
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
            font-family: Varela Round!important;
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

    // Store removed elements to restore later
    const removedElements = [];

    // Create and inject the HTML
    function createToggleSwitch(isChecked) {
        const switchDiv = document.createElement('div');
        switchDiv.className = 'switch';
        switchDiv.innerHTML = `
            <input id="tgl" type="checkbox" ${isChecked ? 'checked' : ''}/>
            <label class="on" for="tgl">Hiện quảng cáo</label>
            <label class="off" for="tgl">Tắt quảng cáo</label>
            <span></span>
        `;
        return switchDiv;
    }

    // Function to toggle element removal
    function toggleElementRemoval(checkbox) {
        checkbox.addEventListener('change', function() {
            const isChecked = this.checked;

            // Save the state to local storage
            GM_setValue('adBlockerState', isChecked);

            if (isChecked) {
                // Remove specific elements
                elementsToRemove.forEach(selector => {
                    // Try multiple selection methods
                    const byId = document.getElementById(selector);
                    const byClass = document.getElementsByClassName(selector);
                    const byAttr = document.querySelector(`[id*="${selector}"]`);
                    const byDataAttr = document.querySelector(`[data-${selector}]`);

                    // Remove found elements and store for potential restoration
                    if (byId) {
                        removedElements.push({ element: byId, parent: byId.parentNode });
                        byId.remove();
                    }

                    Array.from(byClass).forEach(el => {
                        removedElements.push({ element: el, parent: el.parentNode });
                        el.remove();
                    });

                    if (byAttr) {
                        removedElements.push({ element: byAttr, parent: byAttr.parentNode });
                        byAttr.remove();
                    }

                    if (byDataAttr) {
                        removedElements.push({ element: byDataAttr, parent: byDataAttr.parentNode });
                        byDataAttr.remove();
                    }
                });
            } else {
                // Restore previously removed elements
                removedElements.forEach(({ element, parent }) => {
                    if (parent) {
                        parent.appendChild(element);
                    }
                });

                // Clear the removedElements array
                removedElements.length = 0;
            }
        });
    }

    // Function to add the toggle switch to the page
    function addToggleSwitch() {
        // Retrieve the last saved state from local storage
        const lastState = GM_getValue('adBlockerState', false);

        // Create switch with last saved state
        const switchElement = createToggleSwitch(lastState);
        const checkbox = switchElement.querySelector('input');

        document.body.appendChild(switchElement);
        toggleElementRemoval(checkbox);

        // Manually trigger change event to apply initial state
        if (lastState) {
            checkbox.dispatchEvent(new Event('change'));
        }
    }

    // Run the script
    addToggleSwitch();
})();
