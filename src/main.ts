import { apiUrl, errorModal, menuListHtml, menuListHtmlForOffers, successModal } from "./components";
import { fetchData1 } from "./function";
import { Dishes, Menu } from "./interface/Menu";
import { Offer } from "./interface/Offer";

const fetchData = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
	const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error(`Error ${response.status} occured`);
		}
	const json = response.json();
	return json;
};

// GET
// const apiUrl = 'https://jalkkari-server.northeurope.cloudapp.azure.com/';
// const apiUrl = 'http://127.0.0.1:3000/';
const allMenuItems = await fetchData<Menu[]>(apiUrl + 'api/dish');

allMenuItems.forEach((item: Menu) => {
	const menuText = () => {
		let html = `
		<h2 id="${item.category_name}">${item.category_name}</h2>
		<ul class="menu-list">
		`;

		item.dishes.forEach((dish) => {
			const { dish_photo, dish_name, dish_price, dish_id } = dish;
			html += `
			<li class="menu-item" data-dish-id=${dish_id}>
			<img class="menu-img" src="${apiUrl + `media/` + dish_photo}" alt="drink">
			<div>
			<p class="menu-item-name">${dish_name}</p>
			<p class="menu-item-price">${dish_price}</p>
			</div>
			</li>
			`;
		});

		html += `
		</ul>
		`;

		return html;
	};

	const menuTextHtml = menuText();
	document.querySelector('.menu-items')?.insertAdjacentHTML('beforeend', menuTextHtml);

});

// GET ID

const fetchDishDetails = async (dishId: number): Promise<Dishes | null> => {
	try {
		let dishDetails: Dishes;
		const token = localStorage.getItem('token');
		if (token) {
			dishDetails = await getDish(token, dishId);
		} else {
	  		dishDetails = await fetchData<Dishes>(apiUrl + `api/dish/${dishId}`);
		}
	  return dishDetails;
	} catch (error) {
	  console.error(`Error fetching dish details for dish_id ${dishId}:`, error);
	  return null;
	}
};




  // Add event listener to each menu item
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach((menuItem) => {
	menuItem.addEventListener('click', (event) => {
	  const dishId = (event.currentTarget as HTMLElement).dataset.dishId;
	  console.log(dishId);
	  if (dishId) {
		displayDishDetails(Number(dishId));
	  }
	});
  });


  const displayDishDetails = async (dishId: number) => {
	const dishDetails = await fetchDishDetails(dishId);

	if (dishDetails) {
	  // Display the details in a modal, for example
	  console.log('Dish Details:', dishDetails);

	  const { dish_photo, dish_name, dish_price, dish_id, description, offer_price } = dishDetails;

	  // Use the fetched details in your HTML
	  const html = `
		<div class="menu-item" data-dish-id="${dish_id}">
		  <img class="menu-img" src="${apiUrl + `media/` + dish_photo}" alt="drink">
		  <div>
			<p class="menu-item-name">${dish_name}</p>
			<p>${description}</p>
			<p class="menu-item-price">${offer_price ?? dish_price}</p>
		  </div>
		</div>
	  `;

	  const infoItemContainer = document.querySelector('.info-item');

	  // Check if infoItemContainer is not null before manipulating it
	  if (infoItemContainer) {
		// Clear existing content before inserting the new HTML
		infoItemContainer.innerHTML = '';

		infoItemContainer.insertAdjacentHTML('beforeend', html);

				// when a input of quantity is changed, check the input
		const quantityInput = document.querySelector('.quantity-number') as HTMLInputElement;
		// console.log(quantityInput);
		quantityInput?.addEventListener('change', () => {
			console.log(quantityInput.value);
			if (!quantityInput?.value) return;
			// check if the value inside input is a valid number
			const value = +quantityInput.value;
			console.log(value);
			if (isNaN(value) || value <= 0)  {
				quantityInput.value = '1';
			}
		});

	  } else {
		console.error('infoItemContainer is null');
	  }
	} else {
	  console.log('Unable to fetch dish details');
	}
  };
	const plusBtns = document.querySelectorAll('.quantity-plus');
	plusBtns.forEach((plusBtn) => {
		plusBtn.addEventListener('click', (event) => {
			const clickedPlusBtn = event.target as HTMLButtonElement;
			console.log('clicked');
			const quantityE = clickedPlusBtn?.parentElement?.previousElementSibling as HTMLInputElement;
			let quantity = parseInt(quantityE?.value);
			quantity++;
			quantityE.value = quantity.toString();
			console.log(quantityE.value);
		});
	});
	const minusBtns = document.querySelectorAll('.quantity-minus');
	minusBtns.forEach((minusBtn) => {
		minusBtn.addEventListener('click', (event) => {
			const clickedPlusBtn = event.target as HTMLButtonElement;
			console.log('clicked');
			const quantityE = clickedPlusBtn?.parentElement?.nextElementSibling as HTMLInputElement;
			let quantity = parseInt(quantityE?.value);
			quantity--;
			quantityE.value = quantity.toString();
		});
	});




