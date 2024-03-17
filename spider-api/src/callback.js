const axios = require('axios');
require('dotenv').config();

const callback = async ({
  user_id,
  keyword,
  total_result,
  contents,
  adsCount,
  linksCount,
  pageContent,
}) => {
  const data = JSON.stringify({
    user_id,
    name: keyword,
    total_result,
    contents,
    ads_count: adsCount,
    links_count: linksCount,
    page_content: pageContent,
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.CALLBACK_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  };

  axios.request(config)
    .then(() => {
      console.log('Callback API sent: ', data);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = callback;
