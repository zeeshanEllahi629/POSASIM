import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/front/AddToCartButton";
import FallbackImage from "@/components/front/FallbackImage";

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const categorySlug = params?.category || null;

  // Fetch all active categories for the sidebar
  const categories = await prisma.categories.findMany({
    where: { is_available: 1, is_deleted: 2 },
    orderBy: { reorder_id: "asc" },
  });

  const settings = await prisma.settings.findFirst();
  const viewMode = settings?.product_card_view === 1 ? "grid" : "list";

  // Find the selected category object if a slug is provided
  let selectedCategory = null;
  if (categorySlug) {
    selectedCategory = categories.find((c) => c.slug === categorySlug);
  }

  // Fetch items based on category, or all active items if no category is selected
  const whereClause = {
    item_status: 1,
  };
  if (selectedCategory) {
    whereClause.cat_id = Number(selectedCategory.id);
  }

  const items = await prisma.item.findMany({
    where: whereClause,
    orderBy: {
      id: 'desc'
    }
  });

  // Fetch variations for these items
  const itemIds = items.map(i => Number(i.id));
  const variations = await prisma.variation.findMany({
    where: { item_id: { in: itemIds }, is_available: 1 }
  });

  // Attach variations to items
  const itemsWithVariations = items.map(item => ({
    ...item,
    variations: variations.filter(v => v.item_id === Number(item.id))
  }));

  const showBrief = settings?.show_product_brief === 1;

  return (
    <div className="bg-[#0a0a0a] min-h-screen py-10">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white uppercase tracking-tight">Our Menu</h1>
          <p className="text-zinc-400 mt-2">Discover our delicious offerings</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Categories Sidebar */}
          <div className="w-full md:w-1/4 lg:w-1/5">
            <div className="bg-[#111] rounded-2xl shadow-sm p-4 sticky top-24 border border-[#222]">
              <h3 className="font-bold text-lg mb-4 uppercase tracking-wider text-zinc-100 border-b border-[#333] pb-2">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/menu"
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${!categorySlug ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-[#222] hover:text-red-500'}`}
                  >
                    All Items
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id.toString()}>
                    <Link 
                      href={`/menu?category=${cat.slug}`}
                      className={`block px-4 py-3 rounded-lg font-medium transition-colors ${categorySlug === cat.slug ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-[#222] hover:text-red-500'}`}
                    >
                      {cat.category_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Items Grid */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            {selectedCategory && (
               <div className="mb-6">
                 <h2 className="text-2xl font-bold text-white">{selectedCategory.category_name}</h2>
                 <p className="text-zinc-400 text-sm">Showing all items in this category.</p>
               </div>
            )}
            
            {itemsWithVariations.length > 0 ? (
              viewMode === "list" ? (
                <div className="flex flex-col gap-4">
                  {itemsWithVariations.map((item) => (
                    <div key={item.id.toString()} className="bg-[#111] rounded-2xl shadow-sm hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-shadow overflow-hidden group flex flex-col sm:flex-row border border-[#333]">
                      <div className="w-full sm:w-48 h-48 sm:h-auto bg-[#222] relative overflow-hidden flex-shrink-0">
                        <FallbackImage 
                          src={`/storage/app/public/admin-assets/images/item/${item.image}`}
                          alt={item.item_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                          fallbackSrc={`https://via.placeholder.com/400x300?text=${encodeURIComponent(item.item_name)}`}
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-grow justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <h3 className="font-bold text-xl text-white group-hover:text-red-500 transition-colors line-clamp-2">{item.item_name}</h3>
                            <span className="font-bold text-xl text-red-500 flex-shrink-0">${item.price}</span>
                          </div>
                          {showBrief && (
                            <p className="text-zinc-400 text-sm mb-4 line-clamp-2 sm:line-clamp-none">{item.item_description || "Delicious item ready to be ordered."}</p>
                          )}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <AddToCartButton item={item} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {itemsWithVariations.map((item) => (
                    <div key={item.id.toString()} className="bg-[#111] rounded-2xl shadow-sm hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-shadow overflow-hidden group flex flex-col h-full border border-[#333]">
                      <div className="h-48 bg-[#222] relative overflow-hidden flex-shrink-0">
                        <FallbackImage 
                          src={`/storage/app/public/admin-assets/images/item/${item.image}`}
                          alt={item.item_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                          fallbackSrc={`https://via.placeholder.com/400x300?text=${encodeURIComponent(item.item_name)}`}
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h3 className="font-bold text-lg text-white group-hover:text-red-500 transition-colors line-clamp-2">{item.item_name}</h3>
                          <span className="font-bold text-lg text-red-500 flex-shrink-0">${item.price}</span>
                        </div>
                        {showBrief && (
                          <p className="text-zinc-400 text-sm mb-4 line-clamp-2 flex-grow">{item.item_description || "Delicious item ready to be ordered."}</p>
                        )}
                        <div className="mt-auto pt-4">
                          <AddToCartButton item={item} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
               <div className="bg-[#111] rounded-2xl shadow-sm p-10 text-center border border-[#333]">
                 <div className="text-6xl text-zinc-700 mb-4"><i className="fa-solid fa-utensils"></i></div>
                 <h3 className="text-xl font-bold text-zinc-300">No Items Found</h3>
                 <p className="text-zinc-500 mt-2">There are currently no items available in this category.</p>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
