const fs = require('fs');
let content = fs.readFileSync('FlowCraft.md', 'utf8');
content = content.replace(/<img[^>]*src="data:image[^>]*>/g, '[IMAGE_REMOVED]');
fs.writeFileSync('FlowCraft_clean.md', content);
