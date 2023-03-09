<template>
  <Head>
    <Meta name="description" :content="'Check out this chat post on ' + $config.projectName + '!'" />
    <Meta property="og:image" :content="$config.projectUrl+$config.previewImagePost" />
    <Meta name="twitter:image" :content="$config.projectUrl+$config.previewImagePost" />
  </Head>

  <!-- TODO: show component based on the chat type selection (Alien, Forum, smth else) -->
  <AlienChatPost v-if="post" :post="post" />

  <AlienChat v-if="post" :id="post.stream_id" />
</template>

<script>
import AlienChatPost from "~~/components/chat/alien/AlienChatPost.vue";
import AlienChat from "~~/components/chat/alien/AlienChat.vue";
import { useToast } from "vue-toastification/dist/index.mjs";

export default {
  data() {
    return {
      post: null
    }
  },

  components: {
    AlienChat,
    AlienChatPost
  },

  created() {
    this.getPostObject();
  },

  computed: {
    getPostAuthor() {
      if (this.post) {
        return this.post.creator_details.metadata.address;
      }

      return null;
    }
  },

  methods: {
    async getPostObject() {
      let { data, error } = await this.$orbis.getPost(this.route.query.id);

      //console.log("data:")
      //console.log(data)

      this.post = data;

      if (error) {
        console.log("Orbis error");
        console.log(error)
        this.toast("Orbis error", {type: "error"});
        this.toast(error, {type: "error"});
      }
    }
  },

  setup() {
    const route = useRoute();
    const toast = useToast();

    return {
      route,
      toast
    }
  },
}
</script>