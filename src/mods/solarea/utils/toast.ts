import t from 'toastmaker';
import './toast.css';

export const toast = (text, timeOut = 5000, backgroundColor = '#70b038') => {
  return t(text, 5000, {
    styles: { fontSize: '18px', backgroundColor },
    valign: 'top',
  });
};

export const error = (text, timeOut = 5000) => toast(text, timeOut, 'red');
