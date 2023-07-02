// function transforms any length string to a hex color
const getColorForTextMem = {}; // TODO: use memoization function

export default function getColorForText(str: string, opacityBytes = '') {
    const memKey = str + opacityBytes;
    if (getColorForTextMem[memKey]) return getColorForTextMem[memKey];
    let hash = 0;
    if (str.length == 0) return hash;

    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    getColorForTextMem[memKey] = '#' + ((hash & 0xffffff)).toString(16).padStart(6, '0') + opacityBytes;
    return getColorForTextMem[memKey]; // return lower 16-bits of hash value
}
