<template>
  <div class="scroll-500">
    <div class="card mb-2 border" v-if="!hideCommentBox">
      <div class="card-body">
        <div class="form-group mt-2 mb-2">
          <textarea 
            v-model="postText" 
            :disabled="!userStore.getIsConnectedToOrbis || !isSupportedChain || !hasDomainOrNotRequired" 
            class="form-control" id="exampleTextarea" rows="5" 
            :placeholder="createPostPlaceholder"
          ></textarea>
        </div>

        <div class="d-flex justify-content-between">
          <div>
            <!-- GIF button -->
            <TenorGifSearch 
              v-if="$config.tenorApiKey != '' && isActivated && userStore.getIsConnectedToOrbis && isSupportedChain && hasDomainOrNotRequired"  
              @insertGif="insertImage"
            />

            <!-- Sticker button 
            <TenorStickerSearch 
              v-if="$config.tenorApiKey != '' && isActivated && userStore.getIsConnectedToOrbis && isSupportedChain && hasDomainOrNotRequired"  
              @insertSticker="insertImage"
            />
            -->

            <!-- Upload IMG button -->
            <Web3StorageImageUpload 
              v-if="isActivated && $config.web3storageKey !== '' && userStore.getIsConnectedToOrbis && isSupportedChain && hasDomainOrNotRequired"  
              @insertImage="insertImage"
              buttonText="IMG"
              cls="btn btn-outline-primary me-2 mt-2"
            />
          </div>
          
          <div>
            <!-- Create Post button -->
            <button 
              v-if="isActivated && userStore.getIsConnectedToOrbis && isSupportedChain && hasDomainOrNotRequired" 
              :disabled="!postText || waitingCreatePost" 
              class="btn btn-primary me-2 mt-2" 
              @click="createPost"
            >Submit</button>

            <!-- Sign Into Chat button -->
            <button 
              v-if="isActivated && !userStore.getIsConnectedToOrbis && isSupportedChain && hasDomainOrNotRequired" 
              class="btn btn-primary" @click="connectToOrbis"
            >Sign into chat</button>

            <!-- Get Username button -->
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
      </div>
    </div>

    <div class="d-flex justify-content-end mb-2">
      <div class="btn-group">
        <button class="btn btn-outline-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          {{ getSelectedTagObject.title }}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <span 
            v-for="(tagObject, index) in $config.orbisCategories"
            :key="tagObject.slug"
            class="dropdown-item cursor-pointer"
            @click="changeTag(index)"
          >{{ tagObject.title }}</span>
        </ul>
      </div>
    </div>

    <div v-if="orbisPosts">
      <ChatPost 
        @insertReply="insertReply" 
        @removePost="removePost" 
        v-for="post in orbisPosts" 
        :key="post.stream_id"
        :showQuotedPost="showQuotedPost" 
        :post="post" />
    </div>

    <div class="d-flex justify-content-center mb-3" v-if="waitingLoadPosts">
      <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
    </div>
    
    <div class="d-grid gap-2 col-6 mx-auto mb-5" v-if="showLoadMore">
      <button class="btn btn-primary" type="button" @click="getOrbisPosts">Load more posts</button>
    </div>
  </div>
</template>

<script>
import { useEthers } from 'vue-dapp';
import ChatPost from "~/components/chat/ChatPost.vue";
import { useToast } from "vue-toastification/dist/index.mjs";
import { useChatStore } from '~/store/chat';
import { useSiteStore } from '~/store/site';
import { useUserStore } from '~/store/user';
import ConnectWalletButton from "~/components/ConnectWalletButton.vue";
import SwitchChainButton from "~/components/SwitchChainButton.vue";
import TenorGifSearch from "~/components/tenor/TenorGifSearch.vue";
import TenorStickerSearch from "~/components/tenor/TenorStickerSearch.vue";
import Web3StorageImageUpload from "~/components/storage/Web3StorageImageUpload.vue";

