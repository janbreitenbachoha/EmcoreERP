import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    products: [],
    kunden: [],
  },
  getters: {
    products: (state) => state.products,
    kunden: (state) => state.kunden,
    product: (state) => (id) =>
      state.products.find((product) => product.id === id),
  },
  mutations: {
    setProducts(state, payload) {
      state.products = payload;
    },
    setKunden(state, payload) {
      state.kunden = payload;
    },
    addProduct(state, payload) {
      state.products.push(payload);
    },
  },
  actions: {
    fetchProducts(context) {
      axios
        .get(`https://emcore-d87fa-default-rtdb.firebaseio.com/artikel.json`)
        .then((response) => {
          const productsDO = [];
          for (const id in response.data) {
            productsDO.push({
              id: id,
              ...response.data[id],
            });
          }
          context.commit("setProducts", productsDO);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    updateArtikel(content, payload) {
      const productItem = {
        id: payload.id,
        kunde: payload.kunde,
        bezeichnung: payload.bezeichnung,
        zeichnungsnummer: payload.zeichnungsnummer,
        werkstoff: payload.werkstoff,
        bestellungen: [],
      };
      axios
        .put(
          `https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${productItem.id}.json`,
          productItem
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          throw new Error(error);
        });
    },

    updateOrder(content, payload) {
      axios
        .put(
          `https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${payload.id}.json`,
          payload
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          throw new Error(error);
        });
    },

    zuweisenArtikelBestellung(content, payload) {
      console.log(payload.artikel)

      const ruluf = [...payload.artikel]
      console.log(ruluf)

      var productItem = {
        laufzeit: [
          {
            ruest: 0,
            laufzeit: 0,
            wer: "",
            maschine: "",
          },
        ],
      };

  
        for (let item of ruluf) {

          axios
          .post(
            `https://emcore-d87fa-default-rtdb.firebaseio.com/kunden/${payload.kunde.id}/bestellungen/${payload.bestellung.orderId}/artikel.json`,
            item
          )
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            throw new Error(error);
          });

          axios
          .post(
            `https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${item.id}/bestellungen.json`,
            productItem
          )
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            throw new Error(error);
          });
    
        }
   
  
    },

    clearOrder(content, [payload, id]) {
      const productItem = {
        id: payload.id,
        orderId: id,
      };
      axios
        .delete(
          `https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${productItem.id}/bestellungen/${productItem.orderId}.json`
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          throw new Error(error);
        });
    },
    deleteArtikel(content, payload) {
      const productItem = {
        id: payload,
      };
      axios
        .delete(
          `https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${productItem.id}.json`
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          throw new Error(error);
        });
    },

    addOrder(content, payload) {
      var id = payload.id;

      var productItem = {
        show: false,
        bestellung: payload.bestellung,
        menge: payload.menge,
        preis: payload.preis,
        werkstoff: payload.werkstoff,
        masse: payload.masse,
        laufzeit: [
          {
            ruest: 0,
            laufzeit: 0,
            wer: "",
            maschine: "",
          },
        ],
      };

      axios
        .post(
          `https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${id}/bestellungen.json`,
          productItem
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          throw new Error(error);
        });
    },

    fetchKunden(context) {
      axios
        .get(`https://emcore-d87fa-default-rtdb.firebaseio.com/kunden.json`)
        .then((response) => {
          const kundenDO = [];
          for (const id in response.data) {
            kundenDO.push({
              id: id,
              ...response.data[id],
            });
          }
          context.commit("setKunden", kundenDO);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    storeProduct(context, payload) {
      const productItem = {
        kunde: payload.kunde,
        bezeichnung: payload.bezeichnung,
        zeichnungsnummer: payload.zeichnungsnummer,
      };
      axios
        .post(
          `https://emcore-d87fa-default-rtdb.firebaseio.com/artikel.json`,
          productItem
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          throw new Error(error);
        });
    },

    storeOrder(context, payload) {
      var id = payload.kunde.id;
      const productItem = {
        bestellung: payload.bestellung,
        aktiv: true,
      };
      axios
        .post(
          `https://emcore-d87fa-default-rtdb.firebaseio.com/kunden/${id}/bestellungen.json`,
          productItem
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          throw new Error(error);
        });
    },
    createCustomer(context, payload) {
      const kunde = {
        name: payload.name,
      };
      axios
        .post(
          `https://emcore-d87fa-default-rtdb.firebaseio.com/kunden.json`,
          kunde
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          throw new Error(error);
        });
    },
  },
  modules: {},
});
