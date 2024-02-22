// login

import { apiUrl, errorModal } from "./components";
import { fetchData1 } from "./function";

// select login form from the DOM
const loginForm = document.querySelector('#login-form-admin') as HTMLFormElement | null;
const loginBtn = document.querySelector('#login-admin') as HTMLButtonElement |null;
const infoDialog = document.querySelector('#info') as HTMLDialogElement | null;

if (!loginBtn) {
	throw new Error('Login button not found');
}
if (!infoDialog) {
	throw new Error('Dialog not found');
}
// function to login
const login = async (user: {
	email: string,
	password: string
  }): Promise<LoginUser> => {
	const options: RequestInit = {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json'
	  },
	  body: JSON.stringify(user),
	}
	return await fetchData1<LoginUser>(apiUrl + 'api/auth/login-admin', options);
};

loginForm?.addEventListener('submit', async (event) => {
	try {
		event.preventDefault();
		const user = {
			email: loginForm.emailadmin.value,
			password: loginForm.passwordadmin.value
		};
		const loginData = await login(user);
		console.log('loginData', loginData);
		// save token to local storage
		localStorage.setItem('token', loginData.token);
        window.location.href = 'menu-admin.html';
	} catch (err) {
		console.log(err);
		const infoHTML = (err as Error).message + `. Kirjautuminen epäonnistui. Yritä uudelleen`;
		infoDialog.innerHTML = errorModal(infoHTML);
		infoDialog.showModal();
		const closeDialogBtnError = document.querySelector('#back-btn-error') as HTMLButtonElement;
		closeDialogBtnError?.addEventListener('click', () => {
			infoDialog?.close();
		});
	}

});
