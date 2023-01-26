<template>
  <TheShopLayout>
    <template #default>
      <div class="container">
        <div class="row m-5">
          <div class="col-12">
            <h2>Bestellung anlegen</h2>
            <form>
              <div class="form-group">
                <label for="bestellung">Bestellung:</label>
                <input
                  type="text"
                  class="form-control"
                  id="bestellung"
                  aria-describedby="emailHelp"
                  v-model="createOrderAr.bestellung"
                />
                <label for="menge">Menge:</label>
                <input
                  type="text"
                  class="form-control"
                  id="menge"
                  aria-describedby="emailHelp"
                  v-model="createOrderAr.menge"
                />

                <label for="preis">Preis:</label>
                <input
                  type="text"
                  class="form-control"
                  id="preis"
                  aria-describedby="emailHelp"
                  v-model="createOrderAr.preis"
                />
                <label for="werkstoff">Werkstoff:</label>
                <input
                  type="text"
                  class="form-control"
                  id="werkstoff"
                  aria-describedby="emailHelp"
                  v-model="createOrderAr.werkstoff"
                />
                <label for="masse">Maße:</label>
                <input
                  type="text"
                  class="form-control"
                  id="masse"
                  aria-describedby="emailHelp"
                  v-model="createOrderAr.masse"
                />
              </div>
            </form>
            <button
              type="submit"
              @click="createOrder()"
              class="btn btn-primary mt-3"
            >
              Speichern
            </button>
            <button
              class="btn btn-danger float-end mt-3"
              @click="$router.go(-1)"
            >
              Zurück
            </button>
          </div>
        </div>
      </div>
    </template>
  </TheShopLayout>
</template>

<script>
import TheShopLayout from "@/views/TheShopLayout";
export default {
  name: "CreateProductPage",
  components: {
    TheShopLayout,
  },
  data() {
    return {
      createOrderAr: {
        show: false,
        bestellung: "",
        menge: "",
        preis: "",
        werkstoff: "",
        masse: "",
      },
    };
  },
  props: {
    id: String,
  },
  computed: {
    product() {
      return this.$store.getters.product(this.id);
    },
  },
  methods: {
    createProduct() {
      
      this.$store.dispatch("storeProduct", this.product);
      setTimeout(() => {
        this.$store.dispatch("fetchProducts");
      }, 500);
   
  },
    createOrder() {
      const id = { id: this.product.id };

      Object.assign(this.createOrderAr, id);  //hinzufügen der Produkt id in das createOrderAr Object

this.$store.dispatch("addOrder", this.createOrderAr);

setTimeout(() => {
  this.$store.dispatch("fetchProducts");
  this.$router.go(-1);
  this.resetCreateOrderAr();
}, 500);


    },
    resetCreateOrderAr() {
    Object.keys(this.createOrderAr).forEach((key) => {
        this.createOrderAr[key] = '';
    });
  }
  },
};
</script>

<style scoped></style>
