<template>
  <TheShopLayout>
    <template #default>

      <div class="container">
        <Toast />
        <div class="row m-5">
          <h2>Artikel Anlegen</h2>
          <form>
            <div class="mb-3 d-flex flex-column">
              <label for="exampleInputEmail1" class="form-label">Kunde</label>
              <Dropdown
                v-model="product.kunde"
                id="exampleInputEmail1"
                :options="kunden"
                :editable="true"
                optionLabel="name"
                placeholder="Wähle einen Kunden"
                :filter="true"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label"
                >Bezeichnung</label
              >
              <input
                type="text"
                v-model="product.bezeichnung"
                class="form-control"
                id="exampleInputPassword1"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label"
                >Zeichnungsnummer</label
              >
              <input
                type="text"
                v-model="product.zeichnungsnummer"
                class="form-control"
                id="exampleInputPassword1"
              />
            </div>
            <button
              type="submit"
              @click="createProduct()"
              class="btn btn-primary mt-4 col-12"
            >
              Speichern
            </button>
          </form>

          <form></form>
        </div>
      </div>
    </template>
  </TheShopLayout>
</template>

<script>
import TheShopLayout from "@/views/TheShopLayout";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
export default {
  name: "CreateProductPage",
  components: {
    TheShopLayout,
    Dropdown,
    Toast,
  },
  data() {
    return {
      product: {
        kunde: "",
        bezeichnung: "",
        zeichnungsnummer: "",
      },
    };
  },
  computed: {
    kunden() {
      return this.$store.getters.kunden;
    },
  },
  methods: {
    createProduct() {

    const name = {
      bezeichnung: this.product.bezeichnung,
      zeichnungsnummer : this.product.zeichnungsnummer,
      kunde : {
      id: this.product.kunde._ID,
      name: this.product.kunde.name,
    }
    }

    console.log(name)

      this.$store.dispatch("storeProduct", name);
      this.$toast.add({severity:'success', summary: 'Gespeichert', detail:'Artikel wurde angelegt', life: 3000});

      this.product.kunde="";
      this.product.bezeichnung="";
      this.product.zeichnungsnummer="";

      setTimeout(() => {
        this.$store.dispatch("fetchProducts");
      }, 500);
    },
  },
};
</script>

<style scoped></style>
