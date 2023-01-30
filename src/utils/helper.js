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

async function detectNFTsNFTPort(publicAddress, chain, ETHNFTContinuation, PolygonNFTContinuation) {

  const funName = {
    ethereum: { functionName: 'detectETHNFTs', continuation: ETHNFTContinuation },
    polygon: { functionName: 'detectPolygonNFTs', continuation: PolygonNFTContinuation },
  }

  let result;

  if (chain !== 'all') {
    if (funName[chain] === undefined) {
      throw `${chain} not supported`
    }

    [ ...result ] = await this[funName[chain].functionName](publicAddress, funName[chain].continuation);
  } else {
    const ethNFTs = await detectETHNFTs(publicAddress, ETHNFTContinuation);
    const polygonNFTs = await detectPolygonNFTs(publicAddress, PolygonNFTContinuation);

    result = [ ...ethNFTs, ...polygonNFTs ]
  }

  return { response: result };
}

async function detectETHNFTs(publicAddress, continuation) {
  let url = (continuation) ? `${Config.NFTPORT_NFT_DETECTION_API}/${publicAddress}/?chain=ethereum&include=contract_information&continuation=${continuation}` : `${Config.NFTPORT_NFT_DETECTION_API}/${publicAddress}/?chain=ethereum&include=contract_information&include=metadata`;

  const headers = { Authorization: Config.NFTPORT_API_KEY };

  const { response, error } = await getRequest(url, headers);

  if (error) {
    return 'Error detecting NFTs on Ethereum chain';
  }

  let array = [ ...response.nfts ]; 

  let result = [];

  array.forEach((nft) => {
    const obj = {};

    obj.name = nft.name;
    obj.symbol = nft.contract.symbol || null;
    obj.tokenId = nft.token_id;
    obj.contractAddress = nft.contract_address;
    obj.metadata = nft.contract.metadata;
    obj.chainId = 1;
    obj.contract = nft.contract;
    obj.tokenUrl = nft.tokenUrl ? nft.tokenUrl : nft.file_url;
    

    result.push(obj);
  })
  result.push({ ETHContinuation: response.continuation });

  return result;
}

async function detectPolygonNFTs(publicAddress, continuation) {
  let url = (continuation) ? `${Config.NFTPORT_NFT_DETECTION_API}/${publicAddress}/?chain=polygon&include=contract_information&continuation=${continuation}` : `${Config.NFTPORT_NFT_DETECTION_API}/${publicAddress}/?chain=polygon&include=contract_information&include=metadata`;

  const headers = { Authorization: Config.NFTPORT_API_KEY };

  const { response, error } = await getRequest(url, headers);

  if (error) {
    return 'Error detecting NFTs on Polygon chain';
  }

  let array = [ ...response.nfts ]; 

  let result = [];

  array.forEach((nft) => {
    const obj = {};

    obj.name = nft.name;
    obj.symbol = nft.contract.symbol || null;
    obj.tokenId = nft.token_id;
    obj.contractAddress = nft.contract_address;
    obj.metadata = nft.contract.metadata;
    obj.chainId = 137;
    obj.contract = nft.contract;
    obj.tokenUrl = nft.tokenUrl ? nft.tokenUrl : nft.file_url;

    result.push(obj);
  })
  result.push({ PolygonContinuation: response.continuation });

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

