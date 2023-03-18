<template>
  <div class="container-md">
    <div class="row">
      <div class="col-lg-12 scroll-500">

        <div class="card mb-3 border">
          <div class="card-body">
            <div class="form-group mt-2 mb-2">
              <textarea 
                v-model="postText" 
                :disabled="!userStore.getIsConnectedToOrbis || !isSupportedChain || !hasDomainOrNotRequired" 
                class="form-control" id="exampleTextarea" rows="5" 
                :placeholder="createPostPlaceholder"
              ></textarea>
            </div>

            <!-- Create Post button -->
            <button 
              v-if="isActivated && userStore.getIsConnectedToOrbis && isSupportedChain && hasDomainOrNotRequired" 
              :disabled="!postText" 
              class="btn btn-primary" 
              @click="createPost"
            >Submit</button>

            <!-- GIF button -->
            <TenorGifSearch 
              v-if="$config.tenorApiKey != '' && isActivated && userStore.getIsConnectedToOrbis && isSupportedChain && hasDomainOrNotRequired"  
              @insertGif="insertGif"
              />

            <!-- Sign Into Chat button -->
            <button 
              v-if="isActivated && !userStore.getIsConnectedToOrbis && isSupportedChain && hasDomainOrNotRequired" 
              class="btn btn-primary" @click="connectToOrbis"
            >Sign into chat</button>

            <!-- Sign Into Chat button -->
            <button 
              v-if="isActivated && isSupportedChain && !hasDomainOrNotRequired" 
              class="btn btn-primary disabled"
            >Get yourself a {{ $config.tldName }} name to post <i class="bi bi-arrow-right"></i></button>
            
            <!-- Connect Wallet button -->
            <ConnectWalletButton v-if="!isActivated" class="btn btn-primary" btnText="Connect wallet" />

            <!-- Switch Chain button -->
            <SwitchChainButton v-if="isActivated && !isSupportedChain" :navbar="false" :dropdown="false" />
          </div>
        </div>

        <div v-if="orbisPosts">
          <AlienChatPost @insertReply="insertReply" @removePost="removePost" v-for="post in orbisPosts" :key="post.stream_id" :post="post" />
        </div>

        <div class="d-grid gap-2 col-6 mx-auto mb-5" v-if="showLoadMore">
          <button class="btn btn-primary" type="button" @click="getOrbisPosts">Load more posts</button>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
import { useEthers } from 'vue-dapp';
import AlienChatPost from "~~/components/chat/alien/AlienChatPost.vue";
import { useToast } from "vue-toastification/dist/index.mjs";
import { useUserStore } from '~/store/user';
import ConnectWalletButton from "~/components/ConnectWalletButton.vue";
import SwitchChainButton from "~/components/SwitchChainButton.vue";
import TenorGifSearch from "~/components/TenorGifSearch.vue";

