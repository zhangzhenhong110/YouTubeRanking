/**
 * Simple API Test Script
 * 
 * Usage:
 *   node test-api.js [keyword] [timeRange]
 * 
 * Examples:
 *   node test-api.js Jesus 7d
 *   node test-api.js "Python tutorial" 24h
 *   node test-api.js Music 30d
 */

const baseUrl = 'http://localhost:3000';

async function testSearch(keyword = 'Jesus', timeRange = '7d') {
  console.log('\n🔍 YouTube Top Videos Search - API Test\n');
  console.log(`Keyword: ${keyword}`);
  console.log(`Time Range: ${timeRange}`);
  console.log('─'.repeat(50));

  const params = new URLSearchParams({
    q: keyword,
    timeRange: timeRange,
    limit: '10',
    candidates: '50',
    safeSearch: 'moderate',
  });

  const url = `${baseUrl}/api/search?${params.toString()}`;
  
  console.log(`\n📡 Request: GET ${url}\n`);

  try {
    const startTime = Date.now();
    const response = await fetch(url);
    const duration = Date.now() - startTime;

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error:', error.message);
      console.error('Status:', error.statusCode);
      return;
    }

    const data = await response.json();
    
    console.log(`✅ Success! (${duration}ms)\n`);
    console.log(`📊 Results: ${data.count} videos found\n`);
    console.log(`📅 Time Range:`);
    console.log(`   From: ${new Date(data.timeRange.start).toLocaleString()}`);
    console.log(`   To:   ${new Date(data.timeRange.end).toLocaleString()}\n`);

    if (data.items.length > 0) {
      console.log('🏆 Top Videos:\n');
      data.items.forEach((video, index) => {
        console.log(`${index + 1}. ${video.title}`);
        console.log(`   Channel: ${video.channelTitle}`);
        console.log(`   Views: ${formatNumber(video.viewCount)}`);
        console.log(`   URL: ${video.url}`);
        console.log('');
      });
    }

    console.log('─'.repeat(50));
    console.log(`\n✨ Test completed successfully!\n`);

  } catch (error) {
    console.error('❌ Network Error:', error.message);
    console.error('\nMake sure the server is running: npm run dev\n');
  }
}

function formatNumber(num) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Parse command line arguments
const keyword = process.argv[2] || 'Jesus';
const timeRange = process.argv[3] || '7d';

testSearch(keyword, timeRange);






