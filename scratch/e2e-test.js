const mariadb = require("mariadb");
const BASE_URL = "http://localhost:3000";

async function runTest() {
  console.log("=========================================");
  console.log("🚀 STARTING E2E INTEGRATION & DB TEST");
  console.log("=========================================");

  const pool = mariadb.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'foodefy_code'
  });

  let conn;
  try {
    conn = await pool.getConnection();

    // 1. Ensure test data exists (Category & Item)
    console.log("Checking if categories and items exist in the database...");
    const dbCategories = await conn.query("SELECT id FROM categories WHERE is_deleted = 2 LIMIT 1");
    let categoryId;
    if (dbCategories.length === 0) {
      console.log("No categories found. Creating a test category...");
      const insertCat = await conn.query(
        "INSERT INTO categories (reorder_id, category_name, slug, image, is_available, is_deleted, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
        [1, "Test Category", "test-category", "default.png", 1, 2]
      );
      categoryId = insertCat.insertId;
      console.log(`Created Category with ID: ${categoryId}`);
    } else {
      categoryId = dbCategories[0].id;
      console.log(`Found Category with ID: ${categoryId}`);
    }

    const dbItems = await conn.query("SELECT id FROM item WHERE item_status = 1 LIMIT 1");
    let itemId;
    if (dbItems.length === 0) {
      console.log("No items found. Creating a test product...");
      const insertItem = await conn.query(
        "INSERT INTO item (reorder_id, cat_id, subcat_id, item_name, slug, image, item_type, price, qty, original_price, tax, avg_ratting, discount_percentage, item_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
        [1, Number(categoryId), 0, "Delicious Burger", "delicious-burger", "burger.png", 2, 9.99, 50, "9.99", "5", 5.0, 0, 1]
      );
      itemId = insertItem.insertId;
      console.log(`Created Item with ID: ${itemId}`);
    } else {
      itemId = dbItems[0].id;
      console.log(`Found Item with ID: ${itemId}`);
    }

    // 2. Perform Login via API
    console.log("\nLogging in via API...");
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@gmail.com", password: "123456" })
    });
    
    if (loginRes.status !== 200) {
      throw new Error(`Login failed with status ${loginRes.status}: ${await loginRes.text()}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Successfully logged in! Token acquired.");

    const headers = {
      "Content-Type": "application/json",
      "Cookie": `token=${token}`
    };

    // 3. Fetch POS categories and items
    console.log("\nFetching POS categories...");
    const catRes = await fetch(`${BASE_URL}/api/pos/categories`, { headers });
    const catData = await catRes.json();
    console.log(`Fetched ${catData.categories?.length || 0} categories.`);

    console.log("Fetching POS items...");
    const itemsRes = await fetch(`${BASE_URL}/api/pos/items`, { headers });
    const itemsData = await itemsRes.json();
    console.log(`Fetched ${itemsData.items?.length || 0} items.`);
    
    const testItem = itemsData.items?.find(i => i.id.toString() === itemId.toString()) || itemsData.items?.[0];
    if (!testItem) {
      throw new Error("No POS items returned.");
    }
    console.log(`Using test item: "${testItem.item_name}" - Price: $${testItem.price}`);

    // 4. Test Hold Cart API
    console.log("\nTesting Hold Cart API...");
    const cartItems = [
      {
        cartItemId: `${testItem.id}-none-none-none`,
        id: testItem.id,
        name: testItem.item_name,
        image: testItem.image,
        price: parseFloat(testItem.price),
        quantity: 2,
        variation_id: null,
        variation_name: "",
        addons_name: "",
        addons_price: "",
        addons_total: 0,
        extras_name: "",
        extras_price: "",
        extras_total: 0,
        singleItemTotal: parseFloat(testItem.price),
        totalPrice: parseFloat(testItem.price) * 2
      }
    ];

    const subtotal = parseFloat(testItem.price) * 2;
    const tax = subtotal * 0.05;
    const grandTotal = subtotal + tax;

    const holdRes = await fetch(`${BASE_URL}/api/pos/hold-cart`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        items: cartItems,
        customer_id: null,
        subtotal,
        tax_amount: tax,
        discount_amount: 0,
        grand_total: grandTotal,
        notes: "E2E Test Held Cart"
      })
    });

    const holdData = await holdRes.json();
    if (holdData.status !== 1) {
      throw new Error(`Hold cart failed: ${JSON.stringify(holdData)}`);
    }
    console.log(`Cart held successfully! Held count in DB: ${holdData.held_count}`);

    // 5. Test Recall Held Carts
    console.log("Recalling held carts...");
    const recallRes = await fetch(`${BASE_URL}/api/pos/held-carts`, { headers });
    const recallData = await recallRes.json();
    console.log(`Found ${recallData.carts?.length || 0} held carts.`);
    const testHeldCart = recallData.carts?.find(c => c.notes === "E2E Test Held Cart");
    if (!testHeldCart) {
      throw new Error("Could not find the test held cart in DB.");
    }
    console.log(`Found our test held cart with reference: ${testHeldCart.reference_no}`);

    // Delete/clean the held cart from API
    console.log(`Cleaning up test held cart ID: ${testHeldCart.id}...`);
    const deleteRes = await fetch(`${BASE_URL}/api/pos/held-carts/${testHeldCart.id}`, {
      method: "DELETE",
      headers
    });
    const deleteData = await deleteRes.json();
    console.log(`Held cart deleted. New held count: ${deleteData.held_count}`);

    // 6. Test Process Payment API
    console.log("\nProcessing cash checkout order...");
    const paymentRes = await fetch(`${BASE_URL}/api/pos/process-payment`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        items: cartItems,
        customer_id: null,
        customer_name: "Walk-in Customer",
        payment_method: 1, // Cash
        tax_amount: tax,
        discount_amount: 0,
        grand_total: grandTotal,
        notes: "E2E Test Order"
      })
    });

    const paymentData = await paymentRes.json();
    if (paymentData.status !== 1) {
      throw new Error(`Payment processing failed: ${JSON.stringify(paymentData)}`);
    }
    const orderId = paymentData.order_id;
    console.log(`Order processed successfully! Order ID: ${orderId}, Order Number: ${paymentData.order_number}`);

    // 7. Verify Database Records
    console.log("\nVerifying database records...");
    const orderRows = await conn.query("SELECT * FROM `order` WHERE id = ?", [BigInt(orderId)]);
    if (orderRows.length === 0) {
      throw new Error(`Order ID ${orderId} not found in DB!`);
    }
    const dbOrder = orderRows[0];
    console.log("✅ Order Table verification successful:");
    console.log(`   - Order Number: ${dbOrder.order_number}`);
    console.log(`   - Grand Total: $${dbOrder.grand_total}`);
    console.log(`   - Payment Status: ${dbOrder.payment_status} (1 = Paid)`);
    console.log(`   - Is POS Order: ${dbOrder.is_pos_order} (1 = POS)`);

    const detailRows = await conn.query("SELECT * FROM `order_details` WHERE order_id = ?", [BigInt(orderId)]);
    if (detailRows.length === 0) {
      throw new Error(`Order details not found in DB for order ID ${orderId}!`);
    }
    console.log("✅ Order Details Table verification successful:");
    detailRows.forEach((row, idx) => {
      console.log(`   [Item ${idx + 1}] - Name: ${row.item_name}, Price: $${row.item_price}, Qty: ${row.qty}`);
    });

    console.log("\n=========================================");
    console.log("🎉 ALL E2E AND DATABASE TESTS PASSED SUCCESSFULLY!");
    console.log("=========================================");

  } catch (error) {
    console.error("\n❌ TEST FAILED:", error);
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
}

runTest();
