import { ethers } from "ethers";
import Erc20Abi from "~/assets/abi/Erc20Abi.json";
import wrappedNativeTokens from "~/assets/data/wrappedNativeTokens.json";

export async function approveToken(signer, token, beneficiary, amount) {
  const config = useRuntimeConfig();

  // TODO
  let provider = signer;

  if (!provider) {
    provider = this.$getFallbackProvider(config.supportedChainId);
  }

  return null
}

export async function getOutputTokenAmount(signer, inputToken, outputToken, amountIn, routerAddress) {
  const config = useRuntimeConfig();

  let provider = signer;

  if (!provider) {
    provider = this.$getFallbackProvider(config.supportedChainId);
  }

  // router interface
  const routerAbi = [
    "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  ];

  const routerContract = new ethers.Contract(routerAddress, routerAbi, signer);

  const amountInWei = ethers.utils.parseUnits(amountIn, inputToken.decimals);

  let path = [inputToken.address, outputToken.address];

  console.log("path:", path);

  console.log("amountIn:", amountIn);
  console.log("amountInWei:", amountInWei);

  const wrappedAddress = wrappedNativeTokens[String(config.supportedChainId)];

  // check if input & output tokens are not native coin or wrapped token
  if (
    inputToken.address !== ethers.constants.AddressZero && 
    inputToken.address !== wrappedAddress && 
    outputToken.address !== ethers.constants.AddressZero &&
    outputToken.address !== wrappedAddress
  ) {
    // if it's not, add wrapped token to the path
    path = [inputToken.address, wrappedAddress, outputToken.address];
  }

  // if input and output tokens are native coin or wrapped token, then return the amountInWei
  if (
    (inputToken.address === ethers.constants.AddressZero || inputToken.address === wrappedAddress) &&
    (outputToken.address === ethers.constants.AddressZero || outputToken.address === wrappedAddress)
  ) {
    return amountInWei;
  }

  const amounts = await routerContract.getAmountsOut(amountInWei, path);

  console.log("swap utils: getOutputTokenAmount", amountIn, inputToken.symbol, "for", Number(amounts[amounts.length - 1]), outputToken.symbol);

  return amounts[amounts.length - 1];
}

export async function swapTokens(signer, inputToken, outputToken, amountIn, amountOutMin) {
  const config = useRuntimeConfig();
  
  // TODO
  // find slippage and deadline in local storage (if not found, use default values)
  // if swapping native coin for wrapped token, use the wrapped token contract to deposit
  // if swapping wrapped token for native coin, use the wrapped token contract to withdraw
  // else use the iggy router contract to swap
  let provider = signer;

  if (!provider) {
    provider = this.$getFallbackProvider(config.supportedChainId);
  }

  return null
}