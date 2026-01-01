// --- AI ENGINE: "Ultimate Chef" V11.0 ---
// Handles all Chat, NLP, and Learning features.

class ChatBot {
    constructor(app) {
        this.app = app;
        this.isOpen = false;

        // --- 0. NEURAL CONFIG ---
        this.fuzziness = 3; // Max edit distance allowed
        this.personality = 'friendly'; // Default
        this.voiceEnabled = false;

        // --- 1. KNOWLEDGE BASE ---
        this.knowledge = {
            conversions: {
                'cup': 'approx 240ml or 128g (flour)',
                'tbsp': '15ml',
                'tsp': '5ml',
                'kg': '1000g',
                'lb': '450g',
                'oz': '28g'
            },
            tips: [
                "To peel garlic fast, smash it with the flat side of a knife!",
                "Always salt your pasta water like the sea.",
                "Let meat rest for 5 mins after cooking to keep juices in.",
                "Use cold water for stock, hot water for boiling veg.",
                "Dull knives are more dangerous than sharp ones!",
                "Add a pinch of salt to sweets to enhance the flavor."
            ],
            app: {
                'ocr': '<b>OCR (Scan Bill)</b> uses AI to read text from photos of your grocery receipts. It automatically adds items to your inventory!',
                'cook mode': '<b>Cook Mode</b> is a special full-screen view with large text and voice controls, designed to be used while your hands are busy cooking.',
                'voice': 'You can say "Hey Chef" (if enabled) or click the mic button to add items, find recipes, or navigate the app.',
                'smart shopping': 'The app learns what you eat! The <b>Smart Shopping List</b> predicts what you need based on your inventory history.',
                'offline': 'Yes! This app works <b>Offline</b>. You can check recipes and inventory without internet. It syncs when you reconnect.',
                'waste': 'To track waste, use the "Cook Mode". After finishing a recipe, I will ask if you had any leftovers or waste to log.'
            },
            cooking: {
                'egg substitute': 'For baking, you can use mashed banana (1/2 cup), applesauce (1/4 cup), or a flax egg (1 tbsp flax + 3 tbsp water).',
                'buttermilk': 'Mix 1 cup milk with 1 tbsp lemon juice or vinegar. Let sit for 5 mins.',
                'self rising flour': 'Mix 1 cup all-purpose flour + 1.5 tsp baking powder + 1/4 tsp salt.',
                'rest meat': 'Resting meat allows the juices to redistribute effectively, ensuring the meat is juicy and tender, not dry.',
                'boil vs simmer': '<b>Boiling</b> is huge bubbles (100°C) for pasta/veg. <b>Simmering</b> is small bubbles (85-95°C) for soups/stews to be tender.'
            }
        };

        this.reloadKnowledge(); // Load initial custom knowledge

        // --- 2. PERSONALITY ENGINE ---
        this.personalities = {
            'professional': {
                greetings: ["Systems online. How can I assist?", "Ready for input.", "Kitchen AI operational."],
                thanks: ["Affirmative.", "Task complete.", "You are welcome."],
                unknown: ["Input not recognized. Please clarify.", "Data missing. Query vague."],
                prefix: "🤖"
            },
            'friendly': {
                greetings: ["Hello Chef! 🍳", "Cooking time? 🥘", "Ready to help! 👩‍🍳", "Hi! What's on the menu?"],
                thanks: ["You're welcome! 🥗", "My pleasure!", "Happy cooking!"],
                unknown: ["Hmm, I didn't get that. 🤔", "I'm still learning! Try searching for a recipe."],
                prefix: "👩‍🍳"
            },
            'pirate': {
                greetings: ["Ahoy Matey! 🏴‍☠️", "Ready to plunder the fridge?", "Aye aye, Chef!"],
                thanks: ["Aye!", "Treasure secured!", "Fair winds!"],
                unknown: ["Blimey! What be that?", "Speak clearly you scurvy dog!", "No map for that one."],
                prefix: "🏴‍☠️"
            }
        };
    }

    reloadKnowledge() {
        // Reload Custom Knowledge from DB
        this.customKnowledge = this.app.db.customKnowledge || [];

        // Reload Settings (Personality & Voice)
        const configStr = localStorage.getItem('app_config');
        if (configStr) {
            try {
                const config = JSON.parse(configStr);
                if (config.aiPersonality) this.personality = config.aiPersonality;
                this.voiceEnabled = config.voiceEnabled === true;
            } catch (e) { console.error("Config Parse Error", e); }
        }
        console.log("AI Brain Reloaded. Personality:", this.personality, "Voice:", this.voiceEnabled);
    }

    toggle() {
        if (this.app.currentView === 'chat') {
            document.getElementById('tab-chat-input')?.focus();
            return;
        }
        const win = document.getElementById('chat-window');
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            win.classList.remove('hidden');
            setTimeout(() => win.classList.remove('translate-y-10', 'opacity-0'), 10);
            document.getElementById('chat-input')?.focus();

            // Update version display
            this.updateVersionDisplay();

            // Send greeting if empty
            if (document.getElementById('chat-messages').children.length <= 1) {
                this.reply('greetings');
            }
        } else {
            win.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => win.classList.add('hidden'), 300);
        }
    }

    reply(type) {
        const p = this.personalities[this.personality] || this.personalities['friendly'];
        const list = p[type] || p['unknown'];
        const msg = list[Math.floor(Math.random() * list.length)];
        this.addMsg('bot', `${p.prefix} ${msg}`);
    }


    send(fromTab = false) {
        const inputId = fromTab ? 'tab-chat-input' : 'chat-input';
        const input = document.getElementById(inputId);
        if (!input) return;

        const text = input.value.trim();
        if (!text) return;

        this.addMsg('user', text);
        input.value = '';

        // Sync inputs if both exist
        const otherId = fromTab ? 'chat-input' : 'tab-chat-input';
        const otherInput = document.getElementById(otherId);
        if (otherInput) otherInput.value = '';

        this.addTyping();
        const delay = text.length > 20 ? 1200 : 600;

        setTimeout(() => {
            this.removeTyping();
            this.process(text);
        }, delay);
    }

    startVoice(targetId = 'chat-input') {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice input not supported in this browser.');
            return;
        }
        const recognition = new webkitSpeechRecognition();
        recognition.lang = this.app.db.settings.lang === 'si' ? 'si-LK' : 'en-US';

        const btn = document.getElementById('chat-mic-btn');
        if (btn) btn.classList.add('animate-pulse', 'text-red-500');

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            const input = document.getElementById(targetId);
            if (input) {
                input.value = text;
                this.send(targetId === 'tab-chat-input');
            }
            if (btn) btn.classList.remove('animate-pulse', 'text-red-500');
        };

        recognition.onerror = () => {
            if (btn) btn.classList.remove('animate-pulse', 'text-red-500');
        };

        recognition.start();
    }

    speak(text) {
        if (!this.voiceEnabled) return;

        // Strip HTML
        const tmp = document.createElement("DIV");
        tmp.innerHTML = text;
        const plainText = tmp.textContent || tmp.innerText || "";

        if (!plainText) return;

        // Cancel previous
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(plainText);

        // Custom Voices based on Personality (Simplified)
        // Note: Browsers vary wildy in available voices.
        // We just adjust pitch/rate.

        if (this.personality === 'pirate') {
            utterance.pitch = 0.8;
            utterance.rate = 0.9;
        } else if (this.personality === 'professional') {
            utterance.pitch = 1.0;
            utterance.rate = 1.1;
        } else {
            // Friendly
            utterance.pitch = 1.2;
            utterance.rate = 1.0;
        }

        window.speechSynthesis.speak(utterance);
    }

    addMsg(side, text) {
        // Auto-speak if priority message or mode enabled
        // BUT logic for "speak button" is handled via UI interaction
        // If bot, we add the avatar and speak button

        ['chat-messages', 'tab-chat-messages'].forEach(id => {
            const container = document.getElementById(id);
            if (!container) return;

            const div = document.createElement('div');
            // Animation class 'slide-up' defined in Tailwind config or CSS
            div.className = `flex gap-3 ${side === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`;

            let avatarHtml = '';
            if (side === 'bot') {
                avatarHtml = `
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                        <i class="fa-solid fa-robot text-white text-xs"></i>
                    </div>
                 `;
            }

            const bubbleClass = side === 'user'
                ? 'bg-primary-600 text-white rounded-2xl rounded-tr-none shadow-lg shadow-primary-500/20'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-2xl rounded-tl-none shadow-md border dark:border-gray-700';

            // Parse Markdown for Bot messages only
            const finalText = side === 'bot' ? this.parseMarkdown(text) : this.escapeHtml(text);

            const speakBtn = side === 'bot'
                ? `<button onclick="app.chat.speak(\`${text.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" class="ml-2 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-white transition shadow-sm"><i class="fa-solid fa-volume-high text-[10px]"></i></button>`
                : '';

            div.innerHTML = `
                ${side === 'bot' ? avatarHtml : ''}
                <div class="flex flex-col max-w-[85%]">
                    <div class="${bubbleClass} p-3.5 text-sm leading-relaxed relative group">
                        ${finalText}
                    </div>
                    <div class="flex items-center gap-1 mt-1">
                        ${side === 'bot' ? `<span class="text-[10px] text-gray-400 ml-1">AI Chef</span>${speakBtn}` : ''}
                    </div>
                </div>
            `;

            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        });

        // Auto-speak check (optional, if user wants auto-voice on critical alerts or just always manual?)
        // User asked for "Implement voice answers (Text-to-Speech) when a sound button is clicked."
        // So I will DISABLE auto-speak by default unless specific config, allowing button only.
        // However, existing code had voiceEnabled. I'll respect that if true.
        if (side === 'bot' && this.voiceEnabled) {
            this.speak(text);
        }
    }

    addTyping() {
        ['chat-messages', 'tab-chat-messages'].forEach(id => {
            const container = document.getElementById(id);
            if (!container) return;
            const div = document.createElement('div');
            div.className = 'chat-typing flex justify-start animate-pulse';
            div.innerHTML = `
                <div class="bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl rounded-tl-none text-xs text-gray-500">
                    <i class="fa-solid fa-circle text-[8px] animate-bounce"></i>
                    <i class="fa-solid fa-circle text-[8px] animate-bounce delay-100"></i>
                    <i class="fa-solid fa-circle text-[8px] animate-bounce delay-200"></i>
                </div>
            `;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        });
    }

    removeTyping() {
        document.querySelectorAll('.chat-typing').forEach(el => el.remove());
    }

    pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    // --- MARKDOWN PARSER (Lightweight) ---
    parseMarkdown(text) {
        if (!text) return text;

        let html = text
            // Bold (**text**)
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            // Italic (*text*)
            .replace(/\*(.*?)\*/g, '<i>$1</i>')
            // Headers (# Header) - simplified to bold block
            .replace(/^#\s+(.*)$/gm, '<div class="font-bold text-lg border-b mb-1 pb-1">$1</div>')
            .replace(/^##\s+(.*)$/gm, '<div class="font-bold mb-1">$1</div>')
            // Lists (- item) using flex to keep alignment
            .replace(/^- (.*)$/gm, '<div class="flex gap-2 ml-2"><span class="text-primary-500">•</span><span>$1</span></div>')
            // Numbered Lists (1. item)
            .replace(/^\d+\.\s+(.*)$/gm, '<div class="flex gap-2 ml-2"><span class="text-primary-500 font-bold">➜</span><span>$1</span></div>')
            // Newlines to <br> if not already HTML tags involved heavily
            .replace(/\n/g, '<br>');

        return html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- NEURAL MATCHING ENGINE ---

    // Neuro-Linguistic Dictionary for Auto-Translation
    getSynonyms(word) {
        const dict = {
            'price': ['mila', 'gana', 'cost'],
            'recipe': ['krama', 'hadana', 'recipe', 'wttoru'],
            'add': ['daanna', 'ekathu', 'buy'],
            'rice': ['bath', 'sahald'],
            'chicken': ['kukul', 'mas'],
            'dark': ['kalu', 'darkmode', 'theme'],
            'light': ['eliya', 'lightmode']
        };
        for (const key in dict) {
            if (key === word || dict[key].includes(word)) return [key, ...dict[key]];
        }
        return [word];
    }

    // Levenshtein Distance Algorithm
    levenshtein(s, t) {
        const d = [];
        for (let i = 0; i <= s.length; i++) d[i] = [i];
        for (let j = 0; j <= t.length; j++) d[0][j] = j;
        for (let i = 1; i <= s.length; i++) {
            for (let j = 1; j <= t.length; j++) {
                const cost = s[i - 1] === t[j - 1] ? 0 : 1;
                d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            }
        }
        return d[s.length][t.length];
    }

    findMatch(query) {
        if (!this.app.db.customKnowledge) return null;

        let bestMatch = null;
        let minDist = Infinity;

        // Expansion: Test synonyms
        const tokens = query.toLowerCase().split(' ');
        const variations = [query]; // [ "rice mila", "rice price" ]

        // Simple 1-word expansion (MVP)
        tokens.forEach((t, i) => {
            const syns = this.getSynonyms(t);
            if (syns.length > 1) {
                syns.forEach(s => {
                    const clone = [...tokens];
                    clone[i] = s;
                    variations.push(clone.join(' '));
                });
            }
        });

        // Search against ALL variations
        this.app.db.customKnowledge.forEach((item) => {
            variations.forEach(v => {
                const dist = this.levenshtein(v.toLowerCase(), item.q.toLowerCase());
                if (dist < minDist) {
                    minDist = dist;
                    bestMatch = item;
                }
            });
        });

        if (minDist <= this.fuzziness) return bestMatch;
        return null;
    }

    // --- AI APP CONTROL ---
    handleSettings(text) {
        text = text.toLowerCase();

        // Theme
        if (text.includes('dark') || text.includes('kalu')) {
            this.app.toggleTheme(true); // Force Dark
            return "Activated Dark Mode. Eyes relaxed! 🌙";
        }
        if (text.includes('light') || text.includes('eliya')) {
            this.app.toggleTheme(false); // Force Light
            return "Activated Light Mode. Shine bright! ☀️";
        }

        // Language (Mock)
        if (text.includes('sinhala') || text.includes('sinhal')) {
            this.app.toggleLang();
            return "Language switched! භාෂාව වෙනස් කරන ලදී.";
        }

        return null;
    }

    logFailure(query) {
        if (!this.app.db.ai_logs) this.app.db.ai_logs = [];
        // Only log if unique
        if (!this.app.db.ai_logs.some(l => l.q === query)) {
            this.app.db.ai_logs.push({ q: query, t: new Date().toISOString() });
            this.app.save();
        }
    }

    // --- MAIN SEARCH & NLP ENGINE ---
    process(text) {
        const lower = text.toLowerCase();

        // 0. ADMIN / TEACHER MODE
        if (lower.startsWith('/teach')) {
            this.openTeacherMode();
            return;
        }

        // 1. SETTINGS CONTROL (Priority)
        if (lower.includes('change') || lower.includes('turn on') || lower.includes('switch') || lower.includes('mode')) {
            const settingResp = this.handleSettings(lower);
            if (settingResp) { this.addMsg('bot', settingResp); return; }
        }

        // 2. NEURAL MATCH (Custom Knowledge)
        const neuralMatch = this.findMatch(text);
        if (neuralMatch) {
            this.addMsg('bot', `🎓 <b>Trained Answer:</b><br>${neuralMatch.a}`);
            return;
        }

        // 3. GUIDE / HELP
        if (lower === 'help' || lower === 'guide' || lower.includes('how do i use')) {
            this.renderAppGuide();
            return;
        }

        // 4. INVENTORY COMMANDS (Auto-Translate Synonyms found in findMatch, but direct hardcoded here too for speed)
        if (lower.includes('add') || lower.includes('buy') || lower.includes('remove') || lower.includes('use') || lower.includes('ganna') || lower.includes('daanna')) {
            this.handleInventory(lower);
            return;
        }

        // 5. COOKING & RECIPES
        if (lower.includes('recipe') || lower.includes('make') || lower.includes('cook')) {
            this.handleRecipeSearch(lower);
            return;
        }

        // 5. KNOWLEDGE (FAQ, Tips)
        if (lower.includes('cup') || lower.includes('tsp') || lower.includes('tbsp') || lower.includes('tip') ||
            lower.includes('what is') || lower.includes('how to') || lower.includes('why') || lower.includes('substitute') || lower.includes('ocr')) {
            this.handleKnowledge(lower);
            return;
        }

        // 6. DATA / BUDGET
        if (lower.includes('budget') || lower.includes('cost') || lower.includes('report')) {
            this.addMsg('bot', this.analyzeBudget());
            return;
        }

        // 7. NAVIGATION
        if (lower.includes('show') || lower.includes('go to')) {
            if (lower.includes('inv')) { this.app.nav('inventory'); this.addMsg('bot', 'Opening Inventory...'); return; }
            if (lower.includes('dash') || lower.includes('home')) { this.app.nav('dashboard'); this.addMsg('bot', 'Welcome Home!'); return; }
        }

        // 8. SMALL TALK
        if (lower.includes('hi') || lower.includes('hello')) { this.reply('greetings'); return; }
        if (lower.includes('thank')) { this.reply('thanks'); return; }


        // 9. WEB SEARCH FALLBACK (Log Failure First)
        this.logFailure(text);
        this.addMsg('bot', `
            <div class="flex flex-col gap-2">
                <p>I don't have that locally. Search online?</p>
                <div class="flex gap-2 mt-2">
                    <button onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(text)}', '_blank')" class="flex-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-blue-200 transition">
                        <i class="fa-brands fa-google mr-1"></i> Google
                    </button>
                    <button onclick="window.open('https://www.youtube.com/results?search_query=${encodeURIComponent(text)}', '_blank')" class="flex-1 bg-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-200 transition">
                        <i class="fa-brands fa-youtube mr-1"></i> YouTube
                    </button>
                </div>
            </div>
         `);
    }

    handleInventory(text) {
        const isAdd = text.includes('add') || text.includes('buy');
        const qtyMatch = text.match(/(\d+\.?\d*)/);
        const qty = qtyMatch ? parseFloat(qtyMatch[0]) : 1;

        let name = text.replace('add', '').replace('buy', '').replace('remove', '').replace('use', '').replace(qty, '').replace('kg', '').replace('g', '').replace('pcs', '').trim();

        if (name) {
            const unit = text.includes('kg') ? 'kg' : (text.includes(' g ') ? 'g' : 'pcs');
            const finalQty = isAdd ? qty : -qty;
            this.app.quickAdd(name, finalQty, unit);
            const action = isAdd ? 'Added' : 'Removed';
            this.addMsg('bot', `Successfully ${action} <b>${Math.abs(finalQty)}${unit} ${name}</b>.`);
        } else {
            this.addMsg('bot', "What item? (e.g., 'Add 1kg Rice')");
        }
    }

    handleRecipeSearch(text) {
        let query = text.replace('recipe', '').replace('how to make', '').replace('cook', '').replace('for', '').trim();
        if (query === 'something' || query === 'dinner' || query === '') {
            const suggestion = this.app.recipes[Math.floor(Math.random() * this.app.recipes.length)];
            this.addMsg('bot', `How about <b>${suggestion.name}</b>? I can show you the recipe.`);
            return;
        }
        const found = this.app.recipes.filter(r => r.name.toLowerCase().includes(query));
        if (found.length > 0) {
            this.app.currentFilter = 'All';
            this.app.nav('cook');
            this.addMsg('bot', `Found ${found.length} recipes for <b>${query}</b>! Opening Cook Mode.`);
        } else {
            this.addMsg('bot', `No local recipe for "${query}". Try searching online.`);
        }
    }

    handleKnowledge(text) {
        for (const [key, val] of Object.entries(this.knowledge.app)) {
            if (text.includes(key)) { this.addMsg('bot', `💡 <b>App Guide:</b><br>${val}`); return; }
        }
        for (const [key, val] of Object.entries(this.knowledge.cooking)) {
            if (text.includes(key) || (key === 'egg substitute' && text.includes('egg'))) { this.addMsg('bot', `🍳 <b>Chef's Knowledge:</b><br>${val}`); return; }
        }
        for (const [unit, val] of Object.entries(this.knowledge.conversions)) {
            if (text.includes(unit)) { this.addMsg('bot', `📐 <b>Conversion:</b><br>1 ${unit} = ${val}.`); return; }
        }
        if (text.includes('tip')) {
            this.addMsg('bot', `💡 <b>Tip:</b><br>${this.pickRandom(this.knowledge.tips)}`);
            return;
        }
    }

    renderAppGuide() {
        this.addMsg('bot', `
            <div class="space-y-2">
                <p><b>📘 Ultimate App Guide</b></p>
                <ul class="list-disc pl-4 space-y-1">
                    <li><b>Chat</b>: Ask anything! "Plan dinner", "Check budget".</li>
                    <li><b>Scan</b>: Use the Camera to scan grocery bills.</li>
                    <li><b>Cook Mode</b>: Full screen view for hands-free cooking.</li>
                    <li><b>Offline</b>: Everything works without internet.</li>
                </ul>
                <p class="mt-2 text-[10px] text-blue-500">Tip: Type <code>/teach</code> to train me!</p>
            </div>
        `);
    }

    analyzeBudget() {
        const inv = this.app.db.inventory;
        const totalValue = inv.reduce((sum, i) => sum + (i.p * i.qty), 0);
        return `
            <div class="space-y-2">
                <div class="font-bold border-b pb-1 mb-1 border-gray-200 dark:border-gray-700">💰 Financial Snapshot</div>
                <div class="flex justify-between"><span>Stock Value:</span> <span class="font-bold text-green-600">LKR ${Math.floor(totalValue).toLocaleString()}</span></div>
                <div class="flex justify-between"><span>Proj. Monthly:</span> <span class="font-bold text-blue-600">LKR ${Math.floor(totalValue * 1.2).toLocaleString()}</span></div>
            </div>
        `;
    }

    // --- TEACHER MODE ---
    openTeacherMode() {
        const html = `
            <div class="space-y-4">
                <p class="text-sm text-gray-500">Train the AI with your own knowledge.</p>
                <input id="teach-q" type="text" placeholder="Question (e.g. Where is the salt?)" class="w-full p-3 bg-gray-50 rounded-xl border">
                <input id="teach-a" type="text" placeholder="Answer (e.g. Cabinet 2)" class="w-full p-3 bg-gray-50 rounded-xl border">
                <button onclick="app.chat.saveTraining()" class="w-full bg-primary-600 text-white font-bold py-3 rounded-xl">Save to Brain 🧠</button>
            </div>
        `;
        this.app.showModal('Teacher Mode 👨‍🏫', html);
    }

    saveTraining() {
        const q = document.getElementById('teach-q').value.trim();
        const a = document.getElementById('teach-a').value.trim();
        if (!q || !a) return;

        if (!this.app.db.customKnowledge) this.app.db.customKnowledge = [];
        this.app.db.customKnowledge.push({ q, a });
        this.app.save();

        this.app.closeModal();
        this.addMsg('bot', `🧠 I have learned: "<b>${q}</b>" -> "<b>${a}</b>"`);
    }

    // --- UI HELPERS ---
    triggerUpload() {
        // Reuse existing OCR Flow
        this.app.toggleOCRModal();
    }

    renderChips(containerId) {
        const chips = [
            { l: 'Plan Dinner', i: 'fa-utensils', a: 'Suggest a dinner' },
            { l: 'Budget', i: 'fa-coins', a: 'Check budget' },
            { l: 'App Guide', i: 'fa-book', a: 'Guide' },
            { l: 'Scan Bill', i: 'fa-camera', a: 'scan' } // Triggers intent logic? No, needs direct action
        ];

        const html = chips.map(c => `
            <button onclick="${c.a === 'scan' ? 'app.chat.triggerUpload()' : `app.chat.sendChip('${c.a}')`}" class="shrink-0 bg-white dark:bg-gray-800 border dark:border-gray-700 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shadow-sm hover:bg-primary-50 dark:hover:bg-gray-700 transition">
                <i class="fa-solid ${c.i} text-primary-500 mr-1"></i> ${c.l}
            </button>
        `).join('');
        const el = document.getElementById(containerId);
        if (el) el.innerHTML = html;
    }

    sendChip(text) {
        // ... (Same as before)
        const inputs = ['chat-input', 'tab-chat-input'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.value = text; this.send(id === 'tab-chat-input'); }
        });
    }

    // --- IMPORT / EXPORT LOGIC (Linked to Training Panel) ---
    exportKnowledge() {
        if (!this.app.db.customKnowledge || this.app.db.customKnowledge.length === 0) {
            this.app.toast("No custom knowledge to export.", "Empty", "fa-info-circle");
            return;
        }
        // Include metadata
        const exportData = {
            version: "1.0." + Date.now(),
            exportedAt: new Date().toISOString(),
            data: this.app.db.customKnowledge
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `kitchen_ai_brain_v${Date.now()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        this.app.toast("Brain Exported Successfully", "Export", "fa-download");
    }

    async importKnowledge(input) {
        const file = input.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            let json = JSON.parse(text);

            // Handle both legacy (array) and new (object with version) formats
            let items = [];
            let version = "Unknown";

            if (Array.isArray(json)) {
                items = json;
            } else if (json.data && Array.isArray(json.data)) {
                items = json.data;
                version = json.version || "Unknown";
            } else {
                throw new Error("Invalid Format");
            }

            if (!this.app.db.customKnowledge) this.app.db.customKnowledge = [];

            let count = 0;
            items.forEach(item => {
                if (item.q && item.a) {
                    // Avoid duplicates
                    if (!this.app.db.customKnowledge.some(k => k.q.toLowerCase() === item.q.toLowerCase())) {
                        this.app.db.customKnowledge.push({ q: item.q, a: item.a });
                        count++;
                    }
                }
            });

            this.app.save();
            this.reloadKnowledge();

            // Save version to localStorage
            if (version !== "Unknown") {
                localStorage.setItem('ai_brain_version', version);
            }

            // Update version display in UI
            this.updateVersionDisplay();

            // Show Version Info
            const msg = version !== "Unknown" ? `Version ${version} Installed` : `Imported ${count} new rules`;
            this.app.toast(msg, "Brain Updated", "fa-brain");
            this.addMsg('bot', `🧠 <b>System Update:</b><br>${msg}. I have learned ${count} new things!`);

        } catch (e) {
            console.error(e);
            this.app.toast("Failed to load brain file.", "Error", "fa-triangle-exclamation");
        }
        input.value = ''; // Reset
    }

    updateVersionDisplay() {
        const version = localStorage.getItem('ai_brain_version') || 'Default';
        const versionEl = document.getElementById('ai-version-display');
        if (versionEl) {
            versionEl.textContent = `v${version}`;
        }
    }

    getVersion() {
        return localStorage.getItem('ai_brain_version') || 'Default';
    }
}