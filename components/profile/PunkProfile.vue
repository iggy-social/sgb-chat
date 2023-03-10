<template>
  <div class="card border">
    <div class="card-body">
      <p class="fs-3" @click="$router.back()">
        <i class="bi bi-arrow-left-circle cursor-pointer"></i>
      </p>

      <h3 class="mb-3 mt-3">{{ domain }}</h3>

      <ProfileImage :key="orbisImage" v-if="uAddress" class="img-fluid img-thumbnail rounded-circle w-25" :address="uAddress" :domain="domain" :image="orbisImage" />

      <div class="mt-2">
        <button 
          v-if="isCurrentUser"
          :disabled="waitingDataLoad" 
          class="btn btn-primary mt-2 me-2" data-bs-toggle="modal" data-bs-target="#changeImageModal"
        >
          <span v-if="waitingDataLoad" class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
          Change image
        </button>

        <a v-if="uAddress" class="btn btn-outline-primary mt-2 me-2" :href="$config.blockExplorerBaseUrl+'/address/'+uAddress" target="_blank">
          {{ shortenAddress(uAddress) }} <i class="bi bi-box-arrow-up-right"></i>
        </a>

        <button class="btn btn-outline-primary mt-2 disabled">{{ balanceEth }} {{ $config.tokenSymbol }}</button>
      </div>

      <!--
      <p class="text-break mt-3">Followers: {{ followers }}</p>
      <p class="text-break mt-3">Following: {{ following }}</p>
      -->
    </div>

    <!-- Change Image Modal -->
    <div class="modal fade" id="changeImageModal" tabindex="-1" aria-labelledby="changeImageModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="changeImageModalLabel">Change image</h1>
            <button type="button" id="changeImageModalClose" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

            <div v-if="!userStore.getIsConnectedToOrbis">
              <p>First connect to Ceramic to change the profile picture:</p>

              <button class="btn btn-primary" @click="connectToOrbis">Connect to Ceramic</button>
            </div>
            
            <div class="mt-3" v-if="userStore.getIsConnectedToOrbis">
            Enter the new image URL (use a square image):

            <input v-model="newImageLink" type="text" class="form-control mt-2" placeholder="Enter image link" />
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="changeImage" :disabled="!userStore.getIsConnectedToOrbis">
              <span v-if="waitingImageUpdate" class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
              Submit changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- END Change Image Modal -->

  </div>
</template>

<script>
import { useEthers, shortenAddress } from 'vue-dapp';
import { ethers } from 'ethers';
import { useUserStore } from '~/store/user';
import { useToast } from "vue-toastification/dist/index.mjs";
import ProfileImage from "~/components/profile/ProfileImage.vue";
import ResolverAbi from "~/assets/abi/ResolverAbi.json";
import resolvers from "~/assets/data/resolvers.json";

