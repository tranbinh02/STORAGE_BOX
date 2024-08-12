(function () {
    'use strict';

    const getOriginUrl = (imgUrl) => {
        let match = imgUrl.match(/https:\/\/(pbs\.twimg\.com\/media\/[a-zA-Z0-9\-\_]+)(\?format=|.)(jpg|jpeg|png|webp)/);
        if (!match) return false;
        // webp change to jpg
        if (match[3] == 'webp') match[3] = 'jpg';
        // change it to obtain the original quality.
        if (match[2] == '?format=' || !/name=orig/.test(imgUrl)) {
            return `https://${match[1]}.${match[3]}?name=orig`
        } else {
            return false;
        }
    }
    const URL = window.location.href;
    // browsing an image URL
    if (URL.includes('twimg.com')) {
        let originUrl = getOriginUrl(URL);
        if (originUrl) window.location.replace(originUrl);
    }
    // if browsing tweets, activate the observer.
    if (URL.includes('twitter.com') || URL.includes('x.com')) {
        const rootmatch = document.evaluate('//div[@id="react-root"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const rootnode = rootmatch.singleNodeValue;
        const MAX_HASHTAGS = GM_getValue('MAX_HASHTAGS');
        const OUT_HASHTAGS = GM_getValue('OUT_HASHTAGS').split(',');
        const checkElement = (ele) => {
            return [
                ele.dataset.testid == 'tweet',
                ele.dataset.testid == 'tweetPhoto',
                ele.className == 'css-175oi2r r-1pi2tsx r-u8s1d r-13qz1uu',
            ].some(item => item);
        }
        if (rootnode) {
            const callback = (mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    const target = mutation.target;
                    if (!checkElement(target)) continue;
                    // only the article node needs to be checked for spam or ads.
                    if (target.nodeName == 'ARTICLE') {
                        try {
                            const hashtags = Array.from(target.querySelectorAll('a[href^="/hashtag/"]'), tag => tag.textContent);
                            // exceeding the numbers of hashtags.
                            if (MAX_HASHTAGS > 0 && hashtags.length >= MAX_HASHTAGS) throw target;
                            // containing specified hashtags.
                            if (hashtags.some(tag => OUT_HASHTAGS.find(item => item == tag))) throw target;
                            // ads.
                            if (target.querySelector('svg.r-1q142lx')) throw target;
                        } catch (e) {
                            // hidden tweet
                            if (e instanceof HTMLElement) e.closest('div[data-testid="cellInnerDiv"]').style.display = 'none';
                            continue;
                        }
                    }
                    const images = target.querySelectorAll('img');
                    if (!images.length) continue;
                    // tweets image
                    for (const image of images) {
                        let originUrl = getOriginUrl(image.src);
                        if (originUrl) image.src = originUrl;
                        continue;
                    }
                }
            }
            const observer = new MutationObserver(callback);
            // start observe
            observer.observe(document.body, {
                attributes: true,
                childList: true,
                subtree: true
            });
        }
    }
})();

GM_registerMenuCommand('Setting', () => config.open());

const config = new GM_config({
    'id': 'twitter_plus_setting',
    'css': `
        #twitter_plus_setting_wrapper {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        #twitter_plus_setting_section_0 {
            flex: 1;
        }
        #twitter_plus_setting_buttons_holder {
            text-align: center;
        }
        .config_var {
            display: flex;
            flex-direction: column;
            margin-bottom: 1rem !important;
        }
    `,
    'title': 'Remove Spam',
    'fields': {
        'MAX_HASHTAGS': {
            'label': 'When exceeding how many hashtags?',
            'type': 'number',
            'title': 'input 0 to disable',
            'min': 0,
            'max': 100,
            'default': 20,
        },
        'OUT_HASHTAGS': {
            'label': 'When containing which hashtags?',
            'type': 'textarea',
            'title': 'Must include # and separated by commas.',
            'default': '#tag1,#tag2',
        }
    },
    'events': {
        'init': () => {
            if (GM_getValue('MAX_HASHTAGS')) { config.set('MAX_HASHTAGS', GM_getValue('MAX_HASHTAGS')) }
            if (GM_getValue('OUT_HASHTAGS')) { config.set('OUT_HASHTAGS', GM_getValue('OUT_HASHTAGS')) }
        },
        'save': () => {
            GM_setValue('OUT_HASHTAGS', config.get('OUT_HASHTAGS'));
            GM_setValue('MAX_HASHTAGS', config.get('MAX_HASHTAGS'));
            config.close();
        }
    }
});
