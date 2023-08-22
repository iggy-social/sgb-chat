<template>
  <Head>
    <Title>About | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'About | ' + $config.projectMetadataTitle" />
  </Head>

  <div v-if="isLoading" class="loading-image">
    <img src="/img/sgb-chat-logo-2.png" class="loading-spinner" /> 
  </div>

  <div class="card border scroll-500">
    <div class="card-body">
      <p class="fs-3" @click="$router.back()">
        <i class="bi bi-arrow-left-circle cursor-pointer"></i>
      </p>

      <h3 class="mb-3 mt-3">Web3 Social is here.</h3>

      <p class="text-break mt-3">
        SGB Chat is <strong>the first web3 social network</strong> built on Songbird.
      </p>

      <p class="text-break mt-3">
        Web3 Social is a place where social media is fully decentralized, permissionless and all the data is owned by users. 
        The way it should be.
      </p>

      <p class="text-break mt-3">
        Let's leave the old world of corporation-controlled social media behind us and move towards a decentralized future. 
        We promise, it's going to be a lot of fun!
      </p>

      <p class="text-break mt-3">
        Brought to you by the 
        <a target="_blank" href="https://songbird.domains">Songbird Domains</a> & Punk Domains
        team.
      </p>

      <hr />

      <h5>SGB Chat Rules</h5>

      <ol class="mt-4">
        <li>Be respectful: Treat others with kindness and avoid offensive language or personal attacks. No hate speech and no racism.</li>
        <li>Avoid spamming: Refrain from posting multiple identical or irrelevant messages and excessive self-promotion.</li>
        <li>Use appropriate language and content: Keep your language and content suitable for a diverse audience on SGB Chat.</li>
        <li>Give credit and cite sources: Acknowledge and attribute the original authors or sources of information when sharing on SGB Chat.</li>
        <li>Keep personal information confidential: Personal information that comes up in the conversation should be kept confidential.</li>
      </ol>

      <p>
        SGB Chat rules were confirmed by the governance 
        <a href="https://snapshot.org/#/sgbchat.eth/proposal/0xec7e7ce2a0fc739ec1bb33b0d9ce68aa2f20adffbe1e024621beed9e33959c1f" target="_blank">
          via Snapshot on 21 July 2023
        </a>.
      </p>

      <hr />

      <h5>$CHIRP token</h5>

      <p class="mt-4">
        $CHIRP is the official token of Sgb.Chat, designed to reward and empower active contributors.
      </p>

      <p>
        ${{ $config.chatTokenSymbol }} token address is: 
        <a 
          target="_blank" 
          :href="$config.blockExplorerBaseUrl+'/token/'+$config.chatTokenAddress">
          {{ $config.chatTokenAddress }}
        </a>
      </p>

      <p>
        Regarding the $CHIRP token:
      </p>

      <ul>
        <li>$CHIRP is a valueless souvenir token.</li>
        <li>Anyone who mints a post on Sgb.Chat will receive $CHIRP tokens (this campaign will take place for 1 year).</li>
      </ul>

      <p>
        Airdrop details:
      </p>

      <ul>
        <li>Eligible participants for the airdrop include both .sgb domain holders and active Sgb.Chat users.</li>
        <li>If you own multiple .sgb domains, you can claim the airdrop for each domain you have.</li>
        <li>Users who have minted a post as an NFT on Sgb.Chat will receive an additional $CHIRP airdrop.</li>
        <li>To claim the airdrop, go to the Airdrop page in the left sidebar of SGB Chat.</li>
      </ul>

      <hr />

      <h5>Feedback</h5>

      <p class="text-break mt-3">
        Feel free to post ideas, features suggestions, rants directly in the SGB Chat. 
        Or you can drop by 
        <a target="_blank" href="https://discord.gg/8dSrwrAQeu">our Discord</a> 
        and share your thoughts there.
      </p>

      <div class="d-flex justify-content-around flex-wrap">
        <img class="img-fluid tech-stack mt-3" src="/img/tech/orbis.png" />

        <img class="img-fluid tech-stack mt-3" src="/img/tech/ceramic.png" />

        <img class="img-fluid tech-stack mt-3" src="/img/tech/punk.png" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'About',

  setup() {
    const isLoading = ref(true);
     onMounted(() => { isLoading.value = false; });

     return { isLoading }
  }

}

</script>
