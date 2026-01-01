/**
 * Sri Lanka Budget Analytics Engine
 * Provides budget calculations, predictions, and recommendations
 */

class BudgetCalculator {
    constructor(budgetData) {
        this.data = budgetData;
    }

    /**
     * Calculate monthly budget for a family
     * @param {number} familySize - Number of people in family
     * @param {string} district - District name
     * @param {number} monthlyIncome - Family monthly income
     * @param {string} dietType - Diet preference (mixed, vegetarian, etc.)
     * @returns {object} Detailed budget breakdown
     */
    calculateMonthlyBudget(familySize, district, monthlyIncome, dietType = 'mixed') {
        // Get district data
        const districtData = this.data.districts.find(d => d.name === district);
        if (!districtData) {
            throw new Error(`District ${district} not found`);
        }

        // Determine income quintile
        const quintile = this.getIncomeQuintile(monthlyIncome);

        // Get base template for family size
        const baseTemplate = this.getFamilyTemplate(familySize);

        // Apply dietary preference multiplier
        const dietPreference = this.data.dietaryPreferences[dietType];
        const dietMultiplier = dietPreference ? dietPreference.budgetMultiplier : 1.0;

        // Calculate staples
        const staples = this.calculateStaples(familySize, districtData.sector, baseTemplate);

        // Calculate proteins
        const proteins = this.calculateProteins(familySize, dietType, baseTemplate);

        // Calculate vegetables
        const vegetables = this.calculateVegetables(familySize, districtData.sector, baseTemplate);

        // Calculate dairy
        const dairy = this.calculateDairy(familySize, dietType);

        // Calculate oils & condiments
        const oilsCondiments = this.calculateOilsCondiments(familySize);

        // Calculate fruits
        const fruits = this.calculateFruits(familySize, quintile.quintile);

        // Calculate utilities
        const utilities = this.calculateUtilities(familySize);

        // Total calculations
        const totalFood = staples.total + proteins.total + vegetables.total +
            dairy.total + oilsCondiments.total + fruits.total;
        const totalWithUtilities = totalFood + utilities.total;
        const percentageOfIncome = (totalWithUtilities / monthlyIncome * 100).toFixed(1);

        return {
            familySize,
            district: districtData.name,
            monthlyIncome,
            dietType,
            quintile: quintile.name,
            breakdown: {
                staples,
                proteins,
                vegetables,
                dairy,
                oilsCondiments,
                fruits,
                utilities
            },
            totals: {
                foodOnly: Math.round(totalFood),
                withUtilities: Math.round(totalWithUtilities),
                perCapita: Math.round(totalWithUtilities / familySize),
                percentageOfIncome: parseFloat(percentageOfIncome)
            },
            recommendation: this.generateRecommendation(totalWithUtilities, monthlyIncome, quintile),
            timestamp: new Date().toISOString()
        };
    }

    calculateStaples(familySize, sector, template) {
        const riceKg = template.riceKg;
        const sectorData = this.data.sectors[sector] || this.data.sectors.urban;
        const riceType = sectorData.preferredRiceType.toLowerCase();
        const ricePrice = riceType === 'samba' ?
            this.data.foodPrices.rice.samba.price :
            this.data.foodPrices.rice.nadu.price;

        const dhalKg = familySize * this.data.consumptionPatterns.dhal_per_capita_kg;
        const flourKg = Math.max(2, familySize * 0.5);

        const riceCost = riceKg * ricePrice;
        const dhalCost = dhalKg * this.data.foodPrices.dhal_red.price;
        const flourCost = flourKg * this.data.foodPrices.wheat_flour.price;

        return {
            items: [
                { name: `Rice (${riceType})`, quantity: riceKg, unit: 'kg', price: ricePrice, cost: Math.round(riceCost) },
                { name: 'Red Dhal', quantity: dhalKg.toFixed(1), unit: 'kg', price: this.data.foodPrices.dhal_red.price, cost: Math.round(dhalCost) },
                { name: 'Wheat Flour', quantity: flourKg.toFixed(1), unit: 'kg', price: this.data.foodPrices.wheat_flour.price, cost: Math.round(flourCost) }
            ],
            total: Math.round(riceCost + dhalCost + flourCost)
        };
    }

