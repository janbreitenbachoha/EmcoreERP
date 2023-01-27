<template>
  <div class="container mt-2 ">
    <input
      class=" col-8 m-3 p-2"
      type="text"
      v-model="search"
      placeholder="Artikel Suchen"
      aria-label="default input example"
    />
    <button class="col-2 p-2 btn btn-primary">Neuen Artikel Anlegen</button>
  </div>
  <div class="d-flex justify-content-center">
    <div class="row container d-flex justify-content-center">
      <div class="col-2 m-3" v-for="product in filteredUsers" :key="product.id">
        <ProductListItem :product="product" />
      </div>
    </div>
  </div>
</template>

<script>
import ProductListItem from "@/components/ProductListItem";

export default {
  name: "HomeView",
  components: {
    ProductListItem,
  },
  data() {
    return {
      search: "", // Variable für die Sucheingabe
      photoFeed: null,
      product: {
        bezeichnung: "",
        description: "",
        price: null,
      },
    };
  },
  computed: {
    filteredUsers() {
      // Kopie des users-Arrays erstellen
      let users = this.$store.getters.products;
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
          let name = user.kunde.name
            .toLowerCase()
            .replace(/[+\-/\\(){}[\]<>!§$%&=?*#€¿&_.,:;]/g, "");
          let bezeichnung = user.bezeichnung
            .toLowerCase()
            .replace(/[+\-/\\(){}[\]<>!§$%&=?*#€¿&_.,:;]/g, "");
          let zeichnungsnummer = user.zeichnungsnummer
            .toLowerCase()
            .replace(/[+\-/\\(){}[\]<>!§$%&=?*#€¿&_.,:;]/g, "");
          // Prüfen, ob alle Suchwörter in name oder email vorkommen
          return searchWords.every((searchWord) => {
            return (
              bezeichnung.includes(searchWord) ||
              zeichnungsnummer.includes(searchWord) ||
              name.includes(searchWord)
            );
          });
        });
      }


      return users;
    },
  },
};
</script>
