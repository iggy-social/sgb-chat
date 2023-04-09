import { ethers } from "ethers";
import Erc20Abi from "~/assets/abi/Erc20Abi.json";

export async function approveToken(signer, token, beneficiary, amount) {
  // TODO
  let provider = signer;

  if (!provider) {
    provider = this.$getFallbackProvider(this.$config.supportedChainId);
  }

  return null
}

export async function getOutputTokenAmount(signer, inputToken, outputToken, amountIn) {
  // TODO
  let provider = signer;

  if (!provider) {
    provider = this.$getFallbackProvider(this.$config.supportedChainId);
  }

  return null
}

export async function swapTokens(signer, inputToken, outputToken, amountIn, amountOutMin) {
  // TODO
  // find slippage and deadline in local storage (if not found, use default values)
  let provider = signer;

  if (!provider) {
    provider = this.$getFallbackProvider(this.$config.supportedChainId);
  }

  return null
}