<template>
  <TheShopLayout>
    <template #default>
      <div class="container">
        <Toast />
        <div class="row m-5">
          <form>
            <div class="formgroup-inline row">
              <h2 class="text-lg-center">Kunde Anlegen</h2>
              <InputText
                id="FirmenName"
                placeholder="Kunden Name"
                v-model="kunde.name"
                class="col-12"
              />
              <InputText
                id="FirmenName"
                placeholder="Kundennummer"
                v-model="kunde.kundenummer"
                class="col-12 mt-3"
              />
              <button
                type="submit"
                @click="createProduct()"
                class="btn btn-primary mt-4"
              >
                Anlegen
              </button>
            </div>
          </form>
        </div>
        <div class="container mt-2">
          <input
            class="form-control"
            type="text"
            v-model="search"
            placeholder="Kunden Suchen"
            aria-label="default input example"
          />
        </div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">kunde</th>
              <th scope="col">kundenummer</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(kunde, index) in filteredUsers" :key="kunde.id">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ kunde.name }}</td>
              <td>{{ kunde.kundenummer }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </TheShopLayout>
</template>

<script>
import TheShopLayout from "@/views/TheShopLayout";
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";
export default {
  name: "CreateProductPage",
  components: {
    TheShopLayout,
    InputText,
    Toast,
  },
  data() {
    return {
      search:"",
      kunde: {
        name: "",
        kundenummer: "",
      },
    };
  },
  computed: {
    kunden() {
      return this.$store.getters.kunden;
    },

    filteredUsers() {
      // Kopie des users-Arrays erstellen
      let users = this.$store.getters.kunden;
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
          let name = user.name
            .toLowerCase()
            .replace(/[+\-/\\(){}[\]<>!§$%&=?*#€¿&_.,:;]/g, "");
          return searchWords.every((searchWord) => {
            return (
              name.includes(searchWord)
            );
          });
        });
      }


      return users;
    },
  },
  methods: {
    createProduct() {
      if (!this.kunde.name) {
        console.log("leer");
        this.$toast.add({
          severity: "error",
          summary: "Achtung",
          detail: "Feld darf nicht leer sein",
          life: 3000,
        });
      } else {
        this.$store.dispatch("createCustomer", this.kunde);
        this.$toast.add({
          severity: "success",
          summary: "Gespeichert",
          detail: "Kunde wurde angelegt",
          life: 3000,
        });
        this.kunde.name = "";
        this.kunde.kundenummer = "";
        setTimeout(() => {
          this.$store.dispatch("fetchKunden");
        }, 500);
      }
    },
  },
};
</script>

<style scoped></style>
