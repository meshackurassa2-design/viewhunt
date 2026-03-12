import fs from 'fs';

function findPaths(obj, target, path = '') {
  if (typeof obj !== 'object' || obj === null) return [];
  let paths = [];
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      paths = paths.concat(findPaths(item, target, `${path}[${index}]`));
    });
  } else {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;
      if (typeof obj[key] === 'string' && obj[key].toLowerCase().includes(target.toLowerCase())) {
        paths.push({ path: currentPath, value: obj[key] });
      }
      paths = paths.concat(findPaths(obj[key], target, currentPath));
    }
  }
  return paths;
}

try {
  const channelData = JSON.parse(fs.readFileSync('debug_channel_about.json', 'utf8'));
  console.log('--- CHANNEL ABOUT SEARCH (MrBeast) ---');
  // Search for MrBeast and look for large numbers nearby
  const results = findPaths(channelData, 'MrBeast');
  results.forEach(r => {
    if (r.path.length < 200) console.log(r);
  });
} catch (e) { console.log('No channel_about found'); }
