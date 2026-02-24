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
            icon.textContent = '🌙'; // Moon for light mode (click to go dark)
            button.setAttribute('aria-label', 'Switch to dark mode');
        } else {
            icon.textContent = '☀️'; // Sun for dark mode (click to go light)
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
