<template>
  <div>
    <div v-if="position" class="modal">
      <div class="modal-background" @click="hideModal"></div>
      <div class="modal-content">
        <span class="close" @click="hideModal">&times;</span>
        <div class="row p-2">
          <div class="col-6">
            <label for="bestellung">Bestellung</label>
            <input
              disabled
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
            <label for="preis">Artikel Preis</label>
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
          <div class="col-4">
            <label for="masse">Rohmaterial</label>
            <input
              type="text"
              class="form-control"
              id="masse"
              aria-describedby="emailHelp"
              v-model="position.masse"
            />
          </div>
          <div class="col-4">
            <label for="masse">Lieferant</label>
            <input
              type="text"
              class="form-control"
              id="masse"
              aria-describedby="emailHelp"
              v-model="position.lieferant"
            />
          </div>
          <div class="col-4">
            <label for="masse">Material Preis stk.</label>
            <input
              type="text"
              class="form-control"
              id="masse"
              aria-describedby="emailHelp"
              v-model="position.preisMaterial"
            />
          </div>
          <div class="col-6">
            <label for="masse">Oberfläche</label>
            <input
              type="text"
              class="form-control"
              id="masse"
              aria-describedby="emailHelp"
              v-model="position.oberflaeche"
            />
          </div>
          <div class="col-6">
            <label for="masse">Oberfläche Lieferant</label>
            <input
              type="text"
              class="form-control"
              id="masse"
              aria-describedby="emailHelp"
              v-model="position.oberflaecheLieferant"
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
              class="btn btn-lg btn-success col-2"
            >
              Speichern
            </button>

            <!-- <button
              type="submit"
              @click="deletOrder()"
              class="btn btn-danger col-2"
            >
              Bestellung Löschen
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item", "id"],
  data() {
    return {
      position: this.item,
      nummer: this.id,
    };
  },
  methods: {
    deletOrder() {
      this.$emit("clear-order", this.nummer);
      this.$emit("close"); 
    },

    addSpannung() {
      this.position.laufzeit.push({});
    },
    deleteSpannung(id, spannung) {
      this.position.laufzeit.splice(spannung, 1);
    },
    hideModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer; /* Der Cursor wird geändert, wenn der Benutzer über den Hintergrund hovert */
}
.modal {
  display: block; /* Make the modal visible */
  position: fixed; /* Fix the modal to the page */
  z-index: 0; /* Show the modal above other content */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
}

.modal-content {
  z-index: 2;
  pointer-events: auto;
  background-color: #fefefe;
  margin: 5% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
