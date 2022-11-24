const axios = require('axios');

const Config = require('../config');

async function getRequest(url) {
  try {
    const response = await axios.get(url);

    return { response: response.data };
  } catch (error) {
    return { error: error };
  }
}

function inputValidator(chain) {
  if (!Config.CHAIN_ID[chain.toLowerCase()] && chain !== 'all') {
    throw `${chain} chain not supported.`
  }
}

async function getPriceData(contractAddress, tokenId) {
  const { error, response } = await this.getRequest(Config.OPENSEA_API(contractAddress, tokenId));

  if (error) {
    return 'No price data found';
  }

  const { last_sale: { total_price, payment_token: { symbol, decimals, usd_price } } } = response;

  const priceData = {
    symbol,
    valueInCrypto: total_price/decimals,
    valueInUSD: (total_price/decimals) * usd_price,
  }

  return priceData;
}

module.exports = {
    getRequest,
    inputValidator,
    getPriceData,
};

