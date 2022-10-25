
const Config = require('./config');
const Helper = require('./utils/helper');

class NftController {
    async detectNFTs(publicAddress, chain = 'all') {
        Helper.inputValidator(chain);

        const url = `${Config.NFT_DETECTION_API}/${publicAddress}/nfts`;

        const { response, error } = await Helper.getRequest(url);

        if (error) {
            return { error };
        }

        const assetDetails = [];
        let filteredData;

        if (chain === 'all') {
            filteredData = response.data;
        } else {
            filteredData = response.data.filter((asset) => asset.chainId === Config.CHAIN_ID[chain.toLowerCase()]);
        }

        filteredData.forEach((asset) => {
            const obj = {};
      
            obj.name = asset.name;
            obj.symbol = asset.symbol;
            obj.tokenId = asset.tokenId;
            obj.tokenUrl = asset.tokenUrl;
            obj.contractAddress = asset.tokenAddress;
            obj.metadata = asset.metadata;
      
            assetDetails.push(obj);
        });

        return { response: assetDetails };
    }
    
}

module.exports = { NftController: NftController }