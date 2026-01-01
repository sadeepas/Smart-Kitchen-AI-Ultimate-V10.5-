/**
        * KITCHEN AI - ULTIMATE EDITION (V10.5)
        * Combined Features: Analytics, OCR, Cook Mode, AI Chef, Import/Export, Multi-language.
        */
// REPLACE your existing CATALOG_SL, CATALOG_FULL, and CATALOG_MASTER definitions with this single block:
// REPLACE your existing CATALOG_SL, CATALOG_FULL, and CATALOG_MASTER definitions with this single block:

// --- INTERACTIVE FEATURES (V7.8) ---

class VoiceManager {
    constructor(app) {
        this.app = app;
        this.recognition = null;
        this.isListening = false;

        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.app.toast(this.app.L("Listening...", "සවන් දෙමින්..."), "Voice", "fa-microphone");
            };

            this.recognition.onend = () => {
                this.isListening = false;
            };

            this.recognition.onerror = (e) => {
                console.error(e);
                this.app.toast("Voice Error", "Try again", "fa-exclamation-circle");
            };
        }
    }

    start(lang = 'en-US', callback) {
        if (!this.recognition) {
            this.app.toast("Voice not supported in this browser", "Error", "fa-ban");
            return;
        }
        this.recognition.lang = lang; // 'en-US' or 'si-LK'
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (callback) callback(transcript);
        };
        this.recognition.start();
    }
}

// --- DATA SCIENCE ENGINE (V6.0 - "Python-like" Math) ---
class DataScienceEngine {
    constructor() {
        console.log("Data Science Engine Loaded");
    }

    // 1. Linear Regression (for Budget Prediction)
    // Returns { slope, intercept, predict(x) }
    linearRegression(x, y) {
        const n = x.length;
        if (n === 0) return null;

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return {
            slope,
            intercept,
            predict: (val) => slope * val + intercept
        };
    }

    // 2. Vector Similarity (for Smart Recipe Matching)
    // Compares Inventory Vector vs Recipe Ingredient Vector
    cosineSimilarity(vecA, vecB) {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

        if (magA === 0 || magB === 0) return 0;
        return dotProduct / (magA * magB);
    }

    // 3. Outlier Detection (for Market Deals)
    // Uses IQR (Interquartile Range) Method
    detectOutliers(values) {
        if (values.length < 4) return { low: [], high: [] };

        const sorted = [...values].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(values.length / 4)];
        const q3 = sorted[Math.ceil(values.length * (3 / 4))];
        const iqr = q3 - q1;

        const lowerBound = q1 - (1.5 * iqr);
        const upperBound = q3 + (1.5 * iqr);

        return {
            low: values.filter(v => v < lowerBound), // Good Deals
            high: values.filter(v => v > upperBound) // Overpriced
        };
    }
}



class TourManager {
    constructor(app) {
        this.app = app;
        this.isMobile = window.innerWidth < 768;

        // Define steps based on device
        const commonSteps = [
            { el: '#main-view', title: { en: 'Dashboard', si: 'මුල් පිටුව' }, desc: { en: 'Your daily kitchen overview.', si: 'ඔබේ දෛනික මුළුතැන්ගෙයි දත්ත.' } }
        ];

        const desktopSteps = [
            { el: '#desktop-menu', title: { en: 'Sidebar Navigation', si: 'පැති මෙනුව' }, desc: { en: 'Access Inventory, Market, and Cook modes here.', si: 'මෙහි තොග, වෙළඳපල සහ ඉවුම් පිහුම් වෙත පිවිසෙන්න.' } },
            ...commonSteps,
            { el: 'button[onclick="app.toggleQuickMenu()"]', title: { en: 'Quick Actions', si: 'ක්ෂණික ක්‍රියා' }, desc: { en: 'Tap + to scan bills or add items.', si: 'බිල්පත් ස්කෑන් කිරීමට හෝ අයිතම එක් කිරීමට + ඔබන්න.' } }
        ];

        const mobileSteps = [
            { el: '#mobile-menu', title: { en: 'Bottom Navigation', si: 'පහළ මෙනුව' }, desc: { en: 'Switch between tabs easily.', si: 'ටැබ් අතර මාරු වන්න.' } },
            ...commonSteps,
            // Mobile FAB is usually visible, but if hidden in some views, we skip. 
            { el: '#mobile-fab', title: { en: 'Quick Actions', si: 'ක්ෂණික ක්‍රියා' }, desc: { en: 'Tap the center button to add items.', si: 'අයිතම එක් කිරීමට මැද බොත්තම ඔබන්න.' } }
        ];

        this.steps = this.isMobile ? mobileSteps : desktopSteps;
        this.currentStep = 0;
        this.overlay = null;

        // Listen for resize to update responsiveness (optional, but good for PC resizing)
        window.addEventListener('resize', () => {
            const newIsMobile = window.innerWidth < 768;
            if (this.isMobile !== newIsMobile) {
                this.isMobile = newIsMobile;
                this.steps = this.isMobile ? mobileSteps : desktopSteps;
            }
        });
    }

    start() {
        if (localStorage.getItem('tour_doneV90') === 'true') return;
        this.runStep(0);
    }

    skip() {
        this.cleanup();
        localStorage.setItem('tour_doneV90', 'true');
        this.app.toast(this.app.L("Tour Skipped", "Tour එක මග හැරිය"), "Info");
    }

    cleanup() {
        if (this.overlay) this.overlay.remove();
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight', 'relative', 'z-[10002]');
            el.style.zIndex = '';
            el.style.position = '';
        });
        this.currentStep = 0;
    }

    runStep(index) {
        this.cleanup(); // Clean previous step

        if (index >= this.steps.length) {
            localStorage.setItem('tour_doneV90', 'true');
            this.app.toast(this.app.L("You're ready!", "ඔබ සූදානම්!"), "Tour Complete");
            return;
        }

        this.currentStep = index;
        const s = this.steps[index];

        let el = document.querySelector(s.el);
        // Fallback for FAB if ID missing
        if (!el && s.el === '#mobile-fab') el = document.querySelector('button[onclick="app.toggleQuickMenu()"]');

        if (!el || el.offsetParent === null) { // Skip if hidden
            this.runStep(index + 1);
            return;
        }

        // Highlight Logic
        el.style.zIndex = '10002';
        el.style.position = 'relative';
        el.classList.add('tour-highlight');

        // Create Overlay
        this.overlay = document.createElement('div');
        this.overlay.className = "fixed inset-0 z-[10001] bg-black/60 backdrop-blur-sm transition-opacity duration-300";
        this.overlay.onclick = (e) => { e.stopPropagation(); }; // Block clicks

        const popover = document.createElement('div');
        popover.className = "absolute bg-white dark:bg-surface p-5 rounded-2xl shadow-2xl animate-scale w-72 z-[10003] border-t-4 border-primary-500";

        // Smart Positioning
        const rect = el.getBoundingClientRect();
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        let top, left;

        // Horizontal Center
        left = rect.left + (rect.width / 2) - 144;
        if (left < 10) left = 10;
        if (left + 288 > screenW) left = screenW - 298;

        // Vertical Placement (Prefer Top if Bottom is crowded, e.g., Mobile Nav)
        if (rect.bottom > screenH - 200) {
            // Place ABOVE element
            top = rect.top - 180;
        } else {
            // Place BELOW element
            top = rect.bottom + 20;
        }

        popover.style.top = top + 'px';
        popover.style.left = left + 'px';

        const lang = this.app.db.settings.lang;
        const title = s.title[lang] || s.title.en;
        const desc = s.desc[lang] || s.desc.en;

        popover.innerHTML = `
    < div class="flex justify-between items-start mb-2" >
                <h3 class="font-bold text-lg dark:text-white ${lang === 'si' ? 'font-sinhala' : ''}">${title}</h3>
                <span class="text-xs font-bold text-primary-600 bg-primary-100 px-2 py-1 rounded-full">${index + 1}/${this.steps.length}</span>
            </div >
            <p class="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed ${lang === 'si' ? 'font-sinhala' : ''}">${desc}</p>
            <div class="flex gap-2 justify-end pt-2 border-t dark:border-gray-700">
                <button id="tour-skip" class="text-gray-400 text-xs font-bold hover:text-red-500 px-3 py-2">Skip</button>
                <button id="tour-next" class="bg-gradient-to-r from-primary-600 to-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:scale-105 transition transform">
                    ${index === this.steps.length - 1 ? (lang === 'si' ? 'නිම කරන්න' : 'Finish') : (lang === 'si' ? 'ඊළඟ' : 'Next')}&nbsp; <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
`;

        this.overlay.appendChild(popover);
        document.body.appendChild(this.overlay);

        document.getElementById('tour-next').onclick = (e) => {
            e.stopPropagation();
            this.runStep(index + 1);
        };
        document.getElementById('tour-skip').onclick = (e) => {
            e.stopPropagation();
            this.skip();
        };
    }
}

const CATALOG_MASTER = [
    // --- RICE & GRAINS ---
    { n: "Rice (Samba)", s: "සම්බා සහල්", c: "Rice", u: "kg", p: 230, img: "fa-bowl-rice", f: 'd', bg: 'rice', cal: 360 }, // cal per 100g/unit
    { n: "Rice (Nadu)", s: "නාඩු සහල්", c: "Rice", u: "kg", p: 220, img: "fa-bowl-rice", f: 'd', bg: 'rice', cal: 350 },
    { n: "Rice (Keeri Samba)", s: "කීරි සම්බා", c: "Rice", u: "kg", p: 300, img: "fa-bowl-rice", f: 'd', bg: 'rice', cal: 365 },
    { n: "Rice (Red Raw)", s: "රතු කැකුළු", c: "Rice", u: "kg", p: 200, img: "fa-bowl-rice", f: 'd', bg: 'rice', cal: 340 },
    { n: "Rice (White Raw)", s: "සුදු කැකුළු", c: "Rice", u: "kg", p: 210, img: "fa-bowl-rice", f: 'd', bg: 'rice', cal: 350 },
    { n: "Basmati Rice", s: "බාස්මතී සහල්", c: "Rice", u: "kg", p: 650, img: "fa-bowl-rice", f: 'a', bg: 'rice_premium', cal: 370 },

    // --- VEGETABLES (Essential) ---
    { n: "Red Onions", s: "රතු ළූණු", c: "Vegetables", u: "kg", p: 450, img: "fa-onion", f: 'w', cal: 40 },
    { n: "Big Onions (B-Onions)", s: "බී ළූණු", c: "Vegetables", u: "kg", p: 380, img: "fa-onion", f: 'w', cal: 40 },
    { n: "Garlic", s: "සුදු ළූණු", c: "Vegetables", u: "kg", p: 600, img: "fa-icicles", f: 'm', cal: 149 },
    { n: "Ginger", s: "ඉඟුරු", c: "Vegetables", u: "kg", p: 800, img: "fa-carrot", f: 'm', cal: 80 },
    { n: "Potatoes", s: "අර්තාපල්", c: "Vegetables", u: "kg", p: 280, img: "fa-potato", f: 'w', cal: 77 },
    { n: "Tomatoes", s: "තක්කාලි", c: "Vegetables", u: "kg", p: 480, img: "fa-apple-whole", f: 'w', cal: 18 },
    { n: "Green Chillies", s: "අමු මිරිස්", c: "Vegetables", u: "kg", p: 800, img: "fa-pepper-hot", f: 'w', cal: 40 },
    { n: "Lime", s: "දෙහි", c: "Vegetables", u: "pcs", p: 20, img: "fa-lemon", f: 'w', cal: 30 },
    { n: "Curry Leaves", s: "කරපිංචා", c: "Vegetables", u: "bundle", p: 50, img: "fa-leaf", f: 'w', cal: 10 },
    { n: "Rampe (Pandanus)", s: "රම්පෙ", c: "Vegetables", u: "bundle", p: 50, img: "fa-leaf", f: 'w', cal: 10 },

    // --- VEGETABLES (Curry) ---
    { n: "Beans", s: "බෝංචි", c: "Vegetables", u: "kg", p: 450, img: "fa-seedling", f: 'w', cal: 31 },
    { n: "Carrots", s: "කැරට්", c: "Vegetables", u: "kg", p: 350, img: "fa-carrot", f: 'w', cal: 41 },
    { n: "Leeks", s: "ලීක්ස්", c: "Vegetables", u: "kg", p: 300, img: "fa-seedling", f: 'w', cal: 61 },
    { n: "Cabbage", s: "ගෝවා", c: "Vegetables", u: "kg", p: 220, img: "fa-seedling", f: 'w', cal: 25 },
    { n: "Pumpkin", s: "වට්ටක්කා", c: "Vegetables", u: "kg", p: 150, img: "fa-seedling", f: 'w', cal: 26 },
    { n: "Brinjal", s: "වම්බටු", c: "Vegetables", u: "kg", p: 280, img: "fa-seedling", f: 'w', cal: 25 },
    { n: "Okra (Ladies fingers)", s: "බණ්ඩක්කා", c: "Vegetables", u: "kg", p: 200, img: "fa-seedling", f: 'w', cal: 33 },
    { n: "Dhal (Mysore)", s: "පරිප්පු", c: "Dry Goods", u: "kg", p: 320, img: "fa-bowl-food", f: 'w', cal: 340 },

    // --- MEATS & FISH ---
    { n: "Chicken (Whole)", s: "කුකුළු මස් (සම්පූර්ණ)", c: "Meats", u: "kg", p: 1250, img: "fa-drumstick-bite", f: 'w', bg: 'chicken' },
    { n: "Chicken (Curry Cut)", s: "කුකුළු මස් (කෑලි)", c: "Meats", u: "kg", p: 1350, img: "fa-drumstick-bite", f: 'w', bg: 'chicken' },
    { n: "Fish (Kelawalla)", s: "කෙලවල්ලා", c: "Seafood", u: "kg", p: 1800, img: "fa-fish", f: 'w', bg: 'fish_premium' },
    { n: "Fish (Thalapath)", s: "තලපත්", c: "Seafood", u: "kg", p: 2000, img: "fa-fish", f: 'w', bg: 'fish_premium' },
    { n: "Sprats (Halmasso)", s: "හාල්මැස්සෝ", c: "Seafood", u: "kg", p: 1200, img: "fa-fish-fins", f: 'm' },
    { n: "Dried Fish (Katta)", s: "කරවල (කට්ටා)", c: "Seafood", u: "kg", p: 1800, img: "fa-fish-fins", f: 'm' },
    { n: "Canned Fish (Mackerel)", s: "ටින් මාළු", c: "Seafood", u: "can", p: 450, img: "fa-fish", f: 'a' },
    { n: "Eggs", s: "බිත්තර", c: "Meats", u: "pcs", p: 55, img: "fa-egg", f: 'w' },

    // --- SPICES & CONDIMENTS ---
    { n: "Chili Powder", s: "මිරිස් කුඩු", c: "Spices", u: "kg", p: 1200, img: "fa-pepper-hot", f: 'm' },
    { n: "Chili Flakes", s: "කෑලි මිරිස්", c: "Spices", u: "kg", p: 400, img: "fa-pepper-hot", f: 'm' },
    { n: "Turmeric Powder", s: "කහ කුඩු", c: "Spices", u: "100g", p: 250, img: "fa-vial", f: 'm' },
    { n: "Curry Powder (Roasted)", s: "බැදපු තුනපහ", c: "Spices", u: "kg", p: 600, img: "fa-vial", f: 'm' },
    { n: "Curry Powder (Raw)", s: "අමු තුනපහ", c: "Spices", u: "kg", p: 500, img: "fa-vial", f: 'm' },
    { n: "Mustard Seeds", s: "අබ ඇට", c: "Spices", u: "100g", p: 100, img: "fa-seedling", f: 'a' },
    { n: "Fenugreek", s: "උළුහාල්", c: "Spices", u: "100g", p: 120, img: "fa-seedling", f: 'a' },
    { n: "Cinnamon Sticks", s: "කුරුඳු", c: "Spices", u: "100g", p: 400, img: "fa-scroll", f: 'a' },
    { n: "Cardamom", s: "එනසාල්", c: "Spices", u: "kg", p: 800, img: "fa-seedling", f: 'a' },
    { n: "Cloves", s: "කරාබුනැටි", c: "Spices", u: "kg", p: 750, img: "fa-seedling", f: 'a' },
    { n: "Salt", s: "ලුණු", c: "Essentials", u: "kg", p: 90, img: "fa-cube", f: 'm' },
    { n: "Pepper (Black)", s: "ගම්මිරිස්", c: "Spices", u: "100g", p: 200, img: "fa-braille", f: 'm' },
    { n: "Maldive Fish", s: "උම්බලකඩ", c: "Spices", u: "kg", p: 450, img: "fa-fish-fins", f: 'm' },
    { n: "Goraka", s: "ගොරකා", c: "Spices", u: "100g", p: 200, img: "fa-cloud-meatball", f: 'a' },

    // --- COCONUT & OIL ---
    { n: "Coconut", s: "පොල්", c: "Essentials", u: "pcs", p: 120, img: "fa-circle-dot", f: 'w' },
    { n: "Coconut Oil", s: "පොල්තෙල්", c: "Essentials", u: "l", p: 650, img: "fa-bottle-droplet", f: 'm', bg: 'oil' },
    { n: "Vegetable Oil", s: "එළවළු තෙල්", c: "Essentials", u: "l", p: 850, img: "fa-bottle-droplet", f: 'm', bg: 'oil' },
    { n: "Coconut Milk (Powder)", s: "පොල් කිරිපිටි", c: "Essentials", u: "pack", p: 250, img: "fa-box", f: 'a' },
    { n: "Coconut Milk (Liquid)", s: "දියර පොල් කිරි", c: "Essentials", u: "pack", p: 280, img: "fa-box", f: 'a' },

    // --- BAKERY & SNACKS ---
    { n: "Bread (Roast)", s: "රෝස් පාන්", c: "Bakery", u: "loaf", p: 110, img: "fa-bread-slice", f: 'd', bg: 'bread' },
    { n: "Bread (Sandwich)", s: "සැන්ඩ්විච් පාන්", c: "Bakery", u: "loaf", p: 190, img: "fa-bread-slice", f: 'd', bg: 'bread' },
    { n: "Kimbula Bun", s: "කිඹුලා බනිස්", c: "Bakery", u: "pcs", p: 80, img: "fa-cookie", f: 'a' },
    { n: "Cream Cracker", s: "ක්‍රීම් ක්‍රැකර්", c: "Snacks", u: "pack", p: 350, img: "fa-cookie-bite", f: 'w' },
    { n: "Marie Biscuits", s: "මාරි බිස්කට්", c: "Snacks", u: "pack", p: 280, img: "fa-cookie-bite", f: 'w' },
    { n: "Lemon Puff", s: "ලෙමන් පෆ්", c: "Snacks", u: "pack", p: 320, img: "fa-cookie-bite", f: 'a' },

    // --- DAIRY ---
    { n: "Fresh Milk", s: "දියර කිරි", c: "Dairy", u: "l", p: 400, img: "fa-bottle-water", f: 'w', bg: 'milk_fresh' },
    { n: "Milk Powder (Full Cream)", s: "කිරිපිටි", c: "Dairy", u: "kg", p: 900, img: "fa-box-open", f: 'm', bg: 'milk_powder' },
    { n: "Yoghurt", s: "යෝගට්", c: "Dairy", u: "pcs", p: 90, img: "fa-spoon", f: 'd' },
    { n: "Butter", s: "බටර්", c: "Dairy", u: "pack", p: 850, img: "fa-cheese", f: 'm' },
    { n: "Cheese (Slices)", s: "චීස්", c: "Dairy", u: "pack", p: 950, img: "fa-cheese", f: 'a' },

    // --- FLOUR & SUGAR ---
    { n: "Wheat Flour", s: "තිරිඟු පිටි", c: "Essentials", u: "kg", p: 220, img: "fa-sack-dollar", f: 'm', bg: 'flour' },
    { n: "Rice Flour", s: "සහල් පිටි", c: "Essentials", u: "kg", p: 260, img: "fa-sack-dollar", f: 'a', bg: 'flour' },
    { n: "Kurakkan Flour", s: "කුරක්කන් පිටි", c: "Essentials", u: "kg", p: 400, img: "fa-sack-dollar", f: 'a', bg: 'flour' },
    { n: "Sugar (White)", s: "සුදු සීනි", c: "Essentials", u: "kg", p: 280, img: "fa-cubes", f: 'm', bg: 'sugar' },
    { n: "Sugar (Brown)", s: "දුඹුරු සීනි", c: "Essentials", u: "kg", p: 320, img: "fa-cubes", f: 'm', bg: 'sugar' },

    // --- BEVERAGES ---
    { n: "Tea Leaves (Dust)", s: "තේ කොළ", c: "Beverages", u: "pack", p: 200, img: "fa-leaf", f: 'm' },
    { n: "Coffee Powder", s: "කෝපි කුඩු", c: "Beverages", u: "kg", p: 600, img: "fa-mug-hot", f: 'a' },
    { n: "Milo", s: "මයිරෝ", c: "Beverages", u: "pack", p: 800, img: "fa-mug-hot", f: 'a' },
    { n: "Samaposha", s: "සමපෝෂ", c: "Beverages", u: "pack", p: 250, img: "fa-bowl-food", f: 'w' },

    // --- HOUSEHOLD ---
    { n: "Dish Wash Liquid", s: "පිඟන් සෝදන දියර", c: "Household", u: "l", p: 450, img: "fa-soap", f: 'm' },
    { n: "Washing Powder", s: "රෙදි සෝදන කුඩු", c: "Household", u: "kg", p: 500, img: "fa-soap", f: 'm' },
    { n: "Soap Bar", s: "සබන් කැටය", c: "Household", u: "pcs", p: 120, img: "fa-soap", f: 'm' },
    { n: "Toothpaste", s: "දන්තාලේප", c: "Health", u: "pcs", p: 200, img: "fa-tooth", f: 'm' }
];

