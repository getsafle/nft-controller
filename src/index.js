
const Config = require('./config');
const Helper = require('./utils/helper');

class NftController {
    async detectNFTs(publicAddress, chain = 'all') {
        Helper.inputValidator(chain);

        let results;

        const { response, error } = await Helper.detectNFTsCodefi(publicAddress);

        if (error) {
            const { response, error } = await Helper.detectNFTsNFTPort(publicAddress, chain);

            if (error) {
                return { error };
            }

            results = response;
        } else {
            results = response;
        }

        let filteredData;

        if (chain === 'all') {
            filteredData = results;
        } else {
            filteredData = results.filter((asset) => asset.chainId === Config.CHAIN_ID[chain.toLowerCase()]);
        }

        let assetDetails = [];

        for (const asset of filteredData) {
            const obj = {};

            obj.name = asset.name;
            obj.symbol = asset.symbol;
            obj.tokenId = asset.tokenId;
            obj.tokenUrl = asset.tokenUrl;
            obj.contractAddress = asset.contractAddress || asset.tokenAddress;
            obj.metadata = asset.metadata;
            obj.chainId = asset.chainId;

            assetDetails.push(obj);
        };

        return { response: assetDetails };
    }

    async getPriceData({ publicAddress, contractAddress, tokenId, chain }) {
        const headers = (Config.DATAPOINT === 'opensea') ? { 'X-API-KEY': Config.OPENSEA_API_KEY } : { Authorization: Config.NFTPORT_API_KEY };

        const { error, response } = await Helper.getRequest(Config.PRICE_DATA_API({ CONTRACT_ADDRESS: contractAddress, TOKEN_ID: tokenId, PUBLIC_ADDRESS: publicAddress, CHAIN: chain }), headers);

        let priceData = 'No price data found';

        if (error) {
            return priceData;
        }

        if (Config.DATAPOINT === 'opensea') {
            if (response.last_sale) {
                const { last_sale: { total_price, payment_token: { symbol, decimals, usd_price } } } = response;

                priceData = {
                    symbol,
                    valueInCrypto: total_price/decimals,
                    valueInUSD: (total_price/decimals) * usd_price,
                }
            } else {
                priceData = 'No price data found'
            }
        
        } else {
            response.transactions.forEach((data) => {
                const { buyer_address, nft: { contract_address, token_id }, price_details: { asset_type, price, price_usd } } = data;

                if (publicAddress.toLowerCase() === buyer_address.toLowerCase() && contractAddress.toLowerCase() === contract_address.toLowerCase() && tokenId === token_id) {
                    priceData = {
                        symbol: asset_type,
                        valueInCrypto: price,
                        valueInUSD: price_usd,
                    }
                }
            })
        }

        return { response: priceData };
    }
    
}

module.exports = { NftController: NftController }