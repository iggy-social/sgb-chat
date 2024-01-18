<template>
  <Head>
    <Title>Tipping notifications | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'Tipping notifications | ' + $config.projectMetadataTitle" />
  </Head>

  <ChatFeed 
    class="mt-1" 
    :showQuotedPost="$config.showRepliesOnHomepage" 
    :allPosts="true" 
    :hideCommentBox="true"
    orbisContext="kjzl6cwe1jw1493qasw7loj0hnijraw3n5sruvcxm3eero75xvfd880r0dn7k0r" 
  />
</template>

<script>
import { useEthers } from 'vue-dapp'
import ChatFeed from "../components/chat/ChatFeed.vue"

export default {
  name: "tipalerts",

  components: {
    ChatFeed
  },

  computed: {
    getOrbisContext() {
      if (this.$config.orbisTest) {
        return this.$config.orbisTestContext;
      } else {
        return this.$config.orbisContext;
      }
    }
  },

  setup() {
    const { address, chainId } = useEthers()

    return { address, chainId }
  }
}
</script>