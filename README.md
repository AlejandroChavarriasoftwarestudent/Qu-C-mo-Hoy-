# React + Vite

## Acceso a QueComoHoy?

El sitio usa Netlify Identity para registrar cuentas e iniciar sesión con correo y contraseña. Para comprobar el flujo en un despliegue de Netlify, crea una cuenta, abre el enlace de confirmación y verifica que se abra «Descubrir». Después, cierra sesión e intenta volver a abrir una ruta interna como `/favoritos`: debe pedirte que inicies sesión de nuevo.

El registro guarda solo los datos de la cuenta. Las pantallas de planes y perfil incluyen datos de demostración; no se sincronizan con la cuenta.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
