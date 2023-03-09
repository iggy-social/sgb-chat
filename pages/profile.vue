<template>
  <Head>
    <Meta name="description" :content="'Check out this profile on ' + $config.projectName + '!'" />
    <Meta property="og:image" :content="$config.projectUrl+$config.previewImageProfile" />
    <Meta name="twitter:image" :content="$config.projectUrl+$config.previewImageProfile" />
  </Head>

  <PunkProfile class="mt-1" />
</template>

<script>
import PunkProfile from '~/components/profile/PunkProfile.vue'

export default {
  name: "Profile",

  components: {
    PunkProfile
  },

  setup() {

  }
}
</script>