// select dialog element from DOM
const dialog = document.querySelector('dialog');
const menuItemDialog = document.querySelector('#product-info-dialog') as HTMLDialogElement | null;
const loginDialog = document.querySelector('#login-dialog') as HTMLDialogElement | null;
const shoppingCartDialog = document.querySelector('#shopping-cart-dialog') as HTMLDialogElement | null;
const infoDialog = document.querySelector('#info') as HTMLDialogElement | null;


// select menu item elements from DOM
const menuItemEls = document.querySelectorAll('.menu-item');
// console.log(menuItemEls);
menuItemEls.forEach((item) => {
	item.addEventListener('click', () => {
		menuItemDialog?.showModal();
	})
	// document.body.style.overflow = "auto";
});

const shoppingCartIcon = document.querySelector('#shopping-cart-icon') as HTMLElement | null;
shoppingCartIcon?.addEventListener('click', () => {
	shoppingCartDialog?.showModal();
	// document.body.style.overflow = "auto";
});

const closeDialogBtnInfo = document.querySelector('#back-btn-info') as HTMLDialogElement;
closeDialogBtnInfo.addEventListener('click', () => {
	dialog?.close();
});

const closeDialogBtnLogin = document.querySelector('#back-btn-login') as HTMLButtonElement;
closeDialogBtnLogin.addEventListener('click', () => {
	loginDialog?.close();
});

const closeDialogBtnCart = document.querySelector('#back-btn-cart') as HTMLButtonElement;
closeDialogBtnCart.addEventListener('click', () => {
	shoppingCartDialog?.close();
});



// select login form from the DOM
const loginForm = document.querySelector('#login-form') as HTMLFormElement | null;
// select login inputs from the DOM
const profileIconE = document.querySelector('#profile-icon') as HTMLElement | null;

const loginBtn = document.querySelector('#login') as HTMLButtonElement |null;
// const memberNumberInput = document.querySelector(
//   '#member-number'
// ) as HTMLInputElement | null;
// const passwordInput = document.querySelector(
//   '#login-password'
// ) as HTMLInputElement | null;

if (!loginBtn) {
	throw new Error('Login button not found');
}

if (!infoDialog) {
	throw new Error('Dialog not found');
}
// function to login
const login = async (user: {
	membernumber: string,
	password: string
  }): Promise<LoginUser> => {
	const options: RequestInit = {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json'
	  },
	  body: JSON.stringify(user),
	}
	return await fetchData1<LoginUser>(apiUrl + 'api/auth/login', options);
};

// function to get user offers
const getOffers = async (token: string):Promise<Offer> => {
	const options: RequestInit = {
		method: 'GET',
		headers: {
			 Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json'
		}
	};
	return await fetchData1<Offer>(apiUrl + 'api/dish/offers', options);
}

// function to get menu when user is logged on
const getDishesWithOffers = async (token: string):Promise<Menu[]> => {
	const options: RequestInit = {
		method: 'GET',
		headers: {
			 Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json'
		}
	};
	return await fetchData1<Menu[]>(apiUrl + 'api/dish/logged', options);
}
// function to get item by id when logged on
const getDish = async (token: string, id:number):Promise<Dishes> => {
	const options: RequestInit = {
		method: 'GET',
		headers: {
			 Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json'
		}
	};
	return await fetchData1<Dishes>(apiUrl + 'api/dish/'+ id, options);
}

