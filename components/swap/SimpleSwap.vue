<template>
  <div>

    <!-- Input token -->
    <div class="input-group mb-3">
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

      <button class="btn btn-outline-secondary" type="button" id="button-addon2">
        <small>MAX</small>
      </button>
    </div>

    <!-- Arrow down -->
    <h4 
      @click="getOutputAmount" 
      class="text-center mb-3 mt-3 cursor-pointer"
    >
      <i class="bi bi-arrow-down"></i>
    </h4>

    <!-- Output token -->
    <div class="input-group mb-4">
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

    <div class="d-flex justify-content-center">
      <button class="btn btn-outline-primary" type="button">Swap tokens</button>
    </div>

  </div>
</template>

<script>
import tokens from '~/assets/data/tokens.json';

export default {
  name: 'SimpleSwap',
  props: ["outputPlaceholder"],

  data() {
    return {
      filterTextInput: '',
      filterTextOutput: '',
      inputToken: null,
      inputTokenAmount: null,
      outputText: "Click Get amount",
      outputToken: null,
      outputTokenAmount: null,
      tokenList: []
    }
  },

  mounted() {
    this.tokenList = tokens.tokens;

    this.inputToken = tokens.tokens[0];
    this.outputToken = tokens.tokens[1];

    if (this.outputPlaceholder) {
      this.outputText = this.outputPlaceholder;
    }
  },

  computed: {
    filteredTokensInput() {
      const regex = new RegExp(this.filterTextInput, 'i');
      return this.tokenList.filter(token => regex.test(token.symbol));
    },

    filteredTokensOutput() {
      const regex = new RegExp(this.filterTextOutput, 'i');
      return this.tokenList.filter(token => regex.test(token.symbol));
    }
  },

  methods: {
    getOutputAmount() {
      // TODO: call a function in composables
      console.log("getOutputAmount")
    },

    selectInputToken(token) {
      this.inputToken = token;
    },

    selectOutputToken(token) {
      this.outputToken = token;
    }
  }
}
</script>