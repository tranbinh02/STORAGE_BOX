// ==UserScript==
// @name         FACEBOOK CUS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://facebook.com/*
// @match        https://*.facebook.com/*
// @icon         https://www.facebook.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
// CSS

// HTML
document.body.innerHTML += "<style>:root{--white:#fff;--black:#24292d;--accent:#0866FF;--switchers-main:#0b3cc1;--light-bg:#F0F8FF}html{overflow:visible!important}._9dls ._6s5d{overflow:visible!important}h4{margin-bottom:0!important}.appearance .icons,.color-icon.open .color-box{-moz-user-select:none!important;-webkit-touch-callout:none!important;-webkit-user-select:none!important;-khtml-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important;user-select:none!important}.appearance .light-dark,.appearance .icons{height:40px;width:40px;border-radius:6px;line-height:40px;text-align:center;color:#000;font-size:18px;background:none;cursor:pointer}.appearance .light-dark i,.appearance .icons i{opacity:1}.appearance .color-icon{position:relative}.appearance .icons{position:fixed;display:flex;background:#fff;width:45px;height:40px;padding:2px 0 2px 10px;float:right;align-items:center;right:0;top:100px;border-radius:30px 0 0 30px;box-shadow:0 5px 20px 0 rgba(0,0,0,.1)}.appearance .icons:before{content:'';background-image:url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' class='rad' viewBox='0 0 160 160'%3E%3Cpath d='M0-10,150,0l10,150S137.643,80.734,100.143,43.234,0-10,0-10Z' transform='translate(0 10)'%3E%3C/path%3E%3C/svg%3E');width:20px;height:20px;position:absolute;right:-2px;top:-19px;fill:var(--contentB);transform:rotate(92deg);transition:inherit}.appearance .icons:after{content:'';background-image:url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' class='rad in' viewBox='0 0 160 160'%3E%3Cpath d='M0-10,150,0l10,150S137.643,80.734,100.143,43.234,0-10,0-10Z' transform='translate(0 10)'%3E%3C/path%3E%3C/svg%3E');width:20px;height:20px;position:absolute;right:-2px;fill:var(--contentB);transition:inherit;top:auto;bottom:-19px;transform:rotate(-2deg)}.appearance .icons i{font-size:22px}.__fb-dark-mode .appearance .icons,.__fb-dark-mode .appearance .color-box,.__fb-dark-mode .appearance .color-box::before{background:#222}.__fb-dark-mode .appearance .icons:before{content:'';background-image:url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23222' class='rad' viewBox='0 0 160 160'%3E%3Cpath d='M0-10,150,0l10,150S137.643,80.734,100.143,43.234,0-10,0-10Z' transform='translate(0 10)'%3E%3C/path%3E%3C/svg%3E');width:20px;height:20px;position:absolute;right:-2px;top:-19px;fill:var(--contentB);transform:rotate(92deg);transition:inherit}.__fb-dark-mode .appearance .icons:after{content:'';background-image:url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23222' class='rad in' viewBox='0 0 160 160'%3E%3Cpath d='M0-10,150,0l10,150S137.643,80.734,100.143,43.234,0-10,0-10Z' transform='translate(0 10)'%3E%3C/path%3E%3C/svg%3E');width:20px;height:20px;position:absolute;right:-2px;fill:var(--contentB);transition:inherit;top:auto;bottom:-19px;transform:rotate(-2deg)}.__fb-dark-mode .appearance .icons{color:#fff}.__fb-dark-mode .color-switchers .btn.active{box-shadow:0 0 0 2px #222,0 0 0 3px var(--accent)}.appearance .color-box{position:fixed;max-width:228px;top:0;margin-top:98px;right:0;margin-right:74px;min-height:auto;background:var(--white);padding:20px 16px 16px;border-radius:20px;box-shadow:0 5px 30px 0 rgba(0,0,0,.05);opacity:0;pointer-events:none}.color-box::before{content:'';position:absolute;top:12px;right:-12px;height:28px;width:28px;border-radius:50%;background:var(--white);transform:rotate(45deg)}.color-icon.open .color-box{opacity:1;pointer-events:auto}.appearance .color-box .color-switchers{display:block}.color-box .color-switchers .btn{display:initial;position:relative;height:30px;width:30px;line-height:26px;border:none;outline:none;border-radius:50%;margin:4px;cursor:pointer;background:#4070F4}.color-switchers .btn{background:#F79F1F}.color-switchers .btn.active{box-shadow:0 0 0 2px #fff,0 0 0 3px var(--accent)}.color-icon .dot{position:relative;background:var(--accent);border-radius:50%;width:6px;height:6px;right:-2px;top:0}.color-switchers .btn.dark:before{content:'\e9c8';font-family:primeicons;position:relative;color:#fff;float:left;left:4.8px;font-size:16px;bottom:0}</style>"
document.body.innerHTML += "<div class='appearance'><div class='color-icon'><div class='icons'><i class='ti ti-mood-check'></i><div class='dot'></div></div><div class='color-box'><div class='color-switchers'><button class='btn' data-color='#fff #242526 #000000 #000000 #000000' style='background:#000000'></button><button class='btn original active' data-color='#fff #24292d #4070f4 #0b3cc1 #F0F8FF' style='background:#4070f4'></button><button class='btn' data-color='#fff #242526 #3A9943 #2A6F31 #DAF1DC' style='background:#3A9943'></button><button class='btn' data-color='#fff #242526 #BB2525 #2A6F31 #DAF1DC' style='background:#BB2525'><button class='btn' data-color='#fff #242526 #F79F1F #DD8808 #fef5e6' style='background:#F79F1F'></button></button><button class='btn' data-color='#fff #24292d #2196F3 #0b3cc1 #F0F8FF' style='background:#2196F3'></button><button class='btn' data-color='#fff #242526 #FF5722 #DD8808 #fef5e6' style='background:#FF5722'></button><button class='btn' data-color='#fff #242526 #744D97 #783993 #eadaf1' style='background:#744D97'></button><button class='btn' data-color='#fff #242526 #00BFA5 #2A6F31 #DAF1DC' style='background:#00BFA5'></button><button class='btn' data-color='#fff #242526 #F44336 #2A6F31 #DAF1DC' style='background:#F44336'></button><button class='btn' data-color='#fff #242526 #DDF247 #DDF247 #DDF247' style='background:#DDF247'></button><button class='btn' data-color='#fff #242526 #FF9B82 #FF9B82 #FF9B82' style='background:#FF9B82'></button></div></div></div>";
// JS
let colorIcons = document.querySelector(".color-icon"),
icons = document.querySelector(".color-icon .icons");

icons.addEventListener("click" , ()=>{
  colorIcons.classList.toggle("open");
})

// getting all .btn elements
let buttons = document.querySelectorAll(".btn");

for (var button of buttons) {
  button.addEventListener("click", (e)=>{ //adding click event to each button
    let target = e.target;

    let open = document.querySelector(".open");
    if(open) open.classList.remove("open");

    document.querySelector(".active").classList.remove("active");
    target.classList.add("active");

    // js code to switch colors (also day night mode)
    let root = document.querySelector(":root");
    let dataColor = target.getAttribute("data-color"); //getting data-color values of clicked button
    let color = dataColor.split(" "); //splitting each color from space and make them array

    //passing particular value to a particular root variable
    root.style.setProperty("--white", color[0]);
    root.style.setProperty("--black", color[1]);
    root.style.setProperty("--accent", color[2]);
    root.style.setProperty("--primary-button-background", color[3]);
    root.style.setProperty("--light-bg", color[4]);

    let iconName = target.className.split(" ")[2]; //getting the class name of icon

    let coloText = document.querySelector(".x1lliihq .x1k90msu .x2h7rmj .x1qfuztq .x5e5rjt");
  });
}

    // Your code here...
})();
