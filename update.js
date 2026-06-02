const fs = require('fs');
const path = 'src/app/api/admin/products/route.js';
let content = fs.readFileSync(path, 'utf8');

const target = `    const newItem = await prisma.item.create({
      data: {
        item_name, slug, sku, brand_id, unit_id, warranty_id, branch_id,
        alert_quantity, barcode_type, enable_description, tax_type, product_type, label_print,
        cat_id, subcat_id, price, qty, item_type, item_description, image: imageName,
        reorder_id: 0, tax: "0", avg_ratting: 0.0, discount_percentage: 0.0,
        item_status: 1, is_featured: 2, is_top_deals: 2,
      },
    });`;

const replacement = `    const newItem = await prisma.item.create({
      data: {
        item_name, slug, sku, brand_id, unit_id, warranty_id, branch_id,
        alert_quantity, barcode_type, enable_description, tax_type, product_type, label_print,
        cat_id, subcat_id, price, qty, item_type, item_description, image: imageName,
        reorder_id: 0, tax: "0", avg_ratting: 0.0, discount_percentage: 0.0,
        item_status: 1, is_featured: 2, is_top_deals: 2,
      },
    });

    const variationsRaw = formData.get("variations");
    if (product_type === "variable" && variationsRaw) {
      try {
        const parsedVariations = JSON.parse(variationsRaw);
        if (Array.isArray(parsedVariations) && parsedVariations.length > 0) {
          const variationsToInsert = parsedVariations.map(v => ({
            item_id: newItem.id,
            name: v.name,
            price: parseFloat(v.price) || 0,
            qty: parseInt(v.qty) || 0,
            stock_management: 1
          }));
          await prisma.variation.createMany({ data: variationsToInsert });
        }
      } catch (e) {
        console.error("Variation Parsing Error", e);
      }
    }`;

content = content.replace(target, replacement);

fs.writeFileSync(path, content);
console.log('Done!');
