// ==UserScript==
// @name         Universal Timer Accelerator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Accelerates timers on most websites
// @match        *://fontzin.com/*
// @match        *://21ak22.com/*
// @exclude      *://*.youtube.com/*
// @exclude      *://docs.google.com/
// @exclude      *://*.facebook.com/*
// @exclude      *://*.blogger.com/
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const speedFactor = 10;
    let startTime = Date.now();

    function accelerate(date) {
        return new Date(startTime + (date - startTime) * speedFactor);
    }

    let dateNowOrig = Date.now;
    Date.now = function() { return accelerate(dateNowOrig()).getTime(); };

    let dateOrig = Date;
    window.Date = class extends dateOrig {
        constructor(...args) {
            super(...args);
            if (args.length === 0) {
                return accelerate(new dateOrig());
            }
        }
        static now() { return Date.now(); }
    };

    for (let prop of Object.getOwnPropertyNames(dateOrig.prototype)) {
        if (prop !== 'constructor') {
            Date.prototype[prop] = function(...args) {
                return dateOrig.prototype[prop].apply(accelerate(this), args);
            };
        }
    }

    let performanceOrig = performance;
    performance.now = function() { return performanceOrig.now() * speedFactor; };

    for (let timer of ['setTimeout', 'setInterval']) {
        window[timer] = new Proxy(window[timer], {
            apply(target, thisArg, args) {
                args[1] = args[1] / speedFactor;
                return target.apply(thisArg, args);
            }
        });
    }

    console.log(`Timers accelerated by ${speedFactor}x`);
})();
