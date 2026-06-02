const fs = require('fs');
let c = fs.readFileSync('src/app/(front)/page.js', 'utf8');

c = c.replace(
  'orderBy: { reorder_id: "asc" },\n  });',
  'orderBy: { reorder_id: "asc" },\n  });\n\n  const banners = await prisma.banner.findMany({\n    where: { is_available: 1 },\n    orderBy: { reorder_id: "asc" },\n  });'
);

c = c.replace(
  '        </section>\n      )}\n\n      {/* Features Section */}',
  '        </section>\n      )}\n\n      {/* Dynamic Banners from Theme Settings */}\n      {banners.length > 0 && (\n        <section className="py-12 bg-[#050505] container mx-auto px-4 lg:px-8">\n          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n            {banners.map((banner) => (\n              <div key={banner.id} className="rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">\n                <img src={banner.image} alt="Promotional Banner" className="w-full h-48 object-cover" />\n              </div>\n            ))}\n          </div>\n        </section>\n      )}\n\n      {/* Features Section */}'
);

fs.writeFileSync('src/app/(front)/page.js', c);
console.log('done');
