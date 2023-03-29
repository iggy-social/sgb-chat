import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useSiteStore = defineStore({
  id: 'site',

  state: () => {
    return {
      colorMode: "dark",
      showOnlyMasterPosts: useLocalStorage('showOnlyMasterPosts', "false"),
    }
  },

  getters: {
    getColorMode(state) {
      const pStorage = useLocalStorage('colorMode', null);

      if (pStorage.value) {
        state.colorMode = pStorage.value;
      }

      return state.colorMode;
    },

    getShowOnlyMasterPosts(state) {
      const pStorage = useLocalStorage('showOnlyMasterPosts', null);

      if (pStorage.value) {
        state.showOnlyMasterPosts = pStorage.value;
      }

      return state.showOnlyMasterPosts;
    }
  },

  actions: {
    setColorMode(cm: string) {
      this.colorMode = cm;
      localStorage.setItem("colorMode", cm);
    },

    setShowOnlyMasterPosts(somp: string) {
      this.showOnlyMasterPosts = somp;
      localStorage.setItem("showOnlyMasterPosts", somp);
    }
  }
})