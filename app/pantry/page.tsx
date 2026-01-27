'use client';

import { usePantry } from '@/hooks/usePantry';
import { PantryList } from '@/components/pantry/PantryList';
import { useSettings } from '@/context/SettingsContext';

export default function PantryPage() {
    const { items, addItem, updateItem, removeItem } = usePantry();
    const { t } = useSettings();

    // Group items by ingredientId
    // We can assume items with same ingredientId have same name. 
    // If not, we take the name from the first match.
    // The implementation of grouping happens in PantryList or here.
    // Let's pass the raw items to PantryList to handle grouping logic for better composition,
    // or group here. Grouping here seems cleaner for "PantryList" to just take Groups.
    // However, for updates, passing raw items + actions is often easier if PantryList manages the list state.
    // Given the requirement "Grouped View", let's let PantryList handle the presentation logic
    // of the raw flat list from usePantry.

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2 tracking-tight">{t?.pantry?.title || 'Mi Despensa'}</h1>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                        {t?.pantry?.subtitle || 'Gestiona tus ingredientes para cocinar siempre fresco.'}
                    </p>
                </div>
            </header>

            <PantryList
                items={items}
                onUpdate={updateItem}
                onRemove={removeItem}
                onAdd={addItem}
            />
        </div>
    );
}
