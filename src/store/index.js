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

		getArticleAndOrderData() {
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
                console.log(index)
								let orders = [];
								Object.values(orderData).forEach((order) => {
									if (article.kunde.name === order.name && order.bestellungen) {
										const articleOrders = Object.values(order.bestellungen);
										articleOrders.forEach((articleOrder) => {
											if (articleOrder.artikel) {
												const articleIds = Object.values(articleOrder.artikel);

												articleIds.forEach((articleId) => {
													if (articleId.artikelID === article.id) {
														const combinedItem = {
															order: articleOrder,
														};
														orders.push(combinedItem);
													}
												});
											}
										});
									}
								});
								const combinedArtikel = {
									Artikel: article,
									orders: orders,
								};
								combinedData.push(combinedArtikel);
							});

							console.log(combinedData);
							return combinedData;
						});
				});
		},

		fetchBestellungen(context) {
			axios
				.get(`https://emcore-d87fa-default-rtdb.firebaseio.com/kunden.json`)
				.then((response) => {
					const bestellungDO = [];

					for (const id in response.data) {
						bestellungDO.push({
							...response.data[id].bestellungen,
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
