let componentCacheMap = {};

const convertUrltoName = (url) => {
    return url.replace(/[\/.]/g, '_');
}

function getComponent(url, fn) {
    if (componentCacheMap.hasOwnProperty(convertUrltoName(url))) {
        fn(componentCacheMap[convertUrltoName(url)]);
    } else {
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            let modalContent = xhr.responseXML;
            let c = modalContent.body.firstElementChild;
            if (xhr.status === 200 || xhr.status === 201) {
                componentCacheMap[convertUrltoName(url)] = c;
            }
            fn(c);
        };
        xhr.open('get', url);
        xhr.responseType = 'document';
        xhr.overrideMimeType('text/html');
        xhr.send();
    }
}

function getMergedClassName(elSrc, elDes) {
    let srcCs = elSrc.classList;
    let srcCss = [];
    for (let i = 0; i < srcCs.length; i++) {
        srcCss.push(srcCs[i]);
    }

    let desCs = elDes.classList;
    let desCss = [];
    for (let i = 0; i < desCs.length; i++) {
        desCss.push(desCs[i]);
    }
    return srcCss.concat(desCss.filter((item) => srcCss.indexOf(item) < 0)).join(' ');
}


function router(el, orinalUrl, routes) {
    if (!orinalUrl.endsWith('/')) {
        orinalUrl += '/';
    }
    let urls = orinalUrl.split('/');
    let url = urls[0];
    for (let i = 0; i < routes.length; i++) {
        let route = routes[i];
        if (route.path === url) {
            getComponent(route.component, (c) => {
                el.className = getMergedClassName(el, c);
                el.innerHTML = c.innerHTML; // function 유실
                if (el.querySelector('[component]')) {
                    let citarget = el.querySelector('[component]');
                    getComponent(citarget.getAttribute('component'), (ci) => {
                        citarget.className = getMergedClassName(citarget, ci);
                        citarget.removeAttribute('component');
                        citarget.innerHTML = ci.innerHTML; // function 유실
                    })
                }
                if (route.children) {
                    let routerView = el.querySelector('[router-view]');
                    routerView.removeAttribute('router-view');
                    router(routerView, urls[1], route.children);
                }
            });

        }
    }
}



window.onhashchange = () => {
    router(main, location.hash.substring(1), routes);
}

function bhninit(main) {
    location.href = "/#";
    router(main, location.hash.substring(1), routes);
}
