# static-data-portal

**🧪 BETA 🧪**

This is a Globus-powered research data portal `generator` created using Next.js.

---

**⚠️ IMPORTANT ⚠️** You only need to interact with **this** repository if you are improving the `generator` or using this code to start a self-managed project. If you want to deploy a data portal, copy our [template-data-portal](https://github.com/globus/template-data-portal) and modify the `static.json` file to suit your needs.

---

- [static.json Type Documentation](docs/globals.md)

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Developer Documentation

### `static.json`

- The `static.json` file is the main configuration file for the data portal.
- The `utils/static.ts` file is used to enforce a TypeScript type on this file.
- All pages and components that source information from the user-provided `static.json` should use `utils/static.ts` and its available helpers.
- Typedoc is configured to generate documentation from `utils/static.ts`.

The included `static.json` in this repository is configured toward local development, using a non-production Globus environment (`sandbox`).

### MDX Support

[MDX](https://nextjs.org/docs/pages/building-your-application/configuring/mdx) support has been added to the project.

For simple pages, e.g. "Terms and Conditions" and "Privacy Policy" `.mdx` is used to simplify these files being overwritten by end consumers using a `overrides` or `content` directory.

### `content` Directory

An end-user provided `content` directory can be defined to provide Markdown (or MDX) files that will be added as `pages` in the Next.js project. This allows for the end-user to provide custom pages without modifying the core project (via `overrides`). This also allows us to provide backwards compatibility should we decide to move away from Next.js in the future.
