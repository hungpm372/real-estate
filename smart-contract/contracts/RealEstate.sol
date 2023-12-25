// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RealEstate is ERC721URIStorage {
    using Counters for Counters.Counter;

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isListed;
        uint256 createdAt;
    }

    Counters.Counter private _tokenIds;

    mapping(uint256 => Listing) private listings;

    constructor() ERC721("Real Estate", "RE") {}

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);

        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function listTokenForSale(uint256 tokenId, uint256 price) public {
        require(_exists(tokenId), "Token does not exist");
        require(
            ownerOf(tokenId) == msg.sender,
            "You are not the owner of this token"
        );

        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isListed: true,
            createdAt: block.timestamp
        });
    }

    function buyToken(uint256 tokenId) public payable {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) != msg.sender, "Cannot buy your own token");
        require(listings[tokenId].isListed, "Token is not listed for sale");
        require(msg.value >= listings[tokenId].price, "Insufficient funds");

        address seller = listings[tokenId].seller;
        address buyer = msg.sender;
        uint256 price = listings[tokenId].price;

        listings[tokenId].isListed = false;

        _transfer(seller, buyer, tokenId);

        (bool success, ) = seller.call{value: price}("");
        require(success, "Failed to send funds to the seller");
    }

    function cancelTokenSale(uint256 tokenId) public {
        require(_exists(tokenId), "Token does not exist");
        require(
            ownerOf(tokenId) == msg.sender,
            "You are not the owner of this token"
        );
        require(listings[tokenId].isListed, "Token is not listed for sale");

        listings[tokenId].isListed = false;
    }

    function isTokenListed(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        return listings[tokenId].isListed;
    }

    function getTokenPrice(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        require(listings[tokenId].isListed, "Token does not sell");
        return listings[tokenId].price;
    }

    function getOwnerTokens() public view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](balanceOf(msg.sender));

        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (ownerOf(i) == msg.sender) {
                tokenIds[currentIndex] = i;
                currentIndex++;
            }
        }

        return tokenIds;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}
