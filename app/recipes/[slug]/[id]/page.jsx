import { cookies } from 'next/headers';
export const runtime = 'edge';
import { notFound, redirect } from 'next/navigation';
import { RecipeService } from '@/lib/services/recipes';
import RecipeClient from './RecipeClient';
import { slugify } from '@utils/slugify';

async function getRecipe(id, currentSlug = null) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        // Use RecipeService instead of direct fetch
        // This abstracts URL handling and now supports Headers/Token
        const data = await RecipeService.getById(id, token);
        return data;
    } catch (error) {
        if (error?.status === 401) {
            const callbackPath = currentSlug ? `/recipes/${currentSlug}/${id}` : `/`;
            redirect(`/api/logout?callbackUrl=${encodeURIComponent(callbackPath)}`);
        }
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
            images: recipe.imageUrl ? [{ url: recipe.imageUrl }] : [],
        },
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

export default async function RecipeCanonicalPage({ params }) {
    const { id, slug } = await params;
    const recipe = await getRecipe(id, slug);

    if (!recipe) {
        notFound();
    }

    const correctSlug = slugify(recipe.name);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: recipe.name,
        description: recipe.description,
        image: recipe.imageUrl ? [recipe.imageUrl] : [],
        author: {
            '@type': 'Person',
            name: recipe.authorName || recipe.user?.name || 'Culina Smart User',
        },
        datePublished: recipe.created_at,
        prepTime: recipe.preparationTimeMinutes ? `PT${recipe.preparationTimeMinutes}M` : undefined,
        recipeIngredient: recipe.ingredients?.map((i) => `${i.quantity} ${i.unitOfMeasure || i.unit_of_measure} ${i.name || i.ingredient?.name}`),
        recipeInstructions: recipe.instructions?.map((inst) => ({
            '@type': 'HowToStep',
            text: inst,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <RecipeClient
                recipe={recipe}
                recipeId={id}
                currentSlug={slug}
                correctSlug={correctSlug}
            />
        </>
    );
}
