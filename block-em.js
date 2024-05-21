// ==UserScript==
// @name Block element
// @namespace Block element
// @description Chặn quảng cáo web phim
// @version 0.1
// @description *
// @author *
// @match *://*.*.*/*
// @grant none
// ==/UserScript==
const injectCSS = css => {
let el = document.createElement('style');
el.type = 'text/css';
el.innerText = css;
document.head.appendChild(el);
return el;
};
injectCSS('#popads, .ad-floater, #headerpcads, #catfishs_content, #hidemobile, #pm_quangcao, #an_catfish, #topplayerads, #overlay, .overlay_content, .banner-flex, #top_addd, .ads, #ads, #xs-addd0, .popUpBannerBox, #catfish, .no-ads, #top-banner, .promotion-popup, #preload{display: none!important}');
