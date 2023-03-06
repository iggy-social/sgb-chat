<template>
  <Head>
    <Title>About sgb.chat</Title>
    <Meta property="og:title" content="About sgb.chat" />
  </Head>

  <div class="card border">
    <div class="card-body">
      <p class="fs-3" @click="$router.back()">
        <i class="bi bi-arrow-left-circle cursor-pointer"></i>
      </p>

      <h3 class="mb-3 mt-3">Web3 Social is here.</h3>

      <p class="text-break mt-3">
        Sgb.chat is the first decentralized social network on Songbird, brought to you by the Songbird Domains team.
      </p>

      <p class="text-break mt-3">
        Let's leave the old world of corporation-controled social media behind us and move towards a decentralized future. 
        We promise, it's going to be a lot of fun!
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>