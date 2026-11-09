export const themeState = $state({
    mode: 'light' as 'light' | 'dark'
});

export function toggleTheme() {
    if (typeof window === 'undefined') return;
    
    themeState.mode = themeState.mode === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-mode', themeState.mode);
    localStorage.setItem('mode', themeState.mode);
}

export function initTheme() {
    if (typeof window === 'undefined') return;

    const savedMode = localStorage.getItem('mode') as 'light' | 'dark' | null;

    if (savedMode) {
        themeState.mode = savedMode;
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        themeState.mode = prefersDark ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-mode', themeState.mode);
}
