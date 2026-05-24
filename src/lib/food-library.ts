export type FoodEntry = {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  defaultGrams: number;
};

export const FOOD_DATABASE: FoodEntry[] = [
  // ─── חלבונים ───
  { name: "חזה עוף מבושל",       caloriesPer100g: 165, proteinPer100g: 31.0, carbsPer100g: 0.0, fatPer100g: 3.6,  defaultGrams: 150 },
  { name: "ירך עוף ללא עצם",     caloriesPer100g: 209, proteinPer100g: 26.0, carbsPer100g: 0.0, fatPer100g: 11.0, defaultGrams: 150 },
  { name: "הודו טחון (רזה)",     caloriesPer100g: 170, proteinPer100g: 22.0, carbsPer100g: 0.0, fatPer100g: 9.0,  defaultGrams: 150 },
  { name: "בשר בקר רזה",         caloriesPer100g: 218, proteinPer100g: 26.0, carbsPer100g: 0.0, fatPer100g: 12.0, defaultGrams: 150 },
  { name: "סלמון",                caloriesPer100g: 208, proteinPer100g: 20.0, carbsPer100g: 0.0, fatPer100g: 13.0, defaultGrams: 150 },
  { name: "טונה במים",            caloriesPer100g: 109, proteinPer100g: 24.0, carbsPer100g: 0.0, fatPer100g: 1.0,  defaultGrams: 100 },
  { name: "טונה בשמן",            caloriesPer100g: 198, proteinPer100g: 25.0, carbsPer100g: 0.0, fatPer100g: 10.0, defaultGrams: 100 },
  { name: "ביצה שלמה",            caloriesPer100g: 155, proteinPer100g: 12.6, carbsPer100g: 1.1, fatPer100g: 10.6, defaultGrams: 55  },
  { name: "חלבון ביצה",           caloriesPer100g: 52,  proteinPer100g: 11.0, carbsPer100g: 0.7, fatPer100g: 0.2,  defaultGrams: 100 },
  { name: "גבינת קוטג׳ 5%",       caloriesPer100g: 98,  proteinPer100g: 11.0, carbsPer100g: 3.4, fatPer100g: 4.3,  defaultGrams: 200 },
  { name: "גבינה לבנה 5%",        caloriesPer100g: 85,  proteinPer100g: 12.0, carbsPer100g: 3.0, fatPer100g: 3.5,  defaultGrams: 150 },
  { name: "יוגורט יווני 0%",      caloriesPer100g: 59,  proteinPer100g: 10.0, carbsPer100g: 3.6, fatPer100g: 0.4,  defaultGrams: 200 },
  { name: "טופו",                  caloriesPer100g: 76,  proteinPer100g: 8.0,  carbsPer100g: 2.0, fatPer100g: 4.5,  defaultGrams: 150 },
  { name: "שעועית לבנה מבושלת",   caloriesPer100g: 127, proteinPer100g: 8.7,  carbsPer100g: 22.0,fatPer100g: 0.5,  defaultGrams: 150 },
  { name: "עדשים מבושלות",        caloriesPer100g: 116, proteinPer100g: 9.0,  carbsPer100g: 20.0,fatPer100g: 0.4,  defaultGrams: 150 },
  { name: "גבינה צהובה 28%",      caloriesPer100g: 360, proteinPer100g: 25.0, carbsPer100g: 1.0, fatPer100g: 28.0, defaultGrams: 30  },
  { name: "המבורגר בקר 80/20",    caloriesPer100g: 254, proteinPer100g: 17.0, carbsPer100g: 0.0, fatPer100g: 20.0, defaultGrams: 150 },
  { name: "פרוטאין שייק (מנה)",   caloriesPer100g: 120, proteinPer100g: 24.0, carbsPer100g: 3.0, fatPer100g: 1.5,  defaultGrams: 30  },
  { name: "הלומי",                 caloriesPer100g: 321, proteinPer100g: 21.0, carbsPer100g: 1.5, fatPer100g: 26.0, defaultGrams: 80  },

  // ─── פחמימות ───
  { name: "אורז לבן מבושל",       caloriesPer100g: 130, proteinPer100g: 2.7,  carbsPer100g: 28.0,fatPer100g: 0.3,  defaultGrams: 200 },
  { name: "אורז מלא מבושל",       caloriesPer100g: 112, proteinPer100g: 2.6,  carbsPer100g: 23.5,fatPer100g: 0.9,  defaultGrams: 200 },
  { name: "פסטה מבושלת",          caloriesPer100g: 158, proteinPer100g: 5.8,  carbsPer100g: 31.0,fatPer100g: 0.9,  defaultGrams: 200 },
  { name: "קינואה מבושלת",        caloriesPer100g: 120, proteinPer100g: 4.4,  carbsPer100g: 22.0,fatPer100g: 1.9,  defaultGrams: 150 },
  { name: "שיבולת שועל (קווקר)",  caloriesPer100g: 371, proteinPer100g: 13.0, carbsPer100g: 66.0,fatPer100g: 7.0,  defaultGrams: 50  },
  { name: "לחם מלא פרוסה",        caloriesPer100g: 247, proteinPer100g: 9.0,  carbsPer100g: 44.0,fatPer100g: 3.5,  defaultGrams: 30  },
  { name: "לחם לבן פרוסה",        caloriesPer100g: 266, proteinPer100g: 8.0,  carbsPer100g: 52.0,fatPer100g: 2.5,  defaultGrams: 30  },
  { name: "פיתה מלאה",            caloriesPer100g: 260, proteinPer100g: 9.5,  carbsPer100g: 50.0,fatPer100g: 1.5,  defaultGrams: 65  },
  { name: "בטטה מבושלת",          caloriesPer100g: 86,  proteinPer100g: 1.6,  carbsPer100g: 20.0,fatPer100g: 0.1,  defaultGrams: 200 },
  { name: "תפוח אדמה מבושל",      caloriesPer100g: 87,  proteinPer100g: 1.9,  carbsPer100g: 20.0,fatPer100g: 0.1,  defaultGrams: 200 },
  { name: "תירס מבושל",           caloriesPer100g: 96,  proteinPer100g: 3.4,  carbsPer100g: 21.0,fatPer100g: 1.4,  defaultGrams: 150 },
  { name: "בננה",                  caloriesPer100g: 89,  proteinPer100g: 1.1,  carbsPer100g: 23.0,fatPer100g: 0.3,  defaultGrams: 120 },
  { name: "תפוח",                  caloriesPer100g: 52,  proteinPer100g: 0.3,  carbsPer100g: 14.0,fatPer100g: 0.2,  defaultGrams: 150 },
  { name: "מנגו",                  caloriesPer100g: 60,  proteinPer100g: 0.8,  carbsPer100g: 15.0,fatPer100g: 0.4,  defaultGrams: 150 },
  { name: "תמרים",                 caloriesPer100g: 282, proteinPer100g: 2.5,  carbsPer100g: 75.0,fatPer100g: 0.4,  defaultGrams: 30  },
  { name: "גרנולה",                caloriesPer100g: 420, proteinPer100g: 9.0,  carbsPer100g: 65.0,fatPer100g: 14.0, defaultGrams: 50  },
  { name: "דגני בוקר (קורנפלקס)", caloriesPer100g: 357, proteinPer100g: 7.5,  carbsPer100g: 84.0,fatPer100g: 0.5,  defaultGrams: 40  },

  // ─── שומנים ───
  { name: "שמן זית",               caloriesPer100g: 884, proteinPer100g: 0.0,  carbsPer100g: 0.0, fatPer100g: 100.0,defaultGrams: 10  },
  { name: "אבוקדו",                caloriesPer100g: 160, proteinPer100g: 2.0,  carbsPer100g: 9.0, fatPer100g: 15.0, defaultGrams: 100 },
  { name: "שקדים",                 caloriesPer100g: 579, proteinPer100g: 21.0, carbsPer100g: 22.0,fatPer100g: 50.0, defaultGrams: 30  },
  { name: "אגוזי מלך",            caloriesPer100g: 654, proteinPer100g: 15.0, carbsPer100g: 14.0,fatPer100g: 65.0, defaultGrams: 30  },
  { name: "גרעיני חמנייה",        caloriesPer100g: 584, proteinPer100g: 21.0, carbsPer100g: 20.0,fatPer100g: 51.0, defaultGrams: 30  },
  { name: "חמאת בוטנים",          caloriesPer100g: 588, proteinPer100g: 25.0, carbsPer100g: 20.0,fatPer100g: 50.0, defaultGrams: 30  },
  { name: "טחינה גולמית",         caloriesPer100g: 570, proteinPer100g: 17.0, carbsPer100g: 26.0,fatPer100g: 48.0, defaultGrams: 20  },

  // ─── ירקות ───
  { name: "ברוקולי מבושל",        caloriesPer100g: 35,  proteinPer100g: 2.4,  carbsPer100g: 7.2, fatPer100g: 0.4,  defaultGrams: 200 },
  { name: "תרד מבושל",            caloriesPer100g: 23,  proteinPer100g: 2.9,  carbsPer100g: 3.6, fatPer100g: 0.4,  defaultGrams: 150 },
  { name: "כרובית מבושלת",        caloriesPer100g: 25,  proteinPer100g: 1.9,  carbsPer100g: 5.0, fatPer100g: 0.3,  defaultGrams: 200 },
  { name: "אספרגוס",               caloriesPer100g: 20,  proteinPer100g: 2.2,  carbsPer100g: 3.9, fatPer100g: 0.1,  defaultGrams: 150 },
  { name: "זוקיני מבושל",         caloriesPer100g: 17,  proteinPer100g: 1.2,  carbsPer100g: 3.5, fatPer100g: 0.2,  defaultGrams: 200 },
  { name: "עגבנייה",               caloriesPer100g: 18,  proteinPer100g: 0.9,  carbsPer100g: 3.9, fatPer100g: 0.2,  defaultGrams: 150 },
  { name: "מלפפון",                caloriesPer100g: 16,  proteinPer100g: 0.7,  carbsPer100g: 3.6, fatPer100g: 0.1,  defaultGrams: 150 },
  { name: "פלפל אדום",            caloriesPer100g: 31,  proteinPer100g: 1.0,  carbsPer100g: 7.6, fatPer100g: 0.3,  defaultGrams: 150 },
  { name: "גזר",                   caloriesPer100g: 41,  proteinPer100g: 0.9,  carbsPer100g: 9.6, fatPer100g: 0.2,  defaultGrams: 100 },
  { name: "כרוב",                  caloriesPer100g: 25,  proteinPer100g: 1.3,  carbsPer100g: 6.0, fatPer100g: 0.1,  defaultGrams: 150 },
  { name: "חסה",                   caloriesPer100g: 15,  proteinPer100g: 1.4,  carbsPer100g: 2.9, fatPer100g: 0.2,  defaultGrams: 100 },

  // ─── חלב ומוצריו ───
  { name: "חלב דל שומן 1%",        caloriesPer100g: 42,  proteinPer100g: 3.4,  carbsPer100g: 4.8, fatPer100g: 1.0,  defaultGrams: 250 },
  { name: "חלב שלם 3%",            caloriesPer100g: 62,  proteinPer100g: 3.2,  carbsPer100g: 4.8, fatPer100g: 3.2,  defaultGrams: 250 },
  { name: "שמנת חמוצה 15%",        caloriesPer100g: 150, proteinPer100g: 3.5,  carbsPer100g: 3.7, fatPer100g: 15.0, defaultGrams: 50  },

  // ─── אחר ───
  { name: "חומוס מוכן",            caloriesPer100g: 166, proteinPer100g: 9.0,  carbsPer100g: 27.0,fatPer100g: 3.0,  defaultGrams: 100 },
  { name: "שוקולד מריר 70%",       caloriesPer100g: 546, proteinPer100g: 5.0,  carbsPer100g: 46.0,fatPer100g: 35.0, defaultGrams: 20  },
  { name: "דבש",                   caloriesPer100g: 304, proteinPer100g: 0.3,  carbsPer100g: 82.0,fatPer100g: 0.0,  defaultGrams: 15  },
  { name: "ריבה",                  caloriesPer100g: 250, proteinPer100g: 0.5,  carbsPer100g: 65.0,fatPer100g: 0.1,  defaultGrams: 20  },
  { name: "קטשופ",                 caloriesPer100g: 101, proteinPer100g: 1.7,  carbsPer100g: 25.0,fatPer100g: 0.1,  defaultGrams: 30  },
];

export function searchFoods(query: string): FoodEntry[] {
  if (!query.trim()) return FOOD_DATABASE;
  const q = query.trim().toLowerCase();
  return FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(q));
}

export function calcMacros(food: FoodEntry, grams: number) {
  const factor = grams / 100;
  return {
    calories:  Math.round(food.caloriesPer100g * factor),
    protein_g: Math.round(food.proteinPer100g  * factor * 10) / 10,
    carbs_g:   Math.round(food.carbsPer100g    * factor * 10) / 10,
    fat_g:     Math.round(food.fatPer100g      * factor * 10) / 10,
  };
}
