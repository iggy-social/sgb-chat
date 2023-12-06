<template>
<div class="card m-2 bg-light">
  <div class="card-header bg-light">{{ title }}</div>

  <div class="card-body sidebar-card-body">

    <SimpleSwap 
      class="mt-3"
      :routerAddress="routerAddress" 
      :swapId="swapId" 
      :tokens="tokens" 
      :poweredBy="poweredBy"
    />

  </div>
</div>
</template>

<script>
import SimpleSwap from '~/components/swap/SimpleSwap.vue';

export default {
  name: "SimpleSwapWidget",
  props: ["poweredBy", "routerAddress", "swapId", "title", "tokens"],

  components: { SimpleSwap }
}
</script>