<template>
  <Head>
    <Title>Swap | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'Token Swap | ' + $config.projectMetadataTitle" />
  </Head>

  <div class="scroll-500">
    <div class="card border">
      <div class="card-body">
        <p class="fs-3" @click="$router.back()">
          <i class="bi bi-arrow-left-circle cursor-pointer"></i>
        </p>

        <h3 class="mb-4 mt-3">Token Swap</h3>
        
        <div class="d-flex justify-content-center">
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

export default {
  name: 'Swap',

  components: {
    SimpleSwap,
  },
}
</script>