    calculateProteins(familySize, dietType, template) {
        const items = [];
        const dietPreference = this.data.dietaryPreferences[dietType];
        const proteinSources = dietPreference.proteinSources;

        // Eggs (common to most diets)
        const eggsCount = template.eggsCount;
        const eggsCost = eggsCount * this.data.foodPrices.proteins.eggs.price;
        items.push({
            name: 'Eggs',
            quantity: eggsCount,
            unit: 'each',
            price: this.data.foodPrices.proteins.eggs.price,
            cost: Math.round(eggsCost)
        });

        let totalCost = eggsCost;

        if (proteinSources.includes('chicken')) {
            const chickenKg = Math.max(2, familySize * 0.45);
            const chickenCost = chickenKg * this.data.foodPrices.proteins.chicken_whole.price;
            items.push({
                name: 'Chicken',
                quantity: chickenKg.toFixed(1),
                unit: 'kg',
                price: this.data.foodPrices.proteins.chicken_whole.price,
                cost: Math.round(chickenCost)
            });
            totalCost += chickenCost;
        }

        if (proteinSources.includes('fish')) {
            const fishKg = Math.max(2, familySize * 1.2);
            const fishCost = fishKg * this.data.foodPrices.proteins.fish_linna.price;
            items.push({
                name: 'Fish (Mixed)',
                quantity: fishKg.toFixed(1),
                unit: 'kg',
                price: this.data.foodPrices.proteins.fish_linna.price,
                cost: Math.round(fishCost)
            });
            totalCost += fishCost;
        }

        if (proteinSources.includes('beef') || proteinSources.includes('mutton')) {
            const meatKg = Math.max(1, familySize * 0.3);
            const meatPrice = proteinSources.includes('mutton') ?
                this.data.foodPrices.proteins.mutton.price :
                this.data.foodPrices.proteins.beef_round.price;
            const meatCost = meatKg * meatPrice;
            items.push({
                name: proteinSources.includes('mutton') ? 'Mutton' : 'Beef',
                quantity: meatKg.toFixed(1),
                unit: 'kg',
                price: meatPrice,
                cost: Math.round(meatCost)
            });
            totalCost += meatCost;
        }

        if (proteinSources.includes('soya')) {
            const soyaPacks = Math.max(6, familySize * 2);
            const soyaCost = soyaPacks * this.data.foodPrices.proteins.soya_meat.price;
            items.push({
                name: 'Soya Meat',
                quantity: soyaPacks,
                unit: 'packs',
                price: this.data.foodPrices.proteins.soya_meat.price,
                cost: Math.round(soyaCost)
            });
            totalCost += soyaCost;
        }

        return {
            items,
            total: Math.round(totalCost)
        };
    }

    calculateVegetables(familySize, sector, template) {
        const vegetablesKg = template.vegetablesKg;
        const sectorData = this.data.sectors[sector];

        // Rural/estate families grow some vegetables
        const purchaseRatio = (sector === 'rural' || sector === 'estate') ? 0.6 : 1.0;
        const purchasedKg = vegetablesKg * purchaseRatio;

        // Average vegetable price (mixed selection)
        const avgVegPrice = (
            this.data.foodPrices.vegetables.tomato.price * 0.1 +
            this.data.foodPrices.vegetables.onion_big.price * 0.15 +
            this.data.foodPrices.vegetables.potato_local.price * 0.2 +
            this.data.foodPrices.vegetables.carrot.price * 0.1 +
            this.data.foodPrices.vegetables.cabbage.price * 0.15 +
            this.data.foodPrices.vegetables.beans.price * 0.15 +
            this.data.foodPrices.vegetables.leafy_greens.price * 0.15
        );

        const cost = purchasedKg * avgVegPrice;

        return {
            items: [
                {
                    name: 'Mixed Vegetables',
                    quantity: purchasedKg.toFixed(1),
                    unit: 'kg',
                    price: Math.round(avgVegPrice),
                    cost: Math.round(cost),
                    note: sector !== 'urban' ? 'Some home-grown' : ''
                }
            ],
            total: Math.round(cost)
        };
    }

