# Safle NFT Controller

This SDK is used to get the details for a particular ERC721 contract address on a public address.

## Installation

to install this SDK,

```sh
npm install --save @getsafle/nft-controller
```

## Initialization

Initialize the constructor,

```js
const safleNftController = require('@getsafle/nft-controller');

const nftController = new safleNftController.NftController();
```

<br>

> Get User NFT Details

<br>

This function is used to get the details of an ERC721 token of a particular user.

```js
const nftDetails = await nftController.getNftDetails(publicAddress, contractAddress);
```

* `publicAddress` - user wallet public address, 
* `contractAddress` - NFT contract address