export default {
  name: "AlienChat",
  props: ["id", "master"],

  components: {
    AlienChatPost,
    ConnectWalletButton,
    SwitchChainButton,
    TenorGifSearch
  },

  data() {
    return {
      orbisPosts: [],
      pageCounter: 0,
      postText: null,
      reply_to: null, 
      showLoadMore: true
    }
  },

  mounted() {
    this.checkConnectionToOrbis();
    this.getOrbisPosts();
  },

  computed: {
    createPostPlaceholder() {
      if (this.userStore.getIsConnectedToOrbis) {
        if (this.id) {
          return "Post your reply"
        }
        return "What's happening?"
      } else if (!this.isActivated) {
        return "What's happening? (Please connect wallet and then sign into chat to post messages.)"
      } else {
        return "What's happening? (Please sign into chat to post messages.)"
      }
    },

    getOrbisContext() {
      if (this.$config.orbisTest) {
        return this.$config.orbisTestContext;
      } else {
        return this.$config.orbisContext;
      }
    },

    hasDomainOrNotRequired() {
      if (this.$config.domainRequiredToPost) {
        if (this.userStore.getDefaultDomain) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },

    isSupportedChain() {
      if (this.chainId === this.$config.supportedChainId) {
        return true;
      } else {
        return false;
      }
    },
  },

  methods: {
    async checkConnectionToOrbis() {
      const isConn = await this.$orbis.isConnected();
      this.userStore.setIsConnectedToOrbis(isConn);

      if (this.$orbis.session) {
        this.userStore.setDid(this.$orbis.session.did._id);
        this.userStore.setDidParent(this.$orbis.session.did._parentId);
      }
    },

    async connectToOrbis() {
      let res = await this.$orbis.connect_v2({
        provider: this.signer.provider.provider, 
        lit: false
      });

      /** Check if connection is successful or not */
      if(res.status == 200) {
        this.userStore.setIsConnectedToOrbis(true);

        if (this.$orbis.session) {
          this.userStore.setDid(this.$orbis.session.did._id);
          this.userStore.setDidParent(this.$orbis.session.did._parentId);
        }
      } else {
        console.log("Error connecting to Ceramic: ", res);
        this.toast(res.result, {type: "error"});
      }
    },

    async createPost() {
      let options;

      if (this.id) {
        let masterId;

        if (this.master) {
          masterId = this.master;
        } else {
          masterId = this.id;
        }

        options = {
          master: masterId, // the main post in the thread
          reply_to: this.id, // important: reply_to needs to be filled out even if the reply is directly to the master post
          body: this.postText, 
          context: this.getOrbisContext
        }
      } else {
        options = {
          body: this.postText, 
          context: this.getOrbisContext
        }
      }

      // post on Orbis & Ceramic
      let res = await this.$orbis.createPost(options);

      /** Check if posting is successful or not */
      if(res.status == 200) {
        // post on current feed
        this.orbisPosts.unshift({
          stream_id: res.doc,
          count_likes: 0,
          timestamp: Math.floor(Date.now() / 1000),
          creator_details: {
            metadata: {
              address: this.address
            },
            profile: {
              pfp: this.userStore.getOrbisImage
            }
          },
          master: this.id,
          reply_to: this.id,
          content: {
            body: this.postText
          }
        });

        this.postText = null;
      } else {
        console.log("Error posting via Orbis to Ceramic: ", res);
        this.toast(res.result, {type: "error"});
      }
    },

    async getOrbisPosts() {
      let options;

      if (this.id) {
        options = {
          master: this.id, // master is the post ID
          context: this.getOrbisContext, // context is the group ID
          only_master: false // only get master posts (not replies)
        }
      } else {
        options = {
          context: this.getOrbisContext, // context is the group ID
          only_master: true // only get master posts (not replies)
        }
      }

      let { data, error } = await this.$orbis.getPosts(
        options,
        this.pageCounter
      );

      if (error) {
        this.toast("Error fetching posts from the Orbis/Ceramic node.", {type: "error"});
        console.log(error);
        //this.toast(error, {type: "error"});
      }

      //console.log("data:");
      //console.log(data);

      if (data.length < 50) {
        this.showLoadMore = false; // hide Load More Posts button if there's less than 50 posts received
      } else if (data.length === 50) {
        this.showLoadMore = true; // show Load More Posts button if data length was full (50 posts)
      }

      this.orbisPosts.push(...data);

      this.pageCounter++;
    },

    async insertGif(gifImage) {
      // add gifImage string to postText
      if (!this.postText) {
        this.postText = gifImage + " ";
      } else {
        this.postText = this.postText + " " + gifImage + " ";
      }
    },

    async insertReply(streamId, replyToId, replyText, repliedText, repliedAddress) {
      // callback hook for AlienChatPost component
      // listens for reply event and inserts reply into feed
      this.orbisPosts.unshift({
        stream_id: streamId,
        count_likes: 0,
        timestamp: Math.floor(Date.now() / 1000),
        creator_details: {
          metadata: {
            address: this.address
          },
          profile: {
            pfp: this.userStore.getOrbisImage
          }
        },
        master: this.id,
        reply_to: replyToId, // the post/stream ID of the post being replied to
        content: {
          body: replyText // the text of the reply
        },
        reply_to_details: {
          body: repliedText // the text of the post being replied to
        },
        reply_to_creator_details: {
          metadata: {
            address: repliedAddress // the author address of the post being replied to
          }
        }
      });
    },

    async removePost(streamId) {
      // callback hook for AlienChatPost component
      // listens for delete event and removes post from feed
      this.orbisPosts = this.orbisPosts.filter((post) => post.stream_id !== streamId);
    }
  },

  setup() {
    const { address, chainId, isActivated, signer } = useEthers();
    const toast = useToast();
    const userStore = useUserStore();

    return { address, chainId, isActivated, signer, toast, userStore }
  },
}
</script>
