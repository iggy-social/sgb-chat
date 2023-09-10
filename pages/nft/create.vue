<template>
  <Head>
    <Title>Create NFT Collection | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'Create NFT Collection | ' + $config.projectMetadataTitle" />
  </Head>

  <div class="card border scroll-500">
    <div class="card-body">
      <p class="fs-3" @click="$router.back()">
        <i class="bi bi-arrow-left-circle cursor-pointer"></i>
      </p>

      <h3 class="mb-4 mt-3">Create NFT Collection</h3>

      <!-- Collection Name -->
      <div class="mb-4">
        <label for="cName" class="form-label">Collection Name</label>
        <input 
          type="text" class="form-control" id="cName" aria-describedby="cNameHelp"
          placeholder="e.g. Crypto Punks" 
          v-model="cName"
        />
        <div id="cNameHelp" class="form-text">This is not a token name, but the whole collection name.</div>
      </div>

      <!-- Symbol -->
      <div class="mb-4">
        <label for="cSymbol" class="form-label">Collection Symbol</label>
        <input 
          type="text" class="form-control" id="cSymbol" aria-describedby="cSymbolHelp" 
          placeholder="e.g. PUNKS" 
          v-model="cSymbol"
        />
        <div id="cSymbolHelp" class="form-text">Collection symbol (required by the ERC-721 smart contract, but not really important).</div>
      </div>

      <!-- Image -->
      <div class="mb-2">
        <label for="cImage" class="form-label">Collection Image (can be changed later)</label>
        <div class="input-group" aria-describedby="cImageHelp" id="cImage">
          <input 
            v-model="cImage"
            type="text" 
            class="form-control" 
            placeholder="Enter image URL or click the upload button"
          >

          <Web3StorageImageUpload 
            v-if="isActivated && $config.web3storageKey !== ''"  
            @insertImage="insertImage"
            buttonText="Upload"
            cls="btn btn-outline-secondary rounded-end-2"
            type="button" id="button-addon2"
          />
        </div>
        <div id="cImageHelp" class="form-text">Even if you want a generative PFP collection, put a single preview image for now and you will change it to a metadata link later.</div>
      </div>

      <div v-if="cImage" class="mb-4">
        <img :src="cImage" class="img-thumbnail img-fluid" style="max-width: 100px;" />
      </div>

      <!-- Description -->
      <div class="mb-4">
        <label for="cDescription" class="form-label">Collection Description (can be changed later)</label>
        <input 
          type="text" class="form-control" id="cDescription" aria-describedby="cDescriptionHelp" 
          placeholder="Keep it short and sweet." 
          v-model="cDescription"
        />
        <div id="cDescriptionHelp" class="form-text">Too long description means higher gas cost for storing it.</div>
      </div>

      <!-- NFT Name -->
      <div class="mb-4">
        <label for="nftName" class="form-label">NFT Name (can be changed later)</label>
        <input 
          type="text" class="form-control" id="cDescription" aria-describedby="nftNameHelp" 
          placeholder="Short, will show up next to each NFT, e.g. Punk" 
          v-model="nftName"
        />
        <div v-if="nftName" id="nftNameHelp" class="form-text">The first minted NFTs will be {{ nftName }} #1, {{ nftName }} #2, {{ nftName }} #3 etc.</div>
      </div>

      <!-- Unique ID -->
      <div class="mb-4">
        <label for="uniqueId" class="form-label">Unique ID (store it - just in case)</label>
        <input 
          type="text" class="form-control" id="uniqueId" aria-describedby="uniqueIdHelp" 
          disabled readonly 
          v-model="uniqueId"
        />
        <div id="uniqueIdHelp" class="form-text">This is just in case the frontend will not show you the NFT collection address and you'll need to find it manually.</div>
      </div>

      <!-- Ratio -->
      <div class="mb-4">
        <label for="ratio" class="form-label">Bonding Curve Ratio</label>
        <input 
          type="text" class="form-control" id="ratio" aria-describedby="ratioHelp" 
          v-model="ratio"
        />
        <div id="ratioHelp" class="form-text">Leave at {{ $config.nftDefaultRatio }} unless you know what you're doing.</div>
      </div>
      
    </div>
  </div>
</template>


<script>
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';
import { useToast } from "vue-toastification/dist/index.mjs";
import Web3StorageImageUpload from "~/components/storage/Web3StorageImageUpload.vue";

export default {
  name: 'NftCreate',

  data() {
    return {
      cDescription: null,
      cImage: null,
      cName: null,
      cSymbol: null,
      launchpadPaused: null,
      nftName: null,
      createPrice: null,
      ratio: null,
      uniqueId: null,
      waitingData: false
    }
  },

  components: {
    Web3StorageImageUpload
  },

  mounted() {
    this.ratio = this.$config.nftDefaultRatio;
    this.fetchData();
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
        "function paused() public view returns(bool)",
        "function isUniqueIdAvailable(string calldata _uniqueId) public view returns(bool)",
        "function price() public view returns(uint256)"
      ]);

      const launchpadContract = new ethers.Contract(
        this.$config.nftLaunchpadBondingAddress,
        launchpadInterface,
        provider
      );

      // check if paused
      this.launchpadPaused = await launchpadContract.paused();

      // generate unique ID and check if it's already been used
      // Math.random().toString(36).slice(2);
      this.uniqueId = Math.random().toString(36).slice(2);

      const isUniqueIdAvailable = await launchpadContract.isUniqueIdAvailable(this.uniqueId);

      if (!isUniqueIdAvailable) {
        this.uniqueId = Math.random().toString(36).slice(10);
      }

      // get price for creating collection
      this.createPrice = await launchpadContract.price();

      this.waitingData = false;
    },

    insertImage(imageUrl) {
      this.cImage = imageUrl.replace("?.img", "");
    },
  },

  setup() {
    const { address, chainId, isActivated, signer } = useEthers();
    const toast = useToast();

    return { address, chainId, isActivated, signer, toast }
  },
}
</script>