export const useCSS = (id, css) => {
    const oldLink = document.querySelector(`link[id="${id}"]`)

    if(oldLink) {
        oldLink.remove();
    }

    const cssBlob = new Blob([css], {type: 'text/css'})
    const cssBlobUrl = window.URL.createObjectURL(cssBlob);

    let link = document.createElement('link');
    link.id = id;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = cssBlobUrl;

    document.head.appendChild(link);
}