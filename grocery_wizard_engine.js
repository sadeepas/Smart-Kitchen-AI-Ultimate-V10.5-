/**
 * Enhanced Simple Grocery Setup Wizard Engine
 * Comprehensive onboarding for Sri Lankan households
 * Collects detailed preferences, pack sizes, monthly consumption, and stock levels
 */

class GroceryWizard {
    constructor(app) {
        this.app = app;
        this.currentStep = 0;
        this.data = {
            // Household Details
            familySize: { adults: 2, children: 0, total: 2 },
            dietary: [],
            shoppingFreq: 'Weekly',
            shoppingLocations: [],
            monthlyBudget: 0,

            // Category Preferences (stores selected items with details)
            rice: {},
            lentils: {},
            sugars: {},
            oils: {},
            beverages: {},
            dairy: {},
            fish: {},
            meat: {},
            vegetables: [],
            fruits: [],
            spices: {},
            baking: {},
            household: {},
            baby: {},

            // Quick Bypass data
            quickBypass: false,
            bypassQuantities: {}
        };

        // Load baseline data from SriLankaBudgetData if available
        this.budgetData = typeof SriLankaBudgetData !== 'undefined' ? SriLankaBudgetData : null;

        // Load AI training questions by default
        this.aiQuestions = this.loadAIQuestions();
    }

    /**
     * Load AI training questions from customKnowledge database
     * @returns {Array} Array of Q&A objects from AI training data
     */
    loadAIQuestions() {
        // Load from app's custom knowledge base (trained AI questions)
        return this.app.db.customKnowledge || [];
    }

    /**
     * Get AI questions relevant to a specific category or topic
     * @param {string} category - The category to filter by (e.g., 'cooking', 'household', 'rice')
     * @returns {Array} Filtered array of relevant Q&A objects
     */
    getRelevantQuestions(category) {
        if (!this.aiQuestions || this.aiQuestions.length === 0) return [];

        const keywords = {
            'welcome': ['app', 'navigation', 'ocr', 'scan', 'offline', 'data', 'backup'],
            'household': ['family', 'budget', 'shopping', 'monthly', 'grocery'],
            'rice': ['rice', 'grain', 'cook rice', 'ratio', 'basmati', 'samba'],
            'cooking': ['cook', 'recipe', 'tip', 'boil', 'simmer', 'substitute'],
            'tips': ['tip', 'how to', 'prevent', 'store', 'keep', 'make'],
            'general': ['hi', 'hello', 'help', 'guide', 'what']
        };

        const categoryKeywords = keywords[category] || [];

        return this.aiQuestions.filter(q => {
            const question = q.q.toLowerCase();
            return categoryKeywords.some(kw => question.includes(kw));
        }).slice(0, 3); // Limit to top 3 most relevant
    }

    /**
     * Get a random cooking tip from AI training data
     * @returns {Object|null} Random tip Q&A object or null if none available
     */
    getRandomTip() {
        const tips = this.getRelevantQuestions('tips');
        if (tips.length === 0) return null;
        return tips[Math.floor(Math.random() * tips.length)];
    }

    /**
     * Render AI help bubble with contextual questions
     * @param {string} category - Category for filtering questions
     * @returns {string} HTML string for AI help section
     */
    renderAIHelp(category) {
        const questions = this.getRelevantQuestions(category);
        if (questions.length === 0) return '';

        const questionsHTML = questions.map(q => `
            <details class="text-xs mb-2">
                <summary class="cursor-pointer text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800">
                    <i class="fa-solid fa-circle-question mr-1"></i> ${q.q}
                </summary>
                <p class="mt-1 ml-5 text-gray-600 dark:text-gray-400">${q.a}</p>
            </details>
        `).join('');

        return `
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800 mt-4">
                <h4 class="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-2">
                    <i class="fa-solid fa-brain"></i> AI Assistant Tips
                </h4>
                ${questionsHTML}
            </div>
        `;
    }

    start() {
        window.wizard = this; // Make accessible to onclick handlers
        this.currentStep = 1;
        this.renderStep();
    }

