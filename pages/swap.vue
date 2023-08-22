<template>
  <Head>
    <Title>Swap | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'Token Swap | ' + $config.projectMetadataTitle" />
  </Head>

  <div v-if="isLoading" class="loading-image">
    <img src="/img/sgb-chat-logo-2.png" class="loading-spinner" /> 
  </div>

  <div class="scroll-500">
    <div class="card border">
      <div class="card-body mb-3">
        <p class="fs-3">
          <i class="bi bi-arrow-left-circle cursor-pointer" @click="$router.back()"></i>
        </p>

        <h3 class="mt-3">Token Swap</h3>
        
        <div class="d-flex justify-content-center mt-5">
          <div class="col-12 col-lg-8">
            <SimpleSwap 
              :routerAddress="$config.swapRouterAddress" 
              swapId="SwapPage1" 
            />
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import SimpleSwap from '~~/components/swap/SimpleSwap.vue';

import { ref, onMounted } from 'vue'

export default {
  name: 'Swap',

  components: {
    SimpleSwap,
  },

  setup() {
    const isLoading = ref(true);
     onMounted(() => { isLoading.value = false; });

     return { isLoading }
  }
}
</script>
