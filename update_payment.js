const fs = require('fs');
const path = 'R:\\complete-website-plus-pos-code\\foodefy-code\\src\\app\\api\\pos\\process-payment\\route.js';
let content = fs.readFileSync(path, 'utf8');

const target = `          name: data.customer_name || "Walk-in Customer",
          mobile: data.customer_phone ? BigInt(data.customer_phone.replace(/\\D/g, "")) : null,
          email: data.customer_email || "",
          transaction_type: (data.payment_method || 1).toString(), // 1=Cash, 2=Card, 5=Split
          tax_amount: (data.tax_amount || 0).toString(),`;

const replacement = `          name: data.customer_name || "Walk-in Customer",
          mobile: data.customer_phone ? BigInt(data.customer_phone.replace(/\\D/g, "")) : null,
          email: data.customer_email || "",
          address: data.customer_address || null,
          postal_code: data.customer_postal_code || null,
          driver_id: data.driver_id ? parseInt(data.driver_id) : null,
          transaction_type: (data.payment_method || 1).toString(), // 1=Cash, 2=Card, 5=Split
          tax_amount: (data.tax_amount || 0).toString(),`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content, 'utf8');
console.log("Updated process-payment");
