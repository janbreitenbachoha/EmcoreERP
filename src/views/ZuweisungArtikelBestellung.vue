<template>
  <TheShopLayout>
    <template #default>
      <div class="container">
        <div class="row m-5">
          <h2>Artikel Zuweisen</h2>
        </div>
        <div class="mb-3 d-flex flex-column">
          <label for="exampleInputEmail1" class="form-label">Kunde</label>
          <Dropdown
            v-model="kunde"
            id="exampleInputEmail1"
            :options="kunden"
            :editable="true"
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
            optionLabel="order.bestellung"
            placeholder="Wähle eine Bestellung"
          />
          <label for="exampleInputEmail1" class="form-label">Artikel</label>

          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Bezeichnung</th>
                <th scope="col">Zeichnungsnummer</th>
                <th scope="col">Hinzufügen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(artikel, index) in sort" :key="artikel.id">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ artikel.bezeichnung }}</td>
                <td>{{ artikel.zeichnungsnummer }}</td>
                <td>
                  <button
                    :disabled="aktiviert(artikel.id)"
                    @click="hinzu(artikel)"
                  >
                    Hinzufügen
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <button @click="anlegen()">Zuweisen</button>
        </div>
      </div>
    </template>
  </TheShopLayout>
</template>

<script>
import TheShopLayout from "@/views/TheShopLayout";
import Dropdown from "primevue/dropdown";
export default {
  name: "CreateProductPage",
  components: {
    TheShopLayout,
    Dropdown,
  },
  data() {
    return {
      kunde: "",
      bestellung: "",
      artikel: "",
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
        (p) => p.kunde.name === this.kunde.name
      );
      return filteredProducts;
    },

    test() {
      const customer = this.kunde
        ? this.kunden.find((c) => c.name === this.kunde.name)
        : null;

      const oo =
        customer && customer.bestellungen
          ? Object.values(customer.bestellungen)
          : null;

      const test = oo ? oo.map((o) => ({ order: o, orderId: o.id })) : [];

      return test.reverse();
    },
  },
  methods: {
    aktiviert(id) {
      console.log(id);
      const result = this.mehr.some((element) => element.id === id);
      console.log(result);
      return result;
    },
    hinzu(id) {

      this.mehr.push({id: id.id});

      console.log(this.mehr);
    },
    anlegen() {
      const zuweisen = {
        kunde: this.kunde,
        bestellung: this.bestellung,
        artikel: this.artikel,
      };
      this.$store.dispatch("zuweisenArtikelBestellung", zuweisen);
    },
  },
};
</script>

<style scoped></style>
