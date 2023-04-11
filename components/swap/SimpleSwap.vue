<template>
  <div>

    <!-- Input token -->
    <div class="input-group mt-3 mb-1">
      <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {{ inputToken?.symbol }}
      </button>

      <ul class="dropdown-menu p-2">
        <input 
          class="form-control mb-2" 
          placeholder="Filter tokens"
          v-model="filterTextInput" 
        />

        <li v-for="token in filteredTokensInput" :key="token.address" class="cursor-pointer">
          <span @click="selectInputToken(token)" class="dropdown-item">{{ token.symbol }}</span>
        </li>
      </ul>

      <input 
        v-model="inputTokenAmount"
        type="text" 
        class="form-control" 
        placeholder="0.00"
      >

      <button
        @click="inputTokenAmount = inputTokenBalance" 
        class="btn btn-outline-secondary" 
        type="button" id="button-addon2"
      >
        <small>MAX</small>
      </button>
    </div>

    <small @click="inputTokenAmount = inputTokenBalance">
      <em>Balance: </em>  
      <em class="cursor-pointer hover-color">
        {{ formatInputTokenBalance }} {{ inputToken?.symbol }}
      </em>
    </small>

    <!-- Arrow down -->
    <h4 
      @click="getOutputAmount" 
      class="text-center mt-2 cursor-pointer"
    >
      <i class="bi bi-arrow-down"></i>
    </h4>

    <!-- Output token -->
    <div class="input-group mt-4">
      <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {{ outputToken?.symbol }}
      </button>

      <ul class="dropdown-menu p-2">
        <input 
          class="form-control mb-2" 
          placeholder="Filter tokens"
          v-model="filterTextOutput" 
        />

        <li v-for="token in filteredTokensOutput" :key="token.address" class="cursor-pointer">
          <span @click="selectOutputToken(token)" class="dropdown-item">{{ token.symbol }}</span>
        </li>
      </ul>

      <input
        type="text" 
        class="form-control" 
        :value="outputTokenAmount"
        :placeholder="outputText"
        disabled
      >

      <button @click="getOutputAmount" class="btn btn-outline-secondary" type="button">
        <small>Get amount</small>
      </button>
    </div>

    <small 
      v-if="outputTokenAmount && !bothTokensAreNativeCoinOrWrappedTokenOrSame"
    >
      <em>
        You will get at least {{ outputTokenAmount }} {{ outputToken.symbol }}, but probably more (1% slippage).
      </em>
    </small>

    <div class="d-flex justify-content-center mt-4">
      <button
        :disabled="!inputToken || !outputToken || !inputTokenAmount || !outputTokenAmount || !isActivated || bothTokensAreTheSame" 
        class="btn btn-outline-primary" 
        type="button"
      >Swap tokens</button>
    </div>

  </div>
</template>

<script>
import { useEthers } from 'vue-dapp';
import { useToast } from "vue-toastification/dist/index.mjs";
import tokens from '~/assets/data/tokens.json';
import wrappedNativeTokens from "~/assets/data/wrappedNativeTokens.json";
import { getTokenBalance } from '~/utils/balanceUtils';
import { getOutputTokenAmount } from '~/utils/simpleSwapUtils';
import { ethers } from 'ethers';

export default {
  name: 'SimpleSwap',
  props: ["outputPlaceholder", "routerAddress"],

  data() {
    return {
      filterTextInput: '',
      filterTextOutput: '',
      inputToken: null,
      inputTokenAmount: null,
      inputTokenBalance: null,
      outputText: "Click Get amount",
      outputToken: null,
      outputTokenAmountWei: null,
      tokenList: []
    }
  },

  mounted() {
    this.tokenList = tokens.tokens;

    this.selectInputToken(tokens.tokens[0]);
    this.selectOutputToken(tokens.tokens[1]);

    if (this.outputPlaceholder) {
      this.outputText = this.outputPlaceholder;
    }
  },

  computed: {
    bothTokensAreNativeCoinOrWrappedTokenOrSame() {
      if (
        (this.inputToken.address == ethers.constants.AddressZero && this.outputToken.address == wrappedNativeTokens[this.$config.supportedChainId]) || 
        (this.inputToken.address == wrappedNativeTokens[this.$config.supportedChainId] && this.outputToken.address == ethers.constants.AddressZero) || 
        (this.inputToken.address == ethers.constants.AddressZero && this.outputToken.address == ethers.constants.AddressZero) || 
        (this.inputToken.address == wrappedNativeTokens[this.$config.supportedChainId] && this.outputToken.address == wrappedNativeTokens[this.$config.supportedChainId])
      ) {
        return true;
      } else if (this.inputToken.address == this.outputToken.address) {
        return true;
      } else {
        return false;
      }
    },

    bothTokensAreTheSame() {
      if (this.inputToken.address == this.outputToken.address) {
        return true;
      } else {
        return false;
      }
    },

    filteredTokensInput() {
      const regex = new RegExp(this.filterTextInput, 'i');
      return this.tokenList.filter(token => regex.test(token.symbol));
    },

    filteredTokensOutput() {
      const regex = new RegExp(this.filterTextOutput, 'i');
      return this.tokenList.filter(token => regex.test(token.symbol));
    },

    formatInputTokenBalance() {
      if (this.inputTokenBalance) {
        if (this.inputTokenBalance == 0) {
          return 0;
        } else if (this.inputTokenBalance > 100) {
          return Number(this.inputTokenBalance).toFixed(2);
        } else {
          return Number(this.inputTokenBalance).toFixed(4);
        }
      }

      return 0;
    },

    outputTokenAmount() {
      if (this.outputTokenAmountWei) {
        let amount = ethers.utils.formatUnits(String(this.outputTokenAmountWei), this.outputToken.decimals);

        if (amount == 0) {
          return 0;
        } else if (amount > 100) {
          return Number(amount).toFixed(2);
        } else {
          return Number(amount).toFixed(4);
        }
      }

      return null;
    }
  },

  methods: {
    // imported from utils
    getTokenBalance,

    // custom
    async getOutputAmount() {
      if (!this.inputTokenAmount) {
        this.toast.error("Please enter an amount");
        return;
      }

      if (this.bothTokensAreNativeCoinOrWrappedTokenOrSame) {
        this.outputTokenAmountWei = ethers.utils.parseUnits(this.inputTokenAmount, this.inputToken.decimals);
      } else {
        this.outputTokenAmountWei = await getOutputTokenAmount(this.signer, this.inputToken, this.outputToken, this.inputTokenAmount, this.routerAddress);
      }
    },

    preSwapTokens() {
      // before doing a token swap, check the amountOut again: getOutputTokenAmount
      // if the amountOut is different, notify user about it in the modal
      // check for token approvals
    },

    async selectInputToken(token) {
      this.inputToken = token;
      this.inputTokenAmount = null;
      this.inputTokenBalance = await this.getTokenBalance(token, this.address, this.signer);
    },

    selectOutputToken(token) {
      this.outputToken = token;
      this.outputTokenAmountWei = null;
    },

    swapTokens() {
      // do the token swap
    }
  },

  setup() {
    const { address, isActivated, signer } = useEthers();
    const toast = useToast();

    return { address, isActivated, signer, toast }
  },
}
</script>