export default {
  name: "ChatFeed",
  props: [
    "byDid", // if looking for posts by a specific user (user's DID)
    "hideCommentBox", // if true, we'll hide the comment box
    "id", // id (optional) is the post id that this component looks for replies to
    "master", // master stream ID, if there's a master post, we'll show it at the top
    "masterPost", // master post object (if it exists)
    "showQuotedPost" // if true, we'll show the quoted posts (for any post that has a quote)
  ],

  components: {
    ChatPost,
    ConnectWalletButton,
    SwitchChainButton,
    TenorGifSearch,
    TenorStickerSearch,
    Web3StorageImageUpload
  },

  data() {
    return {
      orbisPosts: [],
      pageCounter: 0,
      postText: null,
      reply_to: null, 
      showLoadMore: true,
      waitingCreatePost: false,
      waitingLoadPosts: false
    }
  },

  created() {
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

    getSelectedTagObject() {
      if (this.chatStore.getSelectedTagIndex > 0 && this.chatStore.getSelectedTagIndex < this.$config.orbisCategories.length) {
        return this.$config.orbisCategories[this.chatStore.getSelectedTagIndex];
      } else {
        return this.$config.orbisCategories[0];
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

    showOnlyMasterPosts() {
      // check if user chose to only show master posts on the main feed in local storage
      if (this.siteStore.getShowOnlyMasterPosts === 'true') {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {
    changeTag(index) {
      this.chatStore.setSelectedTagIndex(index);

      // reset posts and page counter
      this.orbisPosts = [];
      this.pageCounter = 0;

      // fetch posts
      this.getOrbisPosts();
    },

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
      this.waitingCreatePost = true;

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

        // if post has tags, add them to the options
        if (this.masterPost?.content?.tags) {
          options["tags"] = this.masterPost.content.tags;
        } else {
          options["tags"] = [this.$config.orbisCategories[1]]; // default to "General" tag
        }

      } else {
        options = {
          body: this.postText, 
          context: this.getOrbisContext
        }

        // add tags
        if (this.chatStore.getSelectedTagIndex > 0 && this.chatStore.getSelectedTagIndex < this.$config.orbisCategories.length) {
          options["tags"] = [this.$config.orbisCategories[this.chatStore.getSelectedTagIndex]];
        } else {
          options["tags"] = [this.$config.orbisCategories[1]]; // default to "General" tag
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
        this.waitingCreatePost = false;
      } else {
        console.log("Error posting via Orbis to Ceramic: ", res);
        this.toast(res.result, {type: "error"});
        this.waitingCreatePost = false;
      }
    },

    async getOrbisPosts() {
      this.waitingLoadPosts = true;

      let ascending = false; // sort by descending order (from newest to oldest) by default
      let options;

      if (this.id) {
        // Post details page
        ascending = true; // if this is a post details page, sort replies by ascending order (from oldest to newest)

        options = {
          master: this.id, // master is the post ID
          context: this.getOrbisContext, // context is the group ID
          only_master: false // only get master posts (not replies), or all posts
        }
      } else {
        // Main feed
        options = {
          //algorithm: "recommendations", // recommendations, all-posts, all-posts-non-filtered
          context: this.getOrbisContext, // context is the group ID
          only_master: this.showOnlyMasterPosts // only get master posts (not replies), or all posts
        }
      }

      if (this.byDid) {
        options["did"] = this.byDid;
        options["only_master"] = false;
      }

      // search by tag (unless it's all posts)
      if (this.chatStore.getSelectedTagIndex > 0 && this.chatStore.getSelectedTagIndex < this.$config.orbisCategories.length) {
        options["tag"] = this.$config.orbisCategories[this.chatStore.getSelectedTagIndex].slug;
      }

      let { data, error } = await this.$orbis.getPosts(
        options,
        this.pageCounter,
        this.$config.getPostsLimit,
        ascending
      );

      if (error) {
        this.toast("Error fetching posts from the Orbis/Ceramic node.", {type: "error"});
        console.log(error);
        //this.toast(error, {type: "error"});
      }

      //console.log("data:");
      //console.log(data);

      if (data.length < this.$config.getPostsLimit) {
        this.showLoadMore = false; // hide Load More Posts button if there's less than getPostsLimit number of posts received
      } else if (data.length === this.$config.getPostsLimit) {
        this.showLoadMore = true; // show Load More Posts button if data length was full (getPostsLimit number of posts)
      }

      this.orbisPosts.push(...data);

      this.pageCounter++;

      this.waitingLoadPosts = false;
    },

    async insertImage(imageUrl) {
      // add image url to postText
      if (!this.postText) {
        this.postText = imageUrl + " ";
      } else {
        this.postText = this.postText + " " + imageUrl + " ";
      }
    },

    async insertReply(streamId, replyToId, replyText, repliedText, repliedAddress) {
      // callback hook for ChatPost component
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
      // callback hook for ChatPost component
      // listens for delete event and removes post from feed
      this.orbisPosts = this.orbisPosts.filter((p) => p.stream_id !== streamId);
    }
  },

  setup() {
    const { address, chainId, isActivated, signer } = useEthers();
    const toast = useToast();
    const chatStore = useChatStore();
    const siteStore = useSiteStore();
    const userStore = useUserStore();

    return { address, chainId, isActivated, signer, toast, chatStore, siteStore, userStore }
  },
}
</script>
