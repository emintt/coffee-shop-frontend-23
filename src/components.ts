import { Menu } from "./interface/Menu";
import { OfferDish } from "./interface/Offer";

// const apiUrl = 'https://jalkkari-server.northeurope.cloudapp.azure.com/';
const apiUrl = 'http://127.0.0.1:3000/';

// menu list for offers
const menuListHtmlForOffers = (dishes: OfferDish[]): string => {
	let html = '<h2 id="offers">Tarjoukset</h2><ul class="menu-list">';
	dishes.forEach((dish) => {
		const {dish_name, dish_price, offer_price, dish_photo, dish_id} = dish;
		html +=`
			<li class="menu-item" data-dish-id=${dish_id}>
				<img class="menu-img" src="${apiUrl + `media/` + dish_photo}" alt=" drink">
				<div class="menu-item-info">
					<p class="menu-item-name">${dish_name}</p>
					<p class="menu-item-price">
						<span class="old">${dish_price}</span>
						<span class="sale">${offer_price}</span>
					</p>
				</div>
			</li>
		`;
	});
	html += `</ul>`;
	return html;
}

// menu list for dishes for logged in user
const menuListHtml = (menuItems: Menu[]): string => {
	let html = '';
	menuItems.forEach((item: Menu) => {
		html += `
		<h2 id="${item.category_name}">${item.category_name}</h2>
		<ul class="menu-list">
		`;

		item.dishes.forEach((dish) => {
		const { dish_name, dish_price, offer_price, dish_photo, dish_id } = dish;
		html += `
			<li class="menu-item" data-dish-id=${dish_id}>
			<img class="menu-img" src="${apiUrl + `media/` + dish_photo}" alt=" drink">
			<div class="menu-item-info">
				<p class="menu-item-name">${dish_name}</p>

					`;
		if (offer_price) {
			html += `
				<p class="menu-item-price">
					<span class="old">${dish_price}</span>
					<span class="sale">${offer_price}</span>
				</p>`;
		} else {
			html += `
				<p class="menu-item-price">${dish_price}</p>`;
		}
		html += `
			</div>
			</li>
		`;
		});

		html += `
		</ul>
		`;
	});
	return html;
}

const errorModal = (message: string) => {
	const html = `
				<h3>Error</h3>
				<p>${message}</p>
				<button type="button" class="button" id="back-btn-error">Takaisin</button>
				`;
	return html;
};


const successModal = (message: string) => {
	const html = `
				<h3>Success</h3>
				<p>${message}</p>
				<button type="button" class="button" id="back-btn-success">Takaisin</button>
				`;
	return html;
}



export {errorModal, successModal, menuListHtmlForOffers, menuListHtml, apiUrl};
