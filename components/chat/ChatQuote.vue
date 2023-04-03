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
      <div v-if="post.body" @click="openPostDetails">
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

      <div v-if="!post.body">
        <p class="card-text"><small><em>(deleted)</em></small></p>
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
  name: "ChatQuote",
  props: ["post"], // quote post: body, stream_id, pfp, username, address

  components: {
    ProfileImage
  },

  data() {
    return {
      authorAddress: null,
      authorDomain: null,
      parsedText: null,
      postLengthLimit: 300,
      showFullText: false
    }
  },

  created() {
    if (this.post.address) {
      this.fetchAuthorDomain();
    }

    this.parsePostText();
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
      let postText = this.post.body;

      postText = sanitizeHtml(postText, {
        allowedTags: [ 'li', 'ul', 'ol', 'br', 'em', 'strong', 'i', 'b' ],
        allowedAttributes: {}
      });

      postText = this.imgParsing(postText);
      postText = this.imgWithoutExtensionParsing(postText);
      postText = this.youtubeParsing(postText);
      postText = this.urlParsing(postText);

      this.parsedText = postText.replace(/(\r\n|\n|\r)/gm, "<br/>");
    },

    imgParsing(text) {
      const imageRegex = /(?:https?:\/\/(?:www\.)?)?(?:[-\w]+\.)+[^\s]+\.(?:jpe?g|gif|png)/gi;
      //const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;

      if (!imageRegex.test(text)) { return text };

      return text.replace(imageRegex, function(url) {
        return '<img class="img-fluid rounded" src="' + url + '" />';
      })
    },

    imgWithoutExtensionParsing(text) {
      // if image doesn't have an extension, it won't be parsed by imgParsing
      // so we need to parse it here
      // but image link needs to end with "?img" to be parsed (otherwise frontend will think it's a link)
      const imageRegex = /(http|https|ipfs):\/\/\S+\?img/;

      if (!imageRegex.test(text)) { return text };

      return text.replace(imageRegex, function(url) {
        return '<img class="img-fluid rounded" src="' + url + '" />';
      })
    },

    urlParsing(text) {
      let urlRegex;

      try {
        urlRegex = new RegExp('(https?:\\/\\/(?!.*\\.(jpg|png|jpeg|gif|pdf|docx))[^\\s]+)(?<![,.:;?!\\-\\"\')])', 'g');
      } catch (error) {
        // fallback to simplified regex (without lookbehinds) in case of an old browser or Safari
        urlRegex = /(https?:\/\/(?!.*\.(jpg|png|jpeg|gif|pdf|docx))[^\s]+)/g;
      }

      if (!urlRegex.test(text)) { return text };

      return text.replace(urlRegex, function(url) {
        if (url.startsWith("https://www.youtube.com/embed/")) {
          // ignore youtube embeds
          return url;
        }

        return '<a target="_blank" href="' + url + '">' + url + '</a>';
      })
    },

    youtubeParsing(text) {
      const ytRegex = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/g;

      if (!ytRegex.test(text)) { return text };

      return text.replace(ytRegex, function(url) {
        const videoId = url.match(/(?:https?:\/\/)?(?:www\.|m\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\/?\?v=|\/embed\/|\/)([^\s&\?\/\#]+)/)[1];

        return "<iframe class='rounded' width='100%' height='315' src='https://www.youtube.com/embed/" + videoId + "' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>";
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