// function to check if token exists and dipsplay offers
const checkToken = async () => {
	const token = localStorage.getItem('token');
	console.log(token);
	if (!token) {
		return;
	}
	const offerData = await getOffers(token);
	// select menu element from DOM
	const target = document.querySelector('.menu-items') as HTMLUListElement | null;
	// empty old menu
	if (target) {
		target.innerHTML = '';
	}
	// add offers to DOM
	const addOffersToDOM = (offerData: Offer) => {
		const target = document.querySelector('.menu-items') as HTMLUListElement | null;
		// render offer
		const html = menuListHtmlForOffers(offerData.offer_dishes);
		console.log(offerData);
		target?.insertAdjacentHTML('afterbegin', html);

		// display offer icon on nav bar
		const navBarDiscount = document.querySelector('.nav-item.discount');
		navBarDiscount?.classList.remove('hidden');
	}
	addOffersToDOM(offerData);

	const menuItemsWithOffers = await getDishesWithOffers(token);
	console.log(menuItemsWithOffers);
	// add menu with offers to DOM
	const addMenuToDOM = (menuItemsWithOffers: Menu[]) => {
		const target = document.querySelector('.menu-items') as HTMLUListElement | null;
		const html = menuListHtml(menuItemsWithOffers);
		target?.insertAdjacentHTML('beforeend', html);
	}
	addMenuToDOM(menuItemsWithOffers);
	// select menu item elements from DOM
	const menuItemEls = document.querySelectorAll('.menu-item');
	// add event listener for menu item
	menuItemEls.forEach((item) => {
		item.addEventListener('click', (event) => {
			const dishId = (event.currentTarget as HTMLElement).dataset.dishId;
			console.log(dishId);
			if (dishId) {
				displayDishDetails(Number(dishId));
			}
			menuItemDialog?.showModal();
		})
		// document.body.style.overflow = "auto";
	});


}



checkToken();

profileIconE?.addEventListener('click', () => {
	const userToken = localStorage.getItem('token') as string | null;
	// if user is not logged in yet, show login modal
	// console.log(userToken);
	console.log(loginDialog);
	if (userToken === null) {
		loginDialog?.showModal();
		// document.body.style.overflow = "auto";

		loginForm?.addEventListener('submit', async (event) => {
			try {
				event.preventDefault();
				const user = {
					membernumber: loginForm.membernumber.value,
					password: loginForm.loginpassword.value
				};
				const loginData = await login(user);
				console.log('loginData', loginData);
				// save token to local storage
				localStorage.setItem('token', loginData.token);
				loginDialog?.close();

				// update DOM using token
				checkToken();

			} catch (err) {
				console.log(err);
				const infoHTML = (err as Error).message + `. Kirjautuminen epäonnistui. Yritä uudelleen`;
				infoDialog.innerHTML = errorModal(infoHTML);
				infoDialog.showModal();
				loginDialog?.close();
				const closeDialogBtnError = document.querySelector('#back-btn-error') as HTMLButtonElement;
				closeDialogBtnError?.addEventListener('click', () => {
					infoDialog?.close();
				});
				console.log('close button', closeDialogBtnError);
				console.log(infoDialog);
			}

		});
	} else {
		// user is already logged in
		const infoHTML = `Olet nyt kirjautunut sisään. Nauti tarjouksistasi!`;
		infoDialog.innerHTML = successModal(infoHTML);
		infoDialog.showModal();
		// close info dialog
		const closeDialogBtnSuccess = document.querySelector('#back-btn-success') as HTMLButtonElement | null;
		closeDialogBtnSuccess?.addEventListener('click', () => {
			infoDialog?.close();
		});
	}

});

// CART


