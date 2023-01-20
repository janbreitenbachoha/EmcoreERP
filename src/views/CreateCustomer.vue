<template>
  <TheShopLayout>
    <template #default>
      <div class="container">
        <Toast />
        <div class="row m-5">
          <form>
            <div class="formgroup-inline row">
              <h2 class=" text-lg-center">Kunde Anlegen</h2>
              <InputText
                id="FirmenName"
                placeholder="Firmen Name"
                v-model="kunde.name"
                class="col-12"
                :class="{'p-invalid ':status.status}"
              />
              <button
                type="submit"
                @click="createProduct()"
                class="btn btn-primary mt-2"
              >
                Anlegen
              </button>
            </div>
          </form>

          <small v-if="status.status">{{ status.name }}</small>
        </div>
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
      kunde: {
        name: "",
      },
      status: {
        name: "",
        status: false,
      },
    };
  },
  computed: {},
  methods: {
    createProduct() {
      if (!this.kunde.name) {
        console.log("leer");
        this.status.status = true;
        this.$toast.add({severity:'error', summary: 'Achtung', detail:'Feld darf nicht leer sein', life: 3000});
      } else {
        this.$store.dispatch("createCustomer", this.kunde);
        this.$toast.add({severity:'success', summary: 'Gespeichert', detail:'Kunde wurde angelegt', life: 3000});
        this.kunde.name="";
        setTimeout(() => {
          this.$store.dispatch("fetchKunden");
        }, 500);
      }
    },
  },
};
</script>

<style scoped></style>
