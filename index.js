import Parser from 'rss-parser';

const parser = new Parser();

async function fetchNews() {
  try {
    console.log('Fetching the latest news from Google...');
    const feed = await parser.parseURL('https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en');

    console.log(`\n📰 ${feed.title}\n`);

    // Get the top 10 news items
    const topItems = feed.items.slice(0, 10);

    topItems.forEach((item, index) => {
      console.log(`\x1b[1m${index + 1}. ${item.title}\x1b[0m`);
      console.log(`   🔗 ${item.link}`);
      console.log(`   🕒 Published: ${new Date(item.pubDate).toLocaleString()}`);
      console.log('-'.repeat(50));
    });

  } catch (error) {
    console.error('Error fetching news:', error.message);
  }
}

fetchNews();
