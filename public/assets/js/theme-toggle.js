// Theme Toggle Functionality
(function () {
    'use strict';

    const THEME_KEY = 'portfolio-theme';
    const LIGHT_THEME = 'light-theme';
    const DARK_THEME = 'dark-theme';

    // Get saved theme or default to dark
    function getSavedTheme() {
        return localStorage.getItem(THEME_KEY) || DARK_THEME;
    }

    // Apply theme to document
    function applyTheme(theme) {
        const html = document.documentElement;

        if (theme === LIGHT_THEME) {
            html.classList.add(LIGHT_THEME);
            html.classList.remove(DARK_THEME);
        } else {
            html.classList.add(DARK_THEME);
            html.classList.remove(LIGHT_THEME);
        }

        // Update toggle button icon
        updateToggleButton(theme);
    }

    // Save theme preference
    function saveTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
    }

    // Toggle between themes
    function toggleTheme() {
        const currentTheme = getSavedTheme();
        const newTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;

        saveTheme(newTheme);
        applyTheme(newTheme);
    }

    // Update toggle button appearance
    function updateToggleButton(theme) {
        const button = document.querySelector('.theme-toggle');
        if (!button) return;

        const icon = button.querySelector('.theme-icon');
        if (theme === LIGHT_THEME) {
            // Moon icon for light mode (click to go dark)
            icon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" fill="#B7AB98"/></svg>';
            button.setAttribute('aria-label', 'Switch to dark mode');
        } else {
            // Sun icon for dark mode (click to go light)
            icon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.42 0-.39.39-.39 1.03 0 1.42l1.06 1.06c.39.39 1.03.39 1.42 0s.39-1.03 0-1.42L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.42 0-.39.39-.39 1.03 0 1.42l1.06 1.06c.39.39 1.03.39 1.42 0 .39-.39.39-1.03 0-1.42l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.42-.39-.39-1.03-.39-1.42 0l-1.06 1.06c-.39.39-.39 1.03 0 1.42s1.03.39 1.42 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.42-.39-.39-1.03-.39-1.42 0l-1.06 1.06c-.39.39-.39 1.03 0 1.42s1.03.39 1.42 0l1.06-1.06z" fill="#B7AB98"/></svg>';
            button.setAttribute('aria-label', 'Switch to light mode');
        }
    }

    // Initialize theme on page load
    function init() {
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);

        // Add click listener to toggle button
        const toggleButton = document.querySelector('.theme-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleTheme);
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
