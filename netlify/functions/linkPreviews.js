exports.handler = async function (event, context) {
  const ethers = require('ethers');

  const metascraper = require('metascraper')([
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-title')()
  ])

  const url = event.queryStringParameters.url;

  // check if URL is an NFT marketplace
  if (url.startsWith("https://sparklesnft.com/item/songbird/")) {
    const cleanUrl = url.split("?")[0];
    const addrTokenId = cleanUrl.split("https://sparklesnft.com/item/songbird/")[1].replace("/", "");
    const addr = addrTokenId.split("_")[0];
    const tokenId = addrTokenId.split("_")[1];

    const provider = new ethers.providers.JsonRpcProvider("https://songbird-api.flare.network/ext/C/rpc");

    const nftInterface = new ethers.utils.Interface([
      "function uri(uint256 _tokenId) external view returns (string memory)",
      "function tokenURI(uint256 _tokenId) external view returns (string memory)"
    ]);

    const nftContract = new ethers.Contract(addr, nftInterface, provider);

    let nftMetadataUri;

    try {
      // erc-1155
      nftMetadataUri = await nftContract.uri(tokenId);
    } catch (error) {
      // erc-721
      nftMetadataUri = await nftContract.tokenURI(tokenId);
    }

    let json;

    if (
      !nftMetadataUri.startsWith("https://") && 
      !nftMetadataUri.startsWith("http://") &&
      !nftMetadataUri.startsWith("ipfs://")
    ) {
      const result = atob(nftMetadataUri.substring(29));
      json = JSON.parse(result);
    } else if (nftMetadataUri.startsWith("ipfs://")) {
      // ipfs://QmTLJDoCTihqD3AkNkMMQFXLMQFZkdqLFR3Mdcg14Ln7bL/7.json
      // https://bafkreiecjcejcg6h5wh2g3wcacy2lnod2mfrvimlr53ikvlsh53mw2zdty.ipfs.w3s.link/
      // https://QmTLJDoCTihqD3AkNkMMQFXLMQFZkdqLFR3Mdcg14Ln7bL.ipfs.dweb.link/7.json
      // https://bafybeickgncmppcbrhg4cbzw3nxqajxoe2vj7ixmmcshddkyn5itv7ang4.ipfs.dweb.link/7.json

      json = {
        "name": "Check this NFT on Sparkles",
        "description": "Sparkles NFT Marketplace",
        "image": "https://bafkreifyx3seviqnnhpcuge72lr7la3yfrvucr3n5aoqijzjul2fyzh64i.ipfs.w3s.link"
      }
    } else {
      const response = await fetch(nftMetadataUri);
      json = await response.json();
    }

    const finalMetadata = {
      "url": url,
      "title": json["name"],
      "description": json["description"], 
      "image": { 
        url: json["image"]
      }
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ data: finalMetadata }),
    };
  }

  try {
    const response = await fetch(url); 
    const html = await response.text();

    const metadata = await metascraper({ html, url });

    const finalMetadata = {
      "url": url,
      "title": metadata.title,
      "description": metadata.description,
      "image": { 
        url: metadata.image
      }
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ data: finalMetadata }),
    };
    
    //return metadata;
  } catch (error) {
    console.error('Error fetching link preview metadata:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
  
};
