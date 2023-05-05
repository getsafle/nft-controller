const axios = require('axios');

const Config = require('../config');

async function getRequest(url, headers) {
  try {
    const response = await axios({ url, method: 'GET', headers: headers || { 'cache-control': 'no-cache' } });

    return { response: response.data };
  } catch (error) {
    return { error };
  }
}

function inputValidator(chain) {
  if (!Config.CHAIN_ID[chain.toLowerCase()] && chain !== 'all') {
    throw `${chain} chain not supported.`
  }
}

async function getChainID(chain){
if(chain === "ethereum"){
  return 1;
}
if(chain === "polygon"){
  return 137;
}
}

module.exports = {
    getRequest,
    inputValidator,
    getChainID
};

