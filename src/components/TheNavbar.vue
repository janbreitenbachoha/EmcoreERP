<template>
  <nav class="navbar navbar-expand-lg bg-vue navbar-dark">
    <div class="container">
      <router-link to="/" class="navbar-brand">Emcore ERP</router-link>
      <ul class="navbar-nav me-auto">
        <li class="nav-item active">
          <router-link to="/" class="nav-link">Artikel</router-link>
        </li>
        <li class="nav-item active">
          <router-link to="/KundeAnlegen" class="nav-link">Kunden</router-link>
        </li>
        <li class="nav-item active">
          <router-link to="/anlegen" class="nav-link">Artikel anlegen</router-link>
        </li>
        <li class="nav-item active">
          <router-link to="/BestellungAnlegen" class="nav-link">Bestellungen</router-link>
        </li>
        <li class="nav-item active">
          <router-link to="/ArtikelZuordnen" class="nav-link">Artikel Zuweisen</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>

export default {
  name: "TheNavbar",
  methods: {
    async signout() {
      try {
        await this.$store.dispatch("signout");
        this.$router.push("/");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
</style>