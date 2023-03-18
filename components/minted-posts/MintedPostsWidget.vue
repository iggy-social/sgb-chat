<template>
<div v-if="posts.length > 0" class="card m-2 bg-light">
  <div class="card-header bg-light">
    <span v-if="posts.length < numberOfPosts" class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
    {{ getWidgetTitle }}
  </div>

  <div class="card-body sidebar-card-body">
    <div class="row">
      <div class="col-12 mb-4" v-for="post in posts" :key="post.id">
        <NuxtLink :to="'/minted-post/?id=' + post.id">
          <img class="img-fluid rounded" :src="post.image" @click="$emit('closeRightSidebar')" />
        </NuxtLink>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';

export default {
  name: "MintedPostsWidget",
  emits: ["closeRightSidebar"],

  data() {
    return {
      numberOfPosts: this.$config.randomPostsNumber,
      posts: []
    };
  },

  mounted() {
    this.fetchRandomMintedPosts();
  },

  computed: {
    getWidgetTitle() {
      if (this.$config.randomPostsNumber === 1) {
        return "Random Minted Post"
      } else {
        return "Random Minted Posts"
      }
    },
  },

  methods: {
    async fetchRandomMintedPosts() {
      // fetch provider from hardcoded RPCs
      let provider = this.$getFallbackProvider(this.$config.supportedChainId);

      if (this.isActivated) {
        if (this.chainId === this.$config.supportedChainId) {
          // fetch provider from user's MetaMask
          provider = this.signer;
        }
      }

      const iggyPostInterface = new ethers.utils.Interface([
        "function counter() external view returns (uint256)",
        "function uri(uint256 _tokenId) external view returns (string memory)"
      ]);

      const iggyContract = new ethers.Contract(this.$config.iggyPostAddress, iggyPostInterface, provider);

      const counter = await iggyContract.counter();

      // generate four unique random numbers between 1 and (counter-1)
      const randomNumbers = [];
      while (randomNumbers.length < this.numberOfPosts) {
        const randomNumber = Math.floor(Math.random() * (counter - 1)) + 1;
        if (!randomNumbers.includes(randomNumber)) {
          randomNumbers.push(randomNumber);
        }
      }

      for (let i = 0; i < randomNumbers.length; i++) {
        let post = localStorage.getItem("minted-post-" + randomNumbers[i]);

        if (!post) {
          post = await iggyContract.uri(randomNumbers[i]);
          localStorage.setItem("minted-post-" + randomNumbers[i], post);
        }

        const json = atob(post.substring(29));
        const result = JSON.parse(json);

        this.posts.push({
          id: randomNumbers[i],
          streamId: result["external_url"].split("?id=")[1],
          image: result["image"]
        });
      }
      
    }
  },

  setup() {
    const { isActivated, chainId, signer } = useEthers();

    return {
      isActivated,
      chainId,
      signer
    }
  }
}
</script>