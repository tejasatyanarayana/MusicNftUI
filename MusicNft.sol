// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyToken is ERC721, ERC721URIStorage, Ownable {
    mapping(uint => address[]) public subscribers;
    using Counters for Counters.Counter;
    bool isCreatedAtleastOne;
    Counters.Counter private _tokenIdCounter;
    uint256  tokenId;
    string[] tokenUris;
function getTokenUris() public view returns(string[] memory){
    return tokenUris;
}
function totalTokens() public view returns(uint){
    require(isCreatedAtleastOne,"no tokens created yet");
    return tokenId+1;
}
    constructor() ERC721("MUSIC TOKEN", "MSC") {}
    mapping(uint => uint) public TokenRevenue;
   
    function safeMint(address to, string memory uri) public onlyOwner {
 tokenUris.push(uri);
        isCreatedAtleastOne = true;
       tokenId = _tokenIdCounter.current();
        
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 _tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(_tokenId);
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(_tokenId);
    }

    function ListenMusic(uint _tokenID) payable public{
        require(msg.value >= 0.001 ether,"send minimum of 0.001 ether");
        subscribers[_tokenID].push(msg.sender);
        TokenRevenue[_tokenID]+=msg.value;
    }
    function releasefunds(address payable to,uint _tokenID) public onlyOwner{
       to.transfer(TokenRevenue[_tokenID]);
    }
     function RevenueGenerated(uint _tokenID) public view returns(uint){
     return TokenRevenue[_tokenID];
 }


}

//https://api.npoint.io/f9795876025ddcc88b1e
