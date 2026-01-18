// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkillCertificate is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    event CertificateMinted(uint256 indexed tokenId, address indexed learner, string skillName, string level);

    constructor(address initialOwner) ERC721("SkillCertificate", "SKILL") Ownable(initialOwner) {}

    function safeMint(
        address to,
        string memory uri,
        string memory skillName,
        string memory level
    ) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit CertificateMinted(tokenId, to, skillName, level);
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
