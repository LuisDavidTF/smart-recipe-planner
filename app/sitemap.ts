import { MetadataRoute } from 'next'
import { slugify } from '@utils/slugify';

import { RecipeService } from '@/lib/services/recipes';

async function getAllRecipes() {
    try {
        let allRecipes: any[] = [];
        let cursor: string | null = null;
        let hasMore = true;

        while (hasMore) {
            const params: any = { limit: 50 }; // Respect API limit
            if (cursor) {
                params.cursor = cursor;
            }

            const response = await RecipeService.getAll(params);
            const recipes = response.data || [];

            if (recipes.length > 0) {
                allRecipes = [...allRecipes, ...recipes];
            }

            // Check for next cursor
            if (response.meta && response.meta.nextCursor) {
                cursor = response.meta.nextCursor;
            } else {
                hasMore = false;
            }
        }

        return allRecipes;
    } catch (error) {
        console.error("Sitemap fetch error:", error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://culinasmart.vercel.app';
    const recipes = await getAllRecipes();

    const recipeUrls = recipes.map((recipe) => {
        const item: any = {
            url: `${baseUrl}/recipes/${slugify(recipe.name)}/${recipe.id}`,
            lastModified: new Date(recipe.updated_at || recipe.created_at || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        };

        // Google Image Sitemap extension
        if (recipe.imageUrl) {
            item.images = [recipe.imageUrl];
        }

        return item;
    });

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
        },
        {
            url: `${baseUrl}/recipes`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/register`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        ...recipeUrls,
    ]
}
