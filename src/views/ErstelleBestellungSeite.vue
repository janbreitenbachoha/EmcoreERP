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
            <button
              type="submit"
              @click="createOrder()"
              class="btn btn-primary mt-4 col-12"
            >
              Speichern
            </button>
          </form>
          <div class="container mt-4">
            <input
              class="form-control"
              type="text"
              v-model="search"
              placeholder="Bestellung Suchen"
              aria-label="default input example"
            />
          </div>
          <div class="mt-4">
            <DataTable
              :value="sort"
              responsiveLayout="scroll"
              :paginator="true"
              :rows="10"
              stripedRows
            >
              <Column field="order.bestellung" header="Bestellung" :sortable="true"></Column>
              <Column field="name" header="Name" :sortable="true"></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </template>
  </TheShopLayout>
</template>

<script>
import TheShopLayout from "@/views/TheShopLayout";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
export default {
  name: "CreateProductPage",
  components: {
    TheShopLayout,
    Dropdown,
    Toast,
    DataTable,
    Column,
  },
  data() {
    return {
      search: "",
      inputDate: null,
      product: {
        kunde: "",
        bestellung: "",
        datum: null,
      },
    };
  },
  computed: {
    kunden() {
      return this.$store.getters.kunden;
    },

    sort() {
      
      let test = Object.values(this.kunden)

      console.log(test)

      let wert = Object.values(this.kunden).flatMap(({ name, bestellungen }) =>
        bestellungen ? Object.values(bestellungen).map((order) => ({ order, name })) : null
      );

      console.log(wert)

      // Kopie des users-Arrays erstellen
      let users = wert;

      // Wenn search nicht leer ist, Ergebnisse filtern
      if (this.search) {
        // Sucheingabe in Kleinbuchstaben umwandeln und Sonderzeichen entfernen
        const search = this.search
          .toLowerCase()
          .replace(/[+\-/\\(){}[\]<>!§$%&=?*#€¿&_.,:;]/g, "");
        // Sucheingabe in ein Array von Wörtern umwandeln
        const searchWords = search.split(/\s+/);
        let searchRegex = new RegExp(searchWords.join("|"), "i");
        let filteredUsers = [];
        users.forEach((user) => {
          if (searchRegex.test(user.order.bestellung)) {
            filteredUsers.push(user);
          }
        });

        return filteredUsers;
      }

      return users;
    },
  },
  methods: {
    createOrder() {


      if (!this.product.kunde || !this.product.bestellung) {
					console.log("leer");
					this.$toast.add({
						severity: "error",
						summary: "Achtung",
						detail: "Feld darf nicht leer sein",
						life: 3000,
					});
				} else {

        

      this.$store.dispatch("storeOrder", this.product);
      this.$toast.add({
        severity: "success",
        summary: "Gespeichert",
        detail: "Artikel wurde angelegt",
        life: 3000,
      });

      this.product.kunde = "";
      this.product.bestellung = "";

      setTimeout(() => {
        this.$store.dispatch("fetchProducts");
        this.$store.dispatch("fetchKunden");
      }, 500);
    }
    },
  },
};
</script>

<style scoped></style>
