<template>
  <Head>
    <Title>About SGB Chat</Title>
    <Meta property="og:title" content="About SGB Chat" />
  </Head>

  <div class="card border">
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

      <p class="text-break mt-3">
        SGB Chat is still in beta. This means that many features are still missing, but will be added over time. 
        There may also be bugs and other issues.
      </p>

      <p class="text-break mt-3">
        What we need from you at this point is to try out SGB Chat and provide us with feedback. 
        Feel free to post ideas, features suggestions, rants directly in the SGB Chat. 
        Or you can drop by 
        <a target="_blank" href="https://discord.gg/8dSrwrAQeu">our Discord</a> 
        and share your thoughts there.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>