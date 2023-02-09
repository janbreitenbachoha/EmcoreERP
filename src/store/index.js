import { createStore } from "vuex";
import axios from "axios";
/* eslint-disable */

var mongoObjectId = function () {
	var timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
	return (
		timestamp +
		"xxxxxxxxxxxxxxxx"
			.replace(/[x]/g, function () {
				return ((Math.random() * 16) | 0).toString(16);
			})
			.toLowerCase()
	);
};

export default createStore({
	state: {
		products: [],
		all: [],
		kunden: [],
		bestellungen: [],
	},
	getters: {
		products: (state) => state.products,
		all: (state) => state.all,
		kunden: (state) => state.kunden,
		bestellung: (state) => state.bestellungen,
		product: (state) => (id) =>
			state.products.find((product) => product.id === id),
	},
	mutations: {
		setProducts(state, payload) {
			state.products = payload;
		},
		setAll(state, payload) {
			state.all = payload;
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
		async fetchProducts(context) {
			try {
				const response = await axios.get(
					`https://emcore-d87fa-default-rtdb.firebaseio.com/artikel.json`
				);
				if (response.data === null) return;

				const productsDO = Object.keys(response.data).map((id) => ({
					id,
					...response.data[id],
				}));
				context.commit("setProducts", productsDO);
			} catch (error) {
				console.error(error);
			}
		},

		getArticleAndOrderData(context) {
			axios
				.get(`https://emcore-d87fa-default-rtdb.firebaseio.com/artikel.json`)
				.then((articleResponse) => {
					const articleData = articleResponse.data ? articleResponse.data : [];

					axios
						.get(`https://emcore-d87fa-default-rtdb.firebaseio.com/kunden.json`)
						.then((orderResponse) => {
							const orderData = orderResponse.data;
							const combinedData = [];

							Object.entries(articleData).forEach(([index, article]) => {
								let artikelid = index;
								let orders = [];
								let data = {};
								Object.entries(orderData).forEach(([index, order]) => {
									if (article.kunde.kundenID === index && order.bestellungen) {
										data["name"] = order.name;
										const articleOrders = Object.entries(order.bestellungen);
										articleOrders.forEach(([index, articleOrder]) => {
											articleOrder["id"] = index;
											if (articleOrder.artikel) {
												const articleIds = Object.values(articleOrder.artikel);
												articleIds.forEach((articleId) => {
													if (articleId.artikelID === artikelid) {
														orders.push(articleOrder);
													}
												});
											}
										});
									}
								});

								article["id"] = index;

								const combinedArtikel = {
									artikel: article,
									orders: orders,
									data: data,
								};
								combinedData.push(combinedArtikel);
							});

							context.commit("setAll", combinedData);
						});
				});
		},
		async updateArtikel(content, payload) {
			const productItem = {
				_ID: payload.id,
				kunde: payload.kunde,
				bezeichnung: payload.bezeichnung,
				zeichnungsnummer: payload.zeichnungsnummer,
				werkstoff: payload.werkstoff,
				bestellungen: [],
			};

			try {
				const response = await axios.put(
					`https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${productItem.id}.json`,
					productItem
				);
				console.log(response);
			} catch (error) {
				throw new Error(error);
			}
		},

		async updateOrder(content, payload) {
			try {
				const response = await axios.put(
					`https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${payload.id}.json`,
					payload
				);
				console.log(response);
			} catch (error) {
				throw new Error(error);
			}
		},

		async updateKunde(context, payload) {
			try {
				const response = await axios.put(
					"https://emcore-d87fa-default-rtdb.firebaseio.com/kunden/${payload.id}.json",
					payload
				);
				console.log(response);
			} catch (error) {
				throw new Error(error);
			}
		},

		async zuweisenArtikelBestellung(context, payload) {
			try {
				const ruluf = [...payload.artikel];
				for (const item of ruluf) {
					const laden = {
						_ID: mongoObjectId(),
						artikelID: item.artikelID,
						status: item.status,
					};

					await axios.post(
						`https://emcore-d87fa-default-rtdb.firebaseio.com/kunden/${payload.kunde.id}/bestellungen/${payload.bestellung.orderId}/artikel.json`,
						laden
					);

					const productItem = {
						_ID: mongoObjectId(),
						bestellungID: payload.bestellung.orderId,
						menge: item.menge,
						laufzeit: [
							{
								ruest: 0,
								laufzeit: 0,
								wer: "",
								maschine: "",
							},
						],
					};

					await axios.post(
						`https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${item.artikelID}/bestellungen.json`,
						productItem
					);
				}
			} catch (error) {
				throw new Error(error);
			}
		},

		deleteArtikel(content, payload) {
			axios
				.delete(
					`https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${payload.artikel.id}.json`
				)
				.then((response) => {
					for (const order of payload.orders) {
						for (const [index, find] of Object.entries(order.artikel)) {
							if (payload.artikel.id === find.artikelID) {
								axios
									.delete(
										`https://emcore-d87fa-default-rtdb.firebaseio.com/kunden/${payload.artikel.kunde.kundenID}/bestellungen/${order.id}/artikel/${index}.json`
									)
									.then((response) => {
										console.log(response);
									})
									.catch((error) => {
										throw new Error(error);
									});
							}
						}
					}
				})
				.catch((error) => {
					throw new Error(error);
				});
		},

		async addOrder(content, payload) {
			try {
				const id = payload.id;
				const productItem = {
					_ID: mongoObjectId(),
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

				const response = await axios.post(
					`https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${id}/bestellungen.json`,
					productItem
				);

				console.log(response);
			} catch (error) {
				console.error(error);
			}
		},

		async fetchKunden(context) {
			try {
				const response = await axios.get(
					`https://emcore-d87fa-default-rtdb.firebaseio.com/kunden.json`
				);
				if (response.data === null) return;

				const kundenDO = Object.keys(response.data).map((id) => ({
					id,
					...response.data[id],
				}));
				context.commit("setKunden", kundenDO);
			} catch (error) {
				console.error(error);
			}
		},

		async storeProduct(context, payload) {
			try {
				const productItem = {
					_ID: mongoObjectId(),
					kunde: payload.kunde,
					bezeichnung: payload.bezeichnung,
					zeichnungsnummer: payload.zeichnungsnummer,
				};
				const response = await axios.post(
					`https://emcore-d87fa-default-rtdb.firebaseio.com/artikel.json`,
					productItem
				);
				console.log(response);
			} catch (error) {
				console.error(error);
			}
		},

		async storeOrder(context, payload) {
			try {
				const id = payload.kunde.id;
				const productItem = {
					_ID: mongoObjectId(),
					bestellung: payload.bestellung,
					aktiv: true,
					lieferdatum: payload.datum,
				};
				const response = await axios.post(
					`https://emcore-d87fa-default-rtdb.firebaseio.com/kunden/${id}/bestellungen.json`,
					productItem
				);
				console.log(response);
			} catch (error) {
				console.error(error);
			}
		},

		async createCustomer(context, payload) {
			try {
				const response = await axios.post(
					`https://emcore-d87fa-default-rtdb.firebaseio.com/kunden.json`,
					payload
				);
				console.log(response);
			} catch (error) {
				console.error(error);
			}
		},

    async sperren(context, payload) {
			try {
				var timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
        console.log(payload)
        const sperre ={
          sperre: payload.sperren,
		  sperreZeit:timestamp,
        }
				const response = await axios.patch(
					`https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${payload.id}.json`,
					sperre
				);
				console.log(response);
			} catch (error) {
				console.error(error);
			}
		},
	},
	modules: {},
});
