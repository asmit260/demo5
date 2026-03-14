const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '_data', 'blog');
const outputFile = path.join(__dirname, '_data', 'blog-list.json');

try {
  if (!fs.existsSync(blogDir)) {
    console.error('Blog directory not found:', blogDir);
    process.exit(1);
  }

  const files = fs.readdirSync(blogDir);
  const slugs = files
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));

  fs.writeFileSync(outputFile, JSON.stringify(slugs, null, 2), 'utf-8');
  console.log(`Successfully built blog-list.json with ${slugs.length} posts.`);
} catch (err) {
  console.error('Error generating blog list:', err);
  process.exit(1);
}
