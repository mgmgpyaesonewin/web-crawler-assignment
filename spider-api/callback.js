const axios = require('axios');
require('dotenv').config();

const callback = async ({
  user_id,
  keyword,
  total_result,
  contents,
}) => {
  const data = JSON.stringify({
    user_id,
    keyword,
    total_result,
    contents,
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
