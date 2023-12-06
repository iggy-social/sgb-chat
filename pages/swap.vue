<template>
  <Head>
    <Title>Swap | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'Token Swap | ' + $config.projectMetadataTitle" />
  </Head>

  <div class="scroll-500">
    <div class="card border">
      <div class="card-body mb-3">
        <p class="fs-3">
          <i class="bi bi-arrow-left-circle cursor-pointer" @click="$router.back()"></i>
        </p>

        <h4 class="text-center mt-5 mb-4">OracleSwap</h4>
        
        <div class="d-flex justify-content-center mb-3">
          <div class="col-12 col-lg-8">
            <SimpleSwap 
              :routerAddress="$config.swapRouterAddress" 
              swapId="SwapPage1" 
              :tokens="tokens"
            />
          </div>
        </div>

        <hr />

        <h4 class="text-center mt-5 mb-4">FeatherSwap</h4>

        <div class="d-flex justify-content-center">
          <div class="col-12 col-lg-8">
            <SimpleSwap 
              routerAddress="0x12c8B86FAB056323dC69b0aeA436d29A072f6364" 
              swapId="SwapPage2" 
              :tokens="tokensFeather"
            />
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import tokens from '~/assets/data/tokens.json';
import tokensFeather from '~/assets/data/tokensFeather.json';
import SimpleSwap from '~~/components/swap/SimpleSwap.vue';

export default {
  name: 'Swap',

  components: {
    SimpleSwap,
  },

  setup() {
    return { tokens, tokensFeather };
  }
}
</script>