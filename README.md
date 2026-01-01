# Smart-Kitchen-AI-Ultimate-V10.5-
An offline-first, AI-powered Progressive Web App (PWA) for managing kitchen inventory, predicting household budgets, scanning grocery bills via OCR, and assisting with cooking through voice commands. Tailored with economic data for Sri Lanka but adaptable for any region.


# 🍲 Smart Kitchen AI Ultimate (V10.5)

![Version](https://img.shields.io/badge/Version-10.5-success) ![Status](https://img.shields.io/badge/Status-Stable-blue) ![License](https://img.shields.io/badge/License-MIT-orange) ![PWA](https://img.shields.io/badge/PWA-Ready-purple)

**Smart Kitchen AI** is a comprehensive, client-side Progressive Web App (PWA) designed to modernize household food management. It combines inventory tracking, financial analytics, recipe generation, and an AI chatbot assistant into a single, offline-capable interface.

While the core logic is universal, this version comes pre-loaded with economic data, recipes, and localization for **Sri Lanka** (English & Sinhala support).

## ✨ Key Features

### 🤖 AI Assistant & Chat
*   **Custom Neural Engine:** A built-in NLP engine (not API-dependent) that handles fuzzy matching for cooking questions, inventory commands, and kitchen tips.
*   **Voice Interaction:** Full speech-to-text and text-to-speech capabilities for hands-free assistance.
*   **Training Mode:** An integrated "Teacher Mode" allows you to teach the AI new Q&A pairs via `ai_training_panel.html`.

### 📦 Smart Inventory & OCR
*   **Inventory Tracking:** Track quantities, expiration dates, and low-stock alerts.
*   **Bill Scanning (OCR):** Uses `Tesseract.js` to scan physical grocery receipts and automatically parse items into your inventory.
*   **Smart Suggestions:** Learns from your usage history to suggest shopping lists.

### 📊 Budget Analytics
*   **Financial Forecasting:** Uses linear regression to predict monthly household costs based on family size and consumption history.
*   **Economic Data:** Pre-loaded with Sri Lankan market data (`srilanka_budget_data.js`) for accurate inflation and budget quintile analysis.
*   **Reporting:** Generates detailed PDF reports of your kitchen's financial health.

### 🍳 Cook Mode
*   **Hands-Free UI:** High-contrast, large-text interface designed for use while cooking.
*   **Stock Deduction:** Automatically deducts used ingredients from your inventory after a meal is logged.
*   **Manual Entry:** Quickly log ad-hoc meals to keep inventory predictions accurate.

### ⚙️ Technical Highlights
*   **Zero Backend:** Runs entirely in the browser using `localStorage`. No server setup required.
*   **PWA Support:** Installable on mobile/desktop via `manifest.json` and works offline via `sw.js`.
*   **Theming:** Dark/Light mode support via Tailwind CSS.
*   **Localization:** Full support for English and Sinhala languages.

---

## 📂 File Structure

*   **`index.html`**: The main application entry point (SPA structure).
*   **`script.js`**: Core application logic (Navigation, UI Rendering, PWA handling).
*   **`ai_engine.js`**: The custom NLP chatbot class, fuzziness logic, and personality engine.
*   **`budget_analytics_engine.js`**: Logic for calculating family budgets, inflation predictions, and seasonal savings.
*   **`grocery_wizard_engine.js`**: Onboarding logic to calculate initial family consumption patterns.
*   **`srilanka_budget_data.js`**: Static database of market prices, seasonal variations, and income quintiles.
*   **`recipes.js`**: Database of 100+ local and international recipes.
*   **`admin_settings.html`**: Configuration panel to toggle features, change themes, and manage app identity.
*   **`ai_training_panel.html`**: A dashboard to view AI logs, train new responses, and export the "brain".
*   **`sw.js`**: Service Worker implementation for offline caching.
*   **`style.css`**: Custom CSS overrides for Tailwind.

---

## 🚀 Getting Started

### Prerequisites
*   A modern web browser (Chrome, Edge, Safari).
*   No Node.js or Python required (Static HTML/JS).

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/smart-kitchen-ai.git
    ```
2.  **Run the App:**
    *   Simply open `index.html` in your browser.
    *   **Note for OCR/Voice:** Some browsers require the file to be served over `http/https` (not `file://`) for permission access (Camera/Microphone).
    *   *Recommended:* Use the "Live Server" extension in VS Code or run `python -m http.server`.

3.  **Install as App (PWA):**
    *   On Mobile: Tap "Add to Home Screen" in browser options.
    *   On Desktop: Click the Install icon in the address bar.

---

## 🛠️ Configuration & Training

### Admin Settings
Access `admin_settings.html` to:
*   Change the App Name and Logo.
*   Toggle Dark Mode / Loader.
*   Configure Currency (default: LKR) and Units.
*   Customize Mobile/Desktop navigation tabs.

### Training the AI
Access `ai_training_panel.html` to:
*   View "Missed Queries" (questions the AI didn't understand).
*   Add new Trigger/Response pairs.
*   Import/Export the "Brain" (`ai_brain_backup.json`).

---

## 📸 Usage Guide

1.  **Onboarding:** Run the "Grocery Wizard" on first launch to set your family size and dietary preferences.
2.  **Adding Stock:** Use the **+** button to scan a bill or add items manually.
3.  **Cooking:** Go to the **Cook** tab, select a recipe, or use "Manual Entry" to log what you made.
4.  **Analytics:** Check the **Data** tab after 3-7 days of usage to see accurate budget predictions.

---

## ⚠️ Data & Privacy
**Your data never leaves your device.**
All inventory, recipes, and chat logs are stored in your browser's `LocalStorage`.
*   **Backup:** Regularly use **Settings > Export Data** to save a JSON backup of your kitchen data.
*   **Clear Data:** You can Factory Reset the app via Settings.

---

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewRecipeLogic`).
3.  Commit your changes.
4.  Push to the branch and open a Pull Request.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

*Developed with ❤️ for efficient, smarter living.*
