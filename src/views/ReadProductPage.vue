<template>
	<TheShopLayout>
		<template #default>
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
					<div class="card mt-4" v-if="product">
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
														aria-describedby="emailHelp"
														v-model="product.kunde.name"
													/>
													<label for="bezeichnung">Bezeichnung</label>
													<input
														type="text"
														class="form-control"
														id="bezeichnung"
														aria-describedby="emailHelp"
														v-model="product.bezeichnung"
													/>
													<label for="zeichnungsnummer">Zeichnungsnummer</label>
													<input
														type="text"
														class="form-control"
														id="zeichnungsnummer"
														aria-describedby="emailHelp"
														v-model="product.zeichnungsnummer"
													/>

													<label for="bemerkungen">Bermerkungen</label>
													<textarea
														type=" textaria"
														class="form-control"
														id="bemerkungen"
														aria-describedby="emailHelp"
														v-model="product.bemerkungen"
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
												v-for="key in reversedKeys"
												:key="key"
												class="btn btn-primary col-2 m-1"
												@click="openModal(product.bestellungen[key], key)"
											>
												{{ product.bestellungen[key].bestellung }}
											</button>

											<!--
                      <TheBestellungen
                        :id="index"
                        @update-product="updateProduct()"
                        :product="position"
                        @clear-order="clearOrder"
                      ></TheBestellungen>
                      -->
										</div>
										<ModalComponent
											v-if="modalItem"
											@close="hideModal"
											:item="modalItem"
											:id="modalId"
											@clear-order="clearOrder"
											@update-product="updateProduct()"
										></ModalComponent>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
	</TheShopLayout>
</template>

<script>
	import TheShopLayout from "@/views/TheShopLayout";
	import ConfirmDialog from "primevue/confirmdialog";
	import Toast from "primevue/toast";
	// import TheBestellungen from "@/components/TheBestellungen.vue";
	import ModalComponent from "@/components/ModalComponent.vue";
	export default {
		name: "ReadProductPage",
		components: {
			TheShopLayout,
			ConfirmDialog,
			Toast,
			// TheBestellungen,
			ModalComponent,
		},
		data() {
			return {
				modalItem: null,
				modalId: null,
				isActive: true,
				isHidden: false,
				results: [],
			};
		},

		props: {
			id: String,
		},
		/*   data() {
    return {
      id: null,
    };
  }, */
		computed: {
			product() {
				return this.$store.getters.product(this.id);
			},
			kunden() {
				return Object.values(this.$store.getters.kunden);
			},
			reversedKeys() {
				const test = Object.values(this.product.bestellungen);
				const lalo = [];
				const laloo = [];

				for (let item of test) {
					lalo.push(item.bestellungID);
				}

				const filteredProducts = Object.values(this.kunden).filter(
					(p) => p.name === this.product.kunde.name
				);

				filteredProducts.forEach(function (item) {
					laloo.push(item.bestellungen );
				});

				console.log(laloo);

				console.log(lalo);

				return false;
			},
		},
		methods: {
			openModal(item, index) {
				this.modalItem = item;
				this.modalId = index;
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
						this.$store.dispatch("deleteArtikel", this.id);
						setTimeout(() => {
							this.$store.dispatch("fetchProducts");
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
			clearOrder(index) {
				console.log(index);
				this.$confirm.require({
					message: "Wollen Sie die Bestellung wirklich löschen?",
					header: "Bestellung Löschen",
					icon: "pi pi-info-circle",
					acceptClass: "p-button-danger",
					accept: () => {
						this.$toast.add({
							severity: "success",
							summary: "Gelöscht",
							detail: "Bestellung gelöscht",
							life: 3000,
						});
						this.$store.dispatch("clearOrder", [this.product, index]);
						setTimeout(() => {
							this.$store.dispatch("fetchProducts");
						}, 500);
					},
					reject: () => {
						this.$toast.add({
							severity: "error",
							summary: "Abgebrochen",
							detail: "Bestellung wurde nicht gelöscht",
							life: 3000,
						});
					},
				});
			},
			updateProduct() {
				this.$store.dispatch("updateOrder", this.product);
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
