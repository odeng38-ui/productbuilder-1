
# Blueprint: Lotto Number Generator

## **Overview**

This project is a web-based Lotto Number Generator. It provides a user-friendly interface for generating a set of 6 unique random numbers, typically for lottery purposes. The application is built using modern, framework-less web technologies, emphasizing the use of Web Components for modularity and encapsulation.

## **Design & Features**

The application adheres to modern design principles to ensure a visually appealing and intuitive user experience.

### **Core Functionality**
- **Number Generation:** Generates a set of 6 unique numbers between 1 and 45.
- **Display:** Shows the generated numbers in a clear and engaging format.
- **Interaction:** A single button triggers the number generation process.

### **Visual Design**
- **Layout:** A clean, centered layout that is mobile-responsive.
- **Typography:** Uses the "Jua" font from Google Fonts for a friendly and readable look.
- **Color Palette:** A vibrant color scheme is used to differentiate the numbers and create a lively interface.
- **Component Style:**
    - The main generator is encapsulated in a `<lotto-generator>` Web Component.
    - Generated numbers are displayed in colored circles ("balls") with a subtle drop shadow to give them a "lifted" feel.
    - The "Generate" button is styled to be interactive with hover and active states.
- **Background:** A subtle noise texture on the background adds a premium, tactile feel.

### **Technical Implementation**
- **Web Component (`<lotto-generator>`):** The core logic and UI are encapsulated within a custom element using the Shadow DOM. This prevents style conflicts with the main document.
- **HTML (`index.html`):** The main file, which includes the custom element and links to the necessary CSS and JavaScript files.
- **CSS (`style.css`):** Global styles for the body, including the background, font, and layout.
- **JavaScript (`main.js`):** Defines the `LottoGenerator` class and registers the custom element. It handles the random number generation and updates the component's display.

## **Current Plan**

1.  **Modify `index.html`:**
    -   Update the page title.
    -   Import the "Jua" Google Font.
    -   Replace the existing body content with the `<lotto-generator>` custom element.
2.  **Modify `style.css`:**
    -   Apply global styles for the background, font, and layout to center the component.
3.  **Modify `main.js`:**
    -   Create the `LottoGenerator` class as a Web Component.
    -   Define the component's HTML structure using a `<template>`.
    -   Encapsulate the component's styles within the Shadow DOM, including styles for the number balls and the button.
    -   Implement the logic to generate 6 unique random numbers when the button is clicked.
    -   Dynamically create and display the number balls in the component's shadow root.
