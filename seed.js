const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    let cat = await prisma.categories.findFirst({ where: { category_name: 'Fast Food' } });
    if (!cat) {
      cat = await prisma.categories.create({
        data: {
          category_name: 'Fast Food',
          slug: 'fast-food',
          image: 'default.png',
          reorder_id: 1,
          is_available: 1,
          is_deleted: 2
        }
      });
    }
    
    const items = [
      { name: 'Zinger Burger', price: 5.99, desc: 'Crispy fried chicken burger', img: 'burger.png' },
      { name: 'Classic Beef Burger', price: 6.50, desc: 'Juicy beef patty with cheese', img: 'burger.png' },
      { name: 'Chicken Nuggets (10pc)', price: 4.99, desc: 'Golden crispy nuggets', img: 'default.png' },
      { name: 'French Fries (Large)', price: 2.99, desc: 'Crispy salted fries', img: 'default.png' },
      { name: 'Cheese Pizza', price: 9.99, desc: '10 inch classic cheese pizza', img: 'default.png' }
    ];
    
    for (const item of items) {
      const existing = await prisma.item.findFirst({ where: { item_name: item.name } });
      if (!existing) {
        await prisma.item.create({
          data: {
            cat_id: Number(cat.id),
            subcat_id: 0,
            item_name: item.name,
            slug: item.name.toLowerCase().replace(/ /g, '-'),
            image: item.img,
            price: item.price,
            original_price: '0',
            reorder_id: 1,
            item_status: 1,
            tax: '0',
            avg_ratting: 5,
            discount_percentage: 0,
            item_description: item.desc
          }
        });
      }
    }
    console.log('Successfully added 5 fast food items!');
  } catch(e) {
    console.error(e);
  } finally {
    await prisma['$disconnect']();
  }
}
seed();
