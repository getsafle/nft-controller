
const Config = require('./config');
const Helper = require('./utils/helper');

class NftController {
    async detectNFTs({ publicAddress, chain = 'all', ETHNFTContinuation, PolygonNFTContinuation }) {
        Helper.inputValidator(chain);

        let results;
        let ETHContinuation = null;
        let PolygonContinuation = null;

        const { response, error } = await Helper.detectNFTsCodefi(publicAddress);

        if (error) {
            const { response, error } = await Helper.detectNFTsNFTPort(publicAddress, chain, ETHNFTContinuation, PolygonNFTContinuation);

            if (error) {
                return { error };
            }

            results = response;

            ETHContinuation = results.filter((asset) => { if (asset.ETHContinuation) { return asset.ETHContinuation } });
            PolygonContinuation = results.filter((asset) => { if (asset.PolygonContinuation) { return asset.PolygonContinuation } });

            ETHContinuation = (!ETHContinuation.length) ? null : ETHContinuation;
            PolygonContinuation = (!PolygonContinuation.length) ? null : PolygonContinuation;

        } else {
            results = response;
        }

        let filteredData;

        if (chain === 'all') {
            filteredData = results;
        } else {
            filteredData = results.filter((asset) => asset.chainId === Config.CHAIN_ID[chain.toLowerCase()]);
        }

        let assetDetails = {};
        let array = []

        for (const asset of filteredData) {
            let obj = {};

            if (asset.chainId !== undefined) {
                obj.name = asset.name;
                obj.symbol = asset.symbol;
                obj.tokenId = asset.tokenId;
                (asset.tokenUrl) ? obj.tokenUrl = asset.tokenUrl : '';
                obj.contractAddress = asset.contractAddress || asset.tokenAddress;
                obj.metadata = asset.metadata;
                obj.chainId = asset.chainId;

                array.push(obj);
            }
        };

        assetDetails.ETHContinuation = (ETHContinuation !== null) ? ETHContinuation[0].ETHContinuation : null;
        assetDetails.PolygonContinuation = (PolygonContinuation !== null) ? PolygonContinuation[0].PolygonContinuation : null;

        assetDetails.data = array;

        return { response: assetDetails };
    }

    async getPriceData(params) {
        let result = []

        for (let param of params) {

            const { publicAddress, contractAddress, tokenId, chain } = param;

            const headers = (Config.DATAPOINT === 'opensea') ? { 'X-API-KEY': Config.OPENSEA_API_KEY } : { Authorization: Config.NFTPORT_API_KEY };

            const { error, response } = await Helper.getRequest(Config.PRICE_DATA_API({ CONTRACT_ADDRESS: contractAddress, TOKEN_ID: tokenId, PUBLIC_ADDRESS: publicAddress, CHAIN: chain }), headers);

            let priceData = 'No price data found';

            if (error) {
                result.push({ tokenId, contractAddress, priceData });
            } else {
                if (Config.DATAPOINT === 'opensea') {
                    if (response.last_sale) {
                        const { last_sale: { total_price, payment_token: { symbol, decimals, usd_price } } } = response;

                        priceData = {
                            symbol,
                            valueInCrypto: total_price/decimals,
                            valueInUSD: (total_price/decimals) * usd_price,
                        }

                        result.push({ tokenId, contractAddress, priceData });
                    } else {
                        priceData = 'No price data found'
                        result.push({ tokenId, contractAddress, priceData });
                    }
                } else {
                    let transactions = [ ...response.transactions ];

                    let continuation = response.continuation;

                    while (continuation !== null && continuation != undefined) {
                        let url = `${Config.PRICE_DATA_API({ PUBLIC_ADDRESS: publicAddress, CHAIN: chain })}&continuation=${continuation}`

                        const { response, error } = await Helper.getRequest(url, headers);

                        if (error) {
                            result.push({ tokenId, contractAddress, priceData: 'No price data found' });
                        }

                        continuation = response.continuation;

                        transactions = [ ...transactions, ...response.transactions ];
                    }

                    let isPresent = false;

                    transactions.forEach((data) => {
                        const { buyer_address, nft: { contract_address, token_id }, price_details: { asset_type, price, price_usd } } = data;

                        if (publicAddress.toLowerCase() === buyer_address.toLowerCase() && contractAddress.toLowerCase() === contract_address.toLowerCase() && tokenId === token_id) {
                            priceData = {
                                symbol: asset_type,
                                valueInCrypto: price,
                                valueInUSD: price_usd,
                            }

                            isPresent = true;

                            result.push({ tokenId, contractAddress, priceData });
                        }
                    })

                    if (!isPresent) {
                        result.push({ tokenId, contractAddress, priceData });
                    }
                }
            }
        }
        return { response: result };
    }
    
}

module.exports = { NftController: NftController }