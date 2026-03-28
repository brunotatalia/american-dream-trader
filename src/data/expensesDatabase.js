/**
 * Expenses Database - Lifestyle tiers and associated monthly costs.
 * Base prices are set for the 1920s era. Use ERA_COST_MULTIPLIERS for other periods.
 */

export const ERA_COST_MULTIPLIERS = {
  ROARING_TWENTIES: 1.0,
  GREAT_DEPRESSION: 0.6,
  MODERN_ERA: 25.0,
};

export const HOUSING_TIERS = {
  homeless: {
    id: 'homeless',
    name: 'Homeless',
    description: 'Sleep on the streets. No address, no stability.',
    monthlyCost: 0,
    effects: {
      jobPerformance: -0.20,
      networking: -0.30,
      health: -0.05,
      happiness: -0.15,
    },
    icon: 'CloudRain',
    unlockCondition: null,
  },
  shared_room: {
    id: 'shared_room',
    name: 'Shared Room',
    description: 'A bed in a shared boarding house. Basic but dry.',
    monthlyCost: 30,
    effects: {},
    icon: 'BedSingle',
    unlockCondition: null,
  },
  studio_apartment: {
    id: 'studio_apartment',
    name: 'Studio Apartment',
    description: 'Your own small space with a kitchenette.',
    monthlyCost: 60,
    effects: {
      jobPerformance: 0.05,
    },
    icon: 'Home',
    unlockCondition: null,
  },
  one_bedroom: {
    id: 'one_bedroom',
    name: 'One Bedroom',
    description: 'A proper apartment with a separate bedroom.',
    monthlyCost: 120,
    effects: {
      jobPerformance: 0.10,
      networking: 0.05,
    },
    icon: 'Home',
    unlockCondition: null,
  },
  nice_apartment: {
    id: 'nice_apartment',
    name: 'Nice Apartment',
    description: 'Upscale apartment in a good neighborhood.',
    monthlyCost: 250,
    effects: {
      jobPerformance: 0.15,
      networking: 0.10,
    },
    icon: 'Building2',
    unlockCondition: null,
  },
  house: {
    id: 'house',
    name: 'House',
    description: 'A proper family home with a yard. Required for family life.',
    monthlyCost: 500,
    effects: {
      jobPerformance: 0.20,
      networking: 0.15,
    },
    icon: 'House',
    unlockCondition: { minNetWorth: 2000 },
    familyRequired: true,
  },
  luxury_home: {
    id: 'luxury_home',
    name: 'Luxury Home',
    description: 'An impressive residence that turns heads.',
    monthlyCost: 1200,
    effects: {
      jobPerformance: 0.25,
      networking: 0.25,
      reputation: 0.10,
    },
    icon: 'Castle',
    unlockCondition: { minNetWorth: 10000 },
  },
  mansion: {
    id: 'mansion',
    name: 'Mansion',
    description: 'A palatial estate. You have truly arrived.',
    monthlyCost: 3000,
    effects: {
      jobPerformance: 0.30,
      networking: 0.30,
      reputation: 0.30,
    },
    icon: 'Crown',
    unlockCondition: { minNetWorth: 50000 },
    prestigeEventsUnlocked: true,
  },
};

export const FOOD_TIERS = {
  starving: {
    id: 'starving',
    name: 'Starving',
    description: 'Going hungry. Your body and mind suffer.',
    monthlyCost: 0,
    effects: {
      energy: -0.30,
      health: -0.20,
    },
    icon: 'Skull',
  },
  street_food: {
    id: 'street_food',
    name: 'Street Food',
    description: 'Cheap eats from carts and stalls. Not always clean.',
    monthlyCost: 15,
    effects: {
      health: -0.10,
    },
    icon: 'UtensilsCrossed',
  },
  basic_groceries: {
    id: 'basic_groceries',
    name: 'Basic Groceries',
    description: 'Simple home-cooked meals. Gets the job done.',
    monthlyCost: 30,
    effects: {},
    icon: 'ShoppingBasket',
  },
  good_diet: {
    id: 'good_diet',
    name: 'Good Diet',
    description: 'Balanced meals with variety and nutrition.',
    monthlyCost: 60,
    effects: {
      energy: 0.05,
      health: 0.05,
    },
    icon: 'Apple',
  },
  healthy_organic: {
    id: 'healthy_organic',
    name: 'Healthy Organic',
    description: 'Premium ingredients and optimal nutrition.',
    monthlyCost: 100,
    effects: {
      energy: 0.10,
      health: 0.10,
    },
    icon: 'Leaf',
  },
  fine_dining: {
    id: 'fine_dining',
    name: 'Fine Dining',
    description: 'Restaurants and private chefs. A social tool as much as sustenance.',
    monthlyCost: 250,
    effects: {
      networking: 0.15,
      reputation: 0.05,
    },
    icon: 'Wine',
  },
};

