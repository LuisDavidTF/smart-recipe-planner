import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import RecipeClient from './RecipeClient';
import { slugify } from '@utils/slugify';

async function getRecipe(id) {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Dynamic host detection for robust server-side fetching
    if (!apiUrl || apiUrl.startsWith('/')) {
        try {
            const headersList = await headers();
            const host = headersList.get('host');
            const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
            apiUrl = `${protocol}://${host}`;
        } catch (e) {
            console.warn("Could not determine host from headers", e);
        }
    }

    if (!apiUrl) return null;

    try {
        // Fix: backend URL likely includes /api/v1, so we should append /recipes, not /api/recipes
        // However, we need to be careful. 
        // If apiUrl is just "http://localhost:3000" (from header detection), we DO need /api/recipes.
        // If apiUrl is "https://.../api/v1", we likely need /recipes.

        let endpoint = `/api/recipes/${id}`;
        if (apiUrl.includes('/api/v1')) {
            endpoint = `/recipes/${id}`;
        }

        const res = await fetch(`${apiUrl}${endpoint}`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`Failed to fetch recipe: ${res.status}`);
        }

        const data = await res.json();
        return data.data || data;
    } catch (error) {
        console.error("SERVER FETCH ERROR:", error);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const recipe = await getRecipe(id);

    if (!recipe) {
        return {
            title: 'Receta no encontrada',
            description: 'La receta que buscas no existe o ha sido eliminada.'
        };
    }

    const correctSlug = slugify(recipe.name);
    const canonicalUrl = `/recipes/${correctSlug}/${id}`;

    return {
        title: `${recipe.name} | Smart Recipe Planner`,
        description: recipe.description || `Receta de ${recipe.name}`,
        openGraph: {
            title: recipe.name,
            description: recipe.description,
            images: recipe.image_url ? [{ url: recipe.image_url }] : [],
        },
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

export default async function RecipeCanonicalPage({ params }) {
    const { id, slug } = await params;
    const recipe = await getRecipe(id);

    if (!recipe) {
        notFound();
    }

    const correctSlug = slugify(recipe.name);

    return (
        <RecipeClient
            recipe={recipe}
            recipeId={id}
            currentSlug={slug}
            correctSlug={correctSlug}
        />
    );
}
