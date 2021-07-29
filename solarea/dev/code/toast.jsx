const {
  default: toastmaker,
} = await require('https://unpkg.com/toastmaker@1.0.9/dist/toastmaker.js');

const toast = (text, timeOut = 5000, backgroundColor = '#5d7b44') => {
  return toastmaker(text, 5000, {
    styles: { fontSize: '18px', borderRadius: '4px', backgroundColor },
    valign: 'top',
  });
};

exports.toast = toast;
exports.error = (text, timeOut = 5000) => toast(text, timeOut, 'red');
