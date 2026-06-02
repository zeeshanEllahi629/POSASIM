const fs = require('fs');

const p = 'src/app/admin/pos/page.js';
let content = fs.readFileSync(p, 'utf8');

const targetCategory = `              <button 
                onClick={async () => {
                  if(!newCategoryName) return alert("Enter name");
                  setLoadingAddCategory(true);
                  // Mock API call for now or connect to real API
                  alert("Add Category API needs to be implemented. Name: " + newCategoryName);
                  setLoadingAddCategory(false);
                  setActiveModal(null);
                }}
                className="w-full bg-[#00e676] text-black font-bold py-3 rounded hover:bg-[#00c853] transition-colors"`;

const replaceCategory = `              <button 
                onClick={async () => {
                  if(!newCategoryName) return alert("Enter name");
                  setLoadingAddCategory(true);
                  try {
                    const res = await fetch("/api/admin/categories", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ category_name: newCategoryName })
                    });
                    const data = await res.json();
                    if (data.status === 1) {
                      setCategories(prev => [...prev, data.category]);
                      setNewCategoryName("");
                      setActiveModal(null);
                    } else {
                      alert("Error: " + data.error);
                    }
                  } catch (err) {
                    alert("Failed to add category");
                  }
                  setLoadingAddCategory(false);
                }}
                className="w-full bg-[#00e676] text-black font-bold py-3 rounded hover:bg-[#00c853] transition-colors"`;

const targetProduct = `              <button 
                onClick={async () => {
                  if(!newProduct.name || !newProduct.price) return alert("Enter details");
                  setLoadingAddProduct(true);
                  // Mock API call for now or connect to real API
                  alert("Add Product API needs to be implemented.");
                  setLoadingAddProduct(false);
                  setActiveModal(null);
                }}
                className="w-full bg-[#00e676] text-black font-bold py-3 rounded hover:bg-[#00c853] transition-colors mt-2"`;

const replaceProduct = `              <button 
                onClick={async () => {
                  if(!newProduct.name || !newProduct.price) return alert("Enter details");
                  setLoadingAddProduct(true);
                  try {
                    const formData = new FormData();
                    formData.append("item_name", newProduct.name);
                    formData.append("price", newProduct.price);
                    formData.append("cat_id", newProduct.category_id || "0");
                    
                    const res = await fetch("/api/admin/products", {
                      method: "POST",
                      body: formData
                    });
                    const data = await res.json();
                    if (data.status === 1) {
                      setAllProducts(prev => [data.product, ...prev]);
                      setFilteredProducts(prev => [data.product, ...prev]);
                      setNewProduct({ name: "", price: "", category_id: "" });
                      setActiveModal(null);
                    } else {
                      alert("Error: " + data.error);
                    }
                  } catch (err) {
                    alert("Failed to add product");
                  }
                  setLoadingAddProduct(false);
                }}
                className="w-full bg-[#00e676] text-black font-bold py-3 rounded hover:bg-[#00c853] transition-colors mt-2"`;

content = content.replace(targetCategory, replaceCategory);
content = content.replace(targetProduct, replaceProduct);

// Try to write it directly
try {
  fs.writeFileSync(p, content, 'utf8');
  console.log('Successfully updated file directly.');
} catch (e) {
  console.log('Direct write failed, trying fallback:', e.message);
  fs.writeFileSync('temp_page.js', content, 'utf8');
}