export default {
  name: "PunkProfile",
  props: ["pAddress", "pDomain"],

  data() {
    return {
      domain: this.pDomain,
      followers: 0,
      following: 0,
      lastActivityTimestamp: null,
      newImageLink: null,
      orbisImage: null,
      orbisProfile: null,
      uAddress: this.pAddress,
      uBalance: 0,
      waitingDataLoad: false,
      waitingImageUpdate: false
    }
  },

  components: {
    ProfileImage
  },

  created() {
    // if uAddress and/or domain is not provided via props, then find it yourself
    if (!this.pAddress || !this.pDomain) {
      this.fetchAddressAndDomain();
    }

    this.checkConnectionToOrbis();
  },

  computed: {
    balanceEth() {
      const bal = ethers.utils.formatEther(this.uBalance);

      if (bal > 0) {
        return Number(bal).toFixed(2)
      } else {
        return Number(bal).toFixed(4)
      }
    },

    isCurrentUser() {
      return String(this.uAddress).toLowerCase() === String(this.address).toLowerCase();
    },
  },

  methods: {
    async changeImage() {
      if (this.userStore.getIsConnectedToOrbis) {
        this.waitingImageUpdate = true;

        if (!this.orbisProfile) {
          this.orbisProfile = {
            pfp: "",
            username: ""
          };
        }

        this.orbisProfile.pfp = this.newImageLink;

        if (!this.orbisProfile.username && this.domain) {
          this.orbisProfile.username = this.domain;
        }

        const res = await this.$orbis.updateProfile(this.orbisProfile);

        /** Check if request is successful or not */
        if (res.status !== 200) { // unsuccessful
          console.log("Error: ", res);
          this.toast(res.result, {type: "error"});
          this.waitingImageUpdate = false;
        } else { // successful
          this.orbisImage = this.newImageLink;
          this.userStore.setOrbisImage(this.newImageLink);
          sessionStorage.setItem(String(this.address).toLowerCase()+"-img", this.newImageLink);
          this.toast("Image successfully updated!", {type: "success"});
          this.waitingImageUpdate = false;
          document.getElementById('changeImageModalClose').click();
        }
      } else {
        this.toast("Please connect to chat first", {type: "error"});
      }
    },

    async checkConnectionToOrbis() {
      let res = await this.$orbis.isConnected();

      if (res) {
        this.userStore.setIsConnectedToOrbis(true);

        if (this.$orbis.session && !this.userStore.getDid) {
          this.userStore.setDid(this.$orbis.session.did._id);
          this.userStore.setDidParent(this.$orbis.session.did._parentId);
        }
      } else {
        this.userStore.setIsConnectedToOrbis(false);
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

    async fetchAddressAndDomain() {
      this.waitingDataLoad = true;

      // see if id is in the URL query and figure out whether it is a domain or uAddress
      if (this.$route.query.id) {
        const id = this.$route.query.id;

        if (id.includes(".")) {
          this.domain = id; // domain
        } else {
          this.uAddress = id; // address
        }
      } else {
        // if no id is provided, then use the user's address
        this.uAddress = this.address;
      }

      // if domain is not provided, check session storage
      if (!this.domain && this.uAddress) {
        this.domain = window.sessionStorage.getItem(String(this.uAddress).toLowerCase());
      }

      // set contract
      let provider = this.$getFallbackProvider(this.$config.supportedChainId);

      if (this.isActivated && this.chainId === this.$config.supportedChainId) {
        // fetch provider from user's wallet
        provider = this.signer;
      }

      const contract = new ethers.Contract(resolvers[this.$config.supportedChainId], ResolverAbi, provider);

      // if domain is not provided, then fetch it
      if (!this.domain && this.uAddress) {
        const domainName = await contract.getDefaultDomain(
          String(this.uAddress).toLowerCase(), 
          String(this.$config.tldName).toLowerCase()
        );

        if (domainName) {
          this.domain = domainName + this.$config.tldName;
          window.sessionStorage.setItem(String(this.uAddress).toLowerCase(), this.domain);
        } 
      }

      if (this.domain && !this.uAddress) {
        const domainHolder = await contract.getDomainHolder(
          String(this.domain).toLowerCase().split(".")[0], 
          String(this.$config.tldName).toLowerCase()
        );

        if (domainHolder !== ethers.constants.AddressZero) {
          this.uAddress = domainHolder;
        }

        window.sessionStorage.setItem(String(this.uAddress).toLowerCase(), this.domain);
      }

      await this.fetchOrbisProfile();
      await this.fetchBalance();
    },

    async fetchBalance() {
      if (this.uAddress) {
        let provider = this.$getFallbackProvider(this.$config.supportedChainId);

        /*
        if (this.isActivated && this.chainId === this.$config.supportedChainId) {
          // fetch provider from user's wallet
          provider = this.signer.provider.provider;
        }
        */

        // fetch balance of an address
        this.uBalance = await provider.getBalance(this.uAddress);
      }
    },

    async fetchOrbisProfile() {
      this.orbisProfile = {
        pfp: "",
        username: ""
      };

      if (this.uAddress) {
        let { data, error } = await this.$orbis.getDids(this.uAddress);

        if (data[0].did) {
          const profile = await this.$orbis.getProfile(data[0].did);

          if (profile.status === 200) {
            this.orbisProfile = profile.data.details.profile;
    
            if (profile && profile.data.details.profile && profile.data.details.profile.pfp) {
              this.orbisImage = profile.data.details.profile.pfp;
            }

            if (profile) {
              this.followers = profile.data.count_followers;
              this.following = profile.data.count_following;
              this.lastActivityTimestamp = profile.data.last_activity_timestamp;
            }

            this.waitingDataLoad = false;
          }
        }

        this.waitingDataLoad = false;
      }
    }

    // @todo: refresh button to refresh user data (e.g. profile image)
  },

  setup() {
    const { address, balance, chainId, isActivated, signer } = useEthers();
    const userStore = useUserStore();
    const toast = useToast();

    return { address, balance, chainId, isActivated, userStore, shortenAddress, signer, toast };
  },

  watch: {
    address() {
      this.fetchAddressAndDomain();
    }
  }
}
</script>
