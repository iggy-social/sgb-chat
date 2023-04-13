import { ethers } from "ethers";
import Erc20Abi from "~/assets/abi/Erc20Abi.json";
import wrappedNativeTokens from "~/assets/data/wrappedNativeTokens.json";

export async function getOutputTokenAmount(signer, inputToken, outputToken, amountIn, routerAddress) {
  const config = useRuntimeConfig();

  let provider = signer;

  if (!provider) {
    provider = this.$getFallbackProvider(config.supportedChainId);
  }

  const amountInWei = ethers.utils.parseUnits(amountIn, inputToken.decimals);

  let path = [inputToken.address, outputToken.address];

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

  // router interface
  const routerAbi = [
    "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  ];

  const routerContract = new ethers.Contract(routerAddress, routerAbi, provider);

  const amounts = await routerContract.getAmountsOut(amountInWei, path);

  //console.log("swap utils: getOutputTokenAmount", amountIn, inputToken.symbol, "for", Number(amounts[amounts.length - 1]), outputToken.symbol);

  return amounts[amounts.length - 1]; // return amount out (the output token amount)
}

export function swapTokens(signer, inputToken, outputToken, amountIn, amountOutMin, routerAddress) {
  const config = useRuntimeConfig();
  let provider = signer;
  const wrappedAddress = wrappedNativeTokens[String(config.supportedChainId)];

  // if swapping native coin for wrapped token, use the wrapped token contract to deposit
  if (inputToken.address === ethers.constants.AddressZero && outputToken.address === wrappedAddress) {
    // wrapped native coin interface with deposit and withdraw functions
    const wrappedInterface = new ethers.utils.Interface([
      "function deposit() payable",
      "function withdraw(uint wad)"
    ]);

    const wrappedContract = new ethers.Contract(wrappedAddress, wrappedInterface, provider);
    return wrappedContract.deposit({ value: amountIn });
  }

  console.log("swapTokens 7")

  // if swapping wrapped token for native coin, use the wrapped token contract to withdraw

  // else use the iggy router contract to swap
    // find slippage and deadline in local storage (if not found, use default values)

  return null
}