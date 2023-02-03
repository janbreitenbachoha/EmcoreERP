<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{{ product.data.name }}</h5>
      <h6 class="card-title">{{ product.artikel.bezeichnung }}</h6>
      <p class="card-text">{{ product.artikel.zeichnungsnummer }}</p>
      <!--       <router-link
        :to="`/shop/read/product/${product.id}`"
        class="stretched-link"
      ></router-link> -->
      <router-link
      :to="{ name: 'ReadProduct', params: { id: product.artikel.id}}"
        class="stretched-link"
      ></router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductListItem",
  props: {
    product: Object,
  },
  created(){

  },
  computed: {
  },
};
</script>

<style scoped>
</style>