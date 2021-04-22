const axios = require('axios');
const { OPENSEA_BASE_URL } = require('../config');


async function getRequest({ url, apiKey }) {
  try {
    const response = await axios({
        url,
        method: 'GET',
        headers: {
        'X-API-KEY': apiKey,
        },
    });

    return { response: response.data };
  } catch (error) {
    return { error: error.response };
  }
}

async function getUserNftDataApi({ publicAddress, contractAddress }){
    return `${OPENSEA_BASE_URL}/assets?owner=${publicAddress}&asset_contract_address=${contractAddress}`;
}

module.exports = {
    getRequest, getUserNftDataApi,
};

