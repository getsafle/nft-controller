
const Config = require('./config');
const Helper = require('./utils/helper');
const { SDK, Auth, TEMPLATES, Metadata } = require('@infura/sdk') ;

class NftController {
    async detectNFTs({ publicAddress, chain  }) {
        Helper.inputValidator(chain);

        const chainId = Config.CHAIN_ID[chain];
    
        const auth = new Auth({
            projectId: Config.INFURA_PROJECT_ID,
            secretId: Config.INFURA_SECRET_ID,
            privateKey: Config.PRIVATEKEY,
            chainId,
      });

      const sdk = new SDK(auth);
      const result = await sdk.api.getNFTs({
        publicAddress,
        includeMetadata: true,
      });

      
const {assets} = result;
      let array = [];
      let assetDetails = {};         


      for (const asset of assets) {
        let obj = {};

        
            obj.name = asset.metadata?.name;
            obj.symbol = asset.metadata?.symbol;
            obj.tokenId = asset.tokenId;
            obj.tokenUrl= asset.metadata?.external_url;
            obj.contractAddress = asset.contract;
            obj.metadata = asset.metadata;
            obj.chainId = chainId;
            if(asset.type==='ERC721'){
                obj.isErc721 = true;
            }
            else{
                obj.isErc721 = false;
            }
            array.push(obj)
    };

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