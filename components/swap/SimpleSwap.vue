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

      <!-- Connect Wallet button -->
      <ConnectWalletButton v-if="!isActivated" class="btn btn-outline-primary" btnText="Connect wallet" />

      <!-- Disabled Swap tokens button (if not input amount is entered) -->
      <button
        v-if="isActivated && !inputTokenAmount"
        :disabled="true" 
        class="btn btn-outline-primary" 
        type="button"
      >
        Swap tokens
      </button>

      <!-- Approve token button -->
      <button
        v-if="isActivated && inputTokenAmount && inputAmountLessThanBalance && !bothTokensAreTheSame && allowanceTooLow" 
        class="btn btn-outline-primary" 
        type="button"
        data-bs-toggle="modal" 
        :data-bs-target="'#simpleSwapTokenApprovalModal'+swapId"
      >
        Approve token
      </button>

      <!-- Approve token modal -->
      <TokenApprovalModal 
        :modalId="swapId"
        :token="inputToken"
        :amount="inputTokenAmount"
        :routerAddress="routerAddress"
        @setApprovalAmount="changeInputTokenAllowance"
      />

      <!-- Swap tokens button -->
      <button
        v-if="isActivated && inputTokenAmount && inputAmountLessThanBalance && !bothTokensAreTheSame && !allowanceTooLow"
        :disabled="!inputToken || !outputToken || !inputTokenAmount || !outputTokenAmount || !isActivated || bothTokensAreTheSame || !inputAmountLessThanBalance" 
        class="btn btn-outline-primary" 
        type="button"
      >
        Swap tokens
      </button>

      <!-- Balance too low button -->
      <button
        v-if="isActivated && inputTokenAmount && !inputAmountLessThanBalance"
        :disabled="true" 
        class="btn btn-outline-primary" 
        type="button"
      >
        Balance too low
      </button>

      <!-- Both tokens are the same button -->
      <button
        v-if="isActivated && inputTokenAmount && bothTokensAreTheSame"
        :disabled="true" 
        class="btn btn-outline-primary" 
        type="button"
      >
        Both tokens are the same
      </button>

    </div>

  </div>
</template>

<script>
import { useEthers } from 'vue-dapp';
import { useToast } from "vue-toastification/dist/index.mjs";
import tokens from '~/assets/data/tokens.json';
import wrappedNativeTokens from "~/assets/data/wrappedNativeTokens.json";
import { getTokenAllowance, getTokenBalance } from '~/utils/balanceUtils';
import { getOutputTokenAmount } from '~/utils/simpleSwapUtils';
import { ethers } from 'ethers';
import ConnectWalletButton from '~/components/ConnectWalletButton.vue';
import TokenApprovalModal from '~/components/approvals/TokenApprovalModal.vue';

export default {
  name: 'SimpleSwap',
  props: ["swapId", "outputPlaceholder", "routerAddress"],

  data() {
    return {
      filterTextInput: '',
      filterTextOutput: '',
      inputToken: null,
      inputTokenAllowance: 0,
      inputTokenAmount: null,
      inputTokenBalance: null,
      outputText: "Click Get amount",
      outputToken: null,
      outputTokenAmountWei: null,
      tokenList: []
    }
  },

  components: {
    ConnectWalletButton,
    TokenApprovalModal
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
    allowanceTooLow() {
      if (Number(this.inputTokenAllowance) < Number(this.inputTokenAmount)) {
        return true;
      } else {
        return false;
      }
    },

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

    inputAmountLessThanBalance() {
      if (this.inputTokenAmount && this.inputTokenBalance) {
        if (Number(this.inputTokenAmount) <= Number(this.inputTokenBalance)) {
          return true;
        } else {
          return false;
        }
      }

      return false;
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
    getTokenAllowance,
    getTokenBalance,

    changeInputTokenAllowance(newAllowance) {
      this.inputTokenAllowance = Number(newAllowance);
    },

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
      this.inputTokenAllowance = 0; // reset the allowance each time a new token is selected

      this.inputToken = token;
      this.inputTokenAmount = null;

      if (this.signer) {
        this.inputTokenBalance = await this.getTokenBalance(token, this.address, this.signer);
      }

      console.log("token.address", token.address);
      console.log("token symbol", token.symbol);

      console.log("input token allowance before", this.inputTokenAllowance);

      if (token.address == ethers.constants.AddressZero) {
        console.log("native coin selected");
        this.inputTokenAllowance = Number(ethers.constants.MaxUint256);
      } else {
        this.inputTokenAllowance = await this.getTokenAllowance(token, this.address, this.routerAddress, this.signer);
      }

      console.log("input token allowance after", this.inputTokenAllowance);
      
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

  watch: {
    async isActivated() {
      if (this.address) {
        this.inputTokenBalance = await this.getTokenBalance(this.inputToken, this.address, this.signer);
      }
    }
  }
}
</script>