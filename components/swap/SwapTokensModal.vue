<template>
<div class="modal fade" :id="'swapTokensModal'+modalId" tabindex="-1" :aria-labelledby="'swapTokensModalLabel'+modalId" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" :id="'swapTokensModalLabel'+modalId">Swap tokens</h1>
        <button :id="'closeSwapTokensModal'+modalId" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">

        <p>Double-check the swap amounts:</p>

        <div class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">{{ inputToken?.symbol }}</span>
          <input type="text" class="form-control" :value="inputTokenAmount" disabled>
        </div>

        <h4 class="text-center mt-2">
          <i class="bi bi-arrow-down"></i>
        </h4>

        <div class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">{{ outputToken?.symbol }}</span>
          <input type="text" class="form-control" :value="outputTokenAmount" disabled>
        </div>

        <small v-if="!bothTokensAreNativeCoinOrWrappedToken">
          <em>
            You will get at least {{ outputTokenAmount }} {{ outputToken?.symbol }}, but probably more (1% slippage).
          </em>
        </small>

      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-primary" @click="swap" :disabled="waiting">
          <span v-if="waiting" class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
          Swap tokens
        </button>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { ethers } from "ethers";
import wrappedNativeTokens from "~/assets/data/wrappedNativeTokens.json";

export default {
  name: "SwapTokensModal",
  props: ["inputToken", "inputTokenAmount", "modalId", "outputToken", "outputTokenAmount", "outputTokenAmountWei"],

  data() {
    return {
      waiting: false,
    };
  },

  computed: {
    bothTokensAreNativeCoinOrWrappedToken() {
      if (
        (this.inputIsNativeCoin && this.outputIsWrappedNativeCoin) || 
        (this.inputIsWrappedNativeCoin && this.outputIsNativeCoin)
      ) {
        return true;
      } else {
        return false;
      }
    },

    inputIsNativeCoin() {
      if (String(this.inputToken?.address).toLowerCase() == String(ethers.constants.AddressZero).toLowerCase()) {
        return true;
      } else {
        return false;
      }
    },

    inputIsWrappedNativeCoin() {
      if (String(this.inputToken?.address).toLowerCase() == String(wrappedNativeTokens[this.$config.supportedChainId]).toLowerCase()) {
        return true;
      } else {
        return false;
      }
    },

    outputIsNativeCoin() {
      if (String(this.outputToken?.address).toLowerCase() == String(ethers.constants.AddressZero).toLowerCase()) {
        return true;
      } else {
        return false;
      }
    },

    outputIsWrappedNativeCoin() {
      if (String(this.outputToken?.address).toLowerCase() == String(wrappedNativeTokens[this.$config.supportedChainId]).toLowerCase()) {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {
    swap() {
      this.waiting = true;
    },
  }
}
</script>