module.exports = {
    CODEFI_NFT_DETECTION_API: 'https://nft.metafi.codefi.network/accounts',
    NFTPORT_NFT_DETECTION_API: 'https://api.nftport.xyz/v0/accounts',
    NFTPORT_NFT_DETAILS_API: 'https://api.nftport.xyz/v0/nfts',
    CHAIN_ID: {
        ethereum: 1,
        polygon: 137,
        bsc: 56,
    },
    DATAPOINT: 'nftport',
    NFTPORT_API_KEY: '911bac2a-f24e-440f-856f-c9f9448b82cc',
    OPENSEA_API_KEY: '',
    PRICE_DATA_API({ CONTRACT_ADDRESS, TOKEN_ID, PUBLIC_ADDRESS, CHAIN }) {
        if (this.DATAPOINT === 'opensea') {
            return `https://api.opensea.io/api/v1/asset/${CONTRACT_ADDRESS}/${TOKEN_ID}/?include_orders=false`;
        } else {
            return `https://api.nftport.xyz/v0/transactions/accounts/${PUBLIC_ADDRESS}/?chain=${CHAIN}&type=buy`;
        }
    },
};