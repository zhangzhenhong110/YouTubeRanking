// 使用 axios 测试 YouTube API 通过 v2rayN 代理
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const API_KEY = process.env.YOUTUBE_API_KEY;
const PROXY = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

console.log('Testing YouTube API with axios + proxy...\n');
console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 20)}...` : 'NOT FOUND');
console.log('Proxy:', PROXY || 'NOT CONFIGURED');
console.log('');

async function test() {
  const url = `https://www.googleapis.com/youtube/v3/search`;
  const params = {
    part: 'snippet',
    q: 'test',
    type: 'video',
    maxResults: 2,
    key: API_KEY
  };
  
  // 创建代理 agent
  const httpsAgent = PROXY ? new HttpsProxyAgent(PROXY) : undefined;
  
  try {
    console.log('Making API request through proxy...');
    const response = await axios.get(url, { 
      params,
      httpsAgent,
      proxy: false, // 禁用 axios 默认代理，使用 httpsAgent
    });
    
    console.log('Status:', response.status, response.statusText);
    console.log('✅ Success! Found', response.data.items?.length, 'videos');
    console.log('\nFirst video:');
    const firstVideo = response.data.items[0];
    console.log('- Title:', firstVideo.snippet.title);
    console.log('- Video ID:', firstVideo.id.videoId);
    console.log('- Channel:', firstVideo.snippet.channelTitle);
    console.log('\n🎉 Proxy is working! Your app should work now!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data || 'Empty response');
    } else if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

test();

