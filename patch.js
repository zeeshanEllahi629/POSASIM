const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'app', 'api', 'pos', 'process-payment', 'route.js');
console.log("Target path:", targetPath);

let content = fs.readFileSync(targetPath, 'utf8');

const target = `          email: data.customer_email || "",\n`;
const replacement = target + `          address: data.customer_address || null,
          postal_code: data.customer_postal_code || null,
          driver_id: data.driver_id ? parseInt(data.driver_id) : null,
`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log("Patched process-payment successfully");
} else {
    console.log("Target string not found in file!");
}
