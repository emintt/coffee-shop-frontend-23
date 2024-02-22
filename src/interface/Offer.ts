interface Offer {
	offer_dishes: OfferDish[];
}


interface OfferDish{
	dish_id: number;
	dish_name: string;
	dish_price: number;
	offer_price: number;
	description: string;
	dish_photo: string;
}


export type {Offer, OfferDish}
