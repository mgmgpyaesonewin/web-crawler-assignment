// Call the API using axios with the following body
// {
//   "keyword": "ads",
//   "total_result": "123",
//   "contents": [
//       {
//           "title": "Google Ads - Get Customers and Sell More with Online ...",
//           "link": "https://ads.google.com/home/",
//           "htmlRaw": "<div>hello</div>"
//       }
//   ]
// }

const axios = require('axios');
require('dotenv').config();

const callback = async ({
  user_id,
  keyword,
  total_result,
  contents
}) => {
  let data = JSON.stringify({
    user_id,
    keyword,
    total_result,
    contents
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.CALLBACK_API_URL,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios.request(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}

// Execute the function
// callback({
//   keyword: 'ads 2',
//   total_result: '123 result',
//   contents: [
//     {
//       title: '...Google Ads - Get Customers and Sell More with Online ...',
//       link: 'https://ads.google.com/home/',
//       htmlRaw: '<div>Google Ads</div>'
//     }
//   ]
// });

module.exports = callback;
