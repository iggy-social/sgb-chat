<template>
  <Head>
    <Title>NFT Launchpad | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'NFT Launchpad | ' + $config.projectMetadataTitle" />
  </Head>

  <div class="card border scroll-500">
    <div class="card-body">
      <p class="fs-3" @click="$router.back()">
        <i class="bi bi-arrow-left-circle cursor-pointer"></i>
      </p>

      <h3 class="mb-3 mt-3">NFT Launchpad (work in progress)</h3>

      <NuxtLink class="btn btn-outline-primary btn-sm" to="/nft/create">
        <i class="bi bi-plus-circle"></i> Create
      </NuxtLink>

      <p class="text-break mt-3">
        {{ lastNfts }}
      </p>
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
      const lNfts = await launchpadContract.getLastNftContracts(5);
      console.log('lastNfts', lNfts);

      this.lastNfts = lNfts;

      this.waitingData = false;
    }
  },

  setup() {
    const { address, chainId, isActivated, signer } = useEthers();

    return { address, chainId, isActivated, signer }
  },
}
</script>