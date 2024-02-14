<template>
  <Head>
    <Title>Tipping | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'Tipping | ' + $config.projectMetadataTitle" />
  </Head>

  <div class="scroll-500">
    <div class="card border">
      <div class="card-body mb-3">
        <p class="fs-3">
          <i class="bi bi-arrow-left-circle cursor-pointer" @click="$router.back()"></i>
        </p>

        <h3 class="mt-3">Send a tip to someone</h3>
        <p class="mt-3"><em>Powered by Spark.</em></p>
        
        <div class="d-flex justify-content-center mt-5">
          <div class="col-12 col-lg-8">
            <SendTokensComponent :tokens="tokens" :recipient="getQueryRecipient" />
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import tokens from '~/assets/data/tokens.json';
import SendTokensComponent from '~~/components/send-tokens/SendTokensComponent.vue';

export default {
  name: 'Tip',

  components: {
    SendTokensComponent,
  },

  computed: {
    getQueryRecipient() {
      if (!this.$route.query.to) return null;

      return this.$route.query.to; // ?to=techie
    },
  },

  setup() {
    return { tokens };
  }
}
</script>