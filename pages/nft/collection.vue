<template>
  <Head>
    <Title>NFT Collection Details | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'NFT Collection Details | ' + $config.projectMetadataTitle" />
  </Head>

  <div class="card border scroll-500">
    <div class="card-body">
      <p class="fs-3" @click="$router.back()">
        <i class="bi bi-arrow-left-circle cursor-pointer"></i>
      </p>

      <h3 class="mb-3 mt-3" v-if="!cName">NFT Collection Details</h3>
      <h3 class="mb-3 mt-3" v-if="cName">Collection: {{ cName }}</h3>

      <div class="d-flex justify-content-center mb-3" v-if="waitingData">
        <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
      </div>

      <p class="text-break mt-3">Collection address: {{ cAddress }}</p>
      <p class="text-break mt-3">Collection description: {{ cDescription }}</p>

      <img v-if="cImage" :src="cImage" class="img-fluid rounded" style="max-width: 200px;" />
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';
import { useToast } from "vue-toastification/dist/index.mjs";
import ConnectWalletButton from "~/components/ConnectWalletButton.vue";
import WaitingToast from "~/components/WaitingToast";

export default {
  name: 'NftCollection',

  data() {
    return {
      cAddress: null,
      cDescription: null,
      cImage: null,
      cName: null,
      mdAddress: null,
      paused: null,
      waitingData: false
    }
  },

  mounted() {
    this.cAddress = this.$route.query.id;

    if (this.cAddress) {
      this.getCollectionDetails();
    }
  },

  methods: {
    async getCollectionDetails() {
      this.waitingData = true;

      // fetch provider from hardcoded RPCs
      let provider = this.$getFallbackProvider(this.$config.supportedChainId);

      if (this.isActivated && this.chainId === this.$config.supportedChainId) {
        // fetch provider from user's MetaMask
        provider = this.signer;
      }

      const nftInterface = new ethers.utils.Interface([
        "function collectionPreview() public view returns (string memory)",
        "function getBurnPrice() public view returns (uint256)",
        "function getMintPrice() public view returns (uint256)",
        "function metadataAddress() public view returns (address)"
      ]);

      const nftContract = new ethers.Contract(this.cAddress, nftInterface, provider);

      // get metadata address
      this.mdAddress = await nftContract.metadataAddress();

      const metadataInterface = new ethers.utils.Interface([
        "function descriptions(address) public view returns (string memory)",
        "function names(address) public view returns (string memory)"
      ]);
      
      const metadataContract = new ethers.Contract(this.mdAddress, metadataInterface, provider);

      // get collection details
      this.cImage = await nftContract.collectionPreview();
      this.cDescription = await metadataContract.descriptions(this.cAddress);
      this.cName = await metadataContract.names(this.cAddress);
      
      this.waitingData = false;
    }
  },

  setup() {
    const { address, chainId, isActivated, signer } = useEthers();
    const toast = useToast();

    return { address, chainId, isActivated, signer, toast }
  },
};
</script>
