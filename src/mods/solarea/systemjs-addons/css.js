async function compileSass(text) {
    return await new Promise((resolve, reject) => {
        globalThis.Sass.compile(text, resolve);
    }).catch()
}

(function () {
    const systemPrototype = System.constructor.prototype;
    const originalInstantiate = systemPrototype.instantiate;

    systemPrototype.instantiate = function () {
        let [prefix, url] = arguments[0].split('^');
        if(!url) url = prefix;

        if (url.slice(-4) === '.css'){
            return new Promise(async function(resolve, reject) {
                const has = document.querySelector(`link[id="${url}"]`)
                if(has) {
                    has.remove();
                }
                const req = await fetch(url);
                let css = await req.text();
                if(prefix !== url) {
                    css = (await compileSass(`
                .${prefix} {
                    ${css}
                }
                `)).text;
                }

                const cssBlob = new Blob([css], {type: 'text/css'})
                const cssBlobUrl = window.URL.createObjectURL(cssBlob);

                let link = document.createElement('link');
                link.id = url;
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = cssBlobUrl;

                link.onload = function(){
                    // console.log('%c Style '+url+' has been loaded', 'color: green');
                    resolve([[], function (){
                        return {};
                    }]);
                };
                link.onerror = function(e) {
                    let href = document.querySelector('link[href="'+url+'"]');
                    if(href){
                        href.parentElement.removeChild(href);
                    }
                    reject(e);
                };
                document.head.appendChild(link);
            })
        } else {
            return originalInstantiate.apply(this, arguments);
        }
    };
})();