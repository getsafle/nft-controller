# **Safle NFT Controller**

This library enables the developer to detect Non Fungible Tokens (NFT) for any public address across the supported chains.

## **Installation and Usage**

> Installation

Install the package by running the command,

```sh
npm install @getsafle/nft-controller
```

Import the package into your project using,

```js
const safleNftController = require('@getsafle/nft-controller');
```

<br>

## Initialization

<br>

Initialise the class using,

`const nftController = new safleNftController.NftController();` 

<br>

#### Methods

<br>

> Discover the NFTs and get their details

```js
const nfts = await nftController.detectNFTs(publicAddress, chain);
```

* `publicAddress` - Public address to detect NFTs.
* `chain` (optional) - Optional chain parameter to detect the NFTs. Supported chains : `Ethereum`, `Polygon` and `BSC`.

