export const key = {
    isCtrlEnter: (e) => e.ctrlKey && e.which == 13,
    isCmdEnter: (e) => e.metaKey && e.which == 13,
    isEnter: (e) => e.which == 13,
}