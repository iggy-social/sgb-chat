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
          href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        },
        { // Bootstrap icons
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css"
        },
        { // Custom
          rel: "stylesheet",
          href: "/css/custom.css"
        }
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
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
      blockExplorerBaseUrl: "https://songbird-explorer.flare.network",
      domainRequiredToPost: true,
      favicon: "/img/favicon.png",
      getPostsLimit: 30, // number of posts to fetch from Orbis in the getPosts() function
      iggyPostAddress: "0x99Dbf11aCd46baFBCE82506FaeB4F13E6Ea1726A",
      iggyPostMinterAddress: "0xabf9960132818049340253C3Ca0551F92Db856d7",
      iggyPostEnumerationAddress: "0x0BF6333Fc85159663A30Ac89FD02c5031B97c5ee",
      marketplaceCollectionUrl: "https://sparklesnft.com/collection/songbird/sgbchat/",
      marketplaceNftItemUrl: "https://sparklesnft.com/item/songbird/0x99dbf11acd46bafbce82506faeb4f13e6ea1726a_", // url + nft id
      maxImageUploadSizeMb: 1, // max image upload size in MB
      orbisContext: "kjzl6cwe1jw14a064memywn3fhuks5w3m2xfole8vrj202suz4xq8o9yfhso6hf", // production context
      orbisTest: false, // if true, test context will be used instead of the production one
      orbisTestContext: "kjzl6cwe1jw145tfqv2eqv8tiz6puo27meyz4smz40atppuc13tulqca87k35z2", // test context
      previewImage: "/img/cover.png",
      previewImagePost: "/img/cover-post.png",
      previewImagePostNft: "/img/cover-post-nft.png",
      previewImageProfile: "/img/cover-profile.png",
      profileMintedPostIdsMax: 36, // max number of minted post ids to show in the profile page
      projectMetadataTitle: "SGB Chat - Web3 Social on Songbird",
      projectName: "SGB Chat (beta)",
      projectDescription: "SGB Chat is the first decentralized social network on Songbird. Brought to you by Songbird Domains.",
      projectTwitter: "https://twitter.com/SongbirdDomains",
      projectUrl: "https://sgb.chat",
      punkMinterAddress: "0xA33dCbE04278706248891931537Dd56B795c3663", // punk domain minter contract address
      punkNumberOfPrices: 5, // number of different prices (based on domain length), usually 1 (price()) or 5 (price1char() - price5char())
      punkTldAddress: "0xBDACF94dDCAB51c39c2dD50BffEe60Bb8021949a", // punk domain TLD address
      randomPostsNumber: 1, // number of random post NFTs to show in the sidebar widget
      showRepliesOnHomepage: true, // show replies on the homepage
      supportedChainId: 19,
      swapRouterAddress: "0x8FF82d2b0ab704Ba2AB5a567f32F1447A6158260", // iggy swap router contract address
      tenorApiKey: process.env.TENOR_KEY || "",
      tldName: ".sgb",
      tokenAddress: null, // leave null if it's a native token of the chain
      tokenDecimals: 18,
      tokenSymbol: "SGB",
      web3storageKey: process.env.WEB3_STORAGE_KEY || ""
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