    renderStep() {
        let title = '';
        let content = '';
        let showNext = true;
        let showSkip = true;

        switch (this.currentStep) {
            case 1:
                title = "Welcome to Smart Kitchen AI";
                content = this.renderWelcome();
                showNext = false;
                break;
            case 2:
                title = "Household & Habits";
                content = this.renderHousehold();
                break;
            case 3:
                title = "Rice & Grains";
                content = this.renderRiceGrains();
                break;
            case 4:
                title = "Lentils & Pulses";
                content = this.renderLentils();
                break;
            case 5:
                title = "Sugars & Sweeteners";
                content = this.renderSugars();
                break;
            case 6:
                title = "Cooking Oils";
                content = this.renderOils();
                break;
            case 7:
                title = "Tea & Coffee";
                content = this.renderBeverages();
                break;
            case 8:
                title = "Milk & Dairy";
                content = this.renderDairy();
                break;
            case 9:
                title = "Fish & Seafood";
                content = this.renderFish();
                break;
            case 10:
                title = "Meat & Eggs";
                content = this.renderMeat();
                break;
            case 11:
                title = "Fresh Produce";
                content = this.renderProduce();
                break;
            case 12:
                title = "Spices & Flavorings";
                content = this.renderSpices();
                break;
            case 13:
                title = "Household Items";
                content = this.renderHousehold();
                break;
            case 14:
                title = "Review & Insights";
                content = this.renderReview();
                showNext = false;
                showSkip = false;
                break;
        }

        // Render to App Modal
        const footer = `
            <div class="flex justify-between mt-6 pt-4 border-t dark:border-gray-700">
                ${showSkip ? `<button onclick="window.wizard.skipStep()" class="text-gray-400 text-sm hover:text-gray-600">Skip</button>` : '<div></div>'}
                <div class="flex gap-2">
                    ${this.currentStep > 1 ? `<button onclick="window.wizard.prev()" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold text-sm">Back</button>` : ''}
                    ${showNext ? `<button onclick="window.wizard.next()" class="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-primary-700">Next <i class="fa-solid fa-arrow-right ml-1"></i></button>` : ''}
                </div>
            </div>
        `;

        const progressPercent = Math.round((this.currentStep / 14) * 100);
        const progressBar = `
            <div class="mb-4">
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Step ${this.currentStep}/14</span>
                    <span>${progressPercent}% Complete</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-primary-600 h-2 rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
                </div>
            </div>
        `;

        this.app.showModal(
            `${title} <span class="text-xs text-gray-400 ml-2">Setup Wizard</span>`,
            progressBar + content + footer
        );
    }

    renderWelcome() {
        // Get AI-powered welcome tips
        const aiTip = this.getRandomTip();
        const aiTipHTML = aiTip ? `
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-xl border border-purple-200 dark:border-purple-800 text-left">
                <p class="text-xs font-bold text-purple-700 dark:text-purple-300 mb-1">
                    <i class="fa-solid fa-lightbulb mr-1"></i> Quick Tip from AI:
                </p>
                <p class="text-xs text-purple-600 dark:text-purple-400">${aiTip.a}</p>
            </div>
        ` : '';

        return `
            <div class="text-center space-y-4">
                <div class="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center mx-auto text-4xl mb-4">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <h3 class="text-xl font-bold dark:text-white">Let's Customize Your Kitchen AI!</h3>
                <p class="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    This wizard will learn your grocery habits, add your favorite items to inventory with accurate prices, 
                    and make monthly shopping recommendations super accurate (with bulk savings tips!).
                </p>
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-900">
                    <p class="text-sm text-blue-700 dark:text-blue-300">
                        <i class="fa-solid fa-clock mr-2"></i>
                        Takes about 10–15 minutes, but you can skip anything. 
                        Completing it unlocks smarter analytics, better recipes, and money-saving suggestions.
                    </p>
                </div>
                ${aiTipHTML}
                ${this.renderAIHelp('welcome')}
                <div class="grid gap-3 mt-6">
                    <button onclick="window.wizard.next()" class="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-xl hover:bg-primary-700 transition flex items-center justify-center gap-3">
                        <i class="fa-solid fa-play-circle"></i> Start Full Setup
                    </button>
                    <button onclick="window.wizard.showQuickBypass()" class="w-full py-3 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-xl font-bold hover:bg-indigo-200 transition">
                        <i class="fa-solid fa-bolt"></i> Quick Bypass (2 minutes)
                    </button>
                </div>
                <p class="text-xs text-center text-gray-400 mt-4">You can re-run this wizard anytime from Settings</p>
            </div>
        `;
    }

    showQuickBypass() {
        const content = `
            <div class="space-y-4">
                <p class="text-sm text-gray-600 dark:text-gray-300">
                    Short on time? Just tell us approximate monthly quantities for major categories:
                </p>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Rice (kg/month)</label>
                        <input type="number" id="bp-rice" value="30" class="w-full p-2 rounded-lg border dark:bg-gray-800">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Dhal (kg/month)</label>
                        <input type="number" id="bp-dhal" value="5" class="w-full p-2 rounded-lg border dark:bg-gray-800">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Cooking Oil (L/month)</label>
                        <input type="number" id="bp-oil" value="3" class="w-full p-2 rounded-lg border dark:bg-gray-800">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Milk Powder (kg/month)</label>
                        <input type="number" id="bp-milk" value="2" class="w-full p-2 rounded-lg border dark:bg-gray-800">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Sugar (kg/month)</label>
                        <input type="number" id="bp-sugar" value="3" class="w-full p-2 rounded-lg border dark:bg-gray-800">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Fish/Seafood (kg/month)</label>
                        <input type="number" id="bp-fish" value="8" class="w-full p-2 rounded-lg border dark:bg-gray-800">
                    </div>
                </div>
                <button onclick="window.wizard.saveQuickBypass()" class="w-full py-3 bg-primary-600 text-white rounded-xl font-bold">
                    Save & Finish Setup
                </button>
            </div>
        `;
        this.app.showModal("Quick Bypass Setup", content);
    }

    saveQuickBypass() {
        // Collect bypass data
        this.data.quickBypass = true;
        this.data.bypassQuantities = {
            rice: parseFloat(document.getElementById('bp-rice').value) || 30,
            dhal: parseFloat(document.getElementById('bp-dhal').value) || 5,
            oil: parseFloat(document.getElementById('bp-oil').value) || 3,
            milk: parseFloat(document.getElementById('bp-milk').value) || 2,
            sugar: parseFloat(document.getElementById('bp-sugar').value) || 3,
            fish: parseFloat(document.getElementById('bp-fish').value) || 8
        };

        this.finalize();
    }

    renderHousehold() {
        const adults = this.data.familySize.adults || 2;
        const children = this.data.familySize.children || 0;

        return `
            <div class="space-y-5">
                <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <h4 class="font-bold text-sm mb-3">Family Size</h4>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Adults</label>
                            <input type="number" id="wiz-adults" value="${adults}" min="1" 
                                class="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-700 text-center font-bold"
                                onchange="window.wizard.data.familySize.adults = parseInt(this.value)">
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Children</label>
                            <input type="number" id="wiz-children" value="${children}" min="0"
                                class="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-700 text-center font-bold"
                                onchange="window.wizard.data.familySize.children = parseInt(this.value)">
                        </div>
                    </div>
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase mb-2 block">Dietary Preferences (Select all that apply)</label>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        ${['Non-Vegetarian', 'Vegetarian', 'Vegan', 'Halal', 'No Beef/Pork', 'Low-Sugar'].map(d => `
                            <label class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100">
                                <input type="checkbox" value="${d}" class="rounded text-primary-600" 
                                    onchange="window.wizard.updateArray('dietary', this.value, this.checked)">
                                <span class="text-xs">${d}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase mb-2 block">Shopping Frequency</label>
                    <select id="wiz-freq" class="w-full p-3 rounded-xl border dark:bg-gray-800 dark:border-gray-700"
                        onchange="window.wizard.data.shoppingFreq = this.value">
                        <option>Daily</option>
                        <option selected>Weekly</option>
                        <option>Bi-weekly</option>
                        <option>Monthly</option>
                    </select>
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase mb-2 block">Shopping Locations (Select all)</label>
                    <div class="space-y-2 text-sm">
                        ${['Local Market/Pola', 'Supermarket', 'Wholesale (Pettah/Dambulla)', 'Small Kadé', 'Online Delivery'].map(loc => `
                            <label class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer">
                                <input type="checkbox" value="${loc}" class="rounded text-primary-600"
                                    onchange="window.wizard.updateArray('shoppingLocations', this.value, this.checked)">
                                <span class="text-xs">${loc}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase mb-1 block">Monthly Grocery Budget (Optional)</label>
                    <div class="relative">
                        <span class="absolute left-3 top-3 text-gray-500">Rs.</span>
                        <input type="number" id="wiz-budget" placeholder="e.g., 60000"
                            class="w-full p-3 pl-12 rounded-xl border dark:bg-gray-800 dark:border-gray-700"
                            onchange="window.wizard.data.monthlyBudget = parseInt(this.value) || 0">
                    </div>
                </div>
                ${this.renderAIHelp('household')}
            </div>
        `;
    }

    renderRiceGrains() {
        return `
            <div class="space-y-4">
                <p class="text-sm text-gray-500">Select rice types you regularly buy, then specify details:</p>
                <div class="space-y-3 max-h-[400px] overflow-y-auto">
                    ${this.renderItemGroup('rice', 'Rice', [
            { id: 'nadu', name: 'Nadu Rice', packs: ['1kg', '5kg', '10kg', '25kg'], price: 227 },
            { id: 'samba', name: 'Samba Rice', packs: ['1kg', '5kg', '10kg', '25kg'], price: 245 },
            { id: 'kekulu', name: 'Kekulu Rice', packs: ['1kg', '5kg', '10kg'], price: 280 },
            { id: 'basmati', name: 'Basmati', packs: ['1kg', '5kg'], price: 650 },
            { id: 'parboiled', name: 'Parboiled/Steamed', packs: ['5kg', '10kg'], price: 215 }
        ])}
                </div>
                ${this.renderAIHelp('rice')}
            </div>
        `;
    }

    renderLentils() {
        return `
            <div class="space-y-4">
                <p class="text-sm text-gray-500">Which lentils/pulses do you buy?</p>
                <div class="space-y-3">
                    ${this.renderItemGroup('lentils', 'Lentils', [
            { id: 'red_dhal', name: 'Red/Masoor Dhal', packs: ['500g', '1kg', '5kg'], price: 320 },
            { id: 'mysore', name: 'Mysore Dhal', packs: ['500g', '1kg', '5kg'], price: 340 },
            { id: 'chickpea', name: 'Chickpea/Kadala', packs: ['500g', '1kg'], price: 380 },
            { id: 'green_gram', name: 'Green Gram/Mung', packs: ['500g', '1kg'], price: 350 }
        ])}
                </div>
                ${this.renderAIHelp('cooking')}
            </div>
        `;
    }

    renderSugars() {
        return `
            <div class="space-y-4">
                <p class="text-sm text-gray-500">Sugar and sweeteners you use:</p>
                ${this.renderItemGroup('sugars', 'Sugars', [
            { id: 'white', name: 'White Sugar', packs: ['1kg', '5kg'], price: 280 },
            { id: 'brown', name: 'Brown Sugar', packs: ['1kg', '5kg'], price: 320 },
            { id: 'jaggery', name: 'Kithul/Jaggery', packs: ['500g', '1kg'], price: 450 }
        ])}
            </div>
        `;
    }

    renderOils() {
        return `
            <div class="space-y-4">
                <p class="text-sm text-gray-500">Cooking oils you regularly purchase:</p>
                ${this.renderItemGroup('oils', 'Oils', [
            { id: 'coconut', name: 'Pure Coconut Oil', packs: ['500ml', '1L', '5L'], price: 650 },
            { id: 'palm', name: 'Palm Olein/Farm Oil', packs: ['1L', '5L'], price: 520 },
            { id: 'sunflower', name: 'Sunflower/Veg Oil', packs: ['1L', '5L'], price: 850 },
            { id: 'sesame', name: 'Gingelly/Sesame', packs: ['500ml', '1L'], price: 1200 }
        ])}
            </div>
        `;
    }

    renderBeverages() {
        return `
            <div class="space-y-4">
                <p class="text-sm text-gray-500">Tea, coffee, and malt drinks:</p>
                <div class="space-y-3">
                    ${this.renderItemGroup('beverages', 'Beverages', [
            { id: 'tea_loose', name: 'Loose Ceylon Tea', packs: ['100g', '250g', '500g'], price: 450 },
            { id: 'tea_bags', name: 'Tea Bags', packs: ['25 bags', '100 bags'], price: 280 },
            { id: 'nescafe', name: 'Nescafé Instant', packs: ['50g', '200g'], price: 600 },
            { id: 'milo', name: 'Milo', packs: ['400g', '1kg'], price: 800 },
            { id: 'nestomalt', name: 'Nestomalt', packs: ['400g'], price: 750 }
        ])}
                </div>
                ${this.renderAIHelp('cooking')}
            </div>
        `;
    }

    renderDairy() {
        return `
            <div class="space-y-4">
                <p class="text-sm text-gray-500">Milk powder, dairy, and related items:</p>
                ${this.renderItemGroup('dairy', 'Dairy', [
            { id: 'anchor', name: 'Anchor Full Cream', packs: ['400g', '1kg', '2.5kg'], price: 900 },
            { id: 'ratthi', name: 'Ratthi Milk Powder', packs: ['400g', '1kg'], price: 850 },
            { id: 'fresh_milk', name: 'Fresh Liquid Milk', packs: ['1L packet'], price: 400 },
            { id: 'yogurt', name: 'Yogurt/Curd', packs: ['80g cup', '400g tub'], price: 90 },
            { id: 'butter', name: 'Butter', packs: ['100g', '250g'], price: 850 }
        ])}
                ${this.renderAIHelp('tips')}
            </div>
        `;
    }

    renderFish() {
        return `
            <div class="space-y-4">
                <p class="text-sm text-gray-500">Fish and seafood you buy regularly:</p>
                ${this.renderItemGroup('fish', 'Fish', [
            { id: 'fresh_tuna', name: 'Fresh Tuna/Balaya', packs: ['1kg'], price: 1800 },
            { id: 'fresh_mackerel', name: 'Fresh Mackerel/Paraw', packs: ['1kg'], price: 1200 },
            { id: 'canned_fish', name: 'Canned Mackerel/Tuna', packs: ['425g can'], price: 450 },
            { id: 'dry_fish', name: 'Dried Fish/Katta', packs: ['250g', '500g', '1kg'], price: 1800 },
            { id: 'sprats', name: 'Sprats/Halmasso', packs: ['500g', '1kg'], price: 1200 },
            { id: 'maldive_fish', name: 'Maldive Fish Chips', packs: ['100g', '250g', '1kg'], price: 450 }
        ])}
            </div>
        `;
    }

    renderMeat() {
        return `
            <div class="space-y-4">
                <p class="text-sm text-gray-500">Chicken, meat, and eggs:</p>
                ${this.renderItemGroup('meat', 'Meat', [
            { id: 'chicken', name: 'Fresh Chicken', packs: ['1kg'], price: 1250 },
            { id: 'eggs_brown', name: 'Brown Eggs', packs: ['6 eggs', '12 eggs', '30 tray'], price: 55 },
            { id: 'eggs_white', name: 'White Eggs', packs: ['12 eggs', '30 tray'], price: 50 },
            { id: 'sausages', name: 'Frozen Sausages', packs: ['250g', '500g'], price: 650 },
            { id: 'nuggets', name: 'Chicken Nuggets', packs: ['400g'], price: 750 }
        ])}
            </div>
        `;
    }

    renderProduce() {
        return `
            <div class="space-y-4">
                <div>
                    <label class="text-sm font-bold mb-2 block">Vegetable buying frequency:</label>
                    <select class="w-full p-2 rounded-lg border dark:bg-gray-800">
                        <option>Daily</option>
                        <option>2-3x/week</option>
                        <option>Weekly</option>
                    </select>
                </div>
                <div>
                    <label class="text-sm font-bold mb-2 block">Always-buy vegetables (Select all):</label>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        ${['Onions', 'Potatoes', 'Tomatoes', 'Carrots', 'Beans', 'Cabbage', 'Leeks', 'Pumpkin', 'Brinjal', 'Green Chillies'].map(veg => `
                            <label class="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer">
                                <input type="checkbox" value="${veg}" class="rounded"
                                    onchange="window.wizard.updateArray('vegetables', this.value, this.checked)">
                                ${veg}
                            </label>
                        `).join('')}
                    </div>
                </div>
                <div>
                    <label class="text-sm font-bold mb-2 block">Fruits (regular/seasonal):</label>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        ${['Bananas', 'Papaya', 'Pineapple', 'Mangoes', 'Oranges', 'Apples'].map(fruit => `
                            <label class="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer">
                                <input type="checkbox" value="${fruit}" class="rounded"
                                    onchange="window.wizard.updateArray('fruits', this.value, this.checked)">
                                ${fruit}
                            </label>
                        `).join('')}
                    </div>
                </div>
                ${this.renderAIHelp('tips')}
            </div>
        `;
    }

    renderSpices() {
        return `
            <div class="space-y-4">
                <p class="text-sm text-gray-500">Common spices and condiments:</p>
                ${this.renderItemGroup('spices', 'Spices', [
            { id: 'chili_powder', name: 'Chili Powder', packs: ['100g', '500g', '1kg'], price: 1200 },
            { id: 'curry_powder', name: 'Curry Powder', packs: ['100g', '500g', '1kg'], price: 600 },
            { id: 'turmeric', name: 'Turmeric Powder', packs: ['100g', '500g'], price: 250 },
            { id: 'pepper', name: 'Black Pepper', packs: ['100g', '250g'], price: 200 },
            { id: 'cinnamon', name: 'Cinnamon', packs: ['50g', '100g'], price: 400 },
            { id: 'goraka', name: 'Goraka', packs: ['100g', '250g'], price: 200 }
        ])}
            </div>
        `;
    }

    renderHousehold() {
        return `
            <div class="space-y-4">
                <p class="text-sm text-gray-500">Household and personal care items:</p>
                ${this.renderItemGroup('household', 'Household', [
            { id: 'wash_powder', name: 'Washing Powder', packs: ['500g', '1kg', '5kg'], price: 500 },
            { id: 'dishwash', name: 'Dishwash Liquid', packs: ['500ml', '1L', '5L'], price: 450 },
            { id: 'toothpaste', name: 'Toothpaste', packs: ['100g tube', '200g tube'], price: 200 },
            { id: 'soap', name: 'Bath Soap', packs: ['100g bar', '4-pack'], price: 120 },
            { id: 'shampoo', name: 'Shampoo', packs: ['200ml', '400ml'], price: 350 }
        ])}
            </div>
        `;
    }

    // Generic item group renderer with pack size, quantity, stock fields
    renderItemGroup(category, categoryName, items) {
        return items.map(item => `
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border dark:border-gray-700">
                <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" id="chk-${category}-${item.id}" 
                        class="w-5 h-5 rounded text-primary-600"
                        onchange="document.getElementById('opt-${category}-${item.id}').classList.toggle('hidden', !this.checked)">
                    <span class="font-bold text-sm">${item.name}</span>
                </label>
                
                <div id="opt-${category}-${item.id}" class="hidden mt-3 pl-8 space-y-3 animate-fade-in">
                    <div class="grid grid-cols-3 gap-2">
                        <div>
                            <label class="text-[10px] uppercase font-bold text-gray-400">Pack Size</label>
                            <select class="w-full p-2 bg-white dark:bg-gray-900 rounded-lg border text-xs"
                                id="pack-${category}-${item.id}">
                                ${item.packs.map(pack => `<option value="${pack}">${pack}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="text-[10px] uppercase font-bold text-gray-400">Monthly Qty</label>
                            <input type="number" placeholder="e.g., 2" 
                                id="qty-${category}-${item.id}"
                                class="w-full p-2 bg-white dark:bg-gray-900 rounded-lg border text-xs">
                        </div>
                        <div>
                            <label class="text-[10px] uppercase font-bold text-gray-400">Stock Now</label>
                            <input type="number" placeholder="0" 
                                id="stock-${category}-${item.id}"
                                class="w-full p-2 bg-white dark:bg-gray-900 rounded-lg border text-xs">
                        </div>
                    </div>
                    <p class="text-[10px] text-gray-500">Price: ~Rs. ${item.price} per base unit</p>
                </div>
            </div>
        `).join('');
    }

    renderReview() {
        let totalItems = 0;
        let estimatedCost = 0;

        return `
            <div class="space-y-4">
                <div class="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-900 text-center">
                    <i class="fa-solid fa-check-circle text-5xl text-green-600 mb-3"></i>
                    <h3 class="text-xl font-bold text-green-900 dark:text-green-100">Setup Complete!</h3>
                    <p class="text-sm text-green-700 dark:text-green-300 mt-2">
                        We're adding your preferred items to inventory with current stock levels and accurate market prices.
                    </p>
                </div>
                
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                    <h4 class="font-bold text-sm mb-2 flex items-center gap-2">
                        <i class="fa-solid fa-lightbulb text-yellow-500"></i> Smart Insights
                    </h4>
                    <ul class="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• High rice usage detected – recommend 10kg+ bags for bulk savings</li>
                        <li>• Your monthly forecast will be based on reported quantities</li>
                        <li>• Analytics Report will show pack-specific recommendations</li>
                    </ul>
                </div>
                
                <button onclick="window.wizard.finalize()" 
                    class="w-full py-4 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition">
                    <i class="fa-solid fa-rocket mr-2"></i> Save & See My Analytics
                </button>
            </div>
        `;
    }

    // Navigation
    next() {
        this.currentStep++;
        if (this.currentStep > 14) {
            this.finalize();
        } else {
            this.renderStep();
        }
    }

    prev() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderStep();
        }
    }

    skipStep() {
        this.next();
    }

    updateArray(arrayName, value, checked) {
        if (checked) {
            if (!this.data[arrayName].includes(value)) {
                this.data[arrayName].push(value);
            }
        } else {
            this.data[arrayName] = this.data[arrayName].filter(v => v !== value);
        }
    }

    finalize() {
        // Process collected data and update app
        this.processWizardData();

        // Mark as complete
        this.app.db.preferences.grocerySetupDone = true;
        this.app.save();

        // Close modal and show success
        this.app.closeModal();
        this.app.toast('Grocery Setup Complete! Check Analytics for personalized recommendations.', 'Success', 'fa-check-circle');

        // Navigate to analytics
        setTimeout(() => {
            this.app.calculatePredictions();
            this.app.nav('analytics');
        }, 1000);
    }

    processWizardData() {
        // This method will populate inventory and preferences based on collected data
        // Implementation continues in next part...
        console.log('Processing wizard data:', this.data);

        // Store custom monthly quantities
        if (!this.app.db.preferences.customMonthly) {
            this.app.db.preferences.customMonthly = {};
        }

        // Quick bypass handling
        if (this.data.quickBypass) {
            // Add representative items with bypass quantities
            this.addBypassItems();
        }

        // Store family details
        this.app.db.familyDetails = {
            adults: this.data.familySize.adults,
            children: this.data.familySize.children,
            total: this.data.familySize.adults + this.data.familySize.children,
            dateSet: Date.now()
        };
    }

    addBypassItems() {
        const bypass = this.data.bypassQuantities;
        const items = [
            { n: 'Nadu Rice', cat: 'Rice', qty: bypass.rice * 0.5, monthly: bypass.rice, u: 'kg', p: 227 },
            { n: 'Red Dhal', cat: 'Dry Goods', qty: bypass.dhal * 0.3, monthly: bypass.dhal, u: 'kg', p: 320 },
            { n: 'Coconut Oil', cat: 'Essentials', qty: bypass.oil * 0.3, monthly: bypass.oil, u: 'l', p: 650 },
            { n: 'Milk Powder', cat: 'Dairy', qty: bypass.milk * 0.4, monthly: bypass.milk, u: 'kg', p: 900 },
            { n: 'White Sugar', cat: 'Essentials', qty: bypass.sugar * 0.4, monthly: bypass.sugar, u: 'kg', p: 280 },
            { n: 'Fresh Fish', cat: 'Seafood', qty: bypass.fish * 0.2, monthly: bypass.fish, u: 'kg', p: 1500 }
        ];

        items.forEach(item => {
            const existing = this.app.db.inventory.find(i => i.n === item.n);
            if (existing) {
                existing.qty = item.qty;
            } else {
                this.app.db.inventory.push({
                    id: `wiz_${Date.now()}_${Math.random()}`,
                    n: item.n,
                    s: item.n,
                    c: item.cat,
                    u: item.u,
                    qty: item.qty,
                    p: item.p,
                    min: item.monthly * 0.2,
                    img: 'fa-cube'
                });
            }

            // Store monthly quantity
            this.app.db.preferences.customMonthly[item.n] = item.monthly;
        });
    }
}
