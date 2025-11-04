import { RecipeFeed } from '@components/recipes/RecipeFeed';
import { createApiClient } from '../lib/apiClient';


async function getRecipes(limit = 6) {
  try {
    const api = createApiClient();
    const data = await api.getRecipes({ limit });
    return data;
  } catch (error) {
    return { data: [], nextCursor: null };
  }
}

export default async function HomePage() {
  const { data: initialRecipes, nextCursor } = await getRecipes(6);

  return (
    <RecipeFeed initialRecipes={initialRecipes || []} initialNextCursor={nextCursor} />
  );
}