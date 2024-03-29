import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreateProductPage from "../views/CreateProductPage.vue";
import CreateCustomer from "../views/CreateCustomer.vue";
import ErstelleBestellungSeite from "../views/ErstelleBestellungSeite.vue";
import ZuweisungArtikelBestellung from "../views/ZuweisungArtikelBestellung.vue";
import ChatTest from "../views/ChatTest.vue";

const routes = [
	{
		path: "/",
		name: "home",
		component: HomeView,
	},
	{
		path: "/anlegen",
		name: "CreateProductPage",
		component: CreateProductPage,
	},
	{
		path: "/BestellungAnlegen",
		name: "ErstelleBestellungSeite",
		component: ErstelleBestellungSeite,
	},
	{
		path: "/ArtikelZuordnen",
		name: "ZuweisungArtikelBestellung",
		component: ZuweisungArtikelBestellung,
	},
	{
		path: "/KundeAnlegen",
		name: "CreateCustomer",
		component: CreateCustomer,
	},
	{
		path: "/Chat",
		name: "ChatTest",
		component: ChatTest,
	},
	{
		path: "/shop/read/product/:id",
		name: "ReadProduct",
		component: () =>
			import(/*webpackChunkName: 'group-shop' */ "@/views/ReadProductPage.vue"),
      props: true,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
