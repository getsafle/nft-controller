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

async function detectNFTsCodefi(publicAddress) {
  const url = `${Config.CODEFI_NFT_DETECTION_API}/${publicAddress}/nfts/?limit=1000000`;
  const headers = { origin: 'https://portfolio.metamask.io', referer: 'https://portfolio.metamask.io' };

  const { response, error } = await this.getRequest(url, headers);

  if (error) {
    return { error };
  }

  return { response: response.data }
}

async function detectNFTsNFTPort(publicAddress, chain) {
  const funName = {
    ethereum: 'detectETHNFTs',
    polygon: 'detectPolygonNFTs',
  }

  let result;

  if (chain !== 'all') {
    [ ...result ] = await this[funName[chain]](publicAddress);
  } else {
    const ethNFTs = await detectETHNFTs(publicAddress);
    const polygonNFTs = await detectPolygonNFTs(publicAddress);

    result = [ ...ethNFTs, ...polygonNFTs ]
  }

  return { response: result };
}

async function detectETHNFTs(publicAddress) {
  let url = `${Config.NFTPORT_NFT_DETECTION_API}/${publicAddress}/?chain=ethereum`;

  const headers = { Authorization: Config.NFTPORT_API_KEY };

  const { response, error } = await getRequest(url, headers);

  if (error) {
    return 'Error detecting NFTs on Ethereum chain';
  }

  let continuation = response.continuation;

  let array = [ ...response.nfts ]; 

  while (continuation !== null) {
    url = `${Config.NFTPORT_NFT_DETECTION_API}/${publicAddress}/?chain=ethereum&continuation=${continuation}`;

    const { response, error } = await getRequest(url, headers);

    if (error) {
      return 'Error detecting NFTs on Ethereum chain';
    }

    continuation = response.continuation;

    array = [ ...array, ...response.nfts ];
  }

  let result = [];

  array.forEach((nft) => {
    const obj = {};

    obj.name = nft.name;
    obj.symbol = null;
    obj.tokenId = nft.token_id;
    obj.contractAddress = nft.contract_address;
    obj.metadata = nft.metadata;
    obj.chainId = 1; 

    result.push(obj);
  })

  return result;
}

async function detectPolygonNFTs(publicAddress) {
  let url = `${Config.NFTPORT_NFT_DETECTION_API}/${publicAddress}/?chain=polygon`;

  const headers = { Authorization: Config.NFTPORT_API_KEY };

  const { response, error } = await getRequest(url, headers);

  if (error) {
    return 'Error detecting NFTs on Polygon chain';
  }

  let continuation = response.continuation;

  let array = [ ...response.nfts ]; 

  while (continuation !== null) {
    url = `${Config.NFTPORT_NFT_DETECTION_API}/${publicAddress}/?chain=polygon&continuation=${continuation}`;

    const { response, error } = await getRequest(url, headers);

    if (error) {
      return 'Error detecting NFTs on Polygon chain';
    }

    continuation = response.continuation;

    array = [ ...array, ...response.nfts ];
  }

  let result = [];

  array.forEach((nft) => {
    const obj = {};

    obj.name = nft.name;
    obj.symbol = null;
    obj.tokenId = nft.token_id;
    obj.contractAddress = nft.contract_address;
    obj.metadata = nft.metadata;
    obj.chainId = 137;

    result.push(obj);
  })

  return result;
}

module.exports = {
    getRequest,
    inputValidator,
    detectNFTsCodefi,
    detectNFTsNFTPort,
    detectETHNFTs,
    detectPolygonNFTs
};

