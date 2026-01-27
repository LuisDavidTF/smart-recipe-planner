import * as React from 'react';
import { LocalPantryItem } from '@/lib/db';
import { Button } from '@/components/shadcn/button';
import { Trash2, Pencil, Calendar } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { cn } from '@/lib/utils';
import { AddBatchModal } from './AddBatchModal';

interface BatchListProps {
    items: LocalPantryItem[];
    onUpdate: (id: number, updates: Partial<LocalPantryItem>) => Promise<void>;
    onRemove: (id: number) => Promise<void>;
}

export function BatchList({ items, onUpdate, onRemove }: BatchListProps) {
    const { t } = useSettings();
    const [editingItem, setEditingItem] = React.useState<LocalPantryItem | null>(null);

    const getDaysUntilExpiration = (dateStr?: string | null) => {
        if (!dateStr) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const exp = new Date(dateStr);
        exp.setHours(0, 0, 0, 0);
        const diffTime = exp.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getExpirationDetails = (days?: number | null) => {
        if (days === null || days === undefined) return { label: t.pantry.optional, color: 'text-muted-foreground bg-muted' };

        if (days < 0) {
            const daysAbs = Math.abs(days);
            // Construct string based on language pattern
            // ES: "Caducó hace" + " " + 2 + " " + "días" -> "Caducó hace 2 días"
            // EN: "Expired" + " " + 2 + " " + "days ago" -> "Expired 2 days ago" (Maybe add "It" prefix if preferred, but "Expired 2 days ago" is standard UI short text)
            // FR: "Expiré il y a" + " " + 2 + " " + "" -> "Expiré il y a 2 [jours implicit in context or empty]" -> wait, I need "jours" in FR too.
            // My keys:
            // ES: Pre='Caducó hace', Post='días'
            // EN: Pre='Expired', Post='days ago'
            // FR: Pre='Expiré il y a', Post='' ... Wait, FR needs "jours".
            // Let's adjust FR key logic in my head: "Expiré il y a 2 jours". So Post should be 'jours'.
            // Let's assume standard construction: Pre + count + Post.

            return {
                label: `${t.common.expiredPre} ${daysAbs} ${t.common.expiredPost}`,
                color: 'text-destructive bg-destructive/10 border-destructive/20 font-medium'
            };
        }
        if (days === 0) {
            return {
                label: t.common.expiresToday,
                color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800 font-medium'
            };
        }
        if (days <= 3) {
            return {
                label: `${t.common.expiresIn} ${days} ${t.common.days}`,
                color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800 font-medium'
            };
        }
        // Stable/Good state - using primary/theme colors as requested
        return {
            label: `${t.common.expiresIn} ${days} ${t.common.days}`,
            color: 'text-primary bg-primary/5 border-primary/10'
        };
    };

    return (
        <div className="space-y-2">
            {items.map(item => {
                const days = getDaysUntilExpiration(item.expirationDate);
                const status = getExpirationDetails(days);
                // Translate unit if possible, otherwise keep original
                const displayUnit = t.units?.[item.unit] || item.unit;

                return (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border sm:hover:border-primary/20 transition-colors group">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 w-full">
                            <span className="font-medium text-foreground min-w-[100px]">{item.quantity} {displayUnit}</span>

                            {item.expirationDate ? (
                                <div className={cn(
                                    "flex items-center text-xs px-3 py-1 rounded-full border transition-colors",
                                    status.color
                                )}>
                                    <Calendar className="w-3 h-3 mr-1.5 opacity-70" />
                                    {status.label}
                                </div>
                            ) : (
                                <span className="text-xs text-muted-foreground italic pl-2">{t.pantry.optional}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary"
                                onClick={() => setEditingItem(item)}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => {
                                    if (confirm(t.pantry.deleteExistencia)) {
                                        if (item.id) onRemove(item.id);
                                    }
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                );
            })}
            {editingItem && (
                <AddBatchModal
                    isOpen={!!editingItem}
                    onClose={() => setEditingItem(null)}
                    existingData={{
                        quantity: editingItem.quantity,
                        unit: editingItem.unit,
                        expirationDate: editingItem.expirationDate
                    }}
                    onSave={async (updates) => {
                        if (editingItem.id) {
                            await onUpdate(editingItem.id, updates);
                        }
                        setEditingItem(null);
                    }}
                />
            )}
        </div>
    );
}
