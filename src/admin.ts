import { apiUrl, errorModal, successModal } from "./components";
import {Menu} from "./interface/Menu";

// GET
const fetchData = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
	const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error(`Error ${response.status} occured`);
		}
	const json = response.json();
	return json;
};

const checkToken = async () => {
	const token = localStorage.getItem('token');
	console.log(token);
	// redirect to login page if user is not logged in
	if (!token) {
		console.log(window.location.href);
		if (!window.location.href.includes('login-admin.html')) {
			window.location.href = 'login-admin.html';
		}
	} else {
		return true;
	}
};
checkToken();
const allMenuItems = await fetchData<Menu[]>(apiUrl + 'api/dish');
allMenuItems.forEach((item: Menu) => {
	const menuText = () => {
	let html = `
		<h2 id="${item.category_name}">${item.category_name}</h2>
		<ul class="menu-list">
	`;

	item.dishes.forEach((dish) => {
		const { dish_name, dish_price, dish_photo, dish_id } = dish;
		html += `
			<li class="menu-item" data-dish-id=${dish_id}>
			<img class="menu-img" src="${apiUrl + `media/` + dish_photo}" alt="drink">
			<div class="menu-item-info">
				<p class="menu-item-name">${dish_name}</p>
				<p class="menu-item-price">${dish_price}</p>
			</div>

		`;
		// add muokkaus buttoni jos on menu admin sivulla
		if (document.querySelector('.menu-container')?.classList.contains('menu-admin')) {
			html += `<div class="menu-item-btns"><button class="menu-modify-btn button">Muokkaa</button>
			<button class="menu-delete-btn button">Poista</button></div>`;
		}

		if (document.querySelector('.menu-container')?.classList.contains('offer-admin')) {
			html += `<div class="menu-item-btns"><button id="offer-activate" class="button">Aktivoi</button>
			<button id="offer-delete" class="button">Poista</button></div>`;
		}

		html += `	</li>`;
	});

	html += `

	</ul>
	`;

	return html;
};

const menuTextHtml = menuText();
document.querySelector('.menu-items')?.insertAdjacentHTML('beforeend', menuTextHtml);

});


// PUT

const modifyItem = async (token:string, dish_id: number, data: FormData) => {
	console.log(data);
	try {
		const response = await fetchData<any>(apiUrl + `api/dish/${dish_id}`, {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + token,
			},
			body: data,
		});
		return response;
	} catch (error) {
		console.error('Error modifying item:', error);
		throw error;
	}
};

const menuItems = document.querySelectorAll('.menu-item');

let selectedDishId: string | undefined;

menuItems.forEach((menuItem) => {
  menuItem.addEventListener('click', (event) => {
    selectedDishId = (event.currentTarget as HTMLElement).dataset.dishId;
    console.log(selectedDishId);
  });
});
// select info dialog from DOM
const infoDialog = document.querySelector('#info') as HTMLDialogElement | null;
if (!infoDialog) {
	throw new Error('Info dialog not found');
}

document.getElementById('item-modify-form')?.addEventListener('submit', async (event) => {
	console.log('sumit');
	console.log();
	event.preventDefault();

	if (selectedDishId) {
		const token = localStorage.getItem('token');
		if (!token) {
			return;
		};

		const itemId: number = parseInt(selectedDishId);
		console.log(itemId);
		const nameInput: HTMLInputElement | null = document.querySelector('#modify-item-dialog input[name="dish_name"]');
		const priceInput: HTMLInputElement | null = document.querySelector('#modify-item-dialog input[name="dish_price"]');
		const descriptionInput: HTMLTextAreaElement | null = document.querySelector('#modify-item-dialog textarea[name="description"]');
		const categorySelect: HTMLSelectElement | null = document.querySelector('#modify-item-dialog select[name="category_id"]');
		const fileInput: HTMLInputElement | null = document.querySelector('#modify-item-dialog input[name="dish_photo"]');
		if (!nameInput || !priceInput || !descriptionInput || !categorySelect || !fileInput?.files) {
			return;
		}
		const dish_name: string = nameInput?.value;
		const dish_price: string = priceInput?.value;
		const description: string = descriptionInput?.value;
		const category_id: string = categorySelect?.value;
		const dish_photo: File = fileInput?.files?.[0];
		const formData = new FormData();
		formData.append('dish_name', dish_name);
		formData.append('dish_price', dish_price);
		formData.append('description', description);
		formData.append('category_id', category_id);
		formData.append('dish_photo', dish_photo);
		try {
			const result = await modifyItem(token, itemId, formData);
			console.log(result);
			const infoHTML = `Päivitys onnistui!`;
			infoDialog.innerHTML = successModal(infoHTML);
			infoDialog.showModal();
			// close info dialog
			const closeDialogBtnSuccess = document.querySelector('#back-btn-success') as HTMLButtonElement | null;
			closeDialogBtnSuccess?.addEventListener('click', () => {
				infoDialog?.close();
			});
			// close modify form
			modifyDialog?.close();
			location.reload();
		} catch (error) {
			console.error('Error modifying item:', error);
			const infoHTML = (error as Error).message;
			infoDialog.innerHTML = errorModal(infoHTML);
			infoDialog.showModal();
			// close info dialog
			const closeDialogBtnError = document.querySelector('#back-btn-error') as HTMLButtonElement;
				closeDialogBtnError?.addEventListener('click', () => {
					infoDialog?.close();
				});
		}
	}
});

// DELETE

const deleteItem = async (token: string, dish_id: number) => {
	console.log(dish_id);
	try {
		const response = await fetchData<any>(apiUrl + `api/dish/${dish_id}`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + token,
			},
		});
		return response;
	} catch (error) {
		console.error('Error deleting item:', error);
	}
};

document.getElementById('item-delete-form')?.addEventListener('submit', async (event) => {
	event.preventDefault();

	if (selectedDishId) {
		const itemId: number = parseInt(selectedDishId);
		console.log(itemId);
		const token = localStorage.getItem('token');
		if (!token) {
			return;
		};
		try {
			const result = await deleteItem(token, itemId);
			console.log(result);
		} catch (error) {
			console.error('Error deleting item:', error);
			throw error;
		}
		deleteDialog?.close();
		location.reload();
	}
});

// select dialog element from DOM
const modifyDialog = document.querySelector('#modify-item-dialog') as HTMLDialogElement | null;
const deleteDialog = document.querySelector('#delete-item-dialog') as HTMLDialogElement | null;
// select buttons form DOM
const modifyBtn = document.querySelectorAll('.menu-modify-btn');
const deleteBtn = document.querySelectorAll('.menu-delete-btn');
// select menu item elements from DOM
// const menuItemEls = document.querySelectorAll('.menu-item');
modifyBtn?.forEach((btn) => {
	btn.addEventListener('click', () => {
		modifyDialog?.showModal();
	})
});

deleteBtn?.forEach((btn) => {
	btn.addEventListener('click', () => {
		deleteDialog?.showModal();
	});
});

const closeDialogBtnModify = document.querySelector('#modify-back-btn') as HTMLButtonElement;
closeDialogBtnModify.addEventListener('click', () => {
	modifyDialog?.close();
});

const closeDialogBtnDelete = document.querySelector('#delete-back-btn') as HTMLButtonElement;
closeDialogBtnDelete.addEventListener('click', () => {
	deleteDialog?.close();
});


