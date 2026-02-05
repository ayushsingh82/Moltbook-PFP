// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MoltbookIdentityNFT
 * @dev ERC721 NFT for Moltbook identity PFPs. One per profile. Mint with IPFS metadata URI.
 * Deploy on Remix → Base Sepolia (or Base mainnet).
 * After deploy: give contract address to frontend for registry reads.
 */
contract MoltbookIdentityNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // profileId (e.g. "ayushcursor" or "mb_xxx") -> tokenId
    mapping(string => uint256) public profileIdToTokenId;

    // tokenId -> profileId (for iteration)
    mapping(uint256 => string) private _tokenProfileId;

    // tokenId -> profileType ("human" or "agent")
    mapping(uint256 => string) private _tokenProfileType;

    // Array of all token IDs for registry iteration
    uint256[] private _allTokenIds;

    event Minted(address indexed to, uint256 indexed tokenId, string profileId, string profileType);

    constructor() ERC721("Moltbook Identity", "MBID") Ownable(msg.sender) {}

    /**
     * @notice Mint a new identity NFT. Only owner (deployer) can call. In production, add minter role or remove onlyOwner for public mint.
     * @param to Recipient address
     * @param uri IPFS metadata URI (e.g. ipfs://Qm...)
     * @param profileId Moltbook profile ID (e.g. ayushcursor, mb_xxx)
     * @param profileType "human" or "agent"
     */
    function mint(
        address to,
        string calldata uri,
        string calldata profileId,
        string calldata profileType
    ) external onlyOwner {
        require(profileIdToTokenId[profileId] == 0, "Profile already minted");
        require(
            keccak256(bytes(profileType)) == keccak256("human") ||
                keccak256(bytes(profileType)) == keccak256("agent"),
            "profileType must be human or agent"
        );

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        profileIdToTokenId[profileId] = tokenId;
        _tokenProfileId[tokenId] = profileId;
        _tokenProfileType[tokenId] = profileType;
        _allTokenIds.push(tokenId);

        emit Minted(to, tokenId, profileId, profileType);
    }

    /**
     * @notice Get token ID for a profile. Returns 0 if not minted.
     */
    function getTokenByProfile(string calldata profileId) external view returns (uint256) {
        return profileIdToTokenId[profileId];
    }

    /**
     * @notice Get full record for a token (for registry display).
     */
    function getRecord(uint256 tokenId)
        external
        view
        returns (string memory profileId, string memory profileType, string memory uri, address owner)
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return (
            _tokenProfileId[tokenId],
            _tokenProfileType[tokenId],
            tokenURI(tokenId),
            ownerOf(tokenId)
        );
    }

    /**
     * @notice Get full record by profile ID.
     */
    function getRecordByProfile(string calldata profileId)
        external
        view
        returns (string memory, string memory, string memory, address)
    {
        uint256 tokenId = profileIdToTokenId[profileId];
        require(tokenId != 0 || _ownerOf(0) == address(0), "Profile not minted");
        if (tokenId == 0 && _nextTokenId > 0) {
            // Check if token 0 exists (edge case)
            if (_ownerOf(0) == address(0)) revert("Profile not minted");
        }
        if (tokenId == 0) revert("Profile not minted");
        return getRecord(tokenId);
    }

    /**
     * @notice Total number of minted tokens.
     */
    function totalSupply() external view returns (uint256) {
        return _allTokenIds.length;
    }

    /**
     * @notice Get token ID by index (0 to totalSupply-1). Use with totalSupply to iterate all.
     */
    function tokenByIndex(uint256 index) external view returns (uint256) {
        require(index < _allTokenIds.length, "Index out of bounds");
        return _allTokenIds[index];
    }

    /**
     * @notice Get all mint records for registry. Use for small to medium registries.
     * For large counts, call tokenByIndex + getRecord in a loop from frontend.
     */
    function getAllRecords(uint256 fromIndex, uint256 limit)
        external
        view
        returns (
            uint256[] memory tokenIds,
            string[] memory profileIds,
            string[] memory profileTypes,
            string[] memory uris,
            address[] memory owners
        )
    {
        uint256 total = _allTokenIds.length;
        if (fromIndex >= total) {
            return (new uint256[](0), new string[](0), new string[](0), new string[](0), new address[](0));
        }
        uint256 end = fromIndex + limit;
        if (end > total) end = total;
        uint256 n = end - fromIndex;

        tokenIds = new uint256[](n);
        profileIds = new string[](n);
        profileTypes = new string[](n);
        uris = new string[](n);
        owners = new address[](n);

        for (uint256 i = 0; i < n; i++) {
            uint256 tokenId = _allTokenIds[fromIndex + i];
            tokenIds[i] = tokenId;
            profileIds[i] = _tokenProfileId[tokenId];
            profileTypes[i] = _tokenProfileType[tokenId];
            uris[i] = tokenURI(tokenId);
            owners[i] = ownerOf(tokenId);
        }
    }

    // Overrides required by Solidity
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
