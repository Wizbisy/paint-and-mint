// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtNFT is ERC721URIStorage, Ownable {
    uint256 public tokenIdCounter;

    constructor() ERC721("ArtNFT", "ART") Ownable(msg.sender) {
        tokenIdCounter = 0;
    }

    function mintTo(address recipient, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        tokenIdCounter++;
        _safeMint(recipient, tokenIdCounter);
        _setTokenURI(tokenIdCounter, tokenURI);
        return tokenIdCounter;
    }
}
