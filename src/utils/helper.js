const axios = require('axios');

const Config = require('../config');

async function getRequest(url) {
  try {
    const response = await axios.get(url);

    return { response: response.data };
  } catch (error) {
    return { error: error.response };
  }
}

function inputValidator(chain) {
  if (!Config.CHAIN_ID[chain.toLowerCase()] && chain !== 'all') {
    throw `${chain} chain not supported.`
  }
}

module.exports = {
    getRequest,
    inputValidator,
};

