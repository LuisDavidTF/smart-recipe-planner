import { permanentRedirect, notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { slugify } from '@utils/slugify';

async function getRecipe(id) {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
        let endpoint = `/api/recipes/${id}`;
        if (apiUrl.includes('/api/v1')) {
            endpoint = `/recipes/${id}`;
        }

        const res = await fetch(`${apiUrl}${endpoint}`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data.data || data;
    } catch (error) {
        console.error("Error fetching recipe:", error);
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
