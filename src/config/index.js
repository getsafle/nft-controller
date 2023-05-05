module.exports = {
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
    INFURA_PROJECT_ID : '6145d532688844c4b6db32574d90e19f',
    INFURA_SECRET_ID : '07c67b9b9f4d4990b5c4c2a19c233a10',
    PRIVATEKEY : '0x5d70861625ec3d9cc82d971f9d2482e661240078fcd070f32f365b5af4a53292',
};