export const TRANSPORT_TIERS = {
  walking: {
    id: 'walking',
    name: 'Walking',
    description: 'Your own two feet. Limits where you can work.',
    monthlyCost: 0,
    purchaseCost: 0,
    effects: {
      timeEfficiency: -0.10,
      jobRange: -0.20,
    },
    icon: 'Footprints',
  },
  public_transit: {
    id: 'public_transit',
    name: 'Public Transit',
    description: 'Streetcars, buses, and trains. Reliable enough.',
    monthlyCost: 10,
    purchaseCost: 0,
    effects: {},
    icon: 'TrainFront',
  },
  used_car: {
    id: 'used_car',
    name: 'Used Car',
    description: 'A second-hand automobile. Freedom on four wheels.',
    monthlyCost: 40,
    purchaseCost: 200,
    effects: {
      jobRange: 0.10,
    },
    icon: 'Car',
  },
  nice_car: {
    id: 'nice_car',
    name: 'Nice Car',
    description: 'A respectable vehicle that makes an impression.',
    monthlyCost: 100,
    purchaseCost: 800,
    effects: {
      reputation: 0.10,
    },
    icon: 'Car',
  },
  luxury_car: {
    id: 'luxury_car',
    name: 'Luxury Car',
    description: 'A statement of success on wheels.',
    monthlyCost: 250,
    purchaseCost: 3000,
    effects: {
      reputation: 0.20,
      networking: 0.10,
    },
    icon: 'CarFront',
  },
};

export const INSURANCE_OPTIONS = {
  health_insurance: {
    id: 'health_insurance',
    name: 'Health Insurance',
    description: 'Reduces medical event costs by 80%.',
    monthlyCost: 20,
    effects: {
      medicalCostReduction: 0.80,
    },
    icon: 'HeartPulse',
  },
  life_insurance: {
    id: 'life_insurance',
    name: 'Life Insurance',
    description: 'Protects your family financially if the worst happens.',
    monthlyCost: 10,
    effects: {
      familyProtection: true,
    },
    icon: 'Shield',
  },
};

export const CLOTHING_TIERS = {
  rags: {
    id: 'rags',
    name: 'Rags',
    description: 'Worn-out clothes. People notice.',
    monthlyCost: 0,
    effects: {
      jobPerformance: -0.10,
      reputation: -0.10,
    },
    icon: 'Shirt',
  },
  basic: {
    id: 'basic',
    name: 'Basic Clothing',
    description: 'Simple, clean clothes. Nothing special.',
    monthlyCost: 5,
    effects: {},
    icon: 'Shirt',
  },
  decent: {
    id: 'decent',
    name: 'Decent Clothing',
    description: 'Well-kept wardrobe. You look presentable.',
    monthlyCost: 20,
    effects: {
      jobPerformance: 0.05,
      reputation: 0.05,
    },
    icon: 'Shirt',
  },
  stylish: {
    id: 'stylish',
    name: 'Stylish Clothing',
    description: 'Fashionable attire. You make an impression.',
    monthlyCost: 50,
    effects: {
      jobPerformance: 0.10,
      reputation: 0.10,
    },
    icon: 'Gem',
  },
  luxury_fashion: {
    id: 'luxury_fashion',
    name: 'Luxury Fashion',
    description: 'Tailored suits and designer pieces. The finest threads.',
    monthlyCost: 100,
    effects: {
      jobPerformance: 0.15,
      reputation: 0.15,
      networking: 0.05,
    },
    icon: 'Crown',
  },
};