    calculateDairy(familySize, dietType) {
        if (dietType === 'vegan') {
            return { items: [], total: 0 };
        }

        const milkLiters = familySize * this.data.consumptionPatterns.milk_liters_per_capita;
        const milkCost = milkLiters * this.data.foodPrices.dairy.milk_liquid.price;

        return {
            items: [
                {
                    name: 'Milk',
                    quantity: milkLiters.toFixed(1),
                    unit: 'liters',
                    price: this.data.foodPrices.dairy.milk_liquid.price,
                    cost: Math.round(milkCost)
                }
            ],
            total: Math.round(milkCost)
        };
    }

    calculateOilsCondiments(familySize) {
        const oilLiters = Math.max(3, familySize * 0.75);
        const coconuts = Math.max(15, familySize * 5);
        const sugarKg = Math.max(2, familySize * 0.75);
        const teaGrams = Math.max(200, familySize * 100);
        const teaPacks = Math.ceil(teaGrams / 100);

        const oilCost = oilLiters * this.data.foodPrices.oils_condiments.vegetable_oil.price;
        const coconutCost = coconuts * this.data.foodPrices.oils_condiments.coconut.price;
        const sugarCost = sugarKg * this.data.foodPrices.oils_condiments.sugar.price;
        const teaCost = teaPacks * this.data.foodPrices.oils_condiments.tea_leaves.price;
        const spicesCost = familySize * 400; // Estimated spices cost

        return {
            items: [
                { name: 'Cooking Oil', quantity: oilLiters.toFixed(1), unit: 'liters', price: this.data.foodPrices.oils_condiments.vegetable_oil.price, cost: Math.round(oilCost) },
                { name: 'Coconuts', quantity: coconuts, unit: 'each', price: this.data.foodPrices.oils_condiments.coconut.price, cost: Math.round(coconutCost) },
                { name: 'Sugar', quantity: sugarKg.toFixed(1), unit: 'kg', price: this.data.foodPrices.oils_condiments.sugar.price, cost: Math.round(sugarCost) },
                { name: 'Tea', quantity: teaPacks, unit: '100g packs', price: this.data.foodPrices.oils_condiments.tea_leaves.price, cost: Math.round(teaCost) },
                { name: 'Spices (Mixed)', quantity: 1, unit: 'set', price: Math.round(spicesCost), cost: Math.round(spicesCost) }
            ],
            total: Math.round(oilCost + coconutCost + sugarCost + teaCost + spicesCost)
        };
    }

    calculateFruits(familySize, incomeQuintile) {
        // Higher income = more fruit consumption
        const fruitKg = familySize * (2 + incomeQuintile);
        const avgFruitPrice = (
            this.data.foodPrices.fruits.banana.price * 0.5 +
            this.data.foodPrices.fruits.papaya.price * 0.3 +
            this.data.foodPrices.fruits.orange.price * 0.2
        );
        const cost = fruitKg * avgFruitPrice;

        return {
            items: [
                { name: 'Mixed Fruits', quantity: fruitKg.toFixed(1), unit: 'kg', price: Math.round(avgFruitPrice), cost: Math.round(cost) }
            ],
            total: Math.round(cost)
        };
    }

    calculateUtilities(familySize) {
        // LPG cylinder lasts ~45 days for average family
        const monthlyCost = this.data.foodPrices.utilities.lpg_cylinder_12_5kg.price * 0.67;

        return {
            items: [
                { name: 'LPG Gas (Monthly)', quantity: 0.67, unit: 'cylinder', price: this.data.foodPrices.utilities.lpg_cylinder_12_5kg.price, cost: Math.round(monthlyCost) }
            ],
            total: Math.round(monthlyCost)
        };
    }

    getIncomeQuintile(monthlyIncome) {
        for (let i = this.data.incomeQuintiles.length - 1; i >= 0; i--) {
            if (monthlyIncome >= this.data.incomeQuintiles[i].monthlyIncome) {
                return this.data.incomeQuintiles[i];
            }
        }
        return this.data.incomeQuintiles[0];
    }

