import db from '@/lib/prismadb';
import CategoryClient from './components/CategoryClient';
import { CategoryColumn } from './components/columns';

async function CategoriesPage({ params }: { params: { storeId: string } }) {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedCategories = categories.map((category) => {
    return {
      id: category.id,
      name: category.name,
      billboardLabel: category.billboard.label,
      createdAt: category.createdAt.toDateString(),
    };
  });

  return (
    <div className="p-8 pt-6 space-y-4 flex-1">
      <CategoryClient categories={formattedCategories} />
    </div>
  );
}

export default CategoriesPage;