const CATEGORY_TRANSLATIONS = {
    "Vegetables": "එළවළු",
    "Fruits": "පලතුරු",
    "Baby": "ළදරු නිෂ්පාදන",
    "Dairy": "කිරි නිෂ්පාදන",
    "Beverages": "පාන වර්ග",
    "Essentials": "අත්‍යවශ්‍ය ද්‍රව්‍ය",
    "Bakery": "බේකරි",
    "Household": "ගෘහස්ථ",
    "Meats": "මස්",
    "Seafood": "මුහුදු ආහාර",
    "Snacks": "කෙටි ආහාර",
    "Rice": "සහල්",
    "Spices": "කුළුබඩු",
    "Auto": "වාහන",
    "Health": "සෞඛ්‍ය",
    "Other": "වෙනත්"
};

//  RECIPES :
//  RECIPES :
// Recipes are now loaded from recipes.js to support 100+ items



// GUIDE_TEXT:
// REPLACE the existing GUIDE_TEXT constant with this:
const GUIDE_TEXT = {
    en: [
        {
            t: 'Dashboard Overview',
            d: 'Your personalized home screen. Get a quick glance at your low stock items, shopping list progress, and estimated monthly budget. Use quick access buttons for common tasks.'
        },
        {
            t: 'Inventory Management',
            d: 'Keep track of every item in your kitchen. Easily add new items, update quantities, set minimum stock alerts, and see what you have at a glance. You can also scan receipts to auto-update your stock.'
        },
        {
            t: 'Market Prices (LKR)',
            d: 'Stay informed about real-time (simulated) market prices for all common groceries. Update prices manually to ensure your budget calculations are accurate. You can also add new items not in the catalog.'
        },
        {
            t: 'Shopping List',
            d: 'Generate and manage your shopping list effortlessly. Automatically add items from AI predictions, or manually add custom items with specific quantities. Check off items as you buy them.'
        },
        {
            t: 'Cook Mode & Meal Logging',
            d: 'Choose from saved recipes and automatically deduct ingredients from your inventory after cooking. For custom meals, use "Manual Entry" to log what you cooked and the ingredients used. This data fuels the AI\'s predictions.'
        },
        {
            t: 'Smart AI Chef',
            d: 'Unleash the power of AI to convert recipes! Upload photos, PDFs, or paste text/links of any recipe. The AI will extract the steps and ingredients, then generate a dual-language recipe card for you (English & Sinhala).'
        },
        {
            t: 'Advanced Analytics & Reports',
            d: 'Gain insights into your household\'s consumption patterns. Based on your family size and meal logs, the AI predicts monthly needs and budget shortfalls. Download a comprehensive PDF report with all your data at the end of the month.'
        },
        {
            t: 'Settings & Data Management',
            d: 'Customize your app experience. Switch themes, change language, and manage your data by exporting backups or importing previous data. A factory reset option is available for fresh starts.'
        }
    ],
    si: [
        {
            t: 'මුල් පිටුවේ දළ විශ්ලේෂණය',
            d: 'ඔබගේ පුද්ගලීකරණය කළ මුල් තිරය. ඔබේ අඩු තොග අයිතම, සාප්පු ලැයිස්තුවේ ප්‍රගතිය සහ ඇස්තමේන්තුගත මාසික අයවැය පිළිබඳ ඉක්මන් දළ විශ්ලේෂණයක් ලබා ගන්න. පොදු කාර්යයන් සඳහා ඉක්මන් ප්‍රවේශ බොත්තම් භාවිතා කරන්න.'
        },
        {
            t: 'තොග කළමනාකරණය',
            d: 'ඔබේ මුළුතැන්ගෙයි ඇති සෑම අයිතමයක්ම නිරීක්ෂණය කරන්න. නව අයිතම පහසුවෙන් එක් කරන්න, ප්‍රමාණ යාවත්කාලීන කරන්න, අවම තොග ඇඟවීම් සකසන්න, සහ එකවරම ඔබේ තොගය බලන්න. බිල්පත් පරික්ෂා කර ස්වයංක්‍රීයව තොග යාවත්කාලීන කළ හැක.'
        },
        {
            t: 'වෙළඳපල මිල ගණන් (LKR)',
            d: 'සියලුම පොදු සිල්ලර බඩු සඳහා තත්‍ය කාලීන (අනුකරණය කරන ලද) වෙළඳපල මිල ගණන් පිළිබඳව දැනුවත්ව සිටින්න. ඔබේ අයවැය ගණනය කිරීම් නිවැරදි බව සහතික කිරීමට මිල ගණන් අතින් යාවත්කාලීන කරන්න. නාමාවලියෙහි නොමැති නව අයිතමද එක් කළ හැක.'
        },
        {
            t: 'සාප්පු ලැයිස්තුව',
            d: 'ඔබගේ සාප්පු ලැයිස්තුව පහසුවෙන් කළමනාකරණය කරන්න. AI අනාවැකි වලින් ස්වයංක්‍රීයව අයිතම එක් කරන්න, නැතහොත් නිශ්චිත ප්‍රමාණ සහිත අභිරුචි අයිතම අතින් එක් කරන්න. ඔබ ඒවා මිලදී ගන්නා විට අයිතම පරීක්ෂා කරන්න.'
        },
        {
            t: 'ඉවුම් පිහුම් සහ ආහාර ඇතුලත් කිරීම',
            d: 'සුරැකි වට්ටෝරු වලින් තෝරාගෙන පිසීමෙන් පසු ඔබේ තොගයෙන් අමුද්‍රව්‍ය ස්වයංක්‍රීයව අඩු කරන්න. අභිරුචි ආහාර සඳහා, ඔබ පිසූ දේ සහ භාවිතා කළ අමුද්‍රව්‍ය "Manual Entry" භාවිතයෙන් සටහන් කරන්න. මෙම දත්ත AI හි අනාවැකි සඳහා යොදා ගැනේ.'
        },
        {
            t: 'ස්මාර්ට් AI අරක්කැමියා',
            d: 'වට්ටෝරු පරිවර්තනය කිරීමට AI බලය මුදාහරින්න! ඡායාරූප, PDF උඩුගත කරන්න, නැතහොත් ඕනෑම වට්ටෝරුවක පෙළ/සබැඳි අලවන්න. AI විසින් පියවර සහ අමුද්‍රව්‍ය උපුටා ගෙන, ඉන්පසු ඔබට ද්විභාෂා වට්ටෝරු පතක් (ඉංග්‍රීසි සහ සිංහල) සාදනු ඇත.'
        },
        {
            t: 'උසස් විශ්ලේෂණ සහ වාර්තා',
            d: 'ඔබගේ නිවසේ පරිභෝජන රටා පිළිබඳ අවබෝධයක් ලබා ගන්න. ඔබේ පවුලේ ප්‍රමාණය සහ ආහාර සටහන් මත පදනම්ව, AI මාසික අවශ්‍යතා සහ අයවැය හිඟයන් පුරෝකථනය කරයි. මාසය අවසානයේ ඔබේ සියලු දත්ත සහිත සවිස්තරාත්මක PDF වාර්තාවක් බාගත කරන්න.'
        },
        {
            t: 'සැකසීම් සහ දත්ත කළමනාකරණය',
            d: 'ඔබගේ යෙදුම් අත්දැකීම අභිරුචිකරණය කරන්න. තේමා මාරු කරන්න, භාෂාව වෙනස් කරන්න, සහ උපස්ථ අපනයනය කිරීමෙන් හෝ පෙර දත්ත ආනයනය කිරීමෙන් ඔබේ දත්ත කළමනාකරණය කරන්න. නව ආරම්භයක් සඳහා කර්මාන්තශාලා යළි පිහිටුවීමේ විකල්පයක් ඇත.'
        }
    ]
};


// --- CORE APPLICATION CLASS (Combined V6.0/V7.0) ---

class SmartKitchenApp {
    constructor() {
        try {
            const savedDB = localStorage.getItem('sk_app_ultimate_v6');
            if (savedDB) { this.db = JSON.parse(savedDB); }
            else { this.db = this.defaults(); }
            this.currentFilter = 'All';
            this.currentView = '';
            this.recipes = [...RECIPES, ...(this.db.savedRecipes || [])];
            this.voice = new VoiceManager(this);
            this.tour = new TourManager(this);
            this.chat = new ChatBot(this);
            this.ds = new DataScienceEngine(); // Init DS Engine
            this.init();
        } catch (e) {
            console.error("Initialization Failed:", e);
            localStorage.removeItem('sk_app_ultimate_v6');
            this.db = this.defaults();
            document.getElementById('loader-reset-btn').style.display = 'block';
            document.getElementById('loader-hint').classList.remove('hidden');
        }
    }

    // Helper for ChatBot
    quickAdd(name, qty, unit) {
        // Check if exists
        const existing = this.db.inventory.find(i => i.n.toLowerCase().includes(name.toLowerCase()));
        if (existing) {
            existing.qty += qty;
        } else {
            // Try to find in Master Catalog for details
            const master = CATALOG_MASTER.find(m => m.n.toLowerCase().includes(name.toLowerCase()));
            this.db.inventory.push({
                id: 'item_' + Date.now(),
                n: master ? master.n : name, // Use canonical name if found
                s: master ? master.s : name,
                c: master ? master.c : 'Other',
                u: unit,
                qty: qty,
                min: 1,
                p: master ? master.p : 0,
                img: master ? master.img : 'fa-box'
            });
        }
        this.save();
        // Refresh view if on inventory
        if (this.currentView === 'inventory') this.renderInventory(document.getElementById('main-view'));
    }

    // Add inside SmartKitchenApp class
    startVoiceSearch(inputId, triggerFunction) {
        if (!('webkitSpeechRecognition' in window)) {
            this.toast("Voice not supported in this browser", "Error", "fa-microphone-slash");
            return;
        }
        const recognition = new webkitSpeechRecognition();
        recognition.lang = this.db.settings.lang === 'si' ? 'si-LK' : 'en-US';

        // Visual feedback
        const btn = document.getElementById(inputId + '-mic');
        if (btn) btn.classList.add('text-red-500', 'animate-pulse');

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            const input = document.getElementById(inputId);
            input.value = text;
            if (btn) btn.classList.remove('text-red-500', 'animate-pulse');
            // Trigger the specific search function provided
            if (typeof this[triggerFunction] === 'function') {
                this[triggerFunction]();
            } else if (triggerFunction) {
                eval(triggerFunction); // Fallback for simple inline scripts
            }
        };

        recognition.onerror = () => {
            if (btn) btn.classList.remove('text-red-500', 'animate-pulse');
        };

