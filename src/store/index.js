import { createStore } from "vuex";
import axios from "axios";


export default createStore({
  state: {
    products: [],
    kunden: [],
    bestellungen: [],
  },
  getters: {
    products: (state) => state.products,
    kunden: (state) => state.kunden,
    bestellung: (state) => state.bestellungen,
    product: (state) => (id) =>
      state.products.find((product) => product.id === id),
  },
  mutations: {
    setProducts(state, payload) {
      state.products = payload;
    },
    setBestellungen(state, payload) {
      state.bestellungen = payload;
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

    fetchBestellungen(context) {
      axios
        .get(`https://emcore-d87fa-default-rtdb.firebaseio.com/kunden.json`)
        .then((response) => {
          const bestellungDO = [];

          for (const id in response.data) {
            bestellungDO.push({ 
              ...response.data[id].bestellungen 
            });
          }
        
          context.commit("setBestellungen", bestellungDO);
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

      const ruluf = [...payload.artikel];
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

          console.log(item.id)

        let productItem = {
          bestellungID: payload.bestellung.orderId,
          bestellung: payload.bestellung.order.bestellung,
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
            `https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${item.artikelID}/bestellungen.json`,
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
        lieferdatum: payload.datum,
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

      console.log(payload)
      axios
        .post(
          `https://emcore-d87fa-default-rtdb.firebaseio.com/kunden.json`,
          payload
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
