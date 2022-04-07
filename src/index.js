
const HELPER = require('./utils/helper');
const { OPENSEA_API_KEY } = require('./config/index');

class NftController {
    async getNftDetails(publicAddress, contractAddress) {
        const url = await HELPER.getUserNftDataApi({ publicAddress, contractAddress });
        const apiKey = OPENSEA_API_KEY;
        const { response, error } = await HELPER.getRequest({ url, apiKey });
        if (error) {
            const { status, statusText } = error;
            return { error:{ status, statusText } };
        }

        const { assets } = response;
        if(assets.length === 0) {
            return { error: { status: 400, statusText: 'No details Found' } };
        
        } else {
            const nftDetails = JSON.parse(JSON.stringify(assets[0]));
            return { response: nftDetails };
        }
    }
    
}

module.exports = { NftController: NftController }