    getFamilyTemplate(familySize) {
        const templateKey = `size_${Math.min(familySize, 8)}`;
        let template = this.data.familyTemplates[templateKey];

        if (!template && familySize > 8) {
            template = this.data.familyTemplates.size_8_plus;
            // Scale up for larger families
            const scaleFactor = familySize / 8;
            template = {
                ...template,
                people: familySize,
                riceKg: Math.round(template.riceKg * scaleFactor),
                vegetablesKg: Math.round(template.vegetablesKg * scaleFactor),
                proteinsKg: Math.round(template.proteinsKg * scaleFactor),
                eggsCount: Math.round(template.eggsCount * scaleFactor)
            };
        }

        return template;
    }

    generateRecommendation(totalBudget, monthlyIncome, quintile) {
        const percentage = (totalBudget / monthlyIncome) * 100;

        if (percentage > 50) {
            return {
                status: 'critical',
                message: `Food expenses (${percentage.toFixed(1)}%) exceed recommended 35-40% of income. Consider cost-saving strategies.`,
                suggestions: [
                    'Switch to budget rice varieties (Kekulu)',
                    'Increase dhal/eggs, reduce meat/fish consumption',
                    'Shop at farmers markets on weekends',
                    'Buy staples in bulk for 10-25% discount'
                ]
            };
        } else if (percentage > 40) {
            return {
                status: 'warning',
                message: `Food expenses (${percentage.toFixed(1)}%) are above ideal 35%. Some optimization recommended.`,
                suggestions: [
                    'Consider seasonal vegetables for 40% savings',
                    'Replace premium fish with local varieties',
                    'Start home garden for leafy greens'
                ]
            };
        } else if (percentage > 25) {
            return {
                status: 'healthy',
                message: `Food expenses (${percentage.toFixed(1)}%) are within healthy range (25-35%).`,
                suggestions: [
                    'Maintain current diet',
                    'Consider bulk purchasing for additional savings',
                    'Explore seasonal variations for variety'
                ]
            };
        } else {
            return {
                status: 'excellent',
                message: `Food expenses (${percentage.toFixed(1)}%) are well-managed. You have flexibility for dietary improvements.`,
                suggestions: [
                    'Consider adding more fruits and premium proteins',
                    'Explore organic or specialty items',
                    'Invest in nutrition quality improvements'
                ]
            };
        }
    }

    /**
     * Get district-specific recommendation
     */
    getDistrictRecommendation(districtName) {
        const district = this.data.districts.find(d => d.name === districtName);
        if (!district) return null;

        return {
            district: district.name,
            medianIncome: district.medianIncome,
            recommendedBudget: district.foodBudget,
            sector: district.sector,
            tips: this.getDistrictSpecificTips(district)
        };
    }

    getDistrictSpecificTips(district) {
        const tips = [];

        if (district.sector === 'urban') {
            tips.push('Take advantage of multiple supermarket options for competitive pricing');
            tips.push('Visit Pettah/Manning Market for wholesale vegetable prices');
        } else if (district.sector === 'rural') {
            tips.push('Utilize home garden space for vegetable cultivation');
            tips.push('Connect with local farmers for direct purchases');
            tips.push('Preserve seasonal produce through drying/pickling');
        } else if (district.sector === 'estate') {
            tips.push('Coordinate bulk purchases with community for discounts');
            tips.push('Maximize use of estate-allocated land for food production');
        }

        // Coastal districts
        if (['Colombo', 'Gampaha', 'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Trincomalee', 'Batticaloa', 'Ampara', 'Puttalam'].includes(district.name)) {
            tips.push('Fresh fish available at lower prices - prioritize over meat');
        }

        // Northern/Eastern districts
        if (['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya', 'Batticaloa', 'Trincomalee'].includes(district.name)) {
            tips.push('Focus on locally-produced staples and dried fish');
        }

        return tips;
    }
}

class PriceAnalyzer {
    constructor(budgetData) {
        this.data = budgetData;
    }

