<template>
  <div v-if="isLoading" class="loading-image">
    <img src="/img/logo.png" class="loading-spinner" /> 
  </div>
  <ChatFeed class="mt-1" :showQuotedPost="$config.showRepliesOnHomepage" />
</template>

<script>
import { useEthers } from 'vue-dapp'
import ChatFeed from "../components/chat/ChatFeed.vue"

import { ref, onMounted } from 'vue'

export default {
  name: "index",

  components: {
    ChatFeed
  },

  setup() {
    const { address, chainId } = useEthers()
    
    const isLoading = ref(true);
     onMounted(() => { isLoading.value = false; });

    return { address, chainId, isLoading }
  }
}
</script>
