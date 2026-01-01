/**
 * Sri Lanka Family Monthly Food Budget Data (2025)
 * Comprehensive economic data for budget analytics and predictions
 * Sources: Department of Census and Statistics HIES 2019, Central Bank of Sri Lanka (June 2025)
 */

const SriLankaBudgetData = {
    // Current period for data accuracy
    dataVersion: "December 2025",
    lastUpdated: "2025-12-28",

    // National Statistics
    nationalAverages: {
        householdMonthlyIncome: 63130,
        householdFoodExpenditure: 22130,
        foodPercentageOfIncome: 35.1,
        avgHouseholdSize: 3.8,
        bathCurryIndicator2019: 836,
        bathCurryIndicator2024: 2623,
        inflationRate213Percent: true,
        individualMonthlyNutrition2019: 6966,
        individualMonthlyNutrition2025: 16318
    },

    // Income Quintiles (5 levels)
    incomeQuintiles: [
        {
            quintile: 1,
            name: "Poorest 20%",
            monthlyIncome: 17572,
            foodBudgetRange: { min: 6000, max: 9000 },
            foodPercentage: 50
        },
        {
            quintile: 2,
            name: "Low Income",
            monthlyIncome: 35000,
            foodBudgetRange: { min: 12000, max: 15000 },
            foodPercentage: 42
        },
        {
            quintile: 3,
            name: "Middle Income",
            monthlyIncome: 63130,
            foodBudgetRange: { min: 20000, max: 25000 },
            foodPercentage: 35
        },
        {
            quintile: 4,
            name: "Upper Middle Income",
            monthlyIncome: 100000,
            foodBudgetRange: { min: 30000, max: 40000 },
            foodPercentage: 32
        },
        {
            quintile: 5,
            name: "Richest 20%",
            monthlyIncome: 196289,
            foodBudgetRange: { min: 40000, max: 70000 },
            foodPercentage: 25
        }
    ],

    // Sector Classification
    sectors: {
        urban: {
            medianIncome: 74679,
            foodBudgetRange: { min: 23000, max: 35000 },
            riceConsumptionPerCapita: 24.1, // kg per month
            preferredRiceType: "Samba",
            foodPercentageOfIncome: 28
        },
        rural: {
            medianIncome: 50869,
            foodBudgetRange: { min: 15000, max: 25000 },
            riceConsumptionPerCapita: 31.8,
            preferredRiceType: "Nadu",
            foodPercentageOfIncome: 37,
            homeGrownVegetables: true
        },
        estate: {
            medianIncome: 40771,
            foodBudgetRange: { min: 13000, max: 16500 },
            riceConsumptionPerCapita: 35.9,
            preferredRiceType: "Nadu",
            foodPercentageOfIncome: 50
        }
    },

    // All 25 Districts Data
    districts: [
        { name: "Colombo", medianIncome: 86981, foodBudget: { min: 28000, max: 35000 }, sector: "urban", population: 2324349 },
        { name: "Gampaha", medianIncome: 69729, foodBudget: { min: 23000, max: 28000 }, sector: "urban", population: 2304833 },
        { name: "Kalutara", medianIncome: 58000, foodBudget: { min: 19000, max: 24000 }, sector: "mixed", population: 1222504 },
        { name: "Kandy", medianIncome: 55000, foodBudget: { min: 18000, max: 23000 }, sector: "mixed", population: 1375382 },
        { name: "Matale", medianIncome: 46000, foodBudget: { min: 15000, max: 19000 }, sector: "rural", population: 484531 },
        { name: "Nuwara Eliya", medianIncome: 43000, foodBudget: { min: 14000, max: 17500 }, sector: "estate", population: 711644 },
        { name: "Galle", medianIncome: 57500, foodBudget: { min: 19000, max: 24000 }, sector: "mixed", population: 1063334 },
        { name: "Matara", medianIncome: 51000, foodBudget: { min: 17000, max: 21000 }, sector: "mixed", population: 814048 },
        { name: "Hambantota", medianIncome: 48000, foodBudget: { min: 16000, max: 20000 }, sector: "rural", population: 599903 },
        { name: "Jaffna", medianIncome: 42000, foodBudget: { min: 14000, max: 17000 }, sector: "mixed", population: 583882 },
        { name: "Kilinochchi", medianIncome: 34862, foodBudget: { min: 12000, max: 14000 }, sector: "rural", population: 113510 },
        { name: "Mannar", medianIncome: 38000, foodBudget: { min: 12500, max: 15500 }, sector: "rural", population: 99570 },
        { name: "Vavuniya", medianIncome: 40000, foodBudget: { min: 13500, max: 16500 }, sector: "rural", population: 172115 },
        { name: "Mullaitivu", medianIncome: 34279, foodBudget: { min: 11500, max: 14000 }, sector: "rural", population: 92238 },
        { name: "Batticaloa", medianIncome: 35850, foodBudget: { min: 12000, max: 14000 }, sector: "rural", population: 526567 },
        { name: "Ampara", medianIncome: 44000, foodBudget: { min: 14500, max: 18000 }, sector: "rural", population: 649402 },
        { name: "Trincomalee", medianIncome: 41000, foodBudget: { min: 13500, max: 17000 }, sector: "mixed", population: 379541 },
        { name: "Kurunegala", medianIncome: 52000, foodBudget: { min: 17000, max: 22000 }, sector: "mixed", population: 1618465 },
        { name: "Puttalam", medianIncome: 61657, foodBudget: { min: 20000, max: 26000 }, sector: "mixed", population: 762396 },
        { name: "Anuradhapura", medianIncome: 47000, foodBudget: { min: 15500, max: 19500 }, sector: "rural", population: 860575 },
        { name: "Polonnaruwa", medianIncome: 45000, foodBudget: { min: 15000, max: 18500 }, sector: "rural", population: 406088 },
        { name: "Badulla", medianIncome: 44500, foodBudget: { min: 14500, max: 18500 }, sector: "mixed", population: 815405 },
        { name: "Monaragala", medianIncome: 40500, foodBudget: { min: 13500, max: 16500 }, sector: "rural", population: 451058 },
        { name: "Ratnapura", medianIncome: 49000, foodBudget: { min: 16000, max: 20000 }, sector: "mixed", population: 1088007 },
        { name: "Kegalle", medianIncome: 50500, foodBudget: { min: 16500, max: 21000 }, sector: "mixed", population: 840648 }
    ],

    // Current Food Prices (December 2025, Rs. per kg unless noted)
    foodPrices: {
        // Staple Grains
        rice: {
            samba: { price: 237.5, unit: "kg", preferred: ["urban"] },
            nadu: { price: 280, unit: "kg", preferred: ["rural", "estate"] },
            kekulu_white: { price: 217.5, unit: "kg", preferred: ["budget"] },
            kekulu_red: { price: 217.5, unit: "kg", preferred: ["budget"] },
            basmathi: { price: 650, unit: "kg" }
        },
        wheat_flour: { price: 95, unit: "kg" },
        dhal_red: { price: 265, unit: "kg" },

        // Vegetables
        vegetables: {
            tomato: { price: 675, unit: "kg", seasonal: true },
            onion_big: { price: 377.5, unit: "kg" },
            onion_red: { price: 400, unit: "kg" },
            potato_local: { price: 333.5, unit: "kg" },
            carrot: { price: 700, unit: "kg" },
            cabbage: { price: 475, unit: "kg" },
            green_chilli: { price: 825, unit: "kg" },
            beans: { price: 450, unit: "kg" },
            brinjal: { price: 380, unit: "kg" },
            leafy_greens: { price: 200, unit: "kg", homeGrown: true },
            pumpkin: { price: 180, unit: "kg" },
            ginger: { price: 1200, unit: "kg" },
            garlic: { price: 600, unit: "kg" }
        },

        // Proteins
        proteins: {
            chicken_whole: { price: 1250, unit: "kg" },
            chicken_katta: { price: 1600, unit: "kg" },
            fish_linna: { price: 850, unit: "kg" },
            fish_thalapath: { price: 1850, unit: "kg" },
            fish_mackerel: { price: 1420, unit: "kg" },
            fish_kelawalla: { price: 1850, unit: "kg" },
            fish_salaya: { price: 600, unit: "kg" },
            beef_round: { price: 2950, unit: "kg" },
            mutton: { price: 1850, unit: "kg" },
            eggs: { price: 33, unit: "each" },
            dried_fish_sprats: { price: 1200, unit: "kg" },
            dried_fish_katta: { price: 1800, unit: "kg" },
            dried_fish_salaya: { price: 600, unit: "kg" },
            canned_fish_mackerel: { price: 450, unit: "425g" },
            soya_meat: { price: 110, unit: "90g pack" }
        },

        // Dairy
        dairy: {
            milk_powder_full_cream: { price: 900, unit: "400g" },
            milk_liquid: { price: 140, unit: "liter" },
            yogurt: { price: 80, unit: "cup" },
            butter: { price: 850, unit: "200g" },
            cheese: { price: 2500, unit: "kg" }
        },

        // Beverages
        beverages: {
            milo: { price: 800, unit: "400g" },
            nescafe: { price: 1500, unit: "100g" },
            coffee_powder: { price: 1800, unit: "kg" },
            coffee_instant_sachets: { price: 35, unit: "sachet" },
            tea_leaves_dust: { price: 200, unit: "pack" },
            tea_bags: { price: 450, unit: "100 count" },
            nestomalt: { price: 750, unit: "400g" }
        },

        // Spices & Condiments
        spices: {
            chili_powder: { price: 1200, unit: "kg" },
            chili_flakes: { price: 400, unit: "kg" },
            curry_powder_raw: { price: 500, unit: "kg" },
            curry_powder_roasted: { price: 600, unit: "kg" },
            turmeric_powder: { price: 300, unit: "100g" },
            pepper_black: { price: 200, unit: "100g" },
            mustard_seeds: { price: 100, unit: "100g" },
            fenugreek: { price: 100, unit: "100g" },
            cinnamon_sticks: { price: 350, unit: "100g" },
            cardamom: { price: 8000, unit: "kg" },
            cloves: { price: 6000, unit: "kg" },
            goraka: { price: 200, unit: "100g" },
            maldive_fish: { price: 450, unit: "kg" }
        },

        // Oils & Coconut
        oils_condiments: {
            coconut_oil: { price: 898, unit: "liter" },
            vegetable_oil: { price: 850, unit: "liter" },
            coconut: { price: 160, unit: "each" },
            coconut_milk_liquid: { price: 280, unit: "pack" },
            coconut_milk_powder: { price: 250, unit: "pack" },
            sugar: { price: 223.5, unit: "kg" },
            salt: { price: 70, unit: "kg" },
            tea_leaves: { price: 350, unit: "100g" }
        },

        // Fruits
        fruits: {
            banana: { price: 125, unit: "kg" },
            papaya: { price: 180, unit: "kg" },
            mango: { price: 400, unit: "kg", seasonal: true },
            apple_imported: { price: 210, unit: "each" },
            orange: { price: 150, unit: "kg" }
        },

        // Household & Personal
        household: {
            toothpaste: { price: 200, unit: "pcs" },
            washing_powder: { price: 500, unit: "1kg" },
            dish_wash_liquid: { price: 450, unit: "liter" },
            soap_bar: { price: 120, unit: "bar" },
            shampoo: { price: 600, unit: "bottle" },
            car_wax: { price: 1200, unit: "tin" },
        },

        // Utilities
        utilities: {
            lpg_cylinder_12_5kg: { price: 3690, unit: "refill" }
        }
    },

    // Monthly Consumption Patterns (per person)
    consumptionPatterns: {
        rice_per_capita_kg: 8.45,
        chicken_per_capita_kg: 0.45,
        eggs_per_capita_count: 4,
        dhal_per_capita_kg: 0.65,
        vegetables_per_capita_kg: 8,
        fish_per_capita_kg: 1.2,
        milk_liters_per_capita: 2.5
    },

    // Family Size Budget Templates
    familyTemplates: {
        size_1: {
            people: 1,
            budgetRange: { min: 6000, max: 10000 },
            riceKg: 8.5,
            vegetablesKg: 8,
            proteinsKg: 2,
            eggsCount: 8
        },
        size_2: {
            people: 2,
            budgetRange: { min: 12000, max: 18000 },
            riceKg: 17,
            vegetablesKg: 16,
            proteinsKg: 4,
            eggsCount: 16
        },
        size_3: {
            people: 3,
            budgetRange: { min: 18000, max: 24000 },
            riceKg: 25,
            vegetablesKg: 24,
            proteinsKg: 6,
            eggsCount: 24
        },
        size_4: {
            people: 4,
            budgetRange: { min: 22000, max: 30000 },
            riceKg: 34,
            vegetablesKg: 32,
            proteinsKg: 8,
            eggsCount: 32
        },
        size_5: {
            people: 5,
            budgetRange: { min: 28000, max: 38000 },
            riceKg: 42,
            vegetablesKg: 40,
            proteinsKg: 10,
            eggsCount: 40
        },
        size_6: {
            people: 6,
            budgetRange: { min: 33000, max: 45000 },
            riceKg: 51,
            vegetablesKg: 48,
            proteinsKg: 12,
            eggsCount: 48
        },
        size_7: {
            people: 7,
            budgetRange: { min: 38000, max: 52000 },
            riceKg: 59,
            vegetablesKg: 56,
            proteinsKg: 14,
            eggsCount: 56
        },
        size_8_plus: {
            people: 8,
            budgetRange: { min: 43000, max: 60000 },
            riceKg: 68,
            vegetablesKg: 64,
            proteinsKg: 16,
            eggsCount: 64
        }
    },

    // Dietary Preferences
    dietaryPreferences: {
        mixed: {
            name: "Mixed (Non-Vegetarian)",
            proteinSources: ["chicken", "fish", "eggs", "dhal", "beef"],
            budgetMultiplier: 1.0,
            description: "Balanced diet with meat, fish, and vegetables"
        },
        vegetarian: {
            name: "Vegetarian",
            proteinSources: ["dhal", "eggs", "dairy", "soya"],
            budgetMultiplier: 0.75,
            description: "Plant-based with dairy and eggs, 25% cost reduction on proteins"
        },
        pescatarian: {
            name: "Pescatarian",
            proteinSources: ["fish", "eggs", "dhal", "dairy"],
            budgetMultiplier: 0.90,
            description: "Fish and plant-based proteins"
        },
        vegan: {
            name: "Vegan",
            proteinSources: ["dhal", "soya", "beans"],
            budgetMultiplier: 0.65,
            description: "Fully plant-based, significant cost savings"
        },
        halal: {
            name: "Halal (Muslim)",
            proteinSources: ["chicken", "fish", "beef", "mutton", "eggs", "dhal"],
            budgetMultiplier: 1.05,
            description: "Halal meat, emphasis on beef/mutton over pork",
            avoidance: ["pork"]
        },
        buddhist_hindu: {
            name: "Buddhist/Hindu",
            proteinSources: ["chicken", "fish", "eggs", "dhal"],
            budgetMultiplier: 0.95,
            description: "Occasional meat avoidance, preference for vegetarian curries",
            poyaDayVeg: true
        }
    },

    // Cost-Saving Strategies
    savingStrategies: [
        {
            strategy: "Bulk Purchasing",
            description: "Purchase staples (rice, flour, sugar, oil) in bulk every 3-4 weeks",
            savings: "15-20% annually",
            minPurchase: 10000,
            discountRange: { min: 10, max: 25 }
        },
        {
            strategy: "Farmers Markets",
            description: "Shop Saturday/Sunday morning markets for vegetables and fish",
            savings: "20-30% vs supermarkets",
            bestDays: ["Saturday", "Sunday"],
            bestTime: "6:00 AM - 9:00 AM"
        },
        {
            strategy: "Seasonal Eating",
            description: "Buy in-season vegetables and preserve during harvest months (June-Sep)",
            savings: "40-50% on off-season items",
            methods: ["drying", "pickling", "freezing"]
        },
        {
            strategy: "Protein Substitution",
            description: "Replace beef with chicken (15% savings) or eggs (60% savings)",
            savings: "15-60% on protein costs",
            substitutions: [
                { from: "beef", to: "chicken", savings: 15 },
                { from: "chicken", to: "eggs", savings: 60 },
                { from: "fish_premium", to: "fish_local", savings: 45 }
            ]
        },
        {
            strategy: "Home Gardening",
            description: "Grow leafy greens, tomatoes, chili in home garden",
            savings: "Rs. 3,000-5,000/month",
            suitableFor: ["rural", "suburban"],
            vegetables: ["leafy greens", "tomato", "chili", "beans"]
        }
    ],

    // Seasonal Price Variations (% change from baseline)
    seasonalVariations: {
        vegetables: {
            peak_harvest: { months: [6, 7, 8, 9], priceChange: -35 },
            off_season: { months: [1, 2, 3], priceChange: +50 },
            normal: { months: [4, 5, 10, 11, 12], priceChange: 0 }
        },
        fruits: {
            mango_season: { months: [5, 6, 7], priceChange: -40 },
            avocado_season: { months: [7, 8, 9], priceChange: -35 }
        },
        fish: {
            monsoon_low: { months: [5, 6, 7, 8], priceChange: +25 },
            calm_season: { months: [11, 12, 1, 2, 3], priceChange: -15 }
        }
    },

    // Religious & Cultural Considerations
    culturalFactors: {
        buddhist_poya_days: {
            frequency: "Monthly (Full Moon)",
            dietaryImpact: "Many avoid meat",
            budgetImpact: -8
        },
        ramadan: {
            duration: "1 month",
            dietaryImpact: "Increased evening meal spending",
            budgetImpact: +15
        },
        hindu_festivals: {
            frequency: "Multiple per year",
            dietaryImpact: "Vegetarian meals, special sweets",
            budgetImpact: +10
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SriLankaBudgetData;
}