<template>
  <Head>
    <Title>Profile | {{ $config.projectMetadataTitle }}</Title>
    <Meta name="description" :content="'Check out this profile on ' + $config.projectName + '!'" />

    <Meta property="og:image" :content="$config.projectUrl+$config.previewImageProfile" />
    <Meta property="og:description" :content="'Check out this profile on ' + $config.projectName + '!'" />

    <Meta name="twitter:image" :content="$config.projectUrl+$config.previewImageProfile" />
    <Meta name="twitter:description" :content="'Check out this profile on ' + $config.projectName + '!'" />
  </Head>

  <div v-if="isLoading" class="loading-image">
    <img src="/img/sgb-chat-logo-2.png" class="loading-spinner" /> 
  </div>
  <PunkProfile class="mt-1" />
</template>

<script>
import PunkProfile from '~/components/profile/PunkProfile.vue'

import { ref, onMounted } from 'vue'

export default {
  name: "Profile",

  components: {
    PunkProfile
  },

  setup() {
    const isLoading = ref(true);
     onMounted(() => { isLoading.value = false; });

     return { isLoading }
  }
}
</script>
