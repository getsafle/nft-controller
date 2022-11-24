module.exports = {
    NFT_DETECTION_API: 'https://nft.metafi.codefi.network/accounts',
    CHAIN_ID: {
        ethereum: 1,
        polygon: 137,
        bsc: 56,
    },
    OPENSEA_API(contractAddress, tokenId) {
        return `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/?include_orders=false`
    },
};