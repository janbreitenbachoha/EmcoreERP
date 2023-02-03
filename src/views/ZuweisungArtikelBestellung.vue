<template>
  <TheShopLayout>
    <template #default>
      <div class="container">
        <Toast />
        <div class="row mt-5">
          <h2>Artikel Zuweisen</h2>
        </div>
        <div class="mb-3 d-flex flex-column">
          <label for="exampleInputEmail1" class="form-label">Kunde</label>
          <Dropdown
            v-model="kunde"
            id="exampleInputEmail1"
            :options="kunden"
            :editable="true"
            :filter="true"
            optionLabel="name"
            placeholder="Wähle einen Kunden"
          />
          <label for="exampleInputEmail1" class="form-label">Bestellung</label>
          <Dropdown
            v-model="bestellung"
            id="exampleInputEmail1"
            :options="test"
            :editable="true"
            :disabled="!kunde"
            :filter="true"
            optionLabel="order.bestellung"
            placeholder="Wähle eine Bestellung"
          />
          <div class="container mt-4">
            <input
              class="form-control"
              type="text"
              v-model="search"
              placeholder="Artikel Suchen"
              aria-label="default input example"
            />
          </div>
          <table class="table mt-4">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Bezeichnung</th>
                <th scope="col">Zeichnungsnummer</th>
                <th scope="col">menge</th>
                <th scope="col">Hinzufügen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(artikel, index) in sort" :key="artikel.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ artikel.bezeichnung }}</td>
                <td>{{ artikel.zeichnungsnummer }}</td>
                <td>
                  <input
                    type="text"
                    @input="updateValue(index, $event.target.value)"
                  />
                </td>
                <td>
                  <button
                    :disabled="aktiviert(artikel.id) || !this.inputValues[index]"
                    @click="hinzu(artikel, inputValues[index])"
                  >
                    Hinzufügen
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <button @click="anlegen()" class="btn btn-primary mt-4 col-12">
            Zuweisen
          </button>
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
      search: "",
      kunde: "",
      bestellung: "",
      artikel: "",
      inputValues: [],
      mehr: [],
    };
  },
  computed: {
    kunden() {
      return this.$store.getters.kunden;
    },
    product() {
      return this.$store.getters.products.slice();
    },

    sort() {
      const filteredProducts = Object.values(this.product).filter(
        (p) => p.kunde.kundenID === this.kunde.id
      );

      // Kopie des users-Arrays erstellen
      let users = filteredProducts;
      // Wenn search nicht leer ist, Ergebnisse filtern
      if (this.search) {
        // Sucheingabe in Kleinbuchstaben umwandeln und Sonderzeichen entfernen
        const search = this.search
          .toLowerCase()
          .replace(/[+\-/\\(){}[\]<>!§$%&=?*#€¿&_.,:;]/g, "");
        // Sucheingabe in ein Array von Wörtern umwandeln
        const searchWords = search.split(/\s+/);
        users = users.filter((user) => {
          // Suche in den Feldern name und email durchführen
          let name = user.bezeichnung
            .toLowerCase()
            .replace(/[+\-/\\(){}[\]<>!§$%&=?*#€¿&_.,:;]/g, "");
          return searchWords.every((searchWord) => {
            return name.includes(searchWord);
          });
        });
      }

      return users;
    },

    test() {
      const customer = this.kunde
        ? this.kunden.find((c) => c.name === this.kunde.name)
        : null;

      const oo =
        customer && customer.bestellungen
          ? Object.entries(customer.bestellungen)
          : null;

      const test = oo ? oo.map((o) => ({ order: o[1], orderId: o[0] })) : [];

      return test.reverse();
    },
  },
  methods: {
    aktiviert(id) {
      const result = this.mehr.some((element) => element.artikelID === id);
      return result;
    },
    updateValue(index, value) {
      this.inputValues[index] = value;
      console.log(this.inputValues)
    },
    hinzu(id, menge) {
      
      this.mehr.push({ artikelID: id.id, menge: menge, status: "Aktiv" });
      console.log(this.mehr)
    },
    anlegen() {
      const zuweisen = {
        kunde: this.kunde,
        bestellung: this.bestellung,
        artikel: this.mehr,
      };
      this.$store.dispatch("zuweisenArtikelBestellung", zuweisen);
      this.$toast.add({
        severity: "success",
        summary: "Gespeichert",
        detail: "Bestellung wurde aktualisiert",
        life: 3000,
      });
      this.kunde = "";
      this.bestellung = "";
      setTimeout(() => {
        this.$store.dispatch("fetchKunden");
        this.$store.dispatch("fetchProducts");
      }, 500);
    },
  },
};
</script>

<style scoped></style>
