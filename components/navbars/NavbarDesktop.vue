<template>
  <nav class="navbar navbar-expand-lg navbar-bg-custom">
    <div class="container-fluid mx-3">

      <NuxtLink class="navbar-brand" to="/">
        <img src="/img/logo-transparent.png" alt="Chat logo" height="24">
        {{$config.projectName}}
      </NuxtLink>

      <ul class="navbar-nav justify-content-end flex-grow-1">
        <li v-if="isActivated" class="nav-item">
          <span class="nav-link cursor-pointer" data-bs-toggle="modal" data-bs-target="#referralModal">
            Earn referral fees! 🤑
          </span>
        </li>

        <li v-if="!isActivated" class="nav-item">
          <ConnectWalletButton class="nav-link cursor-pointer" btnText="Connect wallet" />
        </li>

        <SwitchChainButton v-if="isActivated" :navbar="true" :dropdown="true" />

        <li v-if="isActivated" class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            href="#"
            role="button"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {{ showDomainOrAddress }}
          </a>
          <div class="dropdown-menu dropdown-menu-end">
            <NuxtLink v-if="userStore.getDefaultDomain" class="dropdown-item cursor-pointer" to="/profile">Profile</NuxtLink>
            
            <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#chatSettingsModal"
              >Settings</span
            >
            <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#changeUsernameModal"
              >Change username</span
            >
            <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#findUserModal"
              >Find user</span
            >
            <span class="dropdown-item cursor-pointer" data-bs-toggle="modal" data-bs-target="#referralModal"
              >Share referral link</span
            >
            <span class="dropdown-item cursor-pointer" @click="disconnectWallet">Disconnect</span>
          </div>
        </li>

        <li v-if="isActivated && $config.chatTokenAddress" class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            href="#"
            role="button"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {{ userStore.getChatTokenBalance }} {{ $config.chatTokenSymbol }}
          </a>
          <div class="dropdown-menu dropdown-menu-end">
            <NuxtLink class="dropdown-item cursor-pointer" to="/airdrop"
              >Claim {{ $config.chatTokenSymbol }} airdrop</NuxtLink
            >
            <NuxtLink
              v-if="$config.stakingContractAddress && $config.showFeatures.stake"
              class="dropdown-item cursor-pointer"
              to="/stake"
              >Stake & earn weekly {{ $config.tokenSymbol }} rewards</NuxtLink
            >
            <span class="dropdown-item cursor-pointer" @click="addToMetaMask"
              >Add {{ $config.chatTokenSymbol }} to MetaMask</span
            >
          </div>
        </li>

        <li class="nav-item cursor-pointer" title="Toggle between light and dark mode">
          <span class="nav-link" v-if="siteStore.getColorMode === 'dark'" @click="changeColorMode('light')">
            <i class="bi bi-brightness-high"></i>
          </span>

          <span class="nav-link" v-if="siteStore.getColorMode === 'light'" @click="changeColorMode('dark')">
            <i class="bi bi-moon-fill"></i>
          </span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { useEthers, shortenAddress } from '~/store/ethers'
import { useSiteStore } from '~/store/site'
import { useUserStore } from '~/store/user'
import ConnectWalletButton from '~/components/ConnectWalletButton.vue'
import SwitchChainButton from '~/components/SwitchChainButton.vue'
import { addTokenToMetaMask } from '~/utils/tokenUtils'
import { getTextWithoutBlankCharacters } from '~/utils/textUtils'

export default {
  name: 'Navbar',

  components: {
    ConnectWalletButton,
    SwitchChainButton,
  },

  computed: {
    showDomainOrAddress() {
      if (this.userStore.getDefaultDomain) {
        return getTextWithoutBlankCharacters(this.userStore.getDefaultDomain)
      } else if (this.address) {
        return this.shortenAddress(this.address)
      }

      return 'Profile'
    },
  },

  methods: {
    addToMetaMask() {
      addTokenToMetaMask(
        window.ethereum,
        this.$config.chatTokenAddress,
        this.$config.chatTokenSymbol,
        18, // decimals
        this.$config.chatTokenImage,
      )
    },

    changeColorMode(newMode) {
      this.siteStore.setColorMode(newMode)
      document.documentElement.setAttribute('data-bs-theme', this.siteStore.getColorMode)
    },

    async disconnectWallet() {
      this.disconnect()
    },
  },

  setup() {
    const { address, isActivated, disconnect } = useEthers()
    const siteStore = useSiteStore()
    const userStore = useUserStore()

    return { address, disconnect, isActivated, shortenAddress, siteStore, userStore }
  },
}
</script>
