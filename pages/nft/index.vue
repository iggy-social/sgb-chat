<template>
  <Head>
    <Title>NFT Launchpad | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'NFT Launchpad | ' + $config.projectMetadataTitle" />

    <Meta name="description" :content="'Check out these awesome NFT collections on ' + $config.projectName + '!'" />

    <Meta property="og:image" :content="$config.projectUrl+$config.previewImageNftLaunchpad" />
    <Meta property="og:description" :content="'Check out these awesome NFT collections on ' + $config.projectName + '!'" />

    <Meta name="twitter:image" :content="$config.projectUrl+$config.previewImageNftLaunchpad" />
    <Meta name="twitter:description" :content="'Check out these awesome NFT collections on ' + $config.projectName + '!'" />
  </Head>

  <div class="card border scroll-500">
    <div class="card-body">
      <p class="fs-3" @click="$router.back()">
        <i class="bi bi-arrow-left-circle cursor-pointer"></i>
      </p>

      <h3 class="mb-4 mt-3">
        NFT Launchpad
        <NuxtLink class="btn btn-outline-primary btn-sm" to="/nft/create">
          <i class="bi bi-plus-circle"></i> Create
        </NuxtLink>
      </h3>

      <div class="d-flex justify-content-center mb-3" v-if="waitingData">
        <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
      </div>

      <h4 class="mb-3" v-if="featuredNfts">Featured</h4>

      <div class="row" v-if="featuredNfts">
        <NuxtLink v-for="nft in featuredNfts" :key="nft.address" class="col-md-3 text-decoration-none" :to="'/nft/collection?id=' + nft.address">
          <div class="card border mb-3">
            <img :src="nft.image" class="card-img-top" :alt="nft.name">
            <div class="card-body rounded-bottom-3">
              <p class="card-text mb-1"><strong>{{ nft.name }}</strong></p>
              <small class="card-text">{{ formatPrice(nft.price) }} {{ $config.tokenSymbol }}</small>
            </div>
          </div>
        </NuxtLink>
      </div>

      <h4 class="mt-3 mb-3">Latest</h4>

      <div class="row">
        <NuxtLink v-for="nft in lastNfts" :key="nft.address" class="col-md-3 text-decoration-none" :to="'/nft/collection?id=' + nft.address">
          <div class="card border mb-3">
            <img :src="nft.image" class="card-img-top" :alt="nft.name">
            <div class="card-body rounded-bottom-3">
              <p class="card-text mb-1"><strong>{{ nft.name }}</strong></p>
              <small class="card-text">{{ formatPrice(nft.price) }} {{ $config.tokenSymbol }}</small>
            </div>
          </div>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';

export default {
  name: 'Nft',

  data() {
    return {
      featuredNfts: [],
      lastNfts: [],
      waitingData: false
    }
  },

  mounted() {
    if (this.$config.nftLaunchpadBondingAddress) {
      this.fetchData();
    }
  },

  methods: {
    async fetchData() {
      this.waitingData = true;

      // fetch provider from hardcoded RPCs
      let provider = this.$getFallbackProvider(this.$config.supportedChainId);

      if (this.isActivated && this.chainId === this.$config.supportedChainId) {
        // fetch provider from user's MetaMask
        provider = this.signer;
      }

      // create launchpad contract object
      const launchpadInterface = new ethers.utils.Interface([
        "function getFeaturedNftContracts(uint256 amount) external view returns(address[] memory)",
        "function getLastNftContracts(uint256 amount) external view returns(address[] memory)"
      ]);

      const launchpadContract = new ethers.Contract(
        this.$config.nftLaunchpadBondingAddress,
        launchpadInterface,
        provider
      );

      // get last NFTs
      const lNfts = await launchpadContract.getLastNftContracts(4);

      await this.parseNftsArray(lNfts, this.lastNfts, provider);

      // get featured NFTs
      const fNfts = await launchpadContract.getFeaturedNftContracts(4);

      await this.parseNftsArray(fNfts, this.featuredNfts, provider);

      this.waitingData = false;
    },

    formatPrice(priceWei) {
      if (priceWei === null) {
        return null;
      }

      const price = Number(ethers.utils.formatEther(priceWei));

      if (price > 100) {
        return price.toFixed(0);
      } else if (price > 1) {
        return price.toFixed(2);
      } else if (price > 0.1) {
        return price.toFixed(4);
      } else if (price > 0.01) {
        return price.toFixed(5);
      } else if (price > 0.001) {
        return price.toFixed(6);
      } else if (price > 0.0001) {
        return price.toFixed(7);
      } else if (price > 0.00001) {
        return price.toFixed(8);
      } else if (price > 0.000001) {
        return price.toFixed(9);
      } else {
        return price;
      }
    },

    async parseNftsArray(inputArray, outputArray, provider) {
      const nftInterface = new ethers.utils.Interface([
        "function collectionPreview() public view returns (string memory)",
        "function getMintPrice() public view returns (uint256)",
        "function name() public view returns (string memory)"
      ]);

      // for loop to get NFTs data (price, name & image)
      for (let i = 0; i < inputArray.length; i++) {
        const nftContract = new ethers.Contract(inputArray[i], nftInterface, provider);

        // fetch collection object from session storage
        const collectionString = sessionStorage.getItem(String(inputArray[i]).toLowerCase()+"-collection");
        let collection;
        
        if (collectionString) {
          collection = JSON.parse(collectionString);
        }

        // get collection name
        let cName;

        if (collection?.name) {
          cName = collection.name;
        } else {
          cName = await nftContract.name();
        }

        // get price
        const mintPriceWei = await nftContract.getMintPrice();

        // get image
        let cImage;

        if (collection?.image) {
          cImage = collection.image;
        } else {
          cImage = await nftContract.collectionPreview();
        }

        outputArray.push({
          address: inputArray[i],
          image: cImage,
          name: cName,
          price: mintPriceWei
        });
      }
    }
  },

  setup() {
    const { address, chainId, isActivated, signer } = useEthers();

    return { address, chainId, isActivated, signer }
  },
}
</script>