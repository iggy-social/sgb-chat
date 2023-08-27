exports.handler = async function (event, context) {
  const metascraper = require('metascraper')([
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-title')()
  ])

  const url = event.queryStringParameters.url;

  try {
    const response = await fetch(url); 
    const html = await response.text();
    
    /*
    const metaDescription = html.match(/<meta name="description" content="([^"]+)"/g);
    
    // get image from meta tags
    const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/g);

    const metadata = {
      "url": url,
      "title": html.match(/<title>(.*?)<\/title>/i)[1],
      "description": metaDescription[0].match(/content="([^"]+)"/)[1],
      "image": { 
        url: ogImage[0].match(/content="([^"]+)"/)[1] 
      }
    };
    */

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
    console.error('Error fetching Twitter card metadata:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
  
};