    /**
     * Compare food costs across multiple districts
     */
    compareDistricts(districtNames) {
        const comparison = districtNames.map(name => {
            const district = this.data.districts.find(d => d.name === name);
            return district ? {
                name: district.name,
                medianIncome: district.medianIncome,
                foodBudgetMin: district.foodBudget.min,
                foodBudgetMax: district.foodBudget.max,
                budgetPercentage: ((district.foodBudget.min + district.foodBudget.max) / 2 / district.medianIncome * 100).toFixed(1)
            } : null;
        }).filter(d => d !== null);

        // Sort by median income
        comparison.sort((a, b) => b.medianIncome - a.medianIncome);

        return comparison;
    }

    /**
     * Find cheaper alternatives for expensive items
     */
    findCheapestAlternatives(itemCategory) {
        const alternatives = [];

        if (itemCategory === 'rice') {
            const riceTypes = Object.entries(this.data.foodPrices.rice).map(([type, data]) => ({
                type,
                price: data.price,
                savings: ((this.data.foodPrices.rice.samba.price - data.price) / this.data.foodPrices.rice.samba.price * 100).toFixed(1)
            }));
            return riceTypes.sort((a, b) => a.price - b.price);
        }

        if (itemCategory === 'protein') {
            const proteins = [
                { name: 'Eggs (per kg equivalent)', price: this.data.foodPrices.proteins.eggs.price * 20, type: 'eggs' },
                { name: 'Dhal', price: this.data.foodPrices.dhal_red.price, type: 'legume' },
                { name: 'Soya Meat (per kg equivalent)', price: this.data.foodPrices.proteins.soya_meat.price * 11, type: 'plant' },
                { name: 'Dried Fish (Salaya)', price: this.data.foodPrices.proteins.dried_fish_salaya.price, type: 'fish' },
                { name: 'Fish (Linna)', price: this.data.foodPrices.proteins.fish_linna.price, type: 'fish' },
                { name: 'Chicken', price: this.data.foodPrices.proteins.chicken_whole.price, type: 'poultry' },
                { name: 'Beef', price: this.data.foodPrices.proteins.beef_round.price, type: 'meat' },
                { name: 'Fish (Kelawalla)', price: this.data.foodPrices.proteins.fish_kelawalla.price, type: 'fish' },
                { name: 'Mutton', price: this.data.foodPrices.proteins.mutton.price, type: 'meat' }
            ];
            return proteins.sort((a, b) => a.price - b.price);
        }

        return alternatives;
    }

    /**
     * Calculate seasonal savings potential
     */
    calculateSeasonalSavings(currentMonth) {
        const monthNum = typeof currentMonth === 'number' ? currentMonth : new Date().getMonth() + 1;
        const seasonal = this.data.seasonalVariations;

        let vegSavings = 0;
        if (seasonal.vegetables.peak_harvest.months.includes(monthNum)) {
            vegSavings = Math.abs(seasonal.vegetables.peak_harvest.priceChange);
        } else if (seasonal.vegetables.off_season.months.includes(monthNum)) {
            vegSavings = seasonal.vegetables.off_season.priceChange;
        }

        let fishSavings = 0;
        if (seasonal.fish.monsoon_low.months.includes(monthNum)) {
            fishSavings = seasonal.fish.monsoon_low.priceChange;
        } else if (seasonal.fish.calm_season.months.includes(monthNum)) {
            fishSavings = Math.abs(seasonal.fish.calm_season.priceChange);
        }

        return {
            month: monthNum,
            vegetables: {
                change: vegSavings,
                recommendation: vegSavings < 0 ? 'Great time to buy and preserve vegetables' : 'Consider alternatives or preserved items'
            },
            fish: {
                change: fishSavings,
                recommendation: fishSavings < 0 ? 'Excellent season for fresh fish' : 'Consider dried fish or alternative proteins'
            }
        };
    }

    /**
     * Get cost-saving strategies with estimated savings
     */
    getSavingStrategies() {
        return this.data.savingStrategies.map(strategy => ({
            ...strategy,
            priority: this.calculateStrategyPriority(strategy)
        })).sort((a, b) => b.priority - a.priority);
    }