const ready = () => {

// when a remove btn is clicked, remove the item and update total
const cartRemoveBtns = document.querySelectorAll('.remove-btn');
for (let btn of cartRemoveBtns) {
	btn.addEventListener('click', (event) => {
		console.log('clicked');
		const buttonClicked = event.target as HTMLButtonElement | null;
		buttonClicked?.parentElement?.remove();
		updateCartTotal();
	});
}

// when a input of quantity is changed, check the input and update cart
const cartQuantityInputs = document.querySelectorAll('.cart-quantity-number');
cartQuantityInputs.forEach((quantityInput) => {
	quantityInput.addEventListener('change', (event) => {
		const inputChanged = event.target as HTMLInputElement | null;
		console.log('change');
		if (!inputChanged?.value) return;
		// check if the value inside input is a valid number
		const value = +inputChanged.value;
		if (isNaN(value) || value <= 0)  {
			inputChanged.value = '1';
		}
		updateCartTotal();
	});
});

// when a add to cart button is clicked, add dish to cart
const addTocartBtns = document.querySelectorAll('.addtocart-btn');
console.log(addTocartBtns);
addTocartBtns?.forEach((button) => {
	button.addEventListener('click', (event) => {
		const buttonClicked = event.target as HTMLButtonElement | null;
		console.log('add to cart');
		// get dish name and price
		const productIfo = buttonClicked?.parentElement?.parentElement;
		const dishName = productIfo?.querySelector('.menu-item-name')?.innerHTML;
		const dishPrice = productIfo?.querySelector('.menu-item-price')?.innerHTML;
		if (!dishName || !dishPrice) {
			throw new Error(`title or price not found`);
		}
		addItemToCart(dishName, dishPrice);
		updateCartTotal();
	});
});

// when "maksamaan" button is clicked, remove all the items on the cart
document.querySelector("#paymentbtn")?.addEventListener('click', () => {
	alert('Thank you for your purchase');
	const cartList = document.querySelector('.cart-item-list') as HTMLElement | null;
	while (cartList?.hasChildNodes()) {
		cartList.removeChild(cartList.firstChild as ChildNode);
	}
	updateCartTotal();
});;

}

// check if documents is loaded
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', ready)
} else {
	ready();
}
console.log('cart!');

// function to update total price for cart
const updateCartTotal = () => {
	const cartItemsContainer = document.querySelectorAll('.cart-item-list')[0];
	const cartItems = cartItemsContainer.querySelectorAll('.cart-item-row');
	let total = 0;
	cartItems.forEach((row) => {
		const priceE = row.querySelector('.price') as HTMLElement | null;
		const quantityE = row.querySelector('.cart-quantity-number') as HTMLInputElement | null;
		if (!priceE?.innerText) {
			return;
		}
		const price = parseFloat(priceE?.innerText);
		const quantity = (quantityE?.value);
		if (!quantity) {
			return;
		}
		total += price*parseFloat(quantity);

	});
	const totalStr = total.toFixed(2);
	const cartTotal = document.querySelector('#cart-total') as HTMLElement | null;
	if (!cartTotal?.innerText) return;
	cartTotal.innerText = totalStr;

}


// function to add item to cart
const addItemToCart = (name: string, price: string) => {
	const cartRow = document.createElement('div');
	const cartList = document.querySelector('.cart-item-list') as HTMLElement | null;
	cartRow.classList.add('cart-item-row');
	// check if a dish is already added
	const cartItems = cartList?.querySelectorAll('.cart-item-title');
	if (!cartItems) {
		return;
	}
	for (let item of cartItems) {
		if (item.innerHTML === name) {
			alert('This item is already added to the cart');
			return;
		}
	};
	const cartRowContents = `
			<div class="cart-item">
                <p class="cart-item-title">${name}</p>
            </div>
            <div class="cart-item-price">
                <span class="price">${price}</span><span>&#x20AC;</span>
            </div>
            <div class="quantity">
                <input type="number" class="cart-quantity-number" value="1">
            </div>
            <button class="button remove-btn">Poista</button>`;
	cartRow.innerHTML = cartRowContents;
	cartList?.appendChild(cartRow);
	alert(`${name} is added to cart.`);
	// add event listener for new remove button
	cartRow.querySelector('.remove-btn')?.addEventListener('click', (event) => {
		console.log('clicked');
		const buttonClicked = event.target as HTMLButtonElement | null;
		buttonClicked?.parentElement?.remove();
		updateCartTotal();
	});

	// add event listener for NEW quantity input
	// when a input of quantity is changed, check the input and update cart
	cartRow.querySelector('.cart-quantity-number')?.addEventListener('change', (event) => {
		const inputChanged = event.target as HTMLInputElement | null;
		console.log('change');
		if (!inputChanged?.value) return;
		// check if the value inside input is a valid number
		const value = +inputChanged.value;
		if (isNaN(value) || value <= 0)  {
			inputChanged.value = '1';
		}
		updateCartTotal();
	});
}
