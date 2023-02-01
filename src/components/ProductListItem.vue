<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{{ product.artikel.kunde.name }}</h5>
      <h6 class="card-title">{{ product.artikel.bezeichnung }}</h6>
      <p class="card-text">{{ product.artikel.zeichnungsnummer }}</p>
        {{ product }}
      <!--       <router-link
        :to="`/shop/read/product/${product.id}`"
        class="stretched-link"
      ></router-link> -->
      <router-link
      :to="{ name: 'ReadProduct', params: { id: product}, props: { test: product } }"
        class="stretched-link"
      ></router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductListItem",
  data() {
    return {
      lalala:this.product,
    };
  },
  props: {
    product: Object,
  },
  created() {
    console.log(this.lalala)
  },
  computed: {
  },
};
</script>

<style scoped>
</style>