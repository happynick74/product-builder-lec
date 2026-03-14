# Lotto Number Recommendation Site

## Overview

This project is a modern web application that generates random lottery numbers. It features a responsive design and supports both Dark and Light themes to provide a comfortable user experience.

## Implemented Features

*   **UI:**
    *   Clean and modern user interface with CSS variables.
    *   Interactive theme toggle button (Dark Mode / Light Mode).
    *   Responsive layout for mobile and desktop.
*   **Theme Support:**
    *   **Dark Mode (Default):** Deep dark background with high-contrast elements.
    *   **Light Mode:** Clean white background with soft shadows.
    *   Persistent theme selection using `localStorage`.
*   **Functionality:**
    *   Generates 6 unique random numbers (1-45).
    *   Numbers are automatically sorted in ascending order.
    *   Real-time display update without page reload.
*   **Visual Effects:**
    *   Smooth transitions for theme switching.
    *   Depth effects using multi-layered shadows.
    *   Interactive button animations.

## Technical Details

*   **HTML5 & CSS3:** Uses semantic tags and modern CSS features like Custom Properties (Variables) and Attribute Selectors for theming.
*   **Vanilla JavaScript:** Pure ES6+ logic for number generation and theme state management.
*   **State Management:** LocalStorage is used to remember the user's theme preference across sessions.
