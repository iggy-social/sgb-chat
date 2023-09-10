<template>
  <Head>
    <Title>Edit NFT Collection | {{ $config.projectMetadataTitle }}</Title>
    <Meta property="og:title" :content="'Edit NFT Collection | ' + $config.projectMetadataTitle" />
  </Head>

  <div class="card border scroll-500">
    <div class="card-body">
      <p class="fs-3" @click="$router.back()">
        <i class="bi bi-arrow-left-circle cursor-pointer"></i>
      </p>

      <h3 class="mb-3 mt-3">Edit NFT Collection</h3>

      <p class="text-break mt-3">
        Collection ID: {{ $route.query.id }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditNftCollection'
};
</script>
