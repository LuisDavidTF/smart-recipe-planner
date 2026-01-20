import { permanentRedirect, notFound } from 'next/navigation';
export const runtime = 'edge';
import { headers } from 'next/headers';
import { slugify } from '@utils/slugify';

import { RecipeService } from '@/lib/services/recipes';

async function getRecipe(id) {
    try {
        const recipe = await RecipeService.getById(id);
        return recipe;
    } catch (error) {
        // If 404 or invalid ID, return null
        return null;
    }
}

export default async function LegacyRedirectPage({ params }) {
    // 'slug' here captures the first segment after /recipes/
    // In the legacy case, this is the ID (e.g. /recipes/123 -> slug="123")
    const { slug } = await params;

    // Try to use the slug as an ID
    const recipe = await getRecipe(slug);

    if (!recipe) {
        // If we can't find a recipe with this ID, and since we don't support 
        // slug-only URLs without ID yet, we 404.
        notFound();
    }

    const correctSlug = slugify(recipe.name);

    // Redirect to the canonical URL structure: /recipes/[slug]/[id]
    permanentRedirect(`/recipes/${correctSlug}/${slug}`);
}
