const fs = require('fs');
const p = 'src/app/(front)/layout.js';
let content = fs.readFileSync(p, 'utf8');

if (!content.includes('AiChatWidget')) {
  content = content.replace('import prisma from "@/lib/prisma";', 'import AiChatWidget from "@/components/front/AiChatWidget";\nimport prisma from "@/lib/prisma";');
  content = content.replace('{showSidebarCart && <SidebarCart />}', '{showSidebarCart && <SidebarCart />}\n      <AiChatWidget />');
  fs.writeFileSync(p, content);
  console.log('Layout updated.');
} else {
  console.log('Layout already updated.');
}
