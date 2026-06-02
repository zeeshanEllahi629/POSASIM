const fs = require('fs');

const p = 'src/app/layout.js';
let content = fs.readFileSync(p, 'utf8');

if (!content.includes('AiChatWidget')) {
  content = content.replace('import "./globals.css";', 'import "./globals.css";\nimport AiChatWidget from "@/components/front/AiChatWidget";');
  content = content.replace('{children}</body>', '{children}\n        <AiChatWidget />\n      </body>');
  fs.writeFileSync(p, content);
  console.log('Root Layout updated.');
} else {
  console.log('Root Layout already updated.');
}