        recognition.start();
    }

    // Update the defaults() method:
    defaults() {
        return {
            // Automatically load ALL items from CATALOG_MASTER into inventory
            inventory: CATALOG_MASTER.map((item, idx) => ({
                id: `init_${idx} `,
                n: item.n,
                s: item.s,
                c: item.c,
                u: item.u,
                p: item.p,
                img: item.img,
                qty: 1,
                min: 0,
                exp: '',
                f: item.f || 'd',  // Default to daily if not set (legacy protection)
                bg: item.bg || ''  // Default empty group
            })),
            shopping: [],
            history: [],
            mealHistory: [],
            savedRecipes: [],
            notifications: [{ title: "System Ready", msg: "Welcome to Kitchen AI Ultimate.", date: new Date().toLocaleTimeString() }],
            settings: { theme: 'light', lastSync: null, lang: 'en', firstRun: true, firstFamily: true },
            familyDetails: null,
            analytics: { predictions: {}, monthlyNeed: {}, totalDailyUsage: 0, totalMonthlyNeedValue: 0 },
            preferences: {
                diet: 'non-veg', // non-veg, veg, vegan
                blockedCats: [],
                allowedItems: [], // Specific item IDs allowed
                targetBudget: 60000 // Default baseline
            }
        };
    }

    save() { localStorage.setItem('sk_app_ultimate_v6', JSON.stringify(this.db)); }

    reloadConfig() {
        const configStr = localStorage.getItem('app_config');
        if (!configStr) return;

        const config = JSON.parse(configStr);

        // 1. Theme Color
        if (config.themeColor) {
            document.documentElement.style.setProperty('--primary-color', config.themeColor);
            // Also update meta theme-color for mobile browsers
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', config.themeColor);
        }

        // 2. Force Dark
        if (config.forceDark) {
            document.documentElement.classList.add('dark');
        } else if (config.forceDark === false) {
            document.documentElement.classList.remove('dark');
        }

        // 3. Settings in DB
        if (!this.db.settings) this.db.settings = { lang: 'en', currency: 'LKR', units: 'metric' };

        if (config.currency) this.db.settings.currency = config.currency;
        if (config.units) this.db.settings.units = config.units;

        // 4. Animation Speed (Global Override)
        if (config.animSpeed !== undefined) {
            const speed = parseFloat(config.animSpeed);
            let style = document.getElementById('anim-speed-style');
            if (!style) {
                style = document.createElement('style');
                style.id = 'anim-speed-style';
                document.head.appendChild(style);
            }
            if (speed === 0) {
                style.innerHTML = `*, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; }`;
            } else {
                // Base is ~0.3s. If config is '2' (Slow), we want 0.6s. If '0.5' (Fast), 0.15s.
                // We apply a multiplier to standard tailwind durations? No, easier to just force a default transition speed
                // IF the element has a transition class.
                // But simply, let's just scale the 'standard' usage.
                // Actually, simpler:
                // "1" = Normal.
                const duration = 0.3 * speed;
                style.innerHTML = `:root { --transition-speed: ${duration}s; }`;
                // Note: This requires CSS vars in style.css or tailwind config, which we don't easily have.
                // Let's go with the blunt force for now as it's an "Admin Override" feature.
                if (speed !== 1) {
                    style.innerHTML = `* { transition-duration: ${duration}s !important; } .animate-spin { animation-duration: ${1 / speed}s !important; }`;
                } else {
                    style.innerHTML = '';
                }
            }
        }
    }

    // --- GENERAL UTILITIES (Combined/Updated) ---
    // ...

    initializeErrorHandler() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            console.error('Global Error caught by App:', msg, 'at', lineNo, ':', columnNo);
            const loaderReset = document.getElementById('loader-reset-btn');
            const loaderHint = document.getElementById('loader-hint');

            if (loaderReset) loaderReset.style.display = 'block';
            if (loaderHint) loaderHint.classList.remove('hidden');

            // Optional: Toast for user visibility if app is partially loaded
            // We verify 'this.toast' exists because if the error happens during constructor/init, 'this' might be unstable? 
            // Actually 'this' is bound to the instance here.
            if (typeof this.toast === 'function') {
                this.toast("System Error: " + msg, "Critical", "fa-triangle-exclamation");
            }

            return false; // Let default handler run if needed, or true to suppress
        };

        window.onunhandledrejection = (event) => {
            console.error("Unhandled Promise Rejection:", event.reason);
        };
    }

    initializeErrorHandler() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            console.error('Global Error caused by App:', msg, 'at', lineNo, ':', columnNo);
            const loaderReset = document.getElementById('loader-reset-btn');
            const loaderHint = document.getElementById('loader-hint');

            if (loaderReset) loaderReset.style.display = 'block';
            if (loaderHint) loaderHint.classList.remove('hidden');

            if (typeof this.toast === 'function') {
                this.toast("System Error: " + msg, "Critical", "fa-triangle-exclamation");
            }

            // Force hide loader if stuck
            const loader = document.getElementById('loader');
            if (loader && !loader.classList.contains('hidden')) {
                // loader.classList.add('hidden'); // Optional: auto-hide
            }
            return false;
        };
    }

    // Localization Helper
    L(en, si) {
        if (this.db && this.db.settings && this.db.settings.lang === 'si' && si) {
            return si;
        }
        return en;
    }

    init() {
        try {
            this.initializeErrorHandler(); // Call the error handler initialization
            this.setTheme(this.db.settings.theme);
            this.renderDesktopNav();
            this.calculatePredictions();
            this.renderNotifications();
            this.toggleNotifications(false); // Hide panel initially

            // Real-time Configuration & Sync Listener
            window.addEventListener('storage', (e) => {
                if (e.key === 'app_config') {
                    console.log("Config changed, reloading...");
                    this.reloadConfig();
                    // Also reload AI knowledge to pick up personality
                    if (this.chat && this.chat.reloadKnowledge) this.chat.reloadKnowledge();
                }
                if (e.key === 'sk_app_ultimate_v6') {
                    // DB Sync
                    const saved = localStorage.getItem(e.key);
                    if (saved) {
                        this.db = JSON.parse(saved);
                        this.currentView === 'inventory' ? this.renderInventory(document.getElementById('main-view')) : null;
                    }
                }
            });
            this.reloadConfig();

            // Initialize Error Handler
            this.initializeErrorHandler();

            const loader = document.getElementById('loader');
            loader.classList.add('opacity-0', 'pointer-events-none');

            setTimeout(() => {
                loader.classList.add('hidden');
                if (this.db.settings.firstRun) { this.showGuide(this.db.settings.lang); }
                else {
                    // Wizard Check
                    if (!this.db.preferences.grocerySetupDone && typeof GroceryWizard !== 'undefined') {
                        try {
                            setTimeout(() => new GroceryWizard(this).start(), 1500);
                        } catch (err) {
                            console.error("Wizard Launch Failed:", err);
                        }
                    }
                    // Start Page Logic
                    const config = JSON.parse(localStorage.getItem('app_config') || '{}');
                    const startPage = config.startPage || 'dashboard';
                    this.nav(startPage);

                    setTimeout(() => this.tour.start(), 1500); // Slight delay for safety
                }
            }, 500);

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('sw.js')
                    .then(reg => console.log('SW Registered'))
                    .catch(err => console.log('SW Fail', err));
            }

            // Offline/Online Listeners
            window.addEventListener('online', () => {
                this.toast("You are back online!", "Connected", "fa-wifi");
                const b = document.getElementById('offline-badge');
                if (b) b.remove();
            });
            window.addEventListener('offline', () => {
                this.toast("You are offline. App will work from cache.", "No Internet", "fa-wifi-slash");
                this.updateNavUI(this.currentView); // Trigger badge
            });

        } catch (e) {
            console.error("Init Error:", e);
            document.getElementById('loader').classList.add('hidden');
            this.toast("Startup Error: " + e.message, "System", "fa-bug");
        }
    }

    showModal(t, h) {
        document.getElementById('modal-title').innerText = t;
        document.getElementById('modal-body').innerHTML = h;
        document.getElementById('modal').classList.add('flex');
        document.getElementById('modal').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('modal').classList.add('hidden');
        document.getElementById('modal').classList.remove('flex');
    }

    setTheme(t) {
        if (t === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        this.db.settings.theme = t;
        this.save();
    }

    toggleTheme() { this.setTheme(this.db.settings.theme === 'light' ? 'dark' : 'light'); }

    toast(msg, title = 'Info', icon = 'fa-check-circle') { // V6.0 toast with V7.0 positioning logic
        const t = document.getElementById('toast');
        document.getElementById('toast-title').innerText = title;
        document.getElementById('toast-msg').innerText = msg;
        document.getElementById('toast-icon').className = `fa - solid ${icon} text - primary - 500 text - xl`;
        t.classList.remove('opacity-0', '-translate-y-10');
        t.classList.add('opacity-100');
        setTimeout(() => { t.classList.add('opacity-0', '-translate-y-10'); t.classList.remove('opacity-100'); }, 3000);
    }

    // --- MEAL PLANNER (Phase 2) ---
    // Generates a random weekly plan based on available ingredients and frequency

    generateMealPlan() {
        // Simple heuristic: 
        // 1. Get all recipes
        // 2. Filter recipes where we have > 50% ingredients
        // 3. Select 7 distinct meals

        const availableRecipes = this.recipes.filter(r => {
            // Check ingredient match strength
            if (!r.ing) return true; // No ingredients listed? assume available
            let have = 0;
            r.ing.forEach(ing => {
                if (this.db.inventory.some(i => i.n.toLowerCase().includes(ing.n.toLowerCase()) && i.qty > 0)) have++;
            });
            return (have / r.ing.length) > 0.3; // Very lenient matching for now
        });

        // Shuffle
        const shuffled = availableRecipes.sort(() => 0.5 - Math.random());
        const plan = shuffled.slice(0, 7).map((r, i) => ({
            day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
            meal: r
        }));

        this.db.mealPlan = plan; // Store in DB
        this.save();
        this.showMealPlanModal(plan);
    }

    showMealPlanModal(plan) {
        const html = `
    < div class="space-y-4" >
                <div class="grid gap-3">
                    ${plan.map(p => `
                        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border dark:border-gray-700">
                            <span class="w-10 font-bold text-center text-primary-600">${p.day}</span>
                            <div class="flex-1">
                                <h4 class="font-bold dark:text-white text-sm">${p.meal.n}</h4>
                                <div class="flex gap-2 text-xs text-gray-500">
                                    <span>${this.L('Dinner', 'රාත්‍රී ආහාරය')}</span>
                                    <span class="text-orange-500 font-bold"><i class="fa-solid fa-fire"></i> ~${this.calculateMealCalories(p.meal)} kcal</span>
                                </div>
                            </div>
                            <button onclick="app.nav('cook'); app.closeModal()" class="text-xs bg-white dark:bg-gray-700 px-3 py-1 rounded-lg border dark:border-gray-600 shadow-sm">${this.L('Cook', 'උයන්න')}</button>
                        </div>
                    `).join('')}
                </div>
                <div class="flex gap-3 mt-4">
                     <button onclick="app.addPlanToShop()" class="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg hover:bg-primary-700">
                        <i class="fa-solid fa-cart-plus mr-2"></i> ${this.L('Add Missing to Shop', 'අවශ්‍ය දේ ලැයිස්තුගත කරන්න')}
                     </button>
                      <button onclick="app.exportPlanPDF()" class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600">
                        <i class="fa-solid fa-file-pdf mr-2"></i> PDF
                     </button>
                </div>
            </div >
    `;
        this.showModal(this.L('Weekly Meal Plan', 'සතිපතා ආහාර සැලැස්ම'), html);
    }

    calculateMealCalories(meal) {
        if (!meal.ing) return 300; // default estimate
        let total = 0;
        // Basic heuristic: sum up ingredients if they match catalog
        // Assuming recipe amts are effectively 1 serving or scaling per serving
        // For MVP, we'll assign a base + ingredient modifiers

        meal.ing.forEach(ing => {
            const master = CATALOG_MASTER.find(m => m.n === ing.n);
            if (master && master.cal) {
                // assume 100g serving per ingredient per person for simplicity in MVP
                total += master.cal;
            }
        });
        return total > 0 ? total : 450;
    }

    addPlanToShop() {
        if (!this.db.mealPlan) return;
        let count = 0;
        this.db.mealPlan.forEach(p => {
            if (p.meal.ing) {
                p.meal.ing.forEach(ing => {
                    // Check if we have it
                    const exists = this.db.inventory.some(inv => inv.n.toLowerCase().includes(ing.n.toLowerCase()) && inv.qty > 0.2);
                    if (!exists) {
                        this.addToShoppingList(ing.n, 1, ing.u || 'kg');
                        count++;
                    }
                });
            }
        });
        this.closeModal();
        this.nav('shopping');
        this.toast(`Added ${count} items to shopping list`, 'Planned', 'fa-cart-shopping');
    }

    exportPlanPDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.text("Weekly Meal Plan", 20, 20);

            doc.setFontSize(12);
            let y = 40;
            this.db.mealPlan.forEach(p => {
                doc.text(`${p.day}: ${p.meal.n} `, 20, y);
                y += 10;
            });

            doc.save("meal-plan.pdf");
            this.toast("PDF Downloaded", "Export", "fa-file-pdf");
        } catch (e) {
            console.error(e);
            this.toast("PDF Error", "Failed", "fa-triangle-exclamation");
        }
    }

    shareWhatsApp(text) {
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }

    // --- NOTIFICATIONS (V6.0 Feature) ---

    addNotification(title, msg) {
        this.db.notifications.unshift({ title, msg, date: new Date().toLocaleTimeString() });
        if (this.db.notifications.length > 5) this.db.notifications.pop();
        this.save();
        this.renderNotifications();
        document.getElementById('header-notif').classList.remove('hidden');
    }

    renderNotifications() {
        const list = document.getElementById('notif-list');
        const html = this.db.notifications.length ?
            this.db.notifications.map(n =>
                `<div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <h4 class="font-bold text-sm dark:text-white">${n.title}</h4>
                            <p class="text-xs text-gray-500 dark:text-gray-400">${n.msg} <span class="float-right">${n.date}</span></p>
                        </div>`
            ).join('') :
            '<p class="text-center text-gray-400 p-4 text-sm">No new notifications.</p>';
        list.innerHTML = html;
        if (this.db.notifications.length > 0) document.getElementById('header-notif').classList.remove('hidden');
        else document.getElementById('header-notif').classList.add('hidden');
    }

    toggleNotifications(state) {
        const panel = document.getElementById('notif-panel');
        if (state === false || panel.classList.contains('hidden')) {
            panel.classList.remove('hidden');
            document.getElementById('header-notif').classList.add('hidden');
        } else {
            panel.classList.add('hidden');
        }
    }

    // --- NEW: QUICK ACTION MENU ---
    /**
     * Toggles the visibility of the Quick Action Menu Modal.
     * This modal is typically triggered by the central FAB (Floating Action Button) 
     * on the mobile navigation bar.
     */
    toggleQuickMenu() {
        const modal = document.getElementById('quick-menu-modal');
        modal.classList.toggle('hidden');
    }


    // --- ONBOARDING / GUIDE (V6.0/V7.0 combined) ---

    showGuide(lang) {
        this.setGuideLang(lang);
        document.getElementById('guide-modal').classList.remove('hidden');
    }

    // ... The rest of your class continues here ...

    setGuideLang(lang) { // V7.0 method
        this.db.settings.lang = lang;
        this.save();

        document.getElementById('guide-modal-title').innerText = this.L('Welcome!', 'සාදරයෙන් පිළිගනිමු!');
        document.getElementById('guide-modal-desc').innerText = this.L('This short guide will help you understand the core features.', 'මෙම කෙටි මාර්ගෝපදේශය ප්‍රධාන අංග තේරුම් ගැනීමට ඔබට උපකාරී වනු ඇත.');

        const contentEl = document.getElementById('guide-content');
        const en = lang === 'en';

        const contentHtml = GUIDE_TEXT[lang].map(c => `
                    <div class="bg-white dark:bg-surface p-1 rounded-2x1 shadow-sm border-l-4 border-primary-500">
                        <h3 class="font-bold text-lg dark:text-white ${en ? '' : 'font-sinhala'}">${c.t}</h3>
                        <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm ${en ? '' : 'font-sinhala'}">${c.d}</p>
                    </div>
                `).join('');

        contentEl.innerHTML = contentHtml;
        contentEl.classList.remove('hidden');

        document.getElementById('guide-finish-container').classList.remove('hidden');
        document.getElementById('guide-finish-btn').innerText = this.L('Get Started', 'ආරම්භ කරන්න');
    }

    finishGuide() { // V7.0 method
        document.getElementById('guide-modal').classList.add('hidden');
        // Chain to Onboarding
        this.showOnboardingWizard();
    }

    // --- NAVIGATION ROUTER (V6.0/V7.0 combined) ---

    updateNavUI(view) {
        this.currentView = view;
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.nav-btn i').forEach(el => el.classList.replace('text-primary-600', 'text-gray-400'));
        document.querySelectorAll('.nav-btn span').forEach(el => el.classList.replace('text-primary-600', 'text-gray-500'));

        const activeBtn = document.querySelector(`button[onclick="app.nav('${view}')"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            if (activeBtn.querySelector('i')) activeBtn.querySelector('i').classList.replace('text-gray-400', 'text-primary-600');
            if (activeBtn.querySelector('span')) activeBtn.querySelector('span').classList.replace('text-gray-500', 'text-primary-600');
        }

        // Offline Check (V8.0)
        let offlineBadge = document.getElementById('offline-badge');
        if (!navigator.onLine) {
            if (!offlineBadge) {
                const badge = document.createElement('div');
                badge.id = 'offline-badge';
                badge.className = "fixed top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-[99999] animate-pulse";
                badge.innerHTML = '<i class="fa-solid fa-wifi-slash mr-2"></i> OFFLINE MODE';
                document.body.appendChild(badge);
            }
        } else {
            if (offlineBadge) offlineBadge.remove();
        }
    }

    renderNav(view) {
        const nav = document.getElementById('bottom-nav');
        if (!nav) return;

        // Configuration
        const config = JSON.parse(localStorage.getItem('app_config') || '{}');
        const allTabs = config.masterTabs || [
            { id: 'dashboard', name: 'Home', i: 'fa-chart-pie' },
            { id: 'chat', name: 'Assistant', i: 'fa-message' },
            { id: 'inventory', name: 'Stock', i: 'fa-box-open' },
            { id: 'market', name: 'Market', i: 'fa-shop' },
            { id: 'shopping', name: 'Shop', i: 'fa-cart-shopping' },
            { id: 'cook', name: 'Cook', i: 'fa-fire' },
            { id: 'ai', name: 'AI Chef', i: 'fa-robot' },
            { id: 'training', name: 'Training', i: 'fa-brain' },
            { id: 'analytics', name: 'Data', i: 'fa-chart-line' },
            { id: 'settings', name: 'Settings', i: 'fa-gear' },
            { id: 'help', name: 'Help', i: 'fa-circle-question' }
        ];

        // Mobile Config
        const mobil = config.mobileNav || {
            primary: ['dashboard', 'inventory', 'cook', 'shopping'],
            enabled: allTabs.map(t => t.id)
        };

        // 1. Get Primary Tabs (using config)
        const primaryIds = mobil.primary || ['dashboard', 'inventory', 'cook', 'shopping'];
        // Fallback filter
        const primaryTabs = allTabs.filter(t => primaryIds.includes(t.id));

        // 3. Render HTML
        let html = '<div class="flex justify-between items-center h-full px-2 w-full">';

        // We usually split tabs around a central FAB spacer if there is one.
        // Existing code had a spacer. Ideally we dynamically split.
        // If 4 items, 2 left, 2 right.

        const midPoint = Math.ceil(primaryTabs.length / 2);
        const leftTabs = primaryTabs.slice(0, midPoint);
        const rightTabs = primaryTabs.slice(midPoint);

        const renderBtn = (t) => {
            const active = view === t.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300';
            const bg = view === t.id ? 'bg-primary-50 dark:bg-primary-900/20' : '';
            return `
            <button onclick="app.nav('${t.id}')" class="flex flex-col items-center justify-center w-full h-full space-y-1 ${active} group relative">
                <div class="p-1.5 rounded-xl ${bg} transition-all duration-300 group-active:scale-95">
                    <i class="fa-solid ${t.icon || t.i} text-xl transition-transform group-hover:-translate-y-1"></i>
                </div>
                <span class="text-[10px] font-bold tracking-wide">${t.name}</span>
                ${view === t.id ? '<span class="absolute -bottom-1 w-1 h-1 bg-primary-600 rounded-full"></span>' : ''}
            </button>
            `;
        };

        leftTabs.forEach(t => html += renderBtn(t));

        // Spacer
        html += '<div class="w-16 shrink-0"></div>';

        rightTabs.forEach(t => html += renderBtn(t));

        // "More" Button
        html += `
        <button onclick="app.toggleMoreMenu()" class="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 group relative">
             <div class="p-1.5 rounded-xl transition-all duration-300 group-active:scale-95">
                <i class="fa-solid fa-bars text-xl transition-transform group-hover:rotate-180"></i>
            </div>
            <span class="text-[10px] font-bold tracking-wide">${this.L('More', 'තව')}</span>
        </button>
        `;

        html += '</div>';

        // AI Quick Action (FAB)
        this.renderFAB();
        // Render MORE modal using updated config
        this.renderMoreModal(allTabs, mobil, view);

        nav.innerHTML = html;

        // Ensure FAB is above/concurrent
        this.renderFAB();
    }

    renderMoreModal(allTabs, mobileConfig, currentView) {
        let modal = document.getElementById('nav-more-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'nav-more-modal';
            modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex flex-col justify-end opacity-0 transition-opacity duration-300';
            modal.onclick = (e) => { if (e.target === modal) this.toggleMoreMenu(); };
            document.body.appendChild(modal);
        }

        // Use passed config or fallback
        const enabledIds = mobileConfig?.enabled || allTabs.map(t => t.id);
        const primaryIds = mobileConfig?.primary || [];

        // Show enabled items that are NOT in primary
        const tabsToShow = allTabs.filter(t => enabledIds.includes(t.id) && !primaryIds.includes(t.id));

        const gridHtml = tabsToShow.map(t => `
            <button onclick="app.nav('${t.id}'); app.toggleMoreMenu()" 
                class="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 active:bg-gray-200 dark:active:bg-gray-700 transition space-y-2 ${t.id === currentView ? 'ring-2 ring-primary-500' : ''}">
                <div class="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm text-primary-600 dark:text-primary-400">
                    <i class="fa-solid ${t.icon || t.i} text-lg"></i>
                </div>
                <span class="text-xs font-bold text-gray-700 dark:text-gray-300">${t.name}</span>
            </button>
        `).join('');

        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-900 rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transform transition-transform duration-300 translate-y-full" id="more-menu-content">
                <div class="flex justify-center mb-6">
                    <div class="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4 px-2">More Apps</h3>
                <div class="grid grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                    ${gridHtml.length ? gridHtml : '<p class="text-gray-400 col-span-4 text-center py-4">No other apps enabled.</p>'}
                </div>
                <button onclick="app.toggleMoreMenu()" class="mt-6 w-full py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-gray-600 dark:text-gray-400">Close</button>
            </div>
        `;
    }

    toggleMoreMenu() {
        const modal = document.getElementById('nav-more-modal');
        const content = document.getElementById('more-menu-content');
        if (modal) {
            if (modal.classList.contains('hidden')) {
                modal.classList.remove('hidden');
                // Small delay for animation
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    if (content) content.classList.remove('translate-y-full');
                }, 10);
            } else {
                modal.classList.add('opacity-0');
                if (content) content.classList.add('translate-y-full');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }
        }
    }

    renderDesktopNav() {
        // Configuration
        const config = JSON.parse(localStorage.getItem('app_config') || '{}');
        const allTabs = config.masterTabs || [
            { id: 'dashboard', name: 'Home', i: 'fa-chart-pie' },
            { id: 'chat', name: 'Assistant', i: 'fa-message' },
            { id: 'inventory', name: 'Stock', i: 'fa-box-open' },
            { id: 'market', name: 'Market', i: 'fa-shop' },
            { id: 'shopping', name: 'Shop', i: 'fa-cart-shopping' },
            { id: 'cook', name: 'Cook', i: 'fa-fire' },
            { id: 'ai', name: 'AI Chef', i: 'fa-robot' },
            { id: 'training', name: 'Training', i: 'fa-brain' },
            { id: 'analytics', name: 'Data', i: 'fa-chart-line' },
            { id: 'settings', name: 'Settings', i: 'fa-gear' },
            { id: 'help', name: 'Help', i: 'fa-circle-question' }
        ];

        // PC Config
        const pc = config.pcNav || {
            enabled: ['dashboard', 'inventory', 'cook', 'shopping', 'ai', 'settings']
        };

        // Filter only active tabs for Desktop sidebar
        const visibleTabs = allTabs.filter(t => pc.enabled.includes(t.id));

        const menuEl = document.getElementById('desktop-menu');
        if (menuEl) {
            menuEl.innerHTML = visibleTabs.map(x => `
                <button onclick="app.nav('${x.id}')" class="flex items-center gap-3 w-full p-3 rounded-xl transition ${this.currentView === x.id ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700'}">
                    <i class="fa-solid ${x.icon || x.i} text-xl w-6"></i>
                    <span class="font-medium ${this.db.settings.lang === 'si' ? 'font-sinhala' : ''}">${x.name || x.label || this.L(x.name, x.name)}</span>
                </button>
            `).join('');
        }
    }

    renderFAB() {
        // We'll inject the FAB into the bottom-nav container or a fixed overlay.
        // Since renderNav clears innerHTML, we should append this AFTER.
        // But better: Create a dedicated container for FAB in index.html or use Fixed positioning independent of nav flow, 
        // OR inject into the spacer div we created.

        // Let's use a fixed position button that sits perfectly over the nav spacer.
        let fab = document.getElementById('nav-fab');
        if (!fab) {
            fab = document.createElement('button');
            fab.id = 'nav-fab';
            fab.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-14 h-14 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-full shadow-lg shadow-primary-600/40 text-white flex items-center justify-center text-2xl active:scale-90 transition duration-300';
            fab.onclick = () => this.toggleQuickMenu();
            fab.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i>';
            document.body.appendChild(fab);
        }

        // Ensure it's visible on Mobile, hidden on Desktop (handled by CSS media queries usually, but this is JS)
        if (window.innerWidth >= 768) {
            fab.classList.add('hidden');
        } else {
            fab.classList.remove('hidden');
        }
    }

    nav(view) {
        const el = document.getElementById('main-view');
        if (!el) return;
        el.classList.remove('animate-fade-in');
        void el.offsetWidth; // Reflow
        el.classList.add('animate-fade-in');

        this.updateNavUI(view);
        this.renderNav(view); // Call the new renderNav for bottom navigation
        this.renderDesktopNav(); // Update desktop sidebar active state

        // Hide floating widget if in chat tab
        const widget = document.getElementById('chat-widget');
        if (widget) {
            if (view === 'chat') widget.classList.add('hidden');
            else widget.classList.remove('hidden');
        }

        const routes = {
            dashboard: () => this.renderDashboard(el),
            chat: () => this.renderChatTab(el), // Route for Chat Tab
            inventory: () => this.renderInventory(el),
            shopping: () => this.renderShopping(el),
            ai: () => this.renderAI(el),
            cook: () => this.renderCook(el),
            analytics: () => this.renderAnalytics(el),
            settings: () => this.renderSettings(el),
            help: () => this.renderHelp(el),
            market: () => this.renderMarket(el),
        };

        if (routes[view]) routes[view]();
    }

    // --- NEW: RENDER CHAT TAB (V10.2 UI Polish) ---
    renderChatTab(el) {
        el.innerHTML = `
        <div class="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800 overflow-hidden animate-fade-in relative">
            <!-- Header -->
            <div class="p-4 bg-white/90 dark:bg-gray-900/90 border-b dark:border-gray-800 flex justify-between items-center shrink-0 z-10 backdrop-blur-md">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/20">
                        <i class="fa-solid fa-robot"></i>
                    </div>
                    <div>
                        <h2 class="font-bold text-xl text-gray-800 dark:text-white tracking-tight">${this.L('Kitchen Assistant', 'මුළුතැන්ගෙයි සහායක')}</h2>
                        <div class="flex items-center gap-2">
                             <span class="flex h-2 w-2 relative">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <p class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Online</p>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                     <button onclick="app.chat.clearHistory()" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition" title="Clear Chat">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    <button onclick="app.nav('settings')" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">
                        <i class="fa-solid fa-sliders"></i>
                    </button>
                </div>
            </div>

            <!-- Messages Container -->
            <div id="tab-chat-messages" class="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 scroll-smooth bg-gray-50/50 dark:bg-[#0a0a0a]">
                <!-- Welcome State -->
                <div class="flex flex-col items-center justify-center py-10 opacity-60">
                    <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-4xl mb-4 grayscale hover:grayscale-0 transition duration-500">
                        👨‍🍳
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 font-medium text-sm">How can I help you cook today?</p>
                </div>

                <div class="flex justify-start animate-slide-up">
                     <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl rounded-tl-none border dark:border-gray-700 shadow-sm text-sm dark:text-gray-200 max-w-[90%] md:max-w-[75%] leading-relaxed">
                        <p class="mb-2 font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Hello Chef! 👋</p>
                        I'm your AI Kitchen Assistant. I can help you find recipes, plan meals, or answer cooking questions.
                    </div>
                </div>
            </div>

            <!-- Quick Chips -->
            <div id="chat-chips" class="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar mask-gradient md:justify-center bg-gray-50/50 dark:bg-[#0a0a0a]">
                 <!-- Chips injected via JS -->
            </div>

            <!-- Input Area -->
            <div class="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800 shrink-0 relative z-10 pb-6 md:pb-4">
                <div class="flex gap-2 relative bg-gray-100 dark:bg-gray-800/80 p-2 rounded-[2rem] border border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus-within:ring-2 ring-indigo-500/30 transition shadow-inner">
                    <input type="text" id="tab-chat-input" 
                        placeholder="${this.L('Ask for a recipe, tip, or idea...', 'වට්ටෝරුවක් හෝ උපදෙසක් අසන්න...')}" 
                        class="flex-1 bg-transparent border-none px-4 py-2 text-base focus:ring-0 dark:text-white placeholder-gray-400"
                        autocomplete="off"
                        onkeypress="if(event.key === 'Enter') app.chat.send(true)">
                    
                    <button onclick="app.chat.send(true)" class="bg-indigo-600 text-white w-12 h-12 rounded-full hover:bg-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30 transition transform active:scale-95 shrink-0">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
        // Init Chips
        if (this.chat && this.chat.renderChips) this.chat.renderChips('chat-chips');

        // Scroll to bottom
        const container = document.getElementById('tab-chat-messages');
        if (container) container.scrollTop = container.scrollHeight;

        // Focus Input
        setTimeout(() => document.getElementById('tab-chat-input')?.focus(), 500);
    }

    // --- VIEW RENDER FUNCTIONS ---

    statCard(label, val, icon, colorClass, clickAction = null) { // V6.0/V7.0 combined
        const cursor = clickAction ? 'cursor-pointer hover:-translate-y-1 transition duration-300' : '';
        const onClick = clickAction ? `onclick="${clickAction}"` : '';
        return `
                    <div ${onClick} class="bg-white dark:bg-surface p-4 rounded-2xl shadow-sm border dark:border-gray-800 flex flex-col items-center justify-center text-center ${cursor}">
                        <div class="w-10 h-10 rounded-full ${colorClass} flex items-center justify-center mb-2"><i class="fa-solid ${icon}"></i></div>
                        <h3 class="text-2xl font-bold dark:text-white">${val}</h3>
                        <p class="text-xs text-gray-500 uppercase font-bold">${this.L(label, label)}</p>
                    </div>
                `;
    }

    calculatePredictions() {
        let estCost = 0;
        let lowStockCount = 0;

        this.db.inventory.forEach(item => {
            const master = CATALOG_MASTER.find(m => m.n === item.n) || {};
            const freq = master.f || 'w';
            let baseNeed = 0;

            if (item.n.includes('Bread (')) {
                baseNeed = 10;
            } else {
                if (freq === 'd') baseNeed = 5;
                else if (freq === 'w') baseNeed = 2;
                else if (freq === 'm') baseNeed = 1;
            }

            if (item.qty < baseNeed * 0.3) {
                lowStockCount++;
                estCost += (baseNeed - item.qty) * item.p;
            }
        });

        estCost = Math.ceil(estCost * 1.1);
        this.db.predictions = {
            nextShopDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toDateString(),
            estCost: estCost,
            lowStockCtx: lowStockCount
        };

        if (!this.db.analytics) this.db.analytics = {};
        this.db.analytics.totalMonthlyNeedValue = estCost;
        this.save();
    }

    renderDashboard(el) {
        if (this.db.settings.firstFamily) { this.showFamilyDetailsModal(); }

        const hour = new Date().getHours();
        const greeting = hour < 12 ? this.L('Good Morning', 'සුභ උදෑසනක්') : hour < 18 ? this.L('Good Afternoon', 'සුභ දහවල් කාලයක්') : this.L('Good Evening', 'සුභ සැන්දෑවක්');

        // Stats
        const lowStock = this.db.inventory.filter(i => i.qty <= i.min);
        const shopCount = this.db.shopping.length;
        const monthlyEst = Math.round(this.db.analytics.totalMonthlyNeedValue || 0).toLocaleString();

        el.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6 pb-24 animate-fade-in">
            <!-- Header Section -->
            <div class="flex justify-between items-end px-2">
                <div>
                    <p class="text-sm text-gray-500 font-medium">${new Date().toDateString()}</p>
                    <h1 class="text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">
                        ${greeting}, <br><span class="text-primary-600">Chef!</span>
                    </h1>
                </div>
                <div onclick="app.nav('analytics')" class="bg-white dark:bg-surface p-2 rounded-2xl shadow-sm border dark:border-gray-700 cursor-pointer">
                     <div class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><i class="fa-solid fa-chart-pie"></i></div>
                </div>
            </div>

            <!-- Main Status Card -->
            <div class="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <i class="fa-solid fa-coins absolute -right-6 -bottom-6 text-9xl opacity-10"></i>
                <div class="relative z-10">
                    <p class="text-primary-100 text-sm font-medium mb-1">${this.L('Est. Monthly Budget Need', 'ඇස්තමේන්තුගත මාසික අයවැය')}</p>
                    <h2 class="text-4xl font-bold mb-4">LKR ${monthlyEst}</h2>
                    <div class="flex gap-3">
                        <button onclick="app.nav('analytics')" class="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold transition">
                            ${this.L('View Report', 'වාර්තාව බලන්න')}
                        </button>
                        <button onclick="app.nav('market')" class="bg-white text-primary-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition">
                            ${this.L('Update Prices', 'මිල යාවත්කාලීන කරන්න')}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Quick Access Grid -->
            <div>
                <h3 class="font-bold text-lg dark:text-white px-2 mb-3">${this.L('Quick Access', 'ඉක්මන් පිවිසුම')}</h3>
                <div class="grid grid-cols-4 gap-3 mb-6">
                    ${this.dashboardBtn('Scan', 'fa-camera', 'bg-purple-100 text-purple-600', 'app.toggleOCRModal()')}
                    ${this.dashboardBtn('Cook', 'fa-fire', 'bg-orange-100 text-orange-600', 'app.nav(\'cook\')')}
                    ${this.dashboardBtn('Shop', 'fa-cart-shopping', 'bg-blue-100 text-blue-600', 'app.nav(\'shopping\')')}
                    ${this.dashboardBtn('Add', 'fa-plus', 'bg-gray-100 text-gray-600', 'app.openItemModal()')}
                </div>
                
                 <!-- Charts Shortcut -->
                 <h3 class="font-bold text-lg dark:text-white px-2 mb-3">${this.L('Inventory Value', 'තොග වටිනාකම')}</h3>
                 <div class="bg-white dark:bg-surface p-4 rounded-3xl shadow-sm border dark:border-gray-700 h-48 mb-6">
                    <canvas id="dashboardChart"></canvas>
                 </div>
            </div>

            <!-- Alerts / Notifications -->
            <div class="grid md:grid-cols-2 gap-4">
                <!-- Low Stock Alert -->
                <div onclick="app.nav('inventory')" class="bg-white dark:bg-surface p-5 rounded-3xl shadow-sm border dark:border-gray-700 cursor-pointer hover:shadow-md transition relative overflow-hidden group">
                    <div class="absolute right-0 top-0 p-5 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110">
                        <i class="fa-solid fa-triangle-exclamation text-6xl text-red-500"></i>
                    </div>
                    <div class="flex flex-col h-full justify-between relative z-10">
                        <div class="w-10 h-10 rounded-full ${lowStock.length > 0 ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'} flex items-center justify-center mb-2">
                            <i class="fa-solid ${lowStock.length > 0 ? 'fa-triangle-exclamation' : 'fa-check'}"></i>
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold dark:text-white">${lowStock.length}</h3>
                            <p class="text-xs font-bold text-gray-500 uppercase">${this.L('Low Stock Items', 'අඩු තොග අයිතම')}</p>
                        </div>
                    </div>
                </div>

                <!-- Shopping List Status -->
                <div onclick="app.nav('shopping')" class="bg-white dark:bg-surface p-5 rounded-3xl shadow-sm border dark:border-gray-700 cursor-pointer hover:shadow-md transition relative overflow-hidden group">
                     <div class="absolute right-0 top-0 p-5 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110">
                        <i class="fa-solid fa-basket-shopping text-6xl text-blue-500"></i>
                    </div>
                    <div class="flex flex-col h-full justify-between relative z-10">
                        <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mb-2">
                            <i class="fa-solid fa-basket-shopping"></i>
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold dark:text-white">${shopCount}</h3>
                            <p class="text-xs font-bold text-gray-500 uppercase">${this.L('To Buy', 'මිලදී ගැනීමට')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cooking Suggestion -->
            <div class="bg-white dark:bg-surface p-5 rounded-3xl shadow-sm border dark:border-gray-700">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-lg dark:text-white">${this.L('Recent Activity', 'මෑත ක්‍රියාකාරකම්')}</h3>
                    <span class="text-xs text-primary-600 font-bold bg-primary-50 px-2 py-1 rounded-lg">Live</span>
                </div>
                ${this.db.mealHistory.length > 0 ? `
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl shrink-0"><i class="fa-solid fa-utensils"></i></div>
                        <div>
                            <p class="font-bold dark:text-white">${this.db.mealHistory[this.db.mealHistory.length - 1].name}</p>
                            <p class="text-xs text-gray-500">Last cooked on ${this.db.mealHistory[this.db.mealHistory.length - 1].date}</p>
                        </div>
                    </div>
                ` : `<p class="text-sm text-gray-400 italic">No meals logged yet. Start cooking!</p>`}
            </div>
        </div>
    `;
    }

    // Add this helper for dashboard buttons
    dashboardBtn(label, icon, colorClass, action) {
        return `
        <button onclick="${action}" class="flex flex-col items-center justify-center gap-2 py-4 bg-white dark:bg-surface rounded-2xl shadow-sm border dark:border-gray-700 hover:shadow-md transition active:scale-95 btn-press">
            <div class="w-10 h-10 rounded-full ${colorClass} flex items-center justify-center text-lg"><i class="fa-solid ${icon}"></i></div>
            <span class="text-xs font-bold dark:text-gray-300">${label}</span>
        </button>
    `;
    }

    initDashboardChart() {
        const ctx = document.getElementById('dashboardChart');
        if (!ctx) return;

        // Prepare Data: Use budget vs actual or category spread
        const catData = {};
        this.db.inventory.forEach(i => {
            catData[i.c] = (catData[i.c] || 0) + (i.qty * i.p);
        });

        const labels = Object.keys(catData);
        const data = Object.values(catData);

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { boxWidth: 10, usePointStyle: true } }
                }
            }
        });
    }

    // Updated StartVoiceSearch to use Manager
    startVoiceSearch(inputId, triggerFunction) {
        this.voice.start(this.db.settings.lang === 'si' ? 'si-LK' : 'en-US', (text) => {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = text;
                if (typeof this[triggerFunction] === 'function') {
                    this[triggerFunction]();
                } else if (triggerFunction) { // Fallback
                    // Only use safe evals or better yet, avoid string functions
                }
            }
        });
    }

    // --- INVENTORY MANAGEMENT (V6.0/V7.0 Combined) ---
    // (Including setFilter, filterInv, openItemModal, delItem, saveItem, renderInventoryChart)
    // Note: The full implementations of these functions would be in the final merged code.

    renderInventory(el) {
        // 1. Data Preparation
        // Get unique categories from the database inventory
        const categories = ['All', ...new Set(this.db.inventory.map(i => i.c))];

        // Capture current search value
        const currentSearchValue = document.getElementById('inv-search')?.value || '';

        // Filter and Sort Inventory
        const inventory = this.db.inventory
            .filter(i => this.currentFilter === 'All' || i.c === this.currentFilter)
            .filter(i => {
                const search = currentSearchValue.toLowerCase();
                // Safe check for name (n) and sinhala name (s)
                return (i.n && i.n.toLowerCase().includes(search)) ||
                    (i.s && i.s.toLowerCase().includes(search));
            })
            .sort((a, b) => a.qty - b.qty); // Sort low stock first

        // 2. Render HTML
        el.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-5 pb-24">
            
            <!-- Header Section -->
            <div class="flex justify-between items-end px-1">
                <h2 class="text-3xl font-bold dark:text-white">${this.L('Inventory', 'තොග ලැයිස්තුව')}</h2>
                <span class="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border dark:border-gray-700">
                    ${inventory.length} ${this.L('Items', 'අයිතම')}
                </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
                <label class="flex-1 px-4 py-3 bg-white dark:bg-gray-800 text-primary-600 rounded-xl shadow-sm border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 group">
                    <i class="fa-solid fa-receipt group-hover:scale-110 transition-transform"></i>
                    <span class="font-medium hidden sm:inline">${this.L('Scan Bill', 'බිල් පත පරික්ෂා')}</span>
                    <span class="font-medium sm:hidden">${this.L('Scan', 'ස්කෑන්')}</span>
                    <input type="file" accept="image/*" class="hidden" onchange="app.processBill(this)">
                </label>
                <button onclick="app.openItemModal()" class="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl shadow-lg hover:bg-primary-700 transition flex items-center justify-center gap-2 active:scale-95 group">
                    <i class="fa-solid fa-plus group-hover:rotate-90 transition-transform"></i>
                    <span class="font-medium">${this.L('Add Item', 'එකතු කරන්න')}</span>
                </button>
            </div>

            <!-- Search & Filter Sticky Header -->
            <div class="space-y-3 sticky top-0 z-20 bg-gray-50 dark:bg-gray-900 pt-2 pb-2">
                <div class="relative flex items-center gap-2">
                    <div class="relative flex-1 group">
                        <i class="fa-solid fa-search absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors"></i>
                        <input type="text" id="inv-search" 
                            placeholder="${this.L('Search items...', 'අයිතම සොයන්න...')}" 
                            value="${currentSearchValue}"
                            onkeyup="app.filterInv()" 
                            class="w-full p-3 pl-11 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all">
                    </div>
                    <button onclick="app.startVoiceSearch('inv-search', 'filterInv')" class="p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm text-gray-500 hover:text-primary-600 hover:shadow-md active:scale-95 transition">
                        <i class="fa-solid fa-microphone"></i>
                    </button>
                </div>

                <!-- Categories -->
                <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    ${categories.map(c => `
                        <button onclick="app.setFilter('${c}')" 
                            class="shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all transform active:scale-95 border
                            ${c === this.currentFilter
                ? 'bg-primary-600 text-white border-primary-600 shadow-md scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}">
                            ${this.L(c, CATEGORY_TRANSLATIONS[c] || c)}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Inventory List -->
            <div id="inventory-list" class="space-y-3">
                ${inventory.length ? inventory.map(item => {
                    // Expiry Logic
                    let expHtml = '';
                    if (item.exp) {
                        const diff = Math.ceil((new Date(item.exp) - new Date()) / (1000 * 60 * 60 * 24));
                        if (diff < 0) expHtml = `<span class="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded ml-2 border border-red-200">${this.L('Expired', 'කල් ඉකුත් වී ඇත')}</span>`;
                        else if (diff <= 3) expHtml = `<span class="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded ml-2 border border-orange-200">${diff} ${this.L('days left', 'දින ඉතිරි')}</span>`;
                        else expHtml = `<span class="text-[10px] text-gray-400 ml-2"><i class="fa-regular fa-clock"></i> ${diff}d</span>`;
                    }

                    // Low Stock Logic
                    const isLowStock = item.qty <= item.min;

                    return `
                    <div onclick="app.openItemModal('${item.id}')" class="group relative flex items-center justify-between p-4 bg-white dark:bg-surface rounded-xl shadow-sm border ${isLowStock ? 'border-red-400 ring-1 ring-red-400 dark:border-red-600' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'} cursor-pointer hover:shadow-md transition-all">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full ${isLowStock ? 'bg-red-50 text-red-500' : 'bg-primary-50 text-primary-600'} flex items-center justify-center shadow-inner text-lg">
                                <i class="fa-solid ${item.img || 'fa-cube'}"></i>
                            </div>
                            <div>
                                <p class="font-bold text-gray-800 dark:text-white leading-tight">
                                    ${this.L(item.n, item.s)} ${expHtml}
                                </p>
                                <p class="text-xs text-gray-500 mt-1">
                                    ${this.L(item.c, CATEGORY_TRANSLATIONS[item.c] || item.c)}
                                </p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-xl font-bold ${isLowStock ? 'text-red-500' : 'text-primary-700 dark:text-primary-400'}">
                                ${item.qty}<span class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-0.5">${item.u}</span>
                            </p>
                            <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">${this.L('Min', 'අවම')}: ${item.min}</p>
                        </div>
                    </div>
                `}).join('') : `
                    <div class="flex flex-col items-center justify-center py-12 text-gray-400 opacity-70">
                        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                            <i class="fa-solid fa-box-open text-4xl text-gray-300 dark:text-gray-600"></i>
                        </div>
                        <p class="font-medium">${this.L('No items found', 'අයිතම කිසිවක් හමු නොවීය')}</p>
                    </div>
                `}
            </div>
        </div>
    `;

        // 3. Restore Focus
        const input = document.getElementById('inv-search');
        if (input) {
            input.focus();
            const valLength = input.value.length;
            input.setSelectionRange(valLength, valLength);
        }
    }

    // REPLACE renderMarket(el)
    renderMarket(el) {
        // 1. Filter Logic
        const search = (document.getElementById('market-search')?.value || '').toLowerCase();
        const filteredCatalog = CATALOG_MASTER.filter(i =>
            i.n.toLowerCase().includes(search) ||
            (i.s && i.s.toLowerCase().includes(search))
        );

        const tableRows = filteredCatalog.map((item) => {
            // Find current inventory state or default
            const inv = this.db.inventory.find(i => i.n === item.n);
            const currentUnit = inv ? inv.u : item.u;
            const currentPrice = inv ? inv.p : item.p;

            // Dynamic Price Logic: If user changes unit, price should ideally adjust? 
            // Current logic: Price is per UNIT. So if unit changes, price might need update.
            // But here we allow user to SET the price for that unit.

            return `
            <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td class="p-4">
                    <p class="font-bold dark:text-white">${item.n}</p>
                    <p class="text-xs text-gray-500 font-sinhala">${item.s}</p>
                </td>
                <td class="p-4 text-sm text-gray-500">${item.c}</td>
                <td class="p-4">
                    <select onchange="app.updateMarketItem('${item.n}', 'u', this.value)" class="p-2 rounded border bg-transparent dark:border-gray-600 dark:text-white text-sm">
                        ${['kg', 'g', 'pcs', 'l', 'ml', 'pack', 'can', 'bottle'].map(u =>
                `<option value="${u}" ${u === currentUnit ? 'selected' : ''}>${u}</option>`
            ).join('')}
                    </select>
                </td>
                <td class="p-4">
                    <div class="flex items-center gap-2">
                        <span class="text-gray-400 text-sm">LKR</span>
                        <input type="number" value="${currentPrice}" onchange="app.updateMarketItem('${item.n}', 'p', this.value)" class="w-24 p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-right font-bold text-primary-600">
                    </div>
                </td>
            </tr>
        `}).join('');

        el.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
            <div class="flex justify-between items-end">
                <h2 class="text-3xl font-bold dark:text-white">${this.L('Market Prices', 'වෙළඳපල මිල ගණන්')}</h2>
                <div class="flex gap-2">
                     <!-- Sync Button (New) -->
                     <button onclick="document.getElementById('price-sync-file').click()" class="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl font-bold hover:bg-indigo-200 transition text-sm">
                        <i class="fa-solid fa-sync mr-1"></i> ${this.L('Sync Prices', 'මිල යාවත්කාලීන')}
                     </button>
                     <input type="file" id="price-sync-file" class="hidden" accept=".json,.js,.txt" onchange="app.syncMarketPrices(this)">
                     
                     <button onclick="app.openAddMarketItemModal()" class="bg-primary-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-primary-700 transition text-sm">
                        <i class="fa-solid fa-plus mr-1"></i> ${this.L('New Item', 'නව අයිතමය')}
                     </button>
                </div>
            </div>

            <!-- Search Bar -->
            <div class="relative">
                <i class="fa-solid fa-search absolute left-4 top-3.5 text-gray-400"></i>
                <input type="text" id="market-search" value="${document.getElementById('market-search')?.value || ''}" 
                    placeholder="${this.L('Search market items...', 'වෙළඳපල අයිතම සොයන්න...')}" 
                    onkeyup="app.renderMarket(document.getElementById('main-view'))" 
                    class="w-full p-3 pl-10 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm outline-none">
            </div>
            
            <div class="bg-white dark:bg-surface rounded-2xl shadow-lg border dark:border-gray-700 overflow-hidden">
                <div class="overflow-x-auto max-h-[60vh] custom-scroll">
                    <table class="w-full text-left border-collapse relative">
                        <thead class="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500 font-bold sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th class="p-4">${this.L('Item', 'අයිතමය')}</th>
                                <th class="p-4">${this.L('Category', 'වර්ගය')}</th>
                                <th class="p-4">${this.L('Unit', 'ඒකකය')}</th>
                                <th class="p-4">${this.L('Price', 'මිල')}</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows.length ? tableRows : `<tr><td colspan="4" class="p-8 text-center text-gray-400">${this.L('No items found', 'අයිතම හමු නොවීය')}</td></tr>`}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
        // Restore focus to search input after re-render
        const input = document.getElementById('market-search');
        if (input) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        }
    }

    // Helper to update specific fields
    updateMarketItem(name, field, val) {
        // Update Master Catalog
        const masterItem = CATALOG_MASTER.find(i => i.n === name);
        if (masterItem) masterItem[field] = (field === 'p') ? parseFloat(val) : val;

        // Update Inventory if exists
        const invItem = this.db.inventory.find(i => i.n === name);
        if (invItem) invItem[field] = (field === 'p') ? parseFloat(val) : val;

        // If Unit changed, and user didn't update price yet, we might want to suggest conversion? 
        // For now, keep simple direct edit.

        this.save();
        this.calculatePredictions();
        this.toast("Updated " + name, "Saved", "fa-check");
    }

    // JSON/file sync logic
    async syncMarketPrices(input) {
        if (!input.files[0]) return;
        const file = input.files[0];

        try {
            const text = await file.text();
            let data;

            // Try parsing JSON
            try {
                data = JSON.parse(text);
            } catch (e) {
                // If it's the raw JS file provided (srilanka_budget_data.js structure)
                // We might need to eval or regex extract. 
                // Regex for foodPrices object:
                const match = text.match(/foodPrices:\s*({[\s\S]*?})\s*,/);
                if (match) {
                    // CAUTION: Eval is dangerous but if user provides the file...
                    // Safer to use a strict parser or ask user for JSON.
                    // Let's assume JSON for "Sync Latest Price" feature as cleaner approach.
                    throw new Error("Please upload a Valid JSON file. (e.g. {\"Rice\": 200})");
                }
                throw e;
            }

            let count = 0;
            // Expecting object: { "ItemName": price, ... } OR { "ItemName": { price: 100, unit: "kg" } }

            Object.keys(data).forEach(key => {
                const val = data[key];
                const masterItem = CATALOG_MASTER.find(i => i.n.toLowerCase() === key.toLowerCase());
                if (masterItem) {
                    if (typeof val === 'number') masterItem.p = val;
                    else if (typeof val === 'object') {
                        masterItem.p = val.price || masterItem.p;
                        masterItem.u = val.unit || masterItem.u;
                    }

                    // Sync inventory
                    const inv = this.db.inventory.find(i => i.n === masterItem.n);
                    if (inv) {
                        inv.p = masterItem.p;
                        inv.u = masterItem.u;
                    }
                    count++;
                }
            });

            this.save();
            this.renderMarket(document.getElementById('main-view'));
            this.toast(`Synced ${count} items`, "Success", "fa-sync");

        } catch (e) {
            console.error(e);
            this.toast("Sync Failed. Use JSON format.", "Error", "fa-triangle-exclamation");
        }
    }

    // Add method to open Add Market Item Modal
    openAddMarketItemModal() {
        const html = `
        <div class="space-y-4">
            <div><label class="text-xs font-bold text-gray-500 uppercase">English Name</label><input id="mi-n" class="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white"></div>
            <div><label class="text-xs font-bold text-gray-500 uppercase">Sinhala Name</label><input id="mi-s" class="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white font-sinhala"></div>
            <div class="grid grid-cols-2 gap-4">
                <div><label class="text-xs font-bold text-gray-500 uppercase">Category</label>
                <select id="mi-c" class="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white">
                    ${['Vegetables', 'Fruits', 'Meats', 'Seafood', 'Essentials', 'Spices'].map(c => `<option>${c}</option>`).join('')}
                </select></div>
                <div><label class="text-xs font-bold text-gray-500 uppercase">Price (LKR)</label><input type="number" id="mi-p" class="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white"></div>
            </div>
            <div><label class="text-xs font-bold text-gray-500 uppercase">Unit</label>
            <select id="mi-u" class="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white">
                <option value="kg">kg</option><option value="g">g</option><option value="pcs">pcs</option><option value="l">l</option>
            </select></div>
            <button onclick="app.saveMarketItem()" class="w-full py-3 bg-primary-600 text-white rounded-xl font-bold mt-2">Add to Market</button>
        </div>
    `;
        this.showModal(this.L('Add Market Item', 'වෙළඳපල අයිතමය එක් කරන්න'), html);
    }

    saveMarketItem() {
        const n = document.getElementById('mi-n').value;
        const s = document.getElementById('mi-s').value;
        const c = document.getElementById('mi-c').value;
        const p = parseFloat(document.getElementById('mi-p').value) || 0;
        const u = document.getElementById('mi-u').value;

        if (!n) return;
        CATALOG_MASTER.push({ n, s: s || n, c, p, u, img: 'fa-cube' });
        this.closeModal();
        this.renderMarket(document.getElementById('main-view'));
        this.toast("Item Added", "Success");
    }

    // Add the helper method for updating price:
    updateMarketPrice(name, price) {
        const val = parseFloat(price);
        if (isNaN(val) || val < 0) return;

        // Update Master Catalog
        const masterItem = CATALOG_MASTER.find(i => i.n === name);
        if (masterItem) masterItem.p = val;

        // Update Live Inventory
        const invItem = this.db.inventory.find(i => i.n === name);
        if (invItem) {
            invItem.p = val;
        }
        this.save();
        this.calculatePredictions(); // Recalculate based on new prices
        this.toast(this.L('Price updated', 'මිල යාවත්කාලීන විය'), `LKR ${val}`, 'fa-tag');
    }

    // Dummy/Stub implementations for combined features:

    setFilter(category) {
        this.currentFilter = category;
        this.renderInventory(document.getElementById('main-view'));
    }

    filterInv() {
        this.renderInventory(document.getElementById('main-view'));
    }

    startVoiceSearch() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.toast(this.L('Voice search not supported in this browser.', 'මෙම බ්‍රවුසරයේ හඬ සෙවීම සහාය නොදක්වයි.'), this.L('Error', 'දෝෂය'), 'fa-microphone-slash');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = this.db.settings.lang === 'si' ? 'si-LK' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        this.toast(this.L('Listening...', 'සවන් දෙමින්...'), this.L('Voice Search', 'හඬ සෙවීම'), 'fa-microphone');

        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const searchInput = document.getElementById('inv-search');
            if (searchInput) {
                searchInput.value = transcript.replace('.', ''); // Remove trailing dots
                this.filterInv(); // Trigger filter
                this.toast(this.L(`Found: "${transcript}"`, `සොයාගත්තා: "${transcript}"`), 'Success', 'fa-check');
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            this.toast(this.L('Could not hear you. Try again.', 'ඔබ කී දේ ඇසුනේ නැත. නැවත උත්සාහ කරන්න.'), this.L('Error', 'දෝෂය'), 'fa-triangle-exclamation');
        };
    }

    openItemModal(id = null) {
        const item = id
            ? this.db.inventory.find(i => i.id === id)
            : { n: '', c: 'Vegetables', u: 'kg', qty: 1, min: 0, p: 0, s: '', exp: '' };
        const categories = ['Vegetables', 'Meats', 'Seafood', 'Rice', 'Spices', 'Dairy', 'Essentials', 'Condiments', 'Bakery', 'Fruits', 'Other'];
        const units = ['kg', 'g', 'pcs', 'l', 'ml', 'can', 'pack', 'loaf'];

        // NEW: Expiry Date Logic
        const today = new Date().toISOString().split('T')[0];

        const html = `
                    <div class="space-y-4">
                        <div><label class="text-xs font-bold text-gray-500 uppercase">${this.L('Name', 'නම')}</label><input id="m-n" value="${this.L(item.n, item.s)}" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none"></div>
                        
                        <!-- NEW: Expiry Date Field -->
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">${this.L('Expiry Date', 'කල් ඉකුත් වන දිනය')}</label>
                            <input type="date" id="m-exp" value="${item.exp || ''}" min="${today}" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none">
                        </div>

                            <div>
                                <label class="text-xs font-bold text-gray-500 uppercase">${this.L('Category', 'වර්ගය')}</label>
                                <select id="m-c" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                                    ${categories.map(c => `<option value="${c}" ${c === item.c ? 'selected' : ''}>${c}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-bold text-gray-500 uppercase">${this.L('Unit', 'ඒකකය')}</label>
                                <select id="m-u" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                                    ${units.map(u => `<option value="${u}" ${u === item.u ? 'selected' : ''}>${u}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <!-- NEW: Frequency and Group -->
                        <div class="grid grid-cols-2 gap-4">
                             <div>
                                <label class="text-xs font-bold text-gray-500 uppercase">${this.L('Usage Frequency', 'භාවිතා කරන වාර ගණන')}</label>
                                <select id="m-f" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                                    <option value="d" ${item.f === 'd' ? 'selected' : ''}>${this.L('Daily (Everyday)', 'දිනපතා')}</option>
                                    <option value="w" ${item.f === 'w' ? 'selected' : ''}>${this.L('Weekly (Regular)', 'සතිපතා')}</option>
                                    <option value="m" ${item.f === 'm' ? 'selected' : ''}>${this.L('Monthly (Staple)', 'මාසිකව')}</option>
                                    <option value="a" ${item.f === 'a' ? 'selected' : ''}>${this.L('Occasional (Ad-hoc)', 'විකල්ප/ඉඳහිට')}</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-bold text-gray-500 uppercase">${this.L('Group (Optional)', 'කණ්ඩායම (වෛකල්පිත)')}</label>
                                <input id="m-bg" value="${item.bg || ''}" placeholder="e.g. rice, milk" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none">
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-4">
                            <div><label class="text-xs font-bold text-gray-500 uppercase">${this.L('Quantity', 'ප්‍රමාණය')}</label><input type="number" step="0.01" id="m-qty" value="${item.qty}" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none"></div>
                            <div><label class="text-xs font-bold text-gray-500 uppercase">${this.L('Min Stock', 'අවම තොගය')}</label><input type="number" step="0.01" id="m-min" value="${item.min}" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none"></div>
                            <div><label class="text-xs font-bold text-gray-500 uppercase">${this.L('Price (LKR)', 'මිල')}</label><input type="number" step="1" id="m-p" value="${item.p}" class="w-full p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none"></div>
                        </div>
                        <div class="flex justify-between pt-4">
                            ${id ? `<button onclick="app.delItem('${id}')" class="px-4 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600">${this.L('Delete', 'මකන්න')}</button>` : `<span></span>`}
                            <button onclick="app.saveItem('${id || ''}')" class="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700">${this.L('Save Item', 'අයිතමය සුරකින්න')}</button>
                        </div>
                    </div>
                `;
        this.showModal(id ? this.L('Edit Stock Item', 'තොග අයිතමය සංස්කරණය කරන්න') : this.L('Add New Stock Item', 'නව තොග අයිතමයක් එක් කරන්න'), html);
    }

    saveItem(id) {
        const name = document.getElementById('m-n').value.trim();
        const category = document.getElementById('m-c').value;
        const unit = document.getElementById('m-u').value;
        const qty = parseFloat(document.getElementById('m-qty').value) || 0;
        const min = parseFloat(document.getElementById('m-min').value) || 0;
        const price = parseFloat(document.getElementById('m-p').value) || 0;
        const exp = document.getElementById('m-exp').value;
        const freq = document.getElementById('m-f').value; // <--- NEW
        const bg = document.getElementById('m-bg').value.trim(); // <--- NEW

        if (!name) { this.toast(this.L('Item name is required.', 'අයිතමයේ නම අවශ්‍යයි.'), this.L('Error', 'දෝෂය'), 'fa-exclamation-triangle'); return; }

        const newItem = {
            id: id || 'item_' + Date.now(),
            n: name,
            s: name,
            c: category,
            u: unit,
            qty: qty,
            min: min,
            p: price,
            exp: exp,
            f: freq, // <--- NEW
            bg: bg,  // <--- NEW
            img: CATALOG_MASTER.find(i => i.n === name)?.img || 'fa-cube'
        };

        // ... (Keep the rest of the existing logic regarding id checking/pushing unchanged)
        if (id) {
            const index = this.db.inventory.findIndex(i => i.id === id);
            if (index !== -1) { this.db.inventory[index] = newItem; }
        } else {
            const existing = this.db.inventory.find(i => i.n === name);
            if (existing) {
                existing.qty += qty;
                existing.min = min;
                existing.p = price;
                existing.exp = exp;
                existing.f = freq; // Update frequency
                existing.bg = bg; // Update group
            } else {
                this.db.inventory.push(newItem);
            }
        }

        this.save();
        this.closeModal();
        this.calculatePredictions();
        this.nav('inventory');
        this.toast(this.L('Inventory updated.', 'තොගය යාවත්කාලීන කරන ලදී.'), this.L('Success', 'සාර්ථකයි'));
    }

    delItem(id) {
        this.db.inventory = this.db.inventory.filter(i => i.id !== id);
        this.save();
        this.closeModal();
        this.calculatePredictions();
        this.nav('inventory');
        this.toast(this.L('Item deleted.', 'අයිතමය මකා දැමිණි.'), this.L('Success', 'සාර්ථකයි'));
    }

    renderInventoryChart() {
        const chartEl = document.getElementById('inventoryChart');
        if (!chartEl) return;

        const categories = [...new Set(this.db.inventory.map(i => i.c))];
        const data = categories.map(c => this.db.inventory.filter(i => i.c === c).reduce((sum, i) => sum + (i.qty * i.p), 0));

        new Chart(chartEl, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: data,
                    backgroundColor: ['#059669', '#10b981', '#a7f3d0', '#d1fae5', '#ecfdf5', '#047857', '#064e3b', '#6b7280', '#9ca3af', '#e5e7eb', '#f3f4f6'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });
    }

    // --- SHOPPING LIST (V6.0/V7.0 Combined) ---
    // (Including addShopItem, toggleShop, delShop, addToStockFromShop, renderShopping)

    // REPLACE renderShopping(el)
    renderShopping(el) {
        const datalistHtml = CATALOG_MASTER.map(c => `<option value="${this.L(c.n, c.s)}">`).join('');

        el.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6 flex flex-col h-full pb-24 animate-fade-in">
            <h2 class="text-3xl font-bold dark:text-white">${this.L('Shopping List', 'සාප්පු ලැයිස්තුව')}</h2>

            <!-- Add Custom Item Form -->
            <div class="bg-white dark:bg-surface p-4 rounded-2xl shadow-lg border dark:border-gray-700 space-y-3">
                <div class="relative">
                    <input id="shop-input" list="catalog-list" placeholder="${this.L('Item Name (e.g. Milk)', 'අයිතමයේ නම (උදා: කිරි)')}" class="w-full p-3 pl-10 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none">
                    <i class="fa-solid fa-search absolute left-4 top-3.5 text-gray-400"></i>
                </div>
                <datalist id="catalog-list">${datalistHtml}</datalist>
                
                <div class="flex gap-2">
                    <input type="number" id="shop-qty" placeholder="Qty" class="w-24 p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none">
                    <select id="shop-unit" class="w-24 p-3 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none">
                        <option value="kg">kg</option><option value="g">g</option><option value="pcs">pcs</option><option value="l">l</option>
                    </select>
                    <button onclick="app.addShopItemCustom()" class="flex-1 bg-primary-600 text-white rounded-xl font-bold shadow-lg hover:bg-primary-700 transition">
                        ${this.L('Add', 'එකතු')}
                    </button>
                </div>
            </div>

            <!-- Action Buttons -->
            ${this.db.shopping.length ? `
                <div class="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900">
                    <span class="text-xs font-bold text-blue-600 dark:text-blue-300">${this.db.shopping.length} Items</span>
                    <div class="flex gap-2">
                        <button onclick="app.addToStockFromShop()" class="px-3 py-1.5 bg-white text-blue-600 rounded-lg shadow-sm text-xs font-bold hover:bg-gray-50">Add to Stock</button>
                        <button onclick="app.db.shopping=[]; app.save(); app.nav('shopping');" class="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg shadow-sm text-xs font-bold hover:bg-red-200">Clear</button>
                    </div>
                </div>
            ` : ''}

            <!-- List -->
            <div id="shop-list" class="space-y-3 pb-4">
                ${this.db.shopping.map((item, idx) => `
                    <div class="flex items-center gap-3 p-3 bg-white dark:bg-surface rounded-xl shadow-sm border ${item.checked ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'dark:border-gray-700'} transition">
                        <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="app.toggleShop(${idx})" class="w-6 h-6 accent-primary-600 rounded-lg shrink-0">
                        
                        <div class="flex-1">
                            <p class="font-bold dark:text-white ${item.checked ? 'line-through text-gray-400' : ''}">${item.name}</p>
                            <p class="text-[10px] text-gray-500 uppercase tracking-wide">Qty Needed</p>
                        </div>

                        <!-- Manual Value Input -->
                        <div class="flex items-center gap-1">
                            <input type="number" value="${item.qty}" onchange="app.updateShopQty(${idx}, this.value)" class="w-16 p-1.5 text-center text-sm font-bold rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary-500">
                            <span class="text-xs font-bold text-gray-500 w-8">${item.unit}</span>
                        </div>

                        <button onclick="app.delShop(${idx})" class="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100"><i class="fa-solid fa-trash text-xs"></i></button>
                    </div>
                `).join('')}
                ${!this.db.shopping.length ? `<div class="text-center text-gray-400 py-10 opacity-60"><i class="fa-solid fa-cart-shopping text-4xl mb-2"></i><p>List is empty</p></div>` : ''}
            </div>
        </div>
    `;
    }

    // Add these helper methods
    addShopItemCustom() {
        const name = document.getElementById('shop-input').value.trim();
        const qty = parseFloat(document.getElementById('shop-qty').value) || 1;
        const unit = document.getElementById('shop-unit').value;

        if (!name) return this.toast("Enter name", "Error");

        // Check duplicate
        const existing = this.db.shopping.find(i => i.name.toLowerCase() === name.toLowerCase());
        if (existing) {
            existing.qty += qty;
        } else {
            this.db.shopping.unshift({ name, qty, unit, checked: false });
        }

        this.save();
        this.nav('shopping');
        this.toast("Added to list", "Success");
    }

    updateShopQty(idx, val) {
        if (idx >= 0 && idx < this.db.shopping.length) {
            this.db.shopping[idx].qty = parseFloat(val) || 0;
            this.save();
        }
    }

    addShopItem() {
        const input = document.getElementById('shop-input');
        const name = input.value.trim();
        if (!name) return;

        const match = CATALOG_MASTER.find(i => i.n.toLowerCase() === name.toLowerCase() || i.s.toLowerCase() === name.toLowerCase());
        const unit = match ? match.u : 'pcs';

        // Basic quantity parsing (e.g., "3kg Rice") - simplified
        const qtyMatch = name.match(/(\d+\.?\d*)\s*(kg|g|pcs|l|ml|can|pack|loaf)/i);
        let qty = 1;
        let finalName = name;
        let finalUnit = unit;

        if (qtyMatch) {
            qty = parseFloat(qtyMatch[1]);
            finalUnit = qtyMatch[2].toLowerCase();
            finalName = name.replace(qtyMatch[0], '').trim() || match?.n || name;
        }

        if (match) finalName = match.n; // Use the canonical name

        // Check for existing item to avoid duplicates
        const existing = this.db.shopping.find(i => i.name === finalName && i.unit === finalUnit);
        if (existing) {
            existing.qty += qty;
        } else {
            this.db.shopping.push({ name: finalName, qty: qty, unit: finalUnit, checked: false });
        }

        this.save();
        this.nav('shopping');
        input.value = '';
    }

    toggleShop(index) {
        this.db.shopping[index].checked = !this.db.shopping[index].checked;
        this.save();
        this.nav('shopping');
    }

    delShop(index) {
        this.db.shopping.splice(index, 1);
        this.save();
        this.nav('shopping');
    }

    addToStockFromShop() {
        let addedCount = 0;
        this.db.shopping.filter(i => i.checked).forEach(shopItem => {
            const invItem = this.db.inventory.find(i => i.n === shopItem.name);
            const catalogItem = CATALOG_MASTER.find(i => i.n === shopItem.name);

            const price = catalogItem ? catalogItem.p : 0;
            const min = invItem ? invItem.min : 0;

            if (invItem) {
                // Update existing item
                invItem.qty += shopItem.qty;
            } else if (catalogItem) {
                // Add new item from catalog
                this.db.inventory.push({
                    id: 'item_' + Date.now() + addedCount,
                    n: catalogItem.n,
                    s: catalogItem.s,
                    c: catalogItem.c,
                    u: shopItem.unit,
                    qty: shopItem.qty,
                    min: min,
                    p: price,
                    img: catalogItem.img
                });
            } else {
                // Add as a generic item
                this.db.inventory.push({
                    id: 'item_' + Date.now() + addedCount,
                    n: shopItem.name,
                    s: shopItem.name,
                    c: 'Other',
                    u: shopItem.unit,
                    qty: shopItem.qty,
                    min: 0,
                    p: 0,
                    img: 'fa-cube'
                });
            }
            addedCount++;
        });

        // Remove checked from shopping list
        this.db.shopping = this.db.shopping.filter(i => !i.checked);
        this.save();
        this.closeModal();
        this.calculatePredictions();
        this.nav('inventory');
        this.toast(this.L('Success!', 'සාර්ථකයි!'), `${addedCount} ${this.L('items added to inventory.', 'අයිතම තොගයට එක් කරන ලදී.')}`);
    }

    // --- OCR / BILL SCANNING (V6.0 Feature) ---

    showRawOCRModal(text) {
        const html = `
            <div class="space-y-4">
                <p class="text-sm text-gray-500">${this.L('Review and edit the scanned text below to ensure accuracy before parsing.', 'පැහැදිලි කිරීම සඳහා ස්කෑන් කළ පෙළ සමාලෝචනය කර සංස්කරණය කරන්න.')}</p>
                <textarea id="raw-ocr-text" class="w-full h-64 p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 outline-none">${text}</textarea>
                <div class="flex gap-3">
                    <button onclick="app.closeModal()" class="flex-1 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border dark:border-gray-600 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition">${this.L('Cancel', 'අවලංගු කරන්න')}</button>
                    <button onclick="app.parseOCRText()" class="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-600/30">${this.L('Parse Items', 'අයිතම වෙන් කරන්න')}</button>
                </div>
            </div>
        `;
        this.showModal(this.L('Edit Scanned Text', 'ස්කෑන් කළ පෙළ සංස්කරණය'), html);
    }

    parseOCRText() {
        const text = document.getElementById('raw-ocr-text').value;
        // Improved Regex to capture various formats: Name ... Price
        const itemMatch = /(^.{3,}?)\s+(?:Rs\.?|LKR)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)$/im;
        const lines = text.split('\n');
        const ignoredWords = /total|subtotal|cash|change|tax|balance|discount|tel:|date:/i;

        let detectedItems = [];

        lines.forEach(line => {
            line = line.trim().replace(/(\s{2,})/g, ' ');
            if (line.length > 5 && !ignoredWords.test(line)) {
                const match = line.match(itemMatch);
                if (match && match[1].trim().length > 2) {
                    const priceStr = match[2].replace(/,/g, '');
                    const price = parseFloat(priceStr);
                    const name = match[1].trim();
                    if (!isNaN(price) && price > 0) {
                        detectedItems.push({ n: name, qty: 1, p: price });
                    }
                }
            }
        });

        if (detectedItems.length === 0) {
            this.toast(this.L("No items detected. Please edit the text to format as: 'Item Name Price'", "අයිතම හමු නොවීය. කරුණාකර 'නම මිල' ලෙස සකස් කරන්න"), "Parsing Error", "fa-triangle-exclamation");
            return;
        }

        this.showBillVerifyModal(detectedItems);
    }

    async processBill(input) {
        if (!input.files[0]) return;
        const loader = document.getElementById('ocr-loader');
        loader.classList.remove('hidden');
        document.getElementById('ocr-loader-title').innerText = this.L('Scanning Bill...', 'බිල්පත පරික්ෂා කරමින්...');
        document.getElementById('ocr-loader-msg').innerText = this.L('Extracting text...', 'පෙළ උපුටා ගනිමින්...');

        try {
            const { data: { text } } = await Tesseract.recognize(input.files[0], this.db.settings.lang, { logger: m => console.log(m) });
            this.showRawOCRModal(text);
        } catch (e) {
            this.toast(this.L("Scan Failed: " + e.message, "ස්කෑන් කිරීම අසාර්ථකයි"), this.L("Error", "දෝෂය"), "fa-triangle-exclamation");
        } finally {
            loader.classList.add('hidden');
            input.value = '';
        }
    }

    showBillVerifyModal(items) {
        const itemRows = items.map((item, index) => {
            const match = CATALOG_MASTER.find(c => item.n.toLowerCase().includes(c.n.toLowerCase()));
            const unit = match ? match.u : 'kg';
            return `
                        <tr class="border-b dark:border-gray-700">
                            <td class="p-3">
                                <input id="verify-name-${index}" value="${item.n}" class="w-full bg-transparent outline-none dark:text-white">
                                <p class="text-xs text-primary-600">${this.L('Matched:', 'ගැලපුම:')} ${match ? this.L(match.n, match.s) : this.L('None', 'නැත')}</p>
                            </td>
                            <td class="p-3"><input type="number" step="1" id="verify-qty-${index}" value="1" class="w-12 bg-transparent outline-none"></td>
                            <td class="p-3"><input type="number" step="0.01" id="verify-price-${index}" value="${item.p.toFixed(2)}" class="w-16 bg-transparent outline-none"></td>
                            <td class="p-3"><select id="verify-unit-${index}" class="bg-transparent outline-none dark:text-white">${['kg', 'g', 'pcs', 'l', 'ml', 'can'].map(u => `<option value="${u}" ${u === unit ? 'selected' : ''}>${u}</option>`).join('')}</select></td>
                            <td class="p-3"><input type="checkbox" id="verify-add-${index}" checked class="w-5 h-5 accent-primary-600 rounded"></td>
                        </tr>
                    `;
        }).join('');

        const html = `
                    <div class="space-y-4">
                        <p class="text-sm text-gray-500">${this.L('Verify detected items before adding to stock. Only checked items will be added.', 'තොගයට එක් කිරීමට පෙර හඳුනාගත් අයිතම පරීක්ෂා කරන්න. පරීක්ෂා කළ අයිතම පමණක් එක් කරනු ලැබේ.')}</p>
                        <div class="max-h-60 overflow-y-auto border rounded-xl dark:border-gray-700">
                            <table class="w-full text-sm text-left">
                                <thead class="sticky top-0 bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500"><tr>
                                    <th class="p-3">${this.L('Item', 'අයිතමය')}</th>
                                    <th class="p-3">${this.L('Qty', 'ප්‍රමාණය')}</th>
                                    <th class="p-3">${this.L('Price', 'මිල')}</th>
                                    <th class="p-3">${this.L('Unit', 'ඒකකය')}</th>
                                    <th class="p-3">${this.L('Add', 'එකතු')}</th>
                                </tr></thead>
                                <tbody>${itemRows}</tbody>
                            </table>
                        </div>
                        <button onclick="app.processVerifiedBill(${items.length})" class="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700">${this.L('Add Verified Items to Stock', 'පරීක්ෂා කළ අයිතම තොගයට එක් කරන්න')}</button>
                    </div>
                `;
        this.showModal(this.L('Verify Scanned Bill', 'ස්කෑන් කළ බිල්පත පරීක්ෂා කරන්න'), html);
    }

    processVerifiedBill(count) {
        let addedCount = 0;
        for (let i = 0; i < count; i++) {
            const shouldAdd = document.getElementById(`verify-add-${i}`).checked;
            if (shouldAdd) {
                const name = document.getElementById(`verify-name-${i}`).value.trim();
                const qty = parseFloat(document.getElementById(`verify-qty-${i}`).value) || 1;
                const price = parseFloat(document.getElementById(`verify-price-${i}`).value) || 0;
                const unit = document.getElementById(`verify-unit-${i}`).value;

                if (name && qty > 0) {
                    const existing = this.db.inventory.find(item => item.n === name);
                    const catalogItem = CATALOG_MASTER.find(c => c.n === name);

                    if (existing) {
                        existing.qty += qty;
                    } else {
                        this.db.inventory.push({
                            id: 'bill_' + Date.now() + i,
                            n: name,
                            s: name,
                            c: catalogItem?.c || 'Other',
                            u: unit,
                            qty: qty,
                            min: 0,
                            p: price,
                            img: catalogItem?.img || 'fa-receipt'
                        });
                    }
                    addedCount++;
                }
            }
        }
        this.save();
        this.closeModal();
        this.calculatePredictions();
        this.nav('inventory');
        this.toast(this.L('Success!', 'සාර්ථකයි!'), `${addedCount} ${this.L('items added to inventory.', 'අයිතම තොගයට එක් කරන ලදී.')}`);
    }

    // --- AI CHEF / RECIPE GENERATOR (V6.0 Feature) ---

    renderAI(el) {
        el.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
            <h2 class="text-3xl font-bold dark:text-white">${this.L('Smart AI Chef', 'ස්මාර්ට් අරක්කැමියා')}</h2>
            
            <div class="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <i class="fa-solid fa-robot absolute -right-6 -bottom-6 text-9xl opacity-20"></i>
                <h3 class="font-bold text-xl mb-2 relative z-10">${this.L('Recipe Converter', 'වට්ටෝරු පරිවර්තකය')}</h3>
                <p class="text-indigo-100 text-sm mb-4 relative z-10 max-w-lg">
                    ${this.L('Upload a photo, PDF, Word doc, or paste text. AI will create a step-by-step recipe card in Sinhala & English.', 'ඡායාරූපයක්, PDF, Word ගොනුවක් හෝ පෙළක් උඩුගත කරන්න. AI විසින් සිංහල සහ ඉංග්‍රීසි භාෂාවෙන් වට්ටෝරු පතක් සාදනු ඇත.')}
                </p>
                
                <!-- Input Area -->
            <div class="relative z-10 space-y-3">
                <div class="flex gap-2">
                    <label class="flex-1 cursor-pointer bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl p-3 flex items-center justify-center gap-2 transition">
                        <i class="fa-solid fa-camera"></i> <span class="text-sm font-bold">Photo / File</span>
                        <input type="file" id="ai-file" accept="image/*,.pdf,.doc,.docx,.txt" class="hidden" onchange="document.getElementById('ai-text').value = 'File selected: ' + this.files[0].name">
                    </label>
                    <button onclick="app.processAIInput()" class="px-6 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-gray-100">
                        ${this.L('Convert', 'පරිවර්තනය')}
                    </button>
                </div>
                <textarea id="ai-text" rows="2" placeholder="${this.L('Or paste text/link here...', 'හෝ පෙළ/සබැඳිය මෙහි අලවන්න...')}" class="w-full p-3 rounded-xl border-none text-slate-800 outline-none text-sm bg-white/90"></textarea>
            </div>
        </div>
        
        <!-- Meal Planner Banner -->
        <div class="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden">
             <div class="relative z-10 flex justify-between items-center">
                 <div>
                     <h3 class="font-bold text-xl mb-1">${this.L('Weekly Meal Planner', 'සතිපතා ආහාර සැලැස්ම')}</h3>
                     <p class="text-emerald-100 text-sm opacity-90">${this.L('Generate a 7-day dinner plan based on your stock.', 'ඔබේ ඉන්වෙන්ටරි මත පදනම්ව දින 7ක සැලැස්මක් සාදන්න.')}</p>
                 </div>
                 <button onclick="app.generateMealPlan()" class="bg-white text-emerald-600 px-5 py-3 rounded-xl font-bold hover:bg-emerald-50 shadow-lg active:scale-95 transition">
                     <i class="fa-solid fa-calendar-days mr-2"></i> ${this.L('Plan Now', 'සැලසුම් කරන්න')}
                 </button>
             </div>
             <i class="fa-solid fa-calendar-check absolute -right-4 -bottom-4 text-8xl opacity-20"></i>
        </div>

        <!-- Saved Recipes Grid (Same as before) -->
            <div class="space-y-4">
                <div class="flex justify-between items-center px-1">
                    <h3 class="font-bold text-xl dark:text-white">${this.L('My Recipe Book', 'මගේ වට්ටෝරු පොත')}</h3>
                    <div class="relative w-48">
                         <input type="text" id="ai-recipe-search" onkeyup="app.filterAIRecipes()" placeholder="Search..." class="w-full py-2 px-3 pl-8 rounded-lg text-sm border bg-white dark:bg-surface dark:border-gray-700 dark:text-white">
                         <i class="fa-solid fa-search absolute left-2.5 top-2.5 text-xs text-gray-400"></i>
                    </div>
                </div>
                <div id="ai-recipe-grid" class="grid md:grid-cols-2 gap-4">
                    ${this.recipes.map(r => `
                        <div onclick="app.showRecipeModal('${r.id}')" class="bg-white dark:bg-surface p-4 rounded-xl shadow-sm border dark:border-gray-700 cursor-pointer hover:shadow-lg transition">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-bold text-lg dark:text-white">${r.name}</h4>
                                    <h4 class="font-medium text-sm text-primary-600 font-sinhala">${r.s_name}</h4>
                                </div>
                                <span class="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded">${r.ings.length} items</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    }

    async processRecipeLink() {
        // 1. Get Input
        const linkInput = document.getElementById('ai-link');
        const link = linkInput.value.trim();

        // 2. Validation
        if (!link) {
            this.toast(this.L('Please paste a link.', 'කරුණාකර සබැඳියක් අලවන්න.'), this.L('Error', 'දෝෂය'), 'fa-exclamation-triangle');
            return;
        }

        // 3. UI: Show Loader
        const loader = document.getElementById('ocr-loader');
        loader.classList.remove('hidden');
        document.getElementById('ocr-loader-title').innerText = this.L('Generating Recipe...', 'වට්ටෝරුව ජනනය කරමින්...');
        document.getElementById('ocr-loader-msg').innerText = this.L('Analyzing link content with AI', 'AI සමඟ සබැඳි අන්තර්ගතය විශ්ලේෂණය කරමින්');

        try {
            // 4. Processing (Simulation of API Call)
            // NOTE: In a real environment, you would use: const response = await fetch('/api/scrape', { body: JSON.stringify({url: link}) });
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2-second AI analysis

            // 5. Logic to extract YouTube ID (if the link is a video)
            let videoId = '';
            const ytMatch = link.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            if (ytMatch) videoId = ytMatch[1];

            // 6. Dynamic Naming (Just for simulation fun)
            let demoName = 'AI Generated Web Dish';
            let demoSName = 'AI ජනනය කළ වෙබ් අඩවි ආහාරය';

            if (link.toLowerCase().includes('pasta')) {
                demoName = 'AI Web Pasta'; demoSName = 'AI පැස්ටා වට්ටෝරුව';
            } else if (link.toLowerCase().includes('curry')) {
                demoName = 'AI Web Curry'; demoSName = 'AI වෑංජන වට්ටෝරුව';
            }

            // 7. Construct the Recipe Object
            const newRecipe = {
                id: 'ai_' + Date.now(),
                name: demoName,
                s_name: demoSName,
                video: videoId, // Stores ID if found, otherwise empty string
                desc: `This recipe was analyzed from: ${link}`,
                ings: [
                    { n: 'Primary Ingredient', q: 1, u: 'kg' },
                    { n: 'Spices', q: 50, u: 'g' },
                    { n: 'Oil', q: 2, u: 'tbsp' },
                    { n: 'Water', q: 500, u: 'ml' }
                ],
                // Keeping the simple array structure from your original function.
                // If you want bilingual steps like processAIInput, change this to { en: [], si: [] }
                steps: [
                    'Analyze the ingredients listed in the link.',
                    'Prepare the main ingredients by washing and chopping.',
                    'Cook over medium heat according to the web instructions.',
                    'Serve hot and enjoy your meal.'
                ]
            };

            // 8. Save Data
            this.recipes.unshift(newRecipe);

            // Ensure we save to the specific DB list if your app uses it
            if (this.db && this.db.savedRecipes) {
                this.db.savedRecipes.unshift(newRecipe);
            }

            this.save();

            // 9. Navigation & Feedback
            this.nav('ai');
            this.toast(this.L('Recipe Generated!', 'වට්ටෝරුව ජනනය කරන ලදී!'), this.L('Success', 'සාර්ථකයි'), 'fa-hat-chef');

            // Clear input field
            linkInput.value = '';

        } catch (error) {
            console.error("Link processing error:", error);
            this.toast(this.L('Failed to analyze link.', 'සබැඳිය විශ්ලේෂණය කිරීමට අසමත් විය.'), this.L('Error', 'දෝෂය'));
        } finally {
            // 10. Hide Loader regardless of success or failure
            loader.classList.add('hidden');
        }
    }

    showRecipeModal(id) {
        const r = this.recipes.find(r => r.id === id);
        if (!r) return;

        // Handle legacy steps (array) vs new steps (object with en/si)
        const stepsEn = Array.isArray(r.steps) ? r.steps : (r.steps?.en || []);
        const stepsSi = Array.isArray(r.steps) ? [] : (r.steps?.si || []);

        const html = `
        <div class="space-y-4">
            <p class="text-gray-600 dark:text-gray-400 text-sm italic">${r.desc}</p>
            
            <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900">
                <h4 class="font-bold text-xs uppercase text-green-700 mb-2">Ingredients</h4>
                <div class="flex flex-wrap gap-2">
                    ${r.ings.map(i => `<span class="px-2 py-1 bg-white dark:bg-surface rounded border text-xs">${i.n} (${i.q}${i.u})</span>`).join('')}
                </div>
            </div>

            <div class="space-y-4">
                <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <h4 class="font-bold text-sm text-primary-600 mb-2"><i class="fa-solid fa-earth-americas mr-1"></i> English Instructions</h4>
                    <ol class="list-decimal pl-4 space-y-2 text-sm dark:text-gray-300">
                        ${stepsEn.map(s => `<li>${s}</li>`).join('')}
                    </ol>
                </div>

                ${stepsSi.length > 0 ? `
                <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900">
                    <h4 class="font-bold text-sm text-orange-700 mb-2 font-sinhala"><i class="fa-solid fa-language mr-1"></i> සිංහල උපදෙස්</h4>
                    <ol class="list-decimal pl-4 space-y-2 text-sm dark:text-gray-300 font-sinhala">
                        ${stepsSi.map(s => `<li>${s}</li>`).join('')}
                    </ol>
                </div>
                ` : ''}
            </div>
        </div>
        `;
        this.showModal(this.L(r.name, r.s_name), html);
    }

    // --- NEW: Filter Methods ---
    filterCookRecipes() {
        const query = document.getElementById('cook-search').value.toLowerCase();
        const select = document.getElementById('cook-recipe-select');
        select.innerHTML = `<option value="" disabled selected>${this.L('-- Choose --', '-- තෝරන්න --')}</option>` +
            this.recipes
                .filter(r => r.name.toLowerCase().includes(query) || r.s_name.toLowerCase().includes(query))
                .map(r => `<option value="${r.id}">${this.L(r.name, r.s_name)}</option>`)
                .join('');
    }

    filterAIRecipes() {
        const query = document.getElementById('ai-recipe-search').value.toLowerCase();
        const container = document.getElementById('ai-recipe-grid');
        const filtered = this.recipes.filter(r => r.name.toLowerCase().includes(query) || r.s_name.toLowerCase().includes(query));

        if (filtered.length === 0) {
            container.innerHTML = `<p class="text-gray-400 text-sm col-span-2 text-center py-4">No recipes found.</p>`;
            return;
        }

        container.innerHTML = filtered.map(r => `
            <div onclick="app.showRecipeModal('${r.id}')" class="bg-white dark:bg-surface p-4 rounded-xl shadow-sm border dark:border-gray-700 cursor-pointer hover:shadow-lg transition">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-bold text-lg dark:text-white">${r.name}</h4>
                        <h4 class="font-medium text-sm text-primary-600 font-sinhala">${r.s_name}</h4>
                    </div>
                    <span class="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded">${r.ings.length} items</span>
                </div>
            </div>
        `).join('');
    }

    // --- COOK MODE (V6.0 Feature) ---

    // REPLACE renderCook(el) with this updated version:
    renderCook(el) {
        el.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
            <h2 class="text-3xl font-bold dark:text-white">${this.L('Cook Mode', 'ඉවුම් පිහුම් මාදිලිය')}</h2>
            
            <div class="grid md:grid-cols-2 gap-4">
                 <!-- Auto Cook (Existing) -->
                <div class="bg-white dark:bg-surface p-6 rounded-3xl shadow-lg border dark:border-gray-700">
                    <h3 class="font-bold text-lg mb-4 text-primary-600"><i class="fa-solid fa-wand-magic-sparkles mr-2"></i> ${this.L('Select Recipe', 'වට්ටෝරුවක් තෝරන්න')}</h3>
                    
                    <!-- Searchable Recipe Select -->
                    <div class="relative mb-4">
                        <input type="text" id="cook-search" onkeyup="app.filterCookRecipes()" placeholder="${this.L('Search recipes...', 'වට්ටෝරු සොයන්න...')}" class="w-full p-3 pl-10 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none">
                        <i class="fa-solid fa-search absolute left-3 top-3.5 text-gray-400"></i>
                    </div>

                    <select id="cook-recipe-select" onchange="app.updateCookMode()" class="w-full p-3 mb-4 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none" size="5">
                        <option value="" disabled selected>${this.L('-- Choose --', '-- තෝරන්න --')}</option>
                        ${this.recipes.map(r => `<option value="${r.id}">${this.L(r.name, r.s_name)}</option>`).join('')}
                    </select>
                    <label class="text-xs font-bold text-gray-500 uppercase">${this.L('Servings', 'ප්‍රමාණය')}</label>
                    <input type="number" id="cook-servings" value="1" min="1" onchange="app.updateCookMode()" onkeyup="app.updateCookMode()" class="w-full p-3 mt-1 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none">
                    
                    <div id="cook-recipe-info" class="hidden mt-4">
                        <ul id="cook-stock-check" class="space-y-2 text-sm mb-4"></ul>
                        <button id="cook-deduct-btn" onclick="app.deductIngredients()" class="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:bg-gray-400">
                            ${this.L('Cook & Deduct', 'පිසීම සහ අඩු කිරීම')}
                        </button>
                    </div>
                </div>

                <!-- Manual Cook (New) -->
                <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-3xl shadow-lg border border-orange-200 dark:border-gray-600">
                    <h3 class="font-bold text-lg mb-4 text-orange-600 dark:text-orange-400"><i class="fa-solid fa-hand-holding-heart mr-2"></i> ${this.L('Manual Entry', 'අතින් ඇතුල් කිරීම')}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">${this.L('Cooked something not in the recipes? Log it manually here to update stock and train the AI.', 'වට්ටෝරුවල නැති දෙයක් ඉව්වද? තොග යාවත්කාලීන කිරීමට සහ AI පුහුණු කිරීමට එය මෙහි ඇතුලත් කරන්න.')}</p>
                    <button onclick="app.openManualCookModal()" class="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-md transition transform active:scale-95">
                        <i class="fa-solid fa-plus-circle mr-2"></i> ${this.L('Log Manual Meal', 'ආහාර වේලක් ඇතුලත් කරන්න')}
                    </button>
                </div>
            </div>
        </div>
    `;
    }

    // Add these new methods for Manual Cook Mode:

    // REPLACE openManualCookModal()
    openManualCookModal() {
        const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Special'];
        // Generate datalist options for ingredients
        const dataListOptions = CATALOG_MASTER.map(i => `<option value="${i.n}">${this.L(i.n, i.s)}</option>`).join('');

        const html = `
        <div class="space-y-4">
            <div>
                <label class="text-xs font-bold text-gray-500 uppercase">${this.L('Meal Name', 'ආහාරයේ නම')}</label>
                <div class="relative">
                    <input id="mc-name" placeholder="e.g., Fried Rice" class="w-full p-3 pr-10 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                    <button id="mc-name-mic" onclick="app.startVoiceSearch('mc-name')" class="absolute right-3 top-3 text-gray-400 hover:text-primary-600"><i class="fa-solid fa-microphone"></i></button>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">${this.L('Type', 'වර්ගය')}</label>
                    <select id="mc-type" class="w-full p-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                        ${mealTypes.map(t => `<option value="${t}">${t}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">${this.L('Date', 'දිනය')}</label>
                    <input type="date" id="mc-date" value="${new Date().toISOString().split('T')[0]}" class="w-full p-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                </div>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border dark:border-gray-700">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-bold text-gray-500 uppercase">${this.L('Ingredients', 'අමුද්‍රව්‍ය')}</span>
                    <button onclick="app.addMcRowWithSearch()" class="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300"><i class="fa-solid fa-plus"></i> Add</button>
                </div>
                <div id="mc-rows" class="space-y-2 max-h-48 overflow-y-auto"></div>
                <datalist id="catalog-dl">${dataListOptions}</datalist>
            </div>

            <button onclick="app.saveManualMeal()" class="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 mt-2">
                ${this.L('Save & Deduct Stock', 'සුරකින්න')}
            </button>
        </div>
    `;
        this.showModal(this.L('Log Meal Manually', 'ආහාර වේලක් ඇතුලත් කරන්න'), html);
        this.addMcRowWithSearch();
    }

    // Add this helper for the "Type or Select" row
    // Add this helper for the "Type or Select" row
    addMcRowWithSearch() {
        const container = document.getElementById('mc-rows');
        const div = document.createElement('div');
        div.className = "flex gap-2 items-center";
        div.innerHTML = `
        <div class="flex-1 relative">
            <input list="catalog-dl" placeholder="Type item..." class="mc-item w-full p-2 text-sm rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        </div>
        <input type="number" step="0.01" placeholder="Qty" class="mc-qty w-20 p-2 text-sm rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <select class="mc-unit w-24 p-2 text-sm rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
            <option value="pcs">pcs</option>
            <option value="tbsp">tbsp</option>
            <option value="tsp">tsp</option>
            <option value="cup">cup</option>
        </select>
        <button onclick="this.parentElement.remove()" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-times"></i></button>
    `;
        container.appendChild(div);
    }

    addMcRow() {
        const container = document.getElementById('mc-rows');
        const id = Date.now();
        const options = CATALOG_MASTER.map(i => `<option value="${i.n}">${this.L(i.n, i.s)} (${i.u})</option>`).join('');

        const div = document.createElement('div');
        div.className = "flex gap-2 items-center";
        div.innerHTML = `
        <select class="mc-item flex-1 p-2 text-sm rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">${options}</select>
        <input type="number" step="0.01" placeholder="Qty" class="mc-qty w-20 p-2 text-sm rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <button onclick="this.parentElement.remove()" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-times"></i></button>
    `;
        container.appendChild(div);
    }

    saveManualMeal() {
        const name = document.getElementById('mc-name').value;
        const type = document.getElementById('mc-type').value;
        const date = document.getElementById('mc-date').value;

        if (!name) return this.toast("Name required", "Error", "fa-triangle-exclamation");

        const rows = document.querySelectorAll('#mc-rows > div');
        let usedItems = [];

        rows.forEach(row => {
            const itemn = row.querySelector('.mc-item').value;
            let qty = parseFloat(row.querySelector('.mc-qty').value) || 0;
            const unit = row.querySelector('.mc-unit').value;

            // Convert to base units (g, ml, pcs) for consistent deduction
            if (unit === 'kg') qty = qty * 1000;
            if (unit === 'l') qty = qty * 1000;
            if (unit === 'tbsp') qty = qty * 15; // Approx
            if (unit === 'tsp') qty = qty * 5;   // Approx
            if (unit === 'cup') qty = qty * 240; // Approx

            if (qty > 0) usedItems.push({ n: itemn, q: qty, u_orig: unit }); // Store orig unit for history display if needed
        });

        if (usedItems.length === 0) return this.toast("Add at least one ingredient", "Error", "fa-triangle-exclamation");

        // 1. Deduct from Inventory
        usedItems.forEach(u => {
            const inv = this.db.inventory.find(i => i.n === u.n);
            if (inv) {
                // If inventory is in kg/l, convert deduction back or convert inventory?
                // Standard: Inventory seems to mock mixed units. 
                // Let's rely on simple subtraction but be aware of mismatches (kg vs g).
                // Simplification: Assume Inventory is tracked in 'g'/'ml' if it's granular, or 'kg' if bulk.
                // Better approach: Check Inventory Unit.

                let deduction = u.q;
                if (inv.u === 'kg' || inv.u === 'l') deduction = u.q / 1000; // Convert g->kg

                inv.qty = Math.max(0, inv.qty - deduction);
            }
        });

        // 2. Add to History
        this.db.mealHistory.push({
            id: 'meal_' + Date.now(),
            name, type, date,
            items: usedItems
        });


        this.save();
        this.closeModal();
        this.calculatePredictions(); // Recalculate AI stats
        this.toast(this.L('Meal Logged', 'ආහාරය ඇතුලත් විය'), this.L('Stock updated successfully', 'තොග යාවත්කාලීන විය'));
    }

    updateCookMode() {
        const id = document.getElementById('cook-recipe-select').value;
        const servings = parseFloat(document.getElementById('cook-servings').value) || 1;
        const recipe = this.recipes.find(r => r.id === id);
        const info = document.getElementById('cook-recipe-info');
        const list = document.getElementById('cook-stock-check');
        const btn = document.getElementById('cook-deduct-btn');

        if (!recipe || servings <= 0) {
            info.classList.add('hidden');
            btn.disabled = true;
            return;
        }

        let html = '';
        let canCook = true;

        recipe.ings.forEach(ing => {
            const invItem = this.db.inventory.find(i => i.n === ing.n);
            const needed = ing.q * servings; // Needed quantity
            const available = invItem ? invItem.qty : 0;
            const hasStock = available >= needed;

            html += `<li class="flex justify-between ${hasStock ? 'text-green-600 dark:text-green-400' : 'text-red-500'}">
                        <span>${this.L(ing.n, ing.s_name || ing.n)}: ${needed.toFixed(2)}${ing.u} ${this.L('(Needed)', '(අවශ්‍යයි)')}</span>
                        <span>${available.toFixed(2)}${invItem?.u || ing.u} ${hasStock ? this.L('(Available)', '(තිබේ)') : this.L('(Missing)', '(නැත)')}</span>
                    </li>`;

            if (!hasStock) canCook = false;
        });

        list.innerHTML = html;
        info.classList.remove('hidden');
        btn.disabled = false; // Allow simulation even with missing stock
    }

    deductIngredients() {
        const id = document.getElementById('cook-recipe-select').value;
        const servings = parseFloat(document.getElementById('cook-servings').value) || 1;
        const recipe = this.recipes.find(r => r.id === id);

        if (!recipe) return;

        let deductedCount = 0;
        recipe.ings.forEach(ing => {
            const invItem = this.db.inventory.find(i => i.n === ing.n);
            if (invItem) {
                const deduction = ing.q * servings;
                invItem.qty -= deduction;
                invItem.qty = Math.max(0, invItem.qty); // Prevent negative stock for simplicity
                deductedCount++;
            }
        });

        this.save();
        this.calculatePredictions();
        this.nav('dashboard');
        this.toast(this.L('Cooking finished!', 'ඉවුම් පිහුම් අවසන්.'), `${deductedCount} ${this.L('ingredients deducted from stock.', 'අමුද්‍රව්‍ය තොගයෙන් අඩු කරන ලදී.')}`, 'fa-utensils');
    }

    // --- ANALYTICS (V6.0 Feature) ---

    showFamilyDetailsModal() {
        const title = this.L('Setup Analytics', 'විශ්ලේෂණය සකසන්න');
        const desc = this.L('Enter your family size to enable daily consumption prediction and monthly budget estimates.', 'දෛනික පරිභෝජන අනාවැකි සහ මාසික අයවැය ඇස්තමේන්තු සක්‍රිය කිරීමට ඔබේ පවුලේ ප්‍රමාණය ඇතුළත් කරන්න.');
        const adultsLabel = this.L('Adults (Ages 18+)', 'වැඩිහිටියන් (අවුරුදු 18+)');
        const childrenLabel = this.L('Children (Ages < 18)', 'ළමුන් (අවුරුදු < 18)');
        const btnText = this.L('Save and Enable Analytics', 'සුරකින්න සහ විශ්ලේෂණය සක්‍රීය කරන්න');

        const currentAdults = this.db.familyDetails?.adults || 2;
        const currentChildren = this.db.familyDetails?.children || 0;

        const html = `
                    <div class="space-y-4">
                        <div class="flex gap-4">
                            <div class="flex-1">
                                <label class="text-xs font-bold text-gray-500 uppercase">${adultsLabel}</label>
                                <input type="number" id="adult-count" value="${currentAdults}" min="0" class="w-full p-3 mt-1 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none">
                            </div>
                        <div class="flex-1">
                                <label class="text-xs font-bold text-gray-500 uppercase">${childrenLabel}</label>
                                <input type="number" id="child-count" value="${currentChildren}" min="0" class="w-full p-3 mt-1 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none">
                            </div>
                        </div>
                        
                         <div class="mb-4">
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">${this.L('Target Monthly Budget (LKR)', 'ඉලක්කගත මාසික අයවැය')}</label>
                            <input type="number" id="fam-budget" value="${this.db.preferences?.targetBudget || 60000}" class="w-full p-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none" step="1000">
                        </div>

                        <button onclick="app.manageFamilyDetails()" class="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition">${btnText}</button>
                    </div>
                `;
        document.getElementById('family-modal-title').innerText = title;
        document.getElementById('family-modal-desc').innerText = desc;
        document.getElementById('family-form-body').innerHTML = html;
        document.getElementById('family-modal').classList.remove('hidden');
    }

    manageFamilyDetails() {
        const adults = parseInt(document.getElementById('adult-count').value) || 0;
        const children = parseInt(document.getElementById('child-count').value) || 0;
        const budget = parseInt(document.getElementById('fam-budget').value) || 60000;

        if (adults + children === 0) {
            this.toast(this.L('Please enter a valid family count.', 'කරුණාකර වලංගු පවුල් සංඛ්‍යාවක් ඇතුළත් කරන්න.'), this.L('Error', 'දෝෂය'), 'fa-exclamation-triangle');
            return;
        }

        this.db.familyDetails = { adults, children, total: adults + children, dateSet: Date.now() };

        if (!this.db.preferences) this.db.preferences = {};
        this.db.preferences.targetBudget = budget;

        this.db.settings.firstFamily = false;
        this.save();
        this.calculatePredictions();
        document.getElementById('family-modal').classList.add('hidden');
        this.toast(this.L('Analytics configured!', 'විශ්ලේෂණය සකසන ලදී!'), this.L('Setup Complete', 'සැකසීම සම්පූර්ණයි'));
        this.nav('analytics');
    }

    // REPLACE calculatePredictions() with this:
    calculatePredictions() {
        if (!this.db.familyDetails) return;

        // SMART LOGIC:
        // 1. Frequency-based multipliers.
        // 2. Group-based stock checking (if I have Samba, I don't need Nadu).

        const usageMap = {}; // store total used per item
        let firstDate = new Date();
        let hasHistory = this.db.mealHistory && this.db.mealHistory.length > 0;

        if (hasHistory) {
            this.db.mealHistory.forEach(m => {
                const d = new Date(m.date);
                if (d < firstDate) firstDate = d;
                m.items.forEach(i => {
                    usageMap[i.n] = (usageMap[i.n] || 0) + i.q;
                });
            });
        }

        const daysTracked = Math.max(1, (new Date() - firstDate) / (1000 * 60 * 60 * 24));
        const isAiActive = daysTracked >= 3 && hasHistory; // Require at least 3 days for AI

        const familySize = this.db.familyDetails.total;
        const dailyUseBase = 0.05; // Fallback per person

        this.db.analytics.predictions = {};
        this.db.analytics.monthlyNeed = {};
        let totalDailyVal = 0;
        let monthNeedVal = 0;

        // 1. Group Stock Calculation
        const groupStocks = {};
        this.db.inventory.forEach(i => {
            if (i.bg) {
                groupStocks[i.bg] = (groupStocks[i.bg] || 0) + i.qty;
            }
        });

        // 2. Iterate Catalog
        CATALOG_MASTER.forEach(catalogItem => {
            // --- PREFERENCE FILTERING ---
            const prefs = this.db.preferences || {};
            const diet = prefs.diet || 'non-veg';

            // Diet Check
            if (diet === 'veg' && (catalogItem.c === 'Meats' || catalogItem.c === 'Frozen Food' || catalogItem.c === 'Seafood')) return;
            if (diet === 'vegan' && (catalogItem.c === 'Meats' || catalogItem.c === 'Frozen Food' || catalogItem.c === 'Seafood' || catalogItem.c === 'Dairy')) return;

            // Brand/Type Check 
            if (prefs.allowedItems && prefs.allowedItems.length > 0) {
                if (catalogItem.bg && !prefs.allowedItems.includes(catalogItem.n)) return;
            }
            // ----------------------------
            const invItem = this.db.inventory.find(i => i.n === catalogItem.n);
            const currentQty = invItem ? invItem.qty : 0;
            const price = invItem ? invItem.p : catalogItem.p;

            // Get effective frequency
            const freq = invItem ? invItem.f : (catalogItem.f || 'd'); // d, w, m, a
            const group = invItem ? invItem.bg : (catalogItem.bg || '');

            // Calculate Base Consumption (Per "Usage Unit" - e.g. per Day, per Week)
            let estimatedConsumption = 0;

            // WIZARD OVERRIDE: Check if user set specific monthly target in wizard
            if (this.db.shoppingPlan && this.db.shoppingPlan[catalogItem.n]) {
                const plan = this.db.shoppingPlan[catalogItem.n];
                if (plan.target > 0) {
                    // Reverse engineer consumption based on freq
                    // If freq=d, consumption = target / 30
                    if (freq === 'd') estimatedConsumption = plan.target / 30;
                    else if (freq === 'w') estimatedConsumption = plan.target / 4;
                    else if (freq === 'm') estimatedConsumption = plan.target;
                    else estimatedConsumption = plan.target; // Fallback

                    // Force use of this estimate
                    usageMap[catalogItem.n] = plan.target; // Mock usage
                }
            } else if (isAiActive && usageMap[catalogItem.n]) {
                // AI Mode: Daily Average from real history
                estimatedConsumption = usageMap[catalogItem.n] / daysTracked;
            } else {
                // Heuristic Mode
                let multiplier = 1;
                // Adjust multiplier based on unit type and family
                if (catalogItem.u === 'kg') multiplier = 0.05 * familySize;
                else if (catalogItem.u === 'g') multiplier = 50 * familySize;
                else if (catalogItem.u === 'l') multiplier = 0.05 * familySize;
                else multiplier = 0.5 * familySize;

                estimatedConsumption = multiplier;
            }

            // Calculate Monthly Requirement based on Frequency
            let monthlyNeed = 0;
            if (freq === 'd') monthlyNeed = estimatedConsumption * 30;
            else if (freq === 'w') monthlyNeed = estimatedConsumption * 4;
            else if (freq === 'm') monthlyNeed = estimatedConsumption * 1;
            else if (freq === 'a') monthlyNeed = 0; // Adhoc: Only buy if explicitly needed, don't forecast

            // Calculate Deficit
            // If item is in a group, check GROUP stock, not just individual stock
            let effectiveStock = currentQty;
            let isGroupOK = false;

            if (group) {
                const totalGroupStock = groupStocks[group] || 0;
                // If I have ANY item in this group that covers the need? 
                // Simplification: If group stock > monthly need, assume we are fine for now.
                // Or better: If I have *enough* rice (Samba + Nadu), don't ask for more.
                if (totalGroupStock >= monthlyNeed) {
                    isGroupOK = true;
                }
                effectiveStock = totalGroupStock; // Visual aid, logic uses isGroupOK
            }

            // Deficit Logic
            let toBuy = 0;
            if (monthlyNeed > 0) {
                if (group && isGroupOK) {
                    toBuy = 0; // Covered by other items in group
                } else {
                    toBuy = Math.max(0, monthlyNeed - currentQty);
                }
            }

            // Save Prediction Data
            if (monthlyNeed > 0 || freq === 'a') {
                this.db.analytics.predictions[catalogItem.n] = {
                    daily: parseFloat(estimatedConsumption.toFixed(3)), // This is now "Consumption per Frequency Unit" roughly
                    monthly: parseFloat(monthlyNeed.toFixed(2)),
                    u: catalogItem.u,
                    source: isAiActive ? 'AI History' : 'Estimate',
                    freq: freq
                };

                if (toBuy > 0) {
                    this.db.analytics.monthlyNeed[catalogItem.n] = {
                        buy: parseFloat(toBuy.toFixed(2)),
                        val: toBuy * price,
                        isGroup: !!group
                    };
                    monthNeedVal += toBuy * price;
                }

                // Daily Value for dashboard (approximation for financial stats)
                if (freq === 'd') totalDailyVal += (estimatedConsumption * price);
                else if (freq === 'w') totalDailyVal += ((estimatedConsumption * price) / 7);
                else if (freq === 'm') totalDailyVal += ((estimatedConsumption * price) / 30);
            }
        });

        this.db.analytics.totalDailyUsage = totalDailyVal;
        this.db.analytics.totalMonthlyNeedValue = monthNeedVal;
        this.save();
    }


    // Add this method to generate the PDF
    downloadPDFReport() {
        if (!window.jspdf) {
            this.toast('PDF Library not loaded. Check internet.', 'Error', 'fa-exclamation');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const d = new Date();

        // Header
        doc.setFillColor(5, 150, 105); // Primary Color
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("Smart Kitchen AI - Monthly Report", 105, 15, null, null, "center");
        doc.setFontSize(12);
        doc.text(`Generated: ${d.toDateString()} | Type: Full Analytics`, 105, 25, null, null, "center");

        // Summary Section
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text("1. Financial Summary", 14, 50);

        const dailyVal = Math.round(this.db.analytics.totalDailyUsage).toLocaleString();
        const monthlyVal = Math.round(this.db.analytics.totalMonthlyNeedValue).toLocaleString();
        const totalItems = this.db.inventory.length;
        const stockVal = Math.round(this.db.inventory.reduce((a, b) => a + (b.qty * b.p), 0)).toLocaleString();

        const summaryData = [
            ['Total Inventory Value', `LKR ${stockVal}`],
            ['Estimated Daily Consumption', `LKR ${dailyVal}`],
            ['Forecasted Monthly Budget Needed', `LKR ${monthlyVal}`],
            ['Total Items in Stock', `${totalItems}`]
        ];

        doc.autoTable({
            startY: 55,
            head: [['Metric', 'Value']],
            body: summaryData,
            theme: 'grid',
            headStyles: { fillColor: [5, 150, 105] }
        });

        // Forecast Table
        let finalY = doc.lastAutoTable.finalY + 10;
        doc.text("2. AI Consumption Forecast (Monthly)", 14, finalY);

        const forecastRows = Object.keys(this.db.analytics.predictions).map(k => {
            const p = this.db.analytics.predictions[k];
            const item = CATALOG_MASTER.find(i => i.n === k);
            return [k, `${p.daily} ${p.u}`, `${p.monthly} ${p.u}`, p.source];
        });

        doc.autoTable({
            startY: finalY + 5,
            head: [['Item', 'Daily Avg', 'Monthly Est', 'Source']],
            body: forecastRows,
            theme: 'striped',
            styles: { fontSize: 8 }
        });

        // Cooking History
        doc.addPage();
        doc.text("3. Cooking Log (This Month)", 14, 20);

        const cookRows = this.db.mealHistory.slice(0, 15).map(m => { // Limit to last 15 for space
            const itemStr = m.items.map(i => `${i.n}(${i.q})`).join(', ');
            return [m.date, m.name, m.type, itemStr];
        });

        doc.autoTable({
            startY: 25,
            head: [['Date', 'Meal', 'Type', 'Ingredients Used']],
            body: cookRows,
            theme: 'grid',
            styles: { fontSize: 8 },
            columnStyles: { 3: { cellWidth: 80 } }
        });

        // NEW: Shopping Recommendation
        let nextY = doc.lastAutoTable.finalY + 10;
        doc.text("4. Recommended Shopping List (Immediate Needs)", 14, nextY);

        const shopRows = Object.keys(this.db.analytics.monthlyNeed).map(k => {
            const item = this.db.analytics.monthlyNeed[k];
            return [k, `${item.buy}`, `LKR ${Math.round(item.val).toLocaleString()}`, item.isGroup ? 'Group Shortfall' : 'Direct Shortfall'];
        });

        if (shopRows.length > 0) {
            doc.autoTable({
                startY: nextY + 5,
                head: [['Item', 'Qty Needed', 'Est. Cost', 'Reason']],
                body: shopRows,
                theme: 'striped',
                headStyles: { fillColor: [220, 38, 38] } // Red header for urgency
            });
            nextY = doc.lastAutoTable.finalY + 15;
        } else {
            doc.setFontSize(10);
            doc.text("No immediate items needed.", 14, nextY + 10);
            nextY += 20;
        }

        // NEW: Suggested Meal Plan (Simple Random Suggestion)
        doc.setFontSize(14);
        doc.text("5. Smart Meal Suggestion", 14, nextY);
        doc.setFontSize(10);

        const randomRecipe = this.recipes.length > 0 ? this.recipes[Math.floor(Math.random() * this.recipes.length)] : null;
        if (randomRecipe) {
            doc.text(`Based on your profile, we recommend trying: ${randomRecipe.name}`, 14, nextY + 8);
            doc.text(`Ingredients: ${randomRecipe.ing.join(', ')}`, 14, nextY + 14);
        } else {
            doc.text("Add recipes to get suggestions!", 14, nextY + 8);
        }

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text('Smart Kitchen AI Ultimate V7.6 - generated by KitchenAI', 14, 285);
            doc.text(`Page ${i} of ${pageCount}`, 190, 285, null, null, "right");
        }

        doc.save(`Kitchen_Report_${d.toISOString().split('T')[0]}.pdf`);
        this.toast('Comprehensive Report downloaded!', 'Success', 'fa-file-pdf');
    }

    renderAnalytics(el) {
        if (!this.db.familyDetails) return this.showFamilyDetailsModal();

        const pred = this.db.analytics.predictions;
        const recs = this.db.analytics.monthlyNeed;
        const en = this.db.settings.lang === 'en';

        const monthlyNeedsHtml = Object.keys(recs).length > 0 ? Object.keys(recs).map(name => {
            const item = recs[name];
            const invItem = CATALOG_MASTER.find(i => i.n === name) || {};
            const isGroup = item.isGroup;
            return `
                        <div class="flex justify-between p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                            <div>
                                <span class="font-medium">${en ? name : (invItem.s || name)}</span>
                                ${isGroup ? `<span class="text-[10px] bg-blue-100 text-blue-600 px-1 rounded ml-1">Group: ${invItem.bg}</span>` : ''}
                            </div>
                            <span class="font-bold text-red-600">${item.buy}${invItem.u} (${'LKR ' + Math.round(item.val).toLocaleString()})</span>
                        </div>
                    `;
        }).join('') : `<div class="text-center text-gray-500 py-4">${this.L('No immediate items need to be bought this month.', 'මෙම මාසයේදී වහාම මිලදී ගැනීමට අවශ්‍ය අයිතම නොමැත.')}</div>`;

        el.innerHTML = `
                    <div class="max-w-4xl mx-auto space-y-6 pb-20">
                        <h2 class="text-3xl font-bold dark:text-white">${this.L('Analytics Report', 'විශ්ලේෂණ වාර්තාව')}</h2>

                        <div class="bg-white dark:bg-surface p-6 rounded-3xl shadow-sm border dark:border-gray-700 flex justify-between items-center">
                            <div>
                                <p class="text-sm text-gray-500">${this.L('Family Size', 'පවුලේ ප්‍රමාණය')}</p>
                                <p class="text-xl font-bold dark:text-white">${this.db.familyDetails.total} ${this.L('Members', 'සාමාජිකයින්')}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs text-gray-500">${this.L('Setup Date:', 'සැකසූ දිනය:')} ${new Date(this.db.familyDetails.dateSet).toLocaleDateString()}</p>
                                <button onclick="app.showFamilyDetailsModal()" class="text-primary-600 text-sm hover:underline">${this.L('Edit', 'සංස්කරණය')}</button>
                            </div>
                        </div>

                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="bg-primary-50 dark:bg-primary-900/30 p-6 rounded-3xl shadow-lg border border-primary-200 dark:border-primary-900">
                                <p class="text-sm font-medium text-primary-700">${this.L('Estimated Daily Usage Value', 'ඇස්තමේන්තුගත දෛනික පරිභෝජන වටිනාකම')}</p>
                                <h4 class="text-2xl font-bold text-primary-600">LKR ${Math.round(this.db.analytics.totalDailyUsage).toLocaleString()}</h4>
                            </div>
                            <div class="bg-red-50 dark:bg-red-900/30 p-6 rounded-3xl shadow-lg border border-red-200 dark:border-red-900">
                                <p class="text-sm font-medium text-red-700">${this.L('Estimated Monthly Budget Need (Shortfall)', 'ඇස්තමේන්තුගත මාසික අයවැය අවශ්‍යතාව')}</p>
                                <h4 class="text-2xl font-bold text-red-600">LKR ${Math.round(this.db.analytics.totalMonthlyNeedValue).toLocaleString()}</h4>
                            </div>
                        </div>

                        <!-- NEW: Practical Insights Section -->
                        <div class="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex gap-4 items-start">
                             <div class="bg-indigo-100 dark:bg-indigo-800 p-3 rounded-full shrink-0">
                                <i class="fa-solid fa-lightbulb text-indigo-600 dark:text-indigo-300 text-xl"></i>
                             </div>
                             <div>
                                <h4 class="font-bold text-indigo-900 dark:text-indigo-100 text-lg mb-1">${this.L('Smart Insight', 'සුහුරු උපදෙස්')}</h4>
                                <p class="text-indigo-700 dark:text-indigo-300 text-sm leading-relaxed">
                                    ${this.db.analytics.totalMonthlyNeedValue > 5000
                ? this.L('Buying Rice and Sugar in bulk (5kg+) could save you ~15% this month compared to small packs.', 'සහල් සහ සීනි තොග වශයෙන් (5kg+) මිලදී ගැනීමෙන් කුඩා පැකට් හා සසඳන විට මෙම මාසයේ ~15% ඉතිරි කර ගත හැක.')
                : this.L('Your consumption is stable. Try exploring generic brands for spices to save an extra ~500 LKR.', 'ඔබේ පරිභෝජනය ස්ථාවරයි. අමතර රු. 500ක් පමණ ඉතිරි කර ගැනීමට කුළුබඩු සඳහා සාමාන්‍ය වෙළඳ නාම උත්සාහ කරන්න.')}
                                </p>
                             </div>
                        </div>

                        <div class="bg-white dark:bg-surface p-6 rounded-3xl shadow-lg border dark:border-gray-700 space-y-3">
                            <h3 class="font-bold text-xl dark:text-white">${this.L('Monthly Shopping Recommendation', 'මාසික සාප්පු සවාරි නිර්දේශය')}</h3>
                            <p class="text-sm text-gray-500">${this.L('Items predicted to run out this month based on current stock and family consumption.', 'දැනට පවතින තොග සහ පවුලේ පරිභෝජනය අනුව මෙම මාසයේ අවසන් වීමට නියමිත අයිතම.')}</p>
                            ${monthlyNeedsHtml}
                            <div class="pt-4"><button onclick="app.generateShoppingFromAnalytics()" class="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700">${this.L('Add All to Shopping List', 'සියල්ල සාප්පු ලැයිස්තුවට එක් කරන්න')}</button></div>
                        </div>

                        <div class="mt-6">
                            <button onclick="app.downloadPDFReport()" class="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold shadow-xl hover:bg-gray-900 transition flex items-center justify-center gap-3">
                                <i class="fa-solid fa-file-pdf text-xl text-red-400"></i>
                                <div class="text-left">
                                    <div class="text-sm">Generate Full Report</div>
                                    <div class="text-xs text-gray-400 font-normal">Includes Inventory, Usage, Forecasts, Shopping List & Meal Plan</div>
                                </div>
                            </button>
                        </div>

                    </div>
                `;
    }

    generateShoppingFromAnalytics() {
        const recs = this.db.analytics.monthlyNeed;
        let addedCount = 0;
        Object.keys(recs).forEach(name => {
            const item = recs[name];
            const catalogItem = CATALOG_MASTER.find(i => i.n === name);

            if (item.buy > 0 && catalogItem) {
                // Practical Rounding Logic
                let finalQty = item.buy;
                const u = catalogItem.u;

                if (u === 'kg' || u === 'l') {
                    if (finalQty < 0.2) finalQty = 0.25;      // Min buy 250g
                    else if (finalQty < 0.45) finalQty = 0.5; // Round to 500g
                    else if (finalQty < 0.95) finalQty = 1.0; // Round to 1kg
                    else finalQty = Math.ceil(finalQty * 2) / 2; // Round to nearest 0.5
                } else if (u === 'g' || u === 'ml') {
                    finalQty = Math.ceil(finalQty / 50) * 50; // 50g steps
                    if (finalQty < 50) finalQty = 100;
                } else {
                    // pcs, pack, can, bundle, etc.
                    finalQty = Math.ceil(finalQty);
                }

                const existing = this.db.shopping.find(i => i.name === name);
                if (existing) {
                    existing.qty = existing.qty + finalQty;
                } else {
                    this.db.shopping.push({ name: name, qty: finalQty, unit: catalogItem.u, checked: false });
                }
                addedCount++;
            }
        });

        this.save();
        this.nav('shopping');
        this.toast(this.L('List Updated!', 'ලැයිස්තුව යාවත්කාලීන කරන ලදී!'), `${addedCount} ${this.L('items added to shopping list.', 'අයිතම සාප්පු ලැයිස්තුවට එක් කරන ලදී.')}`);
    }

    // --- SETTINGS (V7.0/V6.0 Combined) ---

    renderSettings(el) { // V7.0/V6.0 Combined
        const en = this.db.settings.lang === 'en';
        el.innerHTML = `
                    <div class="max-w-2xl mx-auto space-y-6 animate-fade-in pb-20">
                        <h2 class="text-3xl font-bold dark:text-white mb-6">${this.L('Settings', 'සැකසීම්')}</h2>

                        <div class="bg-white dark:bg-surface p-5 rounded-2xl shadow-sm border dark:border-gray-700">
                            <h3 class="font-bold text-lg mb-2 dark:text-white">${this.L('Appearance', 'පෙනුම')}</h3>
                            <button onclick="app.toggleTheme()" class="w-full text-left py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-xl flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600">
                                <span>${this.L('Dark Mode', 'අඳුරු මාදිලිය')}</span>
                                <i class="fa-solid ${this.db.settings.theme === 'dark' ? 'fa-toggle-on text-primary-600' : 'fa-toggle-off text-gray-400'} text-2xl"></i>
                            </button>
                        </div>

                        <div class="bg-white dark:bg-surface p-5 rounded-2xl shadow-sm border dark:border-gray-700">
                            <h3 class="font-bold text-lg mb-2 dark:text-white">${this.L('Language', 'භාෂාව')}</h3>
                            <div class="flex gap-3">
                                <button onclick="app.setAppLang('en')" class="flex-1 py-3 rounded-xl font-bold transition ${en ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-white'}">English</button>
                                <button onclick="app.setAppLang('si')" class="flex-1 py-3 rounded-xl font-bold transition ${!en ? 'bg-primary-600 text-white font-sinhala' : 'bg-gray-100 dark:bg-gray-700 dark:text-white font-sinhala'}">සිංහල</button>
                            </div>
                        </div>

                        <div class="bg-white dark:bg-surface p-5 rounded-2xl shadow-sm border dark:border-gray-700 space-y-3">
                            <h3 class="font-bold text-lg mb-2 dark:text-white">${this.L('Data Management', 'දත්ත කළමනාකරණය')}</h3>
                            <button onclick="app.exportData()" class="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition"><i class="fa-solid fa-download mr-2"></i> ${this.L('Export Data (Backup)', 'දත්ත අපනයනය කරන්න')}</button>
                            <label class="w-full py-3 bg-yellow-50 text-yellow-600 rounded-xl font-bold hover:bg-yellow-100 transition flex items-center justify-center cursor-pointer">
                                <i class="fa-solid fa-upload mr-2"></i> ${this.L('Import Data (Restore)', 'දත්ත ආනයනය කරන්න')}
                                <input type="file" accept=".json" class="hidden" onchange="app.importData(this)">
                            </label>
                            <button onclick="if(confirm('${this.L('Are you sure you want to reset all data?', 'ඔබට සියලු දත්ත යළි පිහිටුවීමට අවශ්‍ය බව විශ්වාසද?')}')) { localStorage.clear(); location.reload(); }" class="w-full py-3 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition"><i class="fa-solid fa-triangle-exclamation mr-2"></i> ${this.L('Factory Reset', 'කර්මාන්තශාලා යළි පිහිටුවීම')}</button>
                            <button onclick="app.showOnboardingWizard()" class="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition"><i class="fa-solid fa-wand-magic-sparkles mr-2"></i> ${this.L('Run Setup Wizard', 'සැකසුම් ම법ක්කුව ධාවනය කරන්න')}</button>
                        </div>

                        <div class="bg-white dark:bg-surface p-5 rounded-2xl shadow-sm border dark:border-gray-700">
                            <h3 class="font-bold text-lg mb-2">${this.L('Market Data', 'වෙළඳපල දත්ත')}</h3>
                            <button onclick="app.syncPrices()" class="w-full py-3 bg-green-50 text-green-600 rounded-xl font-bold hover:bg-green-100 transition">${this.L('Sync Latest Prices (Simulated)', 'නවතම මිල ගණන් සමමුහුර්ත කරන්න')}</button>
                            <p class="text-xs text-gray-400 mt-2">${this.L('Last Sync:', 'අවසන් සමමුහුර්තකරණය:')} ${this.db.settings.lastSync ? new Date(this.db.settings.lastSync).toLocaleString() : 'Never'}</p>
                        </div>
                    </div>
                `;
    }

    setAppLang(lang) {
        this.db.settings.lang = lang;
        this.save();
        this.nav('settings'); // Re-render current view to apply language
    }

    syncPrices() {
        // Simulation: Update prices of a few items randomly
        this.db.inventory.forEach(i => {
            i.p = Math.round(i.p * (1 + (Math.random() - 0.5) * 0.1)); // Price change +/- 5%
            i.p = Math.max(1, i.p);
        });
        this.db.settings.lastSync = Date.now();
        this.save();
        this.toast(this.L('Market data synced!', 'වෙළඳපල දත්ත සමමුහුර්ත කරන ලදී!'), this.L('Success', 'සාර්ථකයි'), 'fa-cloud-arrow-up');
        this.nav('settings');
    }

    exportData() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.db));
        const node = document.createElement('a');
        node.setAttribute("href", dataStr);
        node.setAttribute("download", "kitchen_backup.json");
        document.body.appendChild(node);
        node.click();
        document.body.removeChild(node);
        this.toast(this.L('Data exported successfully!', 'දත්ත සාර්ථකව අපනයනය කරන ලදී!'), this.L('Success', 'සාර්ථකයි'), 'fa-download');
    }

    importData(input) {
        const fr = new FileReader();
        fr.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data && data.inventory && data.settings) {
                    this.db = { ...this.defaults(), ...data }; // Merge with defaults to prevent missing new keys
                    this.save();
                    location.reload();
                } else {
                    throw new Error('Invalid file structure.');
                }
            } catch (error) {
                this.toast(this.L("Data import failed: " + error.message, "දත්ත ආනයනය අසාර්ථක විය."), this.L('Error', 'දෝෂය'), 'fa-exclamation-triangle');
            }
        };
        fr.readAsText(input.files[0]);
    }

    // --- MODAL HELPERS ---
    showModal(title, content) {
        const modal = document.getElementById('family-modal');
        const titleEl = document.getElementById('family-modal-title');
        const descEl = document.getElementById('family-modal-desc');
        const bodyEl = document.getElementById('family-form-body');

        if (modal && titleEl && bodyEl) {
            titleEl.innerHTML = title; // Use innerHTML to support HTML tags
            descEl.innerHTML = ''; // Clear description
            bodyEl.innerHTML = content;
            modal.classList.remove('hidden');
        }
    }

    closeModal() {
        const modal = document.getElementById('family-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }


    /* --- ONBOARDING & PREFERENCES --- */
    showOnboardingWizard() {
        const steps = [
            {
                id: 'step-diet',
                title: this.L('Dietary Preferences', 'ආහාර මනාප'),
                html: `
                    <div class="space-y-4">
                        <label class="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                            <input type="radio" name="diet" value="non-veg" checked class="w-5 h-5 text-primary-600">
                            <div><span class="font-bold dark:text-white">Everything (Non-Veg)</span><p class="text-xs text-gray-500">I eat meat, fish, and vegetables.</p></div>
                        </label>
                        <label class="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                            <input type="radio" name="diet" value="veg" class="w-5 h-5 text-primary-600">
                            <div><span class="font-bold dark:text-white">Vegetarian</span><p class="text-xs text-gray-500">No meat or fish. Dairy is okay.</p></div>
                        </label>
                        <label class="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                            <input type="radio" name="diet" value="vegan" class="w-5 h-5 text-primary-600">
                            <div><span class="font-bold dark:text-white">Vegan</span><p class="text-xs text-gray-500">No animal products at all.</p></div>
                        </label>
                    </div>
                `
            },
            {
                id: 'step-family',
                title: this.L('Family Setup', 'පවුලේ විස්තර'),
                html: `
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-xs font-bold text-gray-500 uppercase">${this.L('Adults', 'වැඩිහිටියන්')}</label>
                                <input type="number" id="onb-adults" value="2" min="1" class="w-full p-4 text-xl font-mono rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                            </div>
                            <div>
                                <label class="text-xs font-bold text-gray-500 uppercase">${this.L('Children', 'ළමුන්')}</label>
                                <input type="number" id="onb-children" value="0" min="0" class="w-full p-4 text-xl font-mono rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                            </div>
                        </div>
                        <div>
                             <label class="text-xs font-bold text-gray-500 uppercase">${this.L('Cooking Frequency', 'ඉවුම් පිහුම් වාර ගණන')}</label>
                             <select id="onb-freq" class="w-full p-4 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white mt-1">
                                <option value="daily">Daily (3 meals)</option>
                                <option value="often">Often (Dinner/Weekend)</option>
                                <option value="rarely">Rarely (Eat out mostly)</option>
                             </select>
                        </div>
                    </div>
                `
            },
            {
                id: 'step-staples',
                title: this.L('What specific items do you buy?', 'ඔබ මිලදී ගන්නේ මොනවාද?'),
                desc: "Select the brands/types you actually use. We will hide the rest.",
                html: `
                    <div class="space-y-6 max-h-[50vh] overflow-y-auto custom-scroll pr-2">
                         <!-- Rice Group -->
                         <div>
                            <h4 class="font-bold mb-2 dark:text-white">Rice</h4>
                            <div class="grid grid-cols-1 gap-2">
                                ${CATALOG_MASTER.filter(i => i.bg === 'rice').map(i => `
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" class="pref-item w-4 h-4 rounded text-primary-600" value="${i.n}" checked>
                                        <span class="text-sm dark:text-gray-300">${i.n} (${this.L(i.s)})</span>
                                    </label>
                                `).join('')}
                            </div>
                         </div>
                         <!-- Milk Group -->
                         <div>
                            <h4 class="font-bold mb-2 dark:text-white">Milk/Dairy</h4>
                            <div class="grid grid-cols-1 gap-2">
                                ${CATALOG_MASTER.filter(i => i.c === 'Dairy' || i.bg === 'milk').map(i => `
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" class="pref-item w-4 h-4 rounded text-primary-600" value="${i.n}" checked>
                                        <span class="text-sm dark:text-gray-300">${i.n} (${this.L(i.s)})</span>
                                    </label>
                                `).join('')}
                            </div>
                         </div>
                         <!-- Meats Group (will be hidden if Veg selected, managed by JS) -->
                         <div id="pref-meats-section">
                            <h4 class="font-bold mb-2 dark:text-white">Meats</h4>
                            <div class="grid grid-cols-1 gap-2">
                                ${CATALOG_MASTER.filter(i => i.c === 'Meats' || i.c === 'Frozen Food').map(i => `
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" class="pref-item w-4 h-4 rounded text-primary-600" value="${i.n}" checked>
                                        <span class="text-sm dark:text-gray-300">${i.n} (${this.L(i.s)})</span>
                                    </label>
                                `).join('')}
                            </div>
                         </div>
                    </div>
                `
            }
        ];

        let currentStep = 0;

        const renderStep = () => {
            const s = steps[currentStep];
            const html = `
                <div id="onboarding-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div class="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div class="p-6 bg-primary-600 text-white">
                            <h2 class="text-2xl font-bold">${s.title}</h2>
                            ${s.desc ? `<p class="text-primary-100 text-sm mt-1">${s.desc}</p>` : ''}
                        </div>
                        <div class="p-6 flex-1 overflow-y-auto">
                            ${s.html}
                        </div>
                        <div class="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between">
                            ${currentStep > 0 ? `<button id="btn-prev" class="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold">Back</button>` : '<div></div>'}
                            <button id="btn-next" class="px-8 py-3 rounded-xl bg-primary-600 text-white font-bold shadow-lg shadow-primary-600/30">
                                ${currentStep === steps.length - 1 ? 'Finish & Save' : 'Next'}
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const existing = document.getElementById('onboarding-modal');
            if (existing) existing.remove();
            document.body.insertAdjacentHTML('beforeend', html);

            // Logic for Diet Selection (Step 0)
            if (currentStep === 0) {
                const radios = document.querySelectorAll('input[name="diet"]');
                radios.forEach(r => r.addEventListener('change', (e) => {
                    // Store temporarily or just let next step handle it?
                    // For simplicity, we just proceed.
                }));
            }

            // Buttons
            const btnNext = document.getElementById('btn-next');
            const btnPrev = document.getElementById('btn-prev');

            if (btnPrev) btnPrev.onclick = () => { currentStep--; renderStep(); };

            btnNext.onclick = () => {
                if (currentStep === 0) {
                    const diet = document.querySelector('input[name="diet"]:checked').value;
                    this.tempDiet = diet;
                }

                if (currentStep === 1) {
                    this.tempAdults = parseInt(document.getElementById('onb-adults').value) || 2;
                    this.tempChildren = parseInt(document.getElementById('onb-children').value) || 0;
                    this.tempFreq = document.getElementById('onb-freq').value;
                }

                if (currentStep === 2) {
                    // Gather checkboxes
                    const checked = Array.from(document.querySelectorAll('.pref-item:checked')).map(cb => cb.value);
                    const unchecked = Array.from(document.querySelectorAll('.pref-item:not(:checked)')).map(cb => cb.value);
                    this.tempAllowed = checked;
                    this.tempBlocked = unchecked;
                }

                if (currentStep < steps.length - 1) {
                    currentStep++;
                    renderStep();
                    // Post-render logic for Step 2 (Meats visibility)
                    if (currentStep === 2 && this.tempDiet !== 'non-veg') {
                        const meatSection = document.getElementById('pref-meats-section');
                        if (meatSection) meatSection.style.display = 'none';
                    }
                } else {
                    // FINISH
                    this.finishOnboarding();
                }
            };
        };

        renderStep();
    }

    finishOnboarding() {
        if (!this.db.preferences) this.db.preferences = {};
        this.db.preferences.diet = this.tempDiet || 'non-veg';
        this.db.preferences.allowedItems = this.tempAllowed || [];

        // Save Family Details
        const adults = this.tempAdults || 2;
        const children = this.tempChildren || 0;
        this.db.familyDetails = {
            adults: adults,
            children: children,
            total: adults + children,
            dateSet: Date.now()
        };

        // Save Budget from Step 3 (if it exists in the steps array) or defaults
        // Note: The wizard structure implies Budget might be step 3, but we only have 0,1,2 defined in the previous edit?
        // Wait, I missed adding step 3 explicitly in the logic? 
        // No, the previous edit ADDED step-family. 
        // Original: Diet(0), Staples(1), Budget(2).
        // New: Diet(0), Family(1), Staples(2). 
        // Where is Budget? I removed it in my thought but maybe the code still has it?
        // actually looking at the previous multi_replace in step 147, I inserted Family at index 1.
        // So Staples is 2. 
        // Is there a Step 3 (Budget)? 
        // The original code had Budget at the end. 
        // If I inserted Family, then Staples is 2, Budget is 3. 
        // So this logic handles 0, 1, 2. 
        // I need to ensure Budget is handled if it exists.

        const budgetInput = document.getElementById('onb-budget');
        if (budgetInput) {
            this.db.preferences.targetBudget = parseInt(budgetInput.value) || 60000;
        }

        this.db.settings.firstRun = false;

        this.save();
        document.getElementById('onboarding-modal').remove();
        this.toast(this.L("Preferences Saved! App is now customized for you.", "මනාප සුරැකේ! යෙදුම දැන් ඔබ වෙනුවෙන් සකසා ඇත."));
        this.calculatePredictions();
        this.renderAnalytics(document.getElementById('main-content'));
    }

    // --- HELP VIEW (V7.0 Feature) ---

    // REPLACE renderHelp(el) with this updated version:
    renderHelp(el) {
        const en = this.db.settings.lang === 'en';

        // Map the updated GUIDE_TEXT
        const contentHtml = GUIDE_TEXT[this.db.settings.lang].map((c, idx) => `
        <div class="bg-white dark:bg-surface p-5 rounded-2xl shadow-sm border-l-4 border-primary-500 animate-slide-up" style="animation-delay: ${idx * 50}ms">
            <h3 class="font-bold text-lg dark:text-white ${en ? '' : 'font-sinhala'}">${c.t}</h3>
            <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm ${en ? '' : 'font-sinhala'}">${c.d}</p>
        </div>
    `).join('');

        el.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
            <div class="flex items-center gap-4 mb-2">
                <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl">
                    <i class="fa-solid fa-circle-question"></i>
                </div>
                <div>
                    <h2 class="text-3xl font-bold dark:text-white">${this.L('Help & Guide', 'උදව් සහ මාර්ගෝපදේශය')}</h2>
                    <p class="text-gray-500 text-sm">${this.L('Master your Smart Kitchen AI V7.6', 'ඔබේ Smart Kitchen AI V7.6 භාවිතා කරන ආකාරය')}</p>
                </div>
            </div>

            <div class="space-y-4">
                ${contentHtml}
            </div>

            <!-- Troubleshooting Section -->
            <div class="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-3xl">
                <h3 class="font-bold dark:text-white mb-2"><i class="fa-solid fa-screwdriver-wrench mr-2"></i> ${this.L('Troubleshooting', 'දෝෂ නිරාකරණය')}</h3>
                <p class="text-sm text-gray-500 mb-4">${this.L('If the app behaves unexpectedly, try resetting the data.', 'යෙදුම නිසි ලෙස ක්‍රියා නොකරන්නේ නම්, දත්ත යළි පිහිටුවීමට උත්සාහ කරන්න.')}</p>
                
                <div class="flex gap-3">
                    <button onclick="if(confirm('Reset all data?')) { localStorage.clear(); location.reload(); }" class="px-6 py-2 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition">
                        ${this.L('Factory Reset', 'කර්මාන්තශාලා යළි පිහිටුවීම')}
                    </button>
                    <button onclick="location.reload()" class="px-6 py-2 bg-white dark:bg-gray-700 dark:text-white text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition">
                        ${this.L('Reload App', 'යෙදුම නැවත පූරණය කරන්න')}
                    </button>
                </div>
            </div>
        </div>
    `;
    }

}

// STARTUP
let app;
try {
    app = new SmartKitchenApp();
} catch (error) {
    console.error("CRITICAL APP ERROR:", error);
    alert("Application failed to start: " + error.message);
}

// Error Handler
window.onerror = function () {
    document.getElementById('loader-reset-btn').style.display = 'block';
    document.getElementById('loader-hint').classList.remove('hidden');
}