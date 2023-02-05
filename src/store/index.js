import { createStore } from "vuex";
import axios from "axios";

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

		getArticleAndOrderData(context) {
			axios
				.get(`https://emcore-d87fa-default-rtdb.firebaseio.com/artikel.json`)
				.then((articleResponse) => {
					const articleData = articleResponse.data;

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

		updateKunde(content, payload) {
			axios
				.put(
					`https://emcore-d87fa-default-rtdb.firebaseio.com/kunden/${payload.id}.json`,
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
				const laden = {
					artikelID: item.artikelID,
					status: item.status,
				};

				axios
					.post(
						`https://emcore-d87fa-default-rtdb.firebaseio.com/kunden/${payload.kunde.id}/bestellungen/${payload.bestellung.orderId}/artikel.json`,
						laden
					)
					.then((response) => {
						console.log(response);
					})
					.catch((error) => {
						throw new Error(error);
					});

				//console.log(item);

				let productItem = {
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
			axios
				.delete(
					`https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${payload.id}.json`
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
				_ID: mongoObjectId(),
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
			console.log(payload);
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
