<template>
  <TheNavbar />
  <router-view />
</template>

<script>
import TheNavbar from "@/components/TheNavbar";

export default {
  name: "App",
  components: {
    TheNavbar,
  },
  computed: {},
  created() {
    this.$store.dispatch("fetchProducts");
    this.$store.dispatch("fetchKunden");
  },
  methods: {},
};
</script>

<style>
@import "~bootstrap/dist/css/bootstrap.min.css";

.bg-vue {
  background-color: rgb(52, 73, 94);
  color: white;
}
.bg-vue2 {
  background-color: rgb(65, 184, 131);
  color: white;
}
.text-vue {
  color: rgb(52, 73, 94);
}
.text-vue2 {
  color: rgb(65, 184, 131);
}
</style>
