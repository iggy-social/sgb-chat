<template>
<div class="col-auto col-lg-3 px-0 mt-1">
  <div id="sidebar2" class="collapse collapse-horizontal" :class="{ show: sidebarStore.showRightSidebar }">
    <div id="sidebar-nav" class="list-group border-0 rounded-0 text-sm-start min-vh-100">

      <!-- Mint/register a domain name -->
      <NameMintWidget />

      <!-- Playlist 
      <div class="card m-2 bg-light">
        <div class="card-header bg-light">SGB Chat Playlist</div>
        <div class="card-body sidebar-card-body">
          <iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/37i9dQZF1DX3b9hbbPi5hD?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
      </div>
      -->

      <!-- Keys list 
      <KeysListWidget v-if="$config.keysAddress" />
      -->

      <!-- Swap tokens -->
      <SimpleSwapWidget 
        v-if="$config.swapRouterAddress" 
        :routerAddress="$config.swapRouterAddress" 
        swapId="sidebarSwapOracle"
        :tokens="tokens" 
        title="Swap tokens (OracleSwap)" />

      <!-- Swap tokens -->
      <SimpleSwapWidget 
        v-if="$config.swapRouterAddress" 
        routerAddress="0x12c8B86FAB056323dC69b0aeA436d29A072f6364" 
        swapId="sidebarSwapFeather"
        :tokens="tokensFeather" 
        title="Swap tokens (FeatherSwap)" />

      <!-- Random minted post(s) -->
      <MintedPostsWidget @closeRightSidebar="closeRightSidebar" />

      <!-- Newsletter -->
      <div v-if="$config.newsletterLink" class="card m-2 bg-light">
        <div class="card-header bg-light">{{ $config.projectName }} Newsletter</div>
        <div class="card-body sidebar-card-body">
          <a class="btn btn-outline-primary mt-2 mb-2" target="_blank" :href="$config.newsletterLink">
            Join our newsletter!
            <i class="bi bi-box-arrow-up-right ms-1"></i>
          </a>
        </div>
      </div>
      
    </div>
  </div>
</div>
</template>

<script>
import tokens from '~/assets/data/tokens.json';
import tokensFeather from '~/assets/data/tokensFeather.json';
import { useSidebarStore } from '~/store/sidebars';
import MintedPostsWidget from '~/components/minted-posts/MintedPostsWidget.vue';
import NameMintWidget from '~/components/names/NameMintWidget.vue';
import SimpleSwapWidget from '~/components/swap/SimpleSwapWidget.vue';
import KeysListWidget from '~/components/keys/KeysListWidget.vue';

export default {
    name: "SidebarRight",
    props: ["rSidebar", "isMobile"],

    components: { 
      KeysListWidget,
      MintedPostsWidget,
      NameMintWidget,
      SimpleSwapWidget
    },

    methods: {
      closeRightSidebar() {
        if (this.isMobile) {
          //this.rSidebar.hide();
          this.sidebarStore.setRightSidebar(false);
          this.sidebarStore.setMainContent(true);
        }
      }
    },

    setup() {
        const sidebarStore = useSidebarStore();
        return { sidebarStore, tokens, tokensFeather };
    }
}
</script>