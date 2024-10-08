import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// https://nuxt.com/docs/api/configuration/nuxt-config 
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          "name": "viewport",
          "content": "width=device-width, initial-scale=1"
        },
        {
          "charset": "utf-8"
        }
      ],
      link: [
        { // Bootstrap
          rel: "stylesheet",
          href: "	https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        },
        { // Bootstrap icons
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        },
        { // Custom
          rel: "stylesheet",
          href: "/css/custom.css"
        }
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        }
      ]
    }
  },
  components: false,
  css: [
    'vue-toastification/dist/index.css' 
  ],
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  router: {
    options: {
      hashMode: false
    }
  },
  runtimeConfig: {
    public: {
      airdropClaimDomainsAddress: "0x742d7A1d08c20d9f85c41f8562Ed29aFc64d3c4a", // chat token claim for domain holders contract address
      airdropPostMintersAddress: "0x8A6d7926Db502Bb5b9Ffbcc2FF195623f52040C8", // chat token claim for post minters contract address
      arweaveAddress: process.env.ARWEAVE_ADDRESS,
      arweaveGateway: 'https://arweave.net/',
      arweaveMinBalance: 0.02, // minimum AR balance to upload files
      blockExplorerBaseUrl: "https://songbird-explorer.flare.network",
      chatTokenAddress: "0x81aDd7359f2B95276F8542f2a0acD7ECD2Ae9349", // chat token address
      chatTokenImage: "https://bafybeig2a6e7oe5rjajcrfmvi5vsnhbrh6dnqfll2edm2og3efcrrueup4.ipfs.w3s.link/chirp.png", // chat token image
      chatTokenSymbol: "CHIRP", // chat token symbol or name
      domainRequiredToPost: true,
      expiryCollections: 1000 * 60 * 60 * 24 * 7, // must be in milliseconds (0 means no expiration)
      expiryUsernames: 1000 * 60 * 60 * 24 * 7, // must be in milliseconds (0 means no expiration)
      favicon: "/img/favicon.png",
      fileUploadEnabled: true, // enable/disable file uploads (enable only if external file storage is used, e.g. Arweave)
      fileUploadSizeLimit: 1 * 1024 * 1024, // max file upload size in bytes (1 * 1024 * 1024 = 1 MB)
      fileUploadStorageType: "arweave", // "arweave" or "imagekit"
      fileUploadTokenService: process.env.FILE_UPLOAD_SERVICE || "netlify", // "netlify" or "vercel" (or leave empty for no file uploads)
      getPostsLimit: 30, // number of posts to fetch from Orbis in the getPosts() function
      iggyPostAddress: "0xE33F27496A9cE75313f6d1FA2BA95657Fc904387",
      iggyPostMinterAddress: "0x9e9905FA405A5FC7Ee2DEB94CbAc089B4FE6f0Ef",
      iggyPostEnumerationAddress: "0xE2AfE33f16519e31c6FFE5eEb333A0887a44D2BC",
      imagekitEndpoint: process.env.IMAGEKIT_ENDPOINT,
      imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      ipfsGateway: "https://cloudflare-ipfs.com/ipfs/",
      keysAddress: "0xEdE68a694E4730F997dcA54A9C9f817D86605FF5", // PunkKey contract address 
      keysContext: "kjzl6cwe1jw14aizx9mc4mnwpfa16b05ibzpc4pbie57podvb3dgvy9vay8muf4",
      linkPreviews: process.env.LINK_PREVIEW_SERVICE || "netlify", // "netlify", "vercel", or "microlink" (or leave empty for no link previews)
      lpTokenAddress: "0xdE533DE5e9A73934B380c70f3611B116b8DF7D0d", // liquidity pool token (token to stake in the staking contract)
      lpTokenSymbol: "LP tokens", // LP token symbol
      marketplaceCollectionUrl: "https://marketplace.flareocean.io/collection/19/0xe33f27496a9ce75313f6d1fa2ba95657fc904387",
      marketplaceNftItemUrl: "https://marketplace.flareocean.io/asset/19/0xE33F27496A9cE75313f6d1FA2BA95657Fc904387/", // url (append nft id to it)
      marketplaceNftCollectionBaseUrl: "https://marketplace.flareocean.io/collection/19/", // url (append nft address to it)
      newsletterLink: "https://paragraph.xyz/@iggy?modal=subscribe",
      nftDefaultRatio: 6969, // default ratio for the NFT price bonding curve
      nftLaunchpadBondingAddress: "0x2bb3407bc184B8fF52EEaA2777c51686640d5860", // NFT launchpad with bonding curve contract address
      nftLaunchpadLatestItems: 8, // number of latest NFTs to show in the NFT launchpad
      nftOrbisContext: "kjzl6cwe1jw149y24iu6qrmo2x5yl2rmcxoegmey9y19faclcwaiivjganh5iz5", // Orbis context for NFT collection pages
      orbisCategories: [ // use only alphanumeric ASCII characters for slugs! (no spaces, only dash is allowed)
        { "slug": "all", "title": "General discussion", "hidden": false }, // not a real tag, just denotes the absence of a tag (always keep it here)
        { "slug": "general", "title": "General discussion 2", "hidden": true },
        { "slug": "shill", "title": "Shill & discuss projects", "hidden": true },
        { "slug": "nfts", "title": "Memes & NFTs", "hidden": true }, // keep this category for the purpose of the NFT launchpad
        { "slug": "governance", "title": "Governance", "hidden": true },
        { "slug": "food", "title": "Food & recipes", "hidden": true },
        { "slug": "movie", "title": "Movies & Music", "hidden": true },
        { "slug": "music", "title": "Music", "hidden": true },
        { "slug": "random", "title": "Random", "hidden": true },
      ],
      orbisContext: "kjzl6cwe1jw14a064memywn3fhuks5w3m2xfole8vrj202suz4xq8o9yfhso6hf", // production context
      orbisTest: false, // if true, test context will be used instead of the production one
      orbisTestContext: "kjzl6cwe1jw145tfqv2eqv8tiz6puo27meyz4smz40atppuc13tulqca87k35z2", // test context
      previewImage: "/img/cover.png",
      previewImageAirdrop: "/img/cover-airdrop.png",
      previewImageNftCollection: "/img/cover-nft-collection.png",
      previewImageNftCreate: "/img/cover-nft-create.png",
      previewImageNftLaunchpad: "/img/cover-nft-launchpad.png",
      previewImagePost: "/img/cover-post.png",
      previewImagePostNft: "/img/cover-post-nft.png",
      previewImageProfile: "/img/cover-profile.png",
      previewImageStake: "/img/cover-stake.png",
      profileMintedPostIdsMax: 36, // max number of minted post ids to show in the profile page
      projectMetadataTitle: "SGB Chat - Web3 Social on Songbird",
      projectName: "SGB Chat",
      projectDescription: "SGB Chat is the first decentralized social network on Songbird. Brought to you by Songbird Domains.",
      projectTwitter: "https://twitter.com/SongbirdDomains",
      projectUrl: "https://sgb.chat", // without trailing slash!
      punkMinterAddress: "0xf63B682e308ea0C603ae23eBb617E7998b8C92DF", // punk domain minter contract address
      punkNumberOfPrices: 5, // number of different prices (based on domain length), usually 1 (price()) or 5 (price1char() - price5char())
      punkTldAddress: "0xBDACF94dDCAB51c39c2dD50BffEe60Bb8021949a", // punk domain TLD address
      randomPostsNumber: 1, // number of random post NFTs to show in the sidebar widget
      rpcCustom: process.env.RPC_CUSTOM || "", // Custom RPC URL
      showRepliesOnHomepage: true, // show replies on the homepage     
      stakingContractAddress: "0xCA9749778327CD67700d3a777731a712330beB9A", // this is also the stake/gov token address
      stakeTokenSymbol: "SCG", // stake token symbol (governance token symbol)
      supportedChainId: 19,
      swapPriceImpactMaxBps: 1000, // max price impact in bips (1 bps = 0.01%, 1000bps = 10%) for the swap function
      swapRouterAddress: "0x1fbcB9260Ba042DAB33972dF1262D5045890a9E2", // iggy swap router contract address
      tenorApiKey: process.env.TENOR_KEY || "",
      tldName: ".sgb",
      tokenAddress: null, // leave null if it's a native token of the chain
      tokenDecimals: 18,
      tokenSymbol: "SGB"
    }
  },
  vite: {
    build: {
      target: ['es2020'] // fix big integer literals error
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis'  // fix nuxt3 global
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,  // fix nuxt3 process
            buffer: true
          }),
          NodeModulesPolyfillPlugin()
        ],
        target: "es2020" // fix big integer literals error
      }
    }
  }
})