export const ENTERTAINMENT_TIERS = {
  none: {
    id: 'none',
    name: 'No Entertainment',
    description: 'All work and no play. Drains your spirit.',
    monthlyCost: 0,
    effects: {
      happiness: -0.10,
    },
    icon: 'Ban',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'A newspaper and the occasional radio show.',
    monthlyCost: 5,
    effects: {},
    icon: 'Radio',
  },
  moderate: {
    id: 'moderate',
    name: 'Moderate',
    description: 'Movies, social clubs, and the occasional night out.',
    monthlyCost: 20,
    effects: {
      happiness: 0.05,
      networking: 0.05,
    },
    icon: 'Music',
  },
  generous: {
    id: 'generous',
    name: 'Generous',
    description: 'Regular entertainment, hobbies, and social events.',
    monthlyCost: 50,
    effects: {
      happiness: 0.10,
      networking: 0.10,
    },
    icon: 'PartyPopper',
  },
};

/**
 * Compute the era-adjusted cost for a given base cost.
 */
export function getAdjustedCost(baseCost, eraId) {
  const multiplier = ERA_COST_MULTIPLIERS[eraId] || 1.0;
  return Math.round(baseCost * multiplier);
}

/**
 * Compute total monthly expenses from a lifestyle configuration.
 */
export function calculateTotalMonthlyExpenses(lifestyle, eraId) {
  const housing = HOUSING_TIERS[lifestyle.housing]?.monthlyCost || 0;
  const food = FOOD_TIERS[lifestyle.food]?.monthlyCost || 0;
  const transport = TRANSPORT_TIERS[lifestyle.transport]?.monthlyCost || 0;
  const clothing = CLOTHING_TIERS[lifestyle.clothing]?.monthlyCost || 0;
  const entertainment = ENTERTAINMENT_TIERS[lifestyle.entertainment]?.monthlyCost || 0;

  let insurance = 0;
  if (lifestyle.healthInsurance) {
    insurance += INSURANCE_OPTIONS.health_insurance.monthlyCost;
  }
  if (lifestyle.lifeInsurance) {
    insurance += INSURANCE_OPTIONS.life_insurance.monthlyCost;
  }

  const baseCost = housing + food + transport + clothing + entertainment + insurance;
  return getAdjustedCost(baseCost, eraId);
}

/**
 * Aggregate all lifestyle effects into a single object.
 */
export function aggregateLifestyleEffects(lifestyle) {
  const allEffects = {};

  const sources = [
    HOUSING_TIERS[lifestyle.housing],
    FOOD_TIERS[lifestyle.food],
    TRANSPORT_TIERS[lifestyle.transport],
    CLOTHING_TIERS[lifestyle.clothing],
    ENTERTAINMENT_TIERS[lifestyle.entertainment],
  ];

  for (const source of sources) {
    if (!source?.effects) continue;
    for (const [key, value] of Object.entries(source.effects)) {
      allEffects[key] = (allEffects[key] || 0) + value;
    }
  }

  if (lifestyle.healthInsurance) {
    allEffects.medicalCostReduction = INSURANCE_OPTIONS.health_insurance.effects.medicalCostReduction;
  }
  if (lifestyle.lifeInsurance) {
    allEffects.familyProtection = true;
  }

  return allEffects;
}

/**
 * All tier databases keyed by category for easy iteration.
 */
export const LIFESTYLE_CATEGORIES = {
  housing: { label: 'Housing', tiers: HOUSING_TIERS, icon: 'Home' },
  food: { label: 'Food', tiers: FOOD_TIERS, icon: 'UtensilsCrossed' },
  transport: { label: 'Transportation', tiers: TRANSPORT_TIERS, icon: 'Car' },
  clothing: { label: 'Clothing', tiers: CLOTHING_TIERS, icon: 'Shirt' },
  entertainment: { label: 'Entertainment', tiers: ENTERTAINMENT_TIERS, icon: 'Music' },
};
