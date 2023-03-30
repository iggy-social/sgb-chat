<template>
<div class="card mb-3 border">
  <div class="card-body row">
    <div class="col-2 col-md-1">
      <NuxtLink :to="'/profile/?id='+getUsernameOrAddress">
        <ProfileImage 
          class="img-fluid rounded-circle"
          :address="authorAddress" 
          :domain="authorDomain"
          :image="authorImage"
          :key="authorAddress"
        />
      </NuxtLink>
    </div>
    
    <div class="col-10 col-md-11">
      <p class="mt-0 link-without-color">
        <NuxtLink class="link-without-color hover-color" :to="'/profile/?id='+getUsernameOrAddress">
          {{ getUsernameOrShortAddress }}
        </NuxtLink>
        
        {{ getNotificationAction }}
      </p>

      <p class="mb-0 cursor-pointer" @click="openPostDetails">
        {{ getNotificationContent }}
      </p>
    </div>
  </div>
</div>
</template>

<script>
import { shortenAddress } from 'vue-dapp';
import ProfileImage from '../profile/ProfileImage.vue';

export default {
  name: 'OrbisNotification',
  props: ['notification'],

  components: {
    ProfileImage
  },

  data() {
    return {
      authorAddress: null,
      authorDomain: null,
      authorImage: null,
      lengthLimit: 150
    }
  },

  mounted() {
    if (this.notification) {
      console.log(this.notification);

      this.authorAddress = this.notification["user_notifiying_details"]["did"].split(":")[4];

      // get username from session storage
      this.authorDomain = sessionStorage.getItem(String(this.authorAddress).toLowerCase());

      if (!this.authorDomain && this.notification["user_notifiying_details"]?.profile?.username) {
        this.authorDomain = this.notification["user_notifiying_details"]["profile"]["username"];
      }

      // get image from session storage
      this.authorImage = sessionStorage.getItem(String(this.authorAddress).toLowerCase()+"-img");

      if (!this.authorImage && this.notification["user_notifiying_details"]?.profile?.pfp) {
        this.authorImage = this.notification["user_notifiying_details"]["profile"]["pfp"];
      }
    }
  },

  computed: {
    getNotificationAction() {
      if (this.notification.family === "reply_to") {
        return " replied to your post";
      }
    },

    getNotificationContent() {
      if (this.notification?.content?.body) {
        const content = this.notification["content"]["body"];

        if (content.length > this.lengthLimit) {
          return content.substring(0, this.lengthLimit) + "...";
        } else {
          return content;
        }
      }

      return "";
    },

    getPostStreamId() {
      if (this.notification.family === "reply_to") {
        if (this.notification?.post_details?.stream_id) {
          return this.notification["post_details"]["stream_id"];
        }
      }

      return null;
    },

    getUsernameOrAddress() {
      if (this.authorDomain) {
        return this.authorDomain;
      } else {
        return this.authorAddress;
      }
    },

    getUsernameOrShortAddress() {
      if (this.notification) {
        if (this.notification["user_notifiying_details"]?.profile?.username) {
          this.authorDomain = this.notification["user_notifiying_details"]["profile"]["username"];
          return this.authorDomain;
        } else {
          this.authorAddress = this.notification["user_notifiying_details"]["did"].split(":")[4];
          // get username from session storage
          this.authorDomain = sessionStorage.getItem(String(this.authorAddress).toLowerCase());

          if (this.authorDomain) {
            return this.authorDomain;
          } else {
            return shortenAddress(this.authorAddress);
          }
        }
      }
    }
  },

  methods: {
    openPostDetails() {
      this.$router.push({ name: 'post', query: { id: this.getPostStreamId } });
    },
  },

  setup() {
    return { shortenAddress }
  }
}
</script>