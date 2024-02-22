// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'


export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        adminOrders: resolve(__dirname, 'admin/orders-admin.html'),
        adminLogin: resolve(__dirname, 'admin/login-admin.html'),
        adminMenu: resolve(__dirname, 'admin/menu-admin.html'),
        adminOffer: resolve(__dirname, 'admin/offer-admin.html'),

      },
    },
    target: "ES2022",
  },

})

