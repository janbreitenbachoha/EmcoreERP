<template>
  <TheShopLayout>
    <template #default>

      <div class="container">
        <Toast />
        <div class="row m-5">
          <h2>Bestellung Anlegen</h2>
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
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label"
                >Bestellung</label
              >
              <input
                type="text"
                v-model="product.bestellung"
                class="form-control"
                id="exampleInputPassword1"
              />
            </div>
            <div class="field col-12 md:col-4">
                <label for="multiplemonths" class="form-label">Lieferdatum</label>
                <Calendar inputId="multiplemonths" class="form-control" v-model="product.datum" :numberOfMonths="3" dateFormat="mm-dd-yy"  />
            </div>
            <button
              type="submit"
              @click="createOrder()"
              class="btn btn-primary mt-4"
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
import Calendar from 'primevue/calendar';
export default {
  name: "CreateProductPage",
  components: {
    TheShopLayout,
    Dropdown,
    Toast,
    Calendar,
  },
  data() {
    return {
      product: {
        kunde: "",
        bestellung: "",
        datum:"",
      },
    };
  },
  computed: {
    kunden() {
      return this.$store.getters.kunden;
    },
  },
  methods: {
    createOrder() {
     this.$store.dispatch("storeOrder", this.product);
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
