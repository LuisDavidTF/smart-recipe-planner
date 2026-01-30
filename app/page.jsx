import { RecipeFeed } from '@components/recipes/RecipeFeed';
import { LandingHero } from '@components/landing/LandingHero';
import { FeaturesSection } from '@components/landing/FeaturesSection';

import { RecipeService } from '@/lib/services/recipes';

async function getInitialRecipes() {
  try {
    // Revalidates cache every 60 seconds.
    const data = await RecipeService.getAll({}, { next: { tags: ['recipes'], revalidate: 60 } });
    return data;
  } catch (error) {
    console.error("Error fetching initial recipes:", error);
    return { data: [], meta: { nextCursor: null } };
  }
}

export default async function HomePage() {
  const initialData = await getInitialRecipes();
  return (
    <>
      <LandingHero />
      <FeaturesSection />
      <div id="latest-recipes">
        <RecipeFeed initialData={initialData} />
      </div>
    </>
  );
}
