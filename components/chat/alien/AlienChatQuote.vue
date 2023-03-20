<template>
<div class="card mb-3 border" v-if="post">
  <div class="card-body row">
    <div class="col-2 col-md-1">
      <NuxtLink :to="'/profile/?id='+authorDomain">
        <ProfileImage 
          class="img-fluid rounded-circle"
          :address="authorAddress" 
          :domain="authorDomain"
          :image="getOrbisImage"
        />
      </NuxtLink>
    </div>

    <div class="col-10 col-md-11">
      
      <!-- post author and timestamp -->
      <p class="card-subtitle mb-1 text-muted">
        <NuxtLink v-if="authorDomain" class="link-without-color hover-color" :to="'/profile/?id='+authorDomain">{{showDomainOrAddressOrAnon}}</NuxtLink>
        <span v-if="!authorDomain">{{showDomainOrAddressOrAnon}}</span>
      </p>

      <!-- post text -->
      <div @click="openPostDetails">
        <p
          v-if="parsedText.length > postLengthLimit && !showFullText"
        >
          <span 
            
            class="card-text" 
            v-html="parsedText.substring(0, postLengthLimit) + ' ... '">
          </span>
          <span class="cursor-pointer hover-color" @click="showFullText = true">Read more</span>
        </p>

        <p v-if="parsedText.length < postLengthLimit || showFullText" class="card-text" v-html="parsedText"></p>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import { ethers } from 'ethers';
import sanitizeHtml from 'sanitize-html';
import { useEthers, shortenAddress } from 'vue-dapp';
import ResolverAbi from "~/assets/abi/ResolverAbi.json";
import resolvers from "~/assets/data/resolvers.json";
import { useUserStore } from '~/store/user';
import ProfileImage from "~/components/profile/ProfileImage.vue";

export default {
  name: "AlienChatQuote",
  props: ["post"], // quote post: body, stream_id, pfp, username, address

  components: {
    ProfileImage
  },

  data() {
    return {
      authorAddress: null,
      authorDomain: null,
      parsedText: null,
      postLengthLimit: 550,
      showFullText: false
    }
  },

  created() {
    if (this.post.address) {
      this.fetchAuthorDomain();
    }

    this.parsePostText();

    console.log(this.post);
  },

  computed: {
    getOrbisImage() {
      if (this.post.pfp) {
        return this.post.pfp;
      }

      return null;
    },

    showDomainOrAddressOrAnon() {
      if (this.authorDomain) {
        return this.authorDomain;
      } else if (this.post.address) {
        return this.shortenAddress(this.post.address);
      } else {
        return "Anon";
      }
    },
  },

  methods: {
    async fetchAuthorDomain() {
      // find out if post author has a domain name
      this.authorAddress = this.post.address;

      if (this.authorAddress) {
        // check session storage if author's domain is already stored
        const storedDomain = sessionStorage.getItem(String(this.authorAddress).toLowerCase());

        if (storedDomain) {
          this.authorDomain = storedDomain;
        } else {
          // fetch provider from hardcoded RPCs
          let provider = this.$getFallbackProvider(this.$config.supportedChainId);

          if (this.isActivated && this.chainId === this.$config.supportedChainId) {
            // fetch provider from user's MetaMask
            provider = this.signer;
          }

          const contract = new ethers.Contract(resolvers[this.$config.supportedChainId], ResolverAbi, provider);

          // get author's default domain
          const domainName = await contract.getDefaultDomain(
            String(this.authorAddress).toLowerCase(), 
            String(this.$config.tldName).toLowerCase()
          );

          if (domainName) {
            this.authorDomain = domainName + this.$config.tldName;
            sessionStorage.setItem(String(this.authorAddress).toLowerCase(), this.authorDomain);
          } 
        }
      }
    },

    openPostDetails() {
      this.$router.push({ name: 'post', query: { id: this.post.stream_id } });
    },

    parsePostText() {
      let postText = this.post.body.replace(/(\r\n|\n|\r)/gm, "<br/>");

      postText = sanitizeHtml(postText, {
        allowedTags: [ 'li', 'ul', 'ol', 'br', 'em', 'strong', 'i', 'b' ],
        allowedAttributes: {}
      });

      postText = this.imgParsing(postText);
      this.parsedText = this.urlParsing(postText);
    },

    imgParsing(text) {
      const urlRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;

      if (!urlRegex.test(text)) { return text };

      return text.replace(urlRegex, function(url) {
        return '<br/><img class="my-3 img-fluid rounded" src="' + url + '" /><br/>';
      })
    },

    urlParsing(text) {
      const urlRegex = /(https?:\/\/(?!.*\.(jpg|png|jpeg|gif|pdf|docx))[^\s]+)/g;

      if (!urlRegex.test(text)) { return text };

      return text.replace(urlRegex, function(url) {
        return '<a target="_blank" href="' + url + '">' + url + '</a>';
      })
    },
  },

  setup() {
    const route = useRoute();
    const { address, chainId, isActivated, signer } = useEthers();
    const userStore = useUserStore();

    return { address, chainId, isActivated, route, shortenAddress, signer, userStore }
  },
}
</script>