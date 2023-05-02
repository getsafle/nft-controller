### 1.0.0 (2021-04-21)

* Added methods to get details and balance of erc20 tokens
* Pipelines added

### 1.0.1 (2021-04-22)

* Added github URL's to package.json

### 1.0.2 (2021-05-05)

* Documentation Added

### 1.0.3 (2022-07-04)

* Updated error handling

### 2.0.0 (2022-10-25)

* SDK v2.0.0 - This SDK can now detect and return the details of all the NFTs for a particular address across any supported chains.
* Supported Chains : `Ethereum`, `Polygon` and `BSC`.

### 2.1.0 (2022-11-24)

* This version will return the price data for every NFT. If the price data in not available, then it will return `No price data found`.

### 2.2.0 (2022-12-01)

* The `detectNFTs()` function will detect the NFTs in the address and return its details.
* A new function `getPriceData()` is implemented to get the price data of the NFT.

### 2.2.1 (2022-12-02)

* [Breaking Change] Updated the function `getPriceData()` to accept the token details in an array of objects. The function will loop through the array elements to fetch the price details for all NFTs.

### 2.2.2 (2022-12-06)

* The response structure for `detectNFTs()` function has been changed. The NFT data will be returned inside the `data` array and pagination string will be included in the `ETHContinuation` and `PolygonContinuation`.
* [Breaking Change] - The input parameter is accepted as objects. 2 new parameters are added - `ETHContinuation` and `PolygonContinuation`.


### 2.2.3 (2023-01-30)

* The response structure for `detectNFTs()` function has been updated for nftport API response. 

### 2.2.4 (2023-05-02)

* Returned flag `isERC721` in the response