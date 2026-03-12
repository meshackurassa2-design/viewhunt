import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

async function debugScrape(url, filename) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookies': 'PREF=hl=en&gl=US'
      },
      timeout: 10000
    });
    const $ = cheerio.load(html);
    let jsonData = null;
    $('script').each((i, el) => {
      const content = $(el).html();
      if (content && content.includes('ytInitialData =')) {
        const start = content.indexOf('ytInitialData =') + 'ytInitialData ='.length;
        const remaining = content.substring(start).trim();
        const end = remaining.indexOf('};') + 1;
        try {
          jsonData = JSON.parse(remaining.substring(0, end));
        } catch (e) {
          try {
            const match = remaining.match(/\{.*\}/s);
            if (match) jsonData = JSON.parse(match[0]);
          } catch (e2) {}
        }
      }
    });

    if (jsonData) {
      fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
      console.log(`Saved JSON for ${url} to ${filename}`);
    } else {
      console.log(`No ytInitialData found for ${url}`);
    }
  } catch (err) {
    console.error(`Error for ${url}:`, err.message);
  }
}

(async () => {
  await debugScrape('https://www.youtube.com/@MrBeast/about', 'debug_channel_about.json');
  await debugScrape('https://www.youtube.com/feed/trending?gl=US&hl=en', 'debug_trends_new.json');
})();
