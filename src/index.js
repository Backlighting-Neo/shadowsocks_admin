if (process.env.NODE_ENV !== 'production') {
  require('./index.html')
}

import './style.css';
import QRCode from 'qrcode';

(function() {
  function renderQrcode(dom, text) {
    QRCode.toCanvas(dom, text);
  }

  function renderConfig(config) {
    Object.keys(config).forEach(key => {
      document.getElementById(key).innerHTML = config[key];
    })
  }

  function getQrcode(qrcodeDom) {
    fetch('/api/qrcode')
    .then(res => res.json())
    .then(res => renderQrcode(qrcodeDom, res.qrcode));

  }

  window.onload = function() {
    const qrcodeDom = document.getElementById('qrcode');
    const button = this.document.getElementById('changePort');

    button.onclick = function() {
      if(button.disabled) return;
      button.disabled = true;
      fetch('/api/changePort')
      .then(res => res.json())
      .then(res => {
        renderConfig(res);
        getQrcode(qrcodeDom);
        button.disabled = false;
      })
    }

    getQrcode(qrcodeDom);

    fetch('/api/config')
    .then(res => res.json())
    .then(res => renderConfig(res));
  }
})();