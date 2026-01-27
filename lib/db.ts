import Dexie, { type EntityTable } from 'dexie';

export interface LocalPantryItem {
    id?: number; // Local AutoIndexed ID
    ingredientId: number;
    name: string; // Ingredient name for display
    quantity: number;
    unit: string; // 'L', 'ml', 'kg', 'pza'
    expirationDate?: string | null; // ISO Date YYYY-MM-DD
    isSynced: boolean; // Flag to sync with backend
}

// Extend Dexie class to handle typescript properly for specific tables
const db = new Dexie('SmartRecipePlannerDB') as Dexie & {
    pantryItems: EntityTable<LocalPantryItem, 'id'>;
};

// Schema registration
// We index ingredientId to query by ingredient, and expirationDate for sorting/filtering
db.version(1).stores({
    pantryItems: '++id, ingredientId, expirationDate'
});

export { db };
