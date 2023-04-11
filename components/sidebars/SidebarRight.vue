<template>
<div class="col-auto col-lg-3 px-0 mt-1">
  <div id="sidebar2" class="collapse collapse-horizontal" :class="{ show: sidebarStore.showRightSidebar }">
    <div id="sidebar-nav" class="list-group border-0 rounded-0 text-sm-start min-vh-100">

      <NameMintWidget />

      <!-- Swap Widget -->
      <div class="card m-2 bg-light">
        <div class="card-header bg-light">Swap</div>

        <div class="card-body">

          <SimpleSwap outputPlaceholder="Click ⮕" :routerAddress="$config.swapRouterAddress" />

        </div>
      </div>

      <MintedPostsWidget @closeRightSidebar="closeRightSidebar" />
      
    </div>
  </div>
</div>
</template>

<script>
import { useSidebarStore } from '~/store/sidebars';
import MintedPostsWidget from '~/components/minted-posts/MintedPostsWidget.vue';
import NameMintWidget from '~/components/names/NameMintWidget.vue';
import SimpleSwap from '~~/components/swap/SimpleSwap.vue';

export default {
    name: "SidebarRight",
    props: ["rSidebar", "isMobile"],

    components: { 
      MintedPostsWidget,
      NameMintWidget,
      SimpleSwap
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
        return { sidebarStore };
    }
}
</script>