<template>
	<TheShopLayout>
		<template #default>
			<div v-if="produkt">
			<div v-if="!produkt.artikel.sperre">
				<div class="row">
					<div class="col-12">
						<h1 class="mt-4 text-center">Produktdetails</h1>
						<div>
							<Toast />
							<ConfirmDialog></ConfirmDialog>
							<ConfirmDialog group="templating">
								<template #message="slotProps">
									<div class="flex p-4">
										<i
											:class="slotProps.message.icon"
											style="font-size: 1.5rem"
										></i>
										<p class="pl-2">{{ slotProps.message.message }}</p>
									</div>
								</template>
							</ConfirmDialog>
							<ConfirmDialog group="positionDialog"></ConfirmDialog>
						</div>
						<div class="card mt-4" v-if="produkt">
							<div class="row no-gutters">
								<div class="col-md-12">
									<div class="card-body">
										<div class="d-flex justify-content-between">
											<button
												class="btn btn-sm btn-danger col-2"
												@click="$router.go(-1)"
											>
												Zurück
											</button>
											<button
												class="btn btn-sm btn-danger col-2"
												@click="deleteArtikel()"
											>
												Artikel Löschen
											</button>
											<button
												type="submit"
												@click="updateProduct()"
												class="btn btn-sm btn-success col-2"
											>
												Speichern
											</button>
										</div>
										<div class="row mt-3">
											<div class="col-12">
												<form>
													<div class="form-group">
														<label for="kunde">Kunde</label>
														<input
															type="text"
															class="form-control"
															id="kunde"
															disabled
															aria-describedby="emailHelp"
															v-model="produkt.data.name"
														/>
														<label for="bezeichnung">Bezeichnung</label>
														<input
															type="text"
															class="form-control"
															id="bezeichnung"
															aria-describedby="emailHelp"
															v-model="produkt.artikel.bezeichnung"
														/>
														<label for="zeichnungsnummer"
															>Zeichnungsnummer</label
														>
														{{ produkt.artikel.sperreZeit }}
														<input
															type="text"
															class="form-control"
															id="zeichnungsnummer"
															aria-describedby="emailHelp"
															v-model="produkt.artikel.zeichnungsnummer"
														/>

														<label for="bemerkungen">Bermerkungen</label>
														<textarea
															type=" textaria"
															class="form-control"
															id="bemerkungen"
															aria-describedby="emailHelp"
															v-model="produkt.artikel.bemerkungen"
														/>
													</div>
												</form>
											</div>
											<div class="row mt-3">
												<h4 class="col-10">Bestellungen</h4>
											</div>

											<hr class="mt-2" />
											<div
												class="container row mt-2 d-flex justify-content-center"
											>
												<button
													v-for="test in produkt.orders"
													:key="test"
													class="btn btn-primary col-2 m-1"
													@click="openModal(produkt, test)"
												>
													{{ test.bestellung }}
												</button>

												<!--
                      <TheBestellungen
                        :id="index"
                        @update-product="updateProduct()"
                        :product="position"
                        @clear-order="clearOrder"
                      ></TheBestellungen>
                      --></div>
											<ModalComponent
												v-if="modalItem"
												@close="hideModal"
												:item="modalItem"
												:id="modalId"
												@update-product="updateProduct()"
											></ModalComponent>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="mt-5">
				<div class="card">
					<div class="card-header">Achtung</div>
					<div class="card-body">
						<h5 class="card-title">Dieser Artikel wird bereits bearbeitet</h5>
						<button class="btn btn-sm btn-danger col-2" @click="$router.go(-1)">
							Zurück
						</button>
					</div>
				</div>
			</div>
		</div>
		</template>
	</TheShopLayout>
</template>

<script>
	import ConfirmDialog from "primevue/confirmdialog";
	import Toast from "primevue/toast";
	// import TheBestellungen from "@/components/TheBestellungen.vue";
	import ModalComponent from "@/components/ModalComponent.vue";
	import TheShopLayout from "@/views/TheShopLayout";
	import axios from "axios";
	export default {
		name: "ReadProductPage",
		components: {
			ConfirmDialog,
			Toast,
			// TheBestellungen,
			ModalComponent,
			TheShopLayout,
		},
		data() {
			return {
				modalItem: null,
				modalId: null,
				isActive: true,
				isHidden: false,
				ergebniss: {},
				produkt: null,
			};
		},

		beforeUnmount() {
			if (!this.produkt.artikel.sperre) {
				const sperren = {
					id: this.id,
					sperre: false,
				};
				this.$store.dispatch("sperren", sperren);
				window.removeEventListener("beforeunload", this.releaseArticle);
			}
		},

		async beforeCreate() {
			await this.$store.dispatch("getArticleAndOrderData");
		},

		async created() {
			let users = await this.$store.getters.all;
			let result = await users.find((p) => p.artikel.id === this.id);
			this.produkt = result;
		},

		mounted() {
			const sperren = {
				id: this.id,
				sperre: true,
				sperreZeit:new Date().getTime(),
			};
			this.$store.dispatch("sperren", sperren);
			window.addEventListener("beforeunload", this.releaseArticle.bind(this));
			
		},

		props: {
			id: String,
		},
		computed: {
			product() {
				return this.$store.getters.product(this.id);
			},
			kunden() {
				return Object.values(this.$store.getters.kunden);
			},
			reversedKeys() {
				const matchingOrders = [];

				for (const customer of Object.values(this.kunden)) {
					for (const [orderId, order] of Object.entries(
						customer.bestellungen
					)) {
						if (this.product.bestellungen) {
							const filteredProducts = Object.values(
								this.product.bestellungen
							).filter((p) => p.bestellungID === orderId);

							const produc = filteredProducts[0];

							if (
								Object.values(this.product.bestellungen).some(
									(articleOrder) => orderId === articleOrder.bestellungID
								)
							) {
								matchingOrders.push({ produc, orderId, order });
							}
						}
					}
				}

				return matchingOrders;
			},
		},
		methods: {
			releaseArticle() {
				const sperren = {
					sperre: false,
				};
				axios.patch(
					`https://emcore-d87fa-default-rtdb.firebaseio.com/artikel/${this.id}.json`,
					sperren
				);
			},
			openModal(item, test) {
				this.modalItem = item;
				this.modalId = test;
			},
			hideModal() {
				this.modalItem = null;
			},
			deleteArtikel() {
				this.$confirm.require({
					message: "Wollen Sie die Bestellung wirklich löschen?",
					header: "Bestellung Löschen",
					icon: "pi pi-info-circle",
					acceptClass: "p-button-danger",
					accept: () => {
						this.$store.dispatch("deleteArtikel", this.produkt);
						setTimeout(() => {
							this.$store.dispatch("fetchProducts");
							this.$store.dispatch("fetchKunden");
							this.$store.dispatch("getArticleAndOrderData");
						}, 500);
						this.$router.go(-1);
					},
					reject: () => {
						this.$toast.add({
							severity: "error",
							summary: "Abgebrochen",
							detail: "Artikel wurde nicht gelöscht",
							life: 3000,
						});
					},
				});
			},
			updateProduct() {
				const produkt = this.produkt.artikel;
				this.$store.dispatch("updateOrder", produkt);
				setTimeout(() => {
					this.$store.dispatch("fetchProducts");
				}, 500);
				this.$toast.add({
					severity: "success",
					summary: "Gespeichert",
					detail: "erfolgreich gespeichert",
					life: 3000,
				});
			},
		},
	};
</script>

<style scoped></style>
