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
          <div v-if="sort" class="mt-4">
            <table class="table mt-4">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Bestellung</th>
                  <th scope="col">Kunde</th>
                  <th scope="col">Bearbeiten</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(kunde, index) in sort" :key="kunde.orderID">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ kunde.order.bestellung }}</td>
                  <td>{{ kunde.name }}</td>
                  <td>
                    <button
                      :disabled="!kunde.order.artikel"
                      :key="kunde"
                      class="btn btn-primary col-5"
                      @click="openModal(kunde)"
                    >
                      Bearbeiten
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ModalComponentBestellungen
          v-if="modalItem"
          @close="hideModal"
          :item="modalItem"
        ></ModalComponentBestellungen>
      </div>
    </template>
  </TheShopLayout>
</template>

<script>
import TheShopLayout from "@/views/TheShopLayout";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
import ModalComponentBestellungen from "@/components/ModalComponentBestellungen.vue";

export default {
  name: "CreateProductPage",
  components: {
    TheShopLayout,
    Dropdown,
    Toast,
    ModalComponentBestellungen,
  },
  data() {
    return {
      modalItem: null,
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
      let wert = Object.values(this.kunden).flatMap(({ name, bestellungen }) =>
        bestellungen
          ? Object.entries(bestellungen).map(([orderID, order]) => ({
              order,
              name,
              orderID,
            }))
          : []
      );

      // Kopie des users-Arrays erstellen
      let users = wert;

      // Wenn search nicht leer ist, Ergebnisse filtern
      if (this.search) {
        // Sucheingabe in Kleinbuchstaben umwandeln und Sonderzeichen und Leerzeichen entfernen
        const search = this.search
          .toLowerCase()
          .replace(/[+\-/\\(){}[\]<>!§$%&=?*#€¿&_.,:;\s]+/g, "");
        // Sucheingabe in ein Array von Wörtern umwandeln
        const searchWords = search.split(/\s+/);
        let searchRegex = new RegExp(searchWords.join("|"), "i");
        let filteredUsers = [];
        users.forEach((user) => {
          if (
            searchRegex.test(user.order.bestellung) ||
            searchRegex.test(user.name)
          ) {
            filteredUsers.push(user);
          }
        });

        return filteredUsers;
      }
      console.log(users);

      return users;
    },
  },
  methods: {
    openModal(item) {
      this.modalItem = item;
    },
    hideModal() {
      this.modalItem = null;
    },
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
          this.$store.dispatch("getArticleAndOrderData");
        }, 500);
      }
    },
  },
};
</script>

<style scoped></style>
