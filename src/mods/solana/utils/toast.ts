import t from 'toastmaker';
import "./toast.css";

export const toast = (text, timeOut= 5000) => {
    return t(text, 5000, {
        styles: { fontSize: '18px', backgroundColor: '#5d7b44' },
        valign: 'top'
    })
}