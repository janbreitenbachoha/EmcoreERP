<template>
  <div>
    <div v-if="kunde" class="modal">
      <div class="modal-background" @click="hideModal"></div>
      <div class="modal-content">
        <span class="close" @click="hideModal">&times;</span>
        <div class="row p-2">
          <div class="col-6">
            <label for="menge">Name</label>
            <input
              type="text"
              class="form-control"
              id="menge"
              v-model="kunde.name"
            />
          </div>
          <div class="col-6">
            <label for="menge">Kundennummer</label>
            <input
              type="text"
              class="form-control"
              id="menge"
              v-model="kunde.kundenummer"
            />
          </div>
            <button
              type="submit"
              @click="this.$emit('update-kunde', kunde)"
              class="btn btn-lg btn-success col-4 m-2"
            >
              Speichern
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {
      kunde: this.item,
    };
  },
  methods: {
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
