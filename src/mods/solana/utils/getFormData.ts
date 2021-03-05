export function getFormData(e): any {
    return Object.keys(e.target.elements).map(elem => {
        const targetInput = e.target.elements[elem];
        return {
            [targetInput.name]: targetInput.value,
        }
    }).filter(item => Object.keys(item)[0] !== '').reduce((acc, val) => {
        return Object.assign(acc, val);
    })
}