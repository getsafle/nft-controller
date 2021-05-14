# **Safle NFT Controller**

Safle NFT Controller SDK


## **Installation and Usage**

> Installation

Install the package by running the command,

`npm install @getsafle/nft-controller`

Import the package into your project using,

`const safleNftController = require('@getsafle/nft-controller');`

## **NFT Controller**

> Initialising

Initialise the class using,

`const nftController = new safleNftController.NftController();` 

> Methods

Get user nft details

`const nftDetails = await nftController.getNftDetails(publicAddress, contractAddress);`

* `publicAddress` - user wallet public address, 
* `contractAddress` - NFT contract address
