<template>
  <div class="d-flex justify-content-center">
    <div class="mt-2 container mb-5 flex row justify-content-center">
      <div
        class="bestellungen col-12 p-2"
        v-on:click="position.show = !position.show"
      >
        {{ position.bestellung }}
      </div>

      <div v-if="position.show" class="row klappen p-2">
        <div class="col-6">
          <label for="bestellung">Bestellung</label>
          <input
            type="text"
            class="form-control"
            id="bestellung"
            v-model="position.bestellung"
          />
        </div>
        <div class="col-6">
          <label for="menge">Menge</label>
          <input
            type="text"
            class="form-control"
            id="menge"
            v-model="position.menge"
          />
        </div>
        <div class="col-6">
          <label for="preis">Preis</label>
          <input
            type="text"
            class="form-control"
            id="preis"
            aria-describedby="emailHelp"
            v-model="position.preis"
          />
        </div>
        <div class="col-6">
          <label for="Werkstoff">Werkstoff</label>
          <input
            type="text"
            class="form-control"
            id="Werkstoff"
            aria-describedby="emailHelp"
            v-model="position.werkstoff"
          />
        </div>
        <div class="col-6">
          <label for="masse">Rohmaterial</label>
          <input
            type="text"
            class="form-control"
            id="masse"
            aria-describedby="emailHelp"
            v-model="position.masse"
          />
        </div>
        <div class="col-12">
          <label for="bemerkungen">Bermerkungen</label>
          <textarea
            type=" textaria"
            class="form-control"
            id="bemerkungen"
            aria-describedby="emailHelp"
            v-model="position.bemerkungen"
          />
        </div>

        <table class="table">
          <thead>
            <tr>
              <th scope="col">Spannung</th>
              <th scope="col">Rüst</th>
              <th scope="col">Laufzeit</th>
              <th scope="col">Wer</th>
              <th scope="col">Maschine</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(test, lala) in position.laufzeit" :key="lala">
              <th scope="row">{{ lala + 1 }}</th>
              <td>
                <input
                  type="text"
                  class="form-control"
                  id="masse"
                  aria-describedby="emailHelp"
                  v-model="test.ruest"
                />
              </td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  id="masse"
                  aria-describedby="emailHelp"
                  v-model="test.laufzeit"
                />
              </td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  id="masse"
                  aria-describedby="emailHelp"
                  v-model="test.wer"
                />
              </td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  id="masse"
                  aria-describedby="emailHelp"
                  v-model="test.maschine"
                />
              </td>
              <td>
                <button @click="deleteSpannung(index, lala)">X</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="row flex justify-content-between">
          <button
            type="submit"
            @click="addSpannung(index)"
            class="btn btn-primary col-2"
          >
            Spannung Hinzufügen
          </button>

          <button
            type="submit"
            @click="this.$emit('update-product')"
            class="btn btn-lg bg-vue2 col-2"
          >
            Speichern
          </button>

          <button
            type="submit"
            @click="deletOrder()"
            class="btn btn-danger col-2"
          >
            Bestellung Löschen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheBestellungen",
  components: {},
  data() {
    return {
      position: this.product,
    };
  },
  props: {
    product: Object,
    id: String,
  },
  methods: {
    deletOrder() {
      this.$emit("clear-order", this.id);
    },

    addSpannung() {
      this.position.laufzeit.push({});
    },
    deleteSpannung(id, spannung) {
      this.position.laufzeit.splice(spannung, 1);
    },
  },
};
</script>

<style scoped>
.bestellungen {
  position: relative;
  border: 1px solid rgb(184, 184, 184);
  border-radius: 5px;
}
.klappen {
  border: 1px solid rgb(184, 184, 184);
  border-radius: 5px;
}
.bestellungen::before {
  content: "";
  position: absolute;
  border: 1px solid rgb(184, 184, 184);
  width: 10px;
  height: 10px;
  right: 15px;
  top: 15px;
}

.bestellungen:hover::before {
  content: "";
  position: absolute;
  background-color: black;
  width: 10px;
  height: 10px;
  right: 15px;
  top: 15px;
}
</style>
