const params = new URLSearchParams(window.location.search);
const src = decodeURIComponent(params.get('src') ?? '');

const iframe = document.createElement('iframe');
iframe.src = src;

document.body.appendChild(iframe);