    calculateStrategyPriority(strategy) {
        let priority = 0;

        // Extract numeric savings if available
        if (strategy.savings.includes('%')) {
            const savingsPercent = parseInt(strategy.savings);
            priority += savingsPercent;
        }

        // Tactics with broader applicability get higher priority
        if (strategy.strategy === 'Seasonal Eating') priority += 10;
        if (strategy.strategy === 'Farmers Markets') priority += 8;

        return priority;
    }
}

class PredictionEngine {
    constructor(budgetData) {
        this.data = budgetData;
    }

    /**
     * Predict monthly expenses for next 3 months
     */
    predictMonthlyExpenses(currentBudget, familyData) {
        const predictions = [];
        const currentMonth = new Date().getMonth() + 1;

        for (let i = 1; i <= 3; i++) {
            const futureMonth = ((currentMonth + i - 1) % 12) + 1;
            const seasonalAdjustment = this.getSeasonalAdjustment(futureMonth);
            const predictedBudget = Math.round(currentBudget * (1 + seasonalAdjustment / 100));

            predictions.push({
                month: futureMonth,
                monthName: this.getMonthName(futureMonth),
                predictedExpense: predictedBudget,
                change: predictedBudget - currentBudget,
                changePercent: ((predictedBudget - currentBudget) / currentBudget * 100).toFixed(1),
                factors: this.getPredictionFactors(futureMonth)
            });
        }

        return predictions;
    }

    getSeasonalAdjustment(month) {
        const seasonal = this.data.seasonalVariations;
        let adjustment = 0;

        // Vegetables impact (40% of food budget)
        if (seasonal.vegetables.peak_harvest.months.includes(month)) {
            adjustment += seasonal.vegetables.peak_harvest.priceChange * 0.4;
        } else if (seasonal.vegetables.off_season.months.includes(month)) {
            adjustment += seasonal.vegetables.off_season.priceChange * 0.4;
        }

        // Fish impact (20% of food budget)
        if (seasonal.fish.monsoon_low.months.includes(month)) {
            adjustment += seasonal.fish.monsoon_low.priceChange * 0.2;
        } else if (seasonal.fish.calm_season.months.includes(month)) {
            adjustment += seasonal.fish.calm_season.priceChange * 0.2;
        }

        return adjustment;
    }

    getPredictionFactors(month) {
        const factors = [];
        const seasonal = this.data.seasonalVariations;

        if (seasonal.vegetables.peak_harvest.months.includes(month)) {
            factors.push('Peak vegetable harvest season - expect lower prices');
        } else if (seasonal.vegetables.off_season.months.includes(month)) {
            factors.push('Off-season vegetables - prices may be higher');
        }

        if (seasonal.fish.monsoon_low.months.includes(month)) {
            factors.push('Monsoon season - reduced fishing, higher fish prices');
        } else if (seasonal.fish.calm_season.months.includes(month)) {
            factors.push('Calm seas - abundant fish, lower prices');
        }

        // Cultural events
        if (month === 4) factors.push('Sinhala/Tamil New Year - increased festival spending');
        if (month === 12) factors.push('Christmas season - higher prices on some items');

        return factors;
    }

    /**
     * Analyze budget sufficiency
     */
    analyzeBudgetSufficiency(monthlyIncome, currentSpending, familySize) {
        const idealPercentage = 35;
        const currentPercentage = (currentSpending / monthlyIncome * 100).toFixed(1);
        const gap = currentSpending - (monthlyIncome * idealPercentage / 100);

        const analysis = {
            currentSpending,
            monthlyIncome,
            currentPercentage: parseFloat(currentPercentage),
            idealPercentage,
            gap: Math.round(gap),
            status: '',
            recommendations: []
        };

        if (gap > monthlyIncome * 0.15) {
            analysis.status = 'critical';
            analysis.recommendations = [
                `Reduce spending by Rs. ${Math.round(gap)} to reach sustainable levels`,
                'Switch to budget rice varieties (save Rs. 500-800/month)',
                'Reduce meat/fish frequency, increase eggs/dhal (save Rs. 2,000-4,000/month)',
                'Shop at farmers markets (save 20-30%)',
                'Start home garden for vegetables (save Rs. 3,000-5,000/month)'
            ];
        } else if (gap > 0) {
            analysis.status = 'needs improvement';
            analysis.recommendations = [
                `Target Rs. ${Math.round(gap)} reduction to optimize budget`,
                'Implement bulk purchasing for staples (save 15-20%)',
                'Focus on seasonal vegetables (save 40% on produce)',
                'Compare protein prices and substitute premium items'
            ];
        } else {
            analysis.status = 'sufficient';
            analysis.recommendations = [
                'Budget is well-managed',
                'Consider building emergency food fund',
                'Opportunity to improve diet quality if desired'
            ];
        }

        return analysis;
    }

    /**
     * Predict price inflation for specific items
     */
    predictPriceInflation(itemName, months = 6) {
        // Based on historical 213% inflation over 5 years (2019-2024)
        // Average annual inflation ~25%, monthly ~1.9%
        const monthlyInflationRate = 0.019;

        const predictions = {
            item: itemName,
            currentPrice: this.getCurrentPrice(itemName),
            predictions: []
        };

        for (let i = 1; i <= months; i++) {
            const inflatedPrice = Math.round(predictions.currentPrice * Math.pow(1 + monthlyInflationRate, i));
            predictions.predictions.push({
                month: i,
                price: inflatedPrice,
                increase: inflatedPrice - predictions.currentPrice,
                increasePercent: ((inflatedPrice - predictions.currentPrice) / predictions.currentPrice * 100).toFixed(1)
            });
        }

        return predictions;
    }

    getCurrentPrice(itemName) {
        // Simplified price lookup
        const prices = {
            'rice_samba': this.data.foodPrices.rice.samba.price,
            'rice_nadu': this.data.foodPrices.rice.nadu.price,
            'chicken': this.data.foodPrices.proteins.chicken_whole.price,
            'fish': this.data.foodPrices.proteins.fish_linna.price,
            'eggs': this.data.foodPrices.proteins.eggs.price,
            'vegetables': 450, // Average
            'oil': this.data.foodPrices.oils_condiments.vegetable_oil.price
        };

        return prices[itemName] || 100;
    }

    getMonthName(monthNum) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthNum - 1];
    }
}

// Main Analytics Engine
class BudgetAnalyticsEngine {
    constructor() {
        this.data = typeof SriLankaBudgetData !== 'undefined' ? SriLankaBudgetData : null;

        if (!this.data) {
            console.error('SriLankaBudgetData not loaded! Make sure srilanka_budget_data.js is included first.');
            return;
        }

        this.calculator = new BudgetCalculator(this.data);
        this.priceAnalyzer = new PriceAnalyzer(this.data);
        this.predictor = new PredictionEngine(this.data);
    }

    /**
     * Get all districts for dropdown
     */
    getAllDistricts() {
        return this.data.districts.map(d => d.name).sort();
    }

    /**
     * Get all diet types
     */
    getAllDietTypes() {
        return Object.keys(this.data.dietaryPreferences).map(key => ({
            key,
            name: this.data.dietaryPreferences[key].name,
            description: this.data.dietaryPreferences[key].description
        }));
    }

    /**
     * Generate complete budget report
     */
    generateCompleteReport(familySize, district, monthlyIncome, dietType) {
        const budget = this.calculator.calculateMonthlyBudget(familySize, district, monthlyIncome, dietType);
        const districtRecommendation = this.calculator.getDistrictRecommendation(district);
        const seasonalSavings = this.priceAnalyzer.calculateSeasonalSavings(new Date().getMonth() + 1);
        const predictions = this.predictor.predictMonthlyExpenses(budget.totals.withUtilities, { familySize, district });
        const sufficiency = this.predictor.analyzeBudgetSufficiency(monthlyIncome, budget.totals.withUtilities, familySize);
        const savingStrategies = this.priceAnalyzer.getSavingStrategies();

        return {
            budget,
            districtRecommendation,
            seasonalSavings,
            predictions,
            sufficiency,
            savingStrategies: savingStrategies.slice(0, 5),
            timestamp: new Date().toISOString()
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BudgetAnalyticsEngine, BudgetCalculator, PriceAnalyzer, PredictionEngine };
}