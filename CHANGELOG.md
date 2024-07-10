# Changelog

## [1.0.4](https://github.com/globus/static-data-portal/compare/v1.5.0...1.0.4) (2024-07-10)


### ⚠ BREAKING CHANGES

* Move to npm packaging and update to new static.json format ([#1](https://github.com/globus/static-data-portal/issues/1))

### chore

* release static-data-portal 1.0.4 ([ef2eb3b](https://github.com/globus/static-data-portal/commit/ef2eb3b20da6957b48a9d7c08413600264b869ba))


### Features

* add link to Globus Web App Task Overview on successful Transfer task creation. ([#63](https://github.com/globus/static-data-portal/issues/63)) ([1f1ab94](https://github.com/globus/static-data-portal/commit/1f1ab948eec0ee59dc28be811feee5404b4052d3))
* adds basic 'View Settings' and refactors File Browser ([071b264](https://github.com/globus/static-data-portal/commit/071b264f150b3c35126471343a1254343d7d9824))
* adds Globus Client ID configuration ([5df9c86](https://github.com/globus/static-data-portal/commit/5df9c86649959e4b138a3d52917c71eda501dde7))
* adds OIDC integration using react-oidc-context ([aa8f5ab](https://github.com/globus/static-data-portal/commit/aa8f5ab5a2377693cf5fcb176a671cff3e23af70))
* adds static integration and CI ([cc176ee](https://github.com/globus/static-data-portal/commit/cc176ee4f5d8e2ff338d7b691f1591da81695342))
* adds support for 'path' configuration ([08e8b19](https://github.com/globus/static-data-portal/commit/08e8b195643e2ff7b3d9dba267e61519f06e9273))
* adds support for `data.attributes.theme` ([#64](https://github.com/globus/static-data-portal/issues/64)) ([38e593d](https://github.com/globus/static-data-portal/commit/38e593d75a5a7bad33cc9589c09ce4d0ed721e56))
* adds support for content.subtitle ([#140](https://github.com/globus/static-data-portal/issues/140)) ([d74bf52](https://github.com/globus/static-data-portal/commit/d74bf52420b3d96a06dbcbf75cfeca9d48f6bf3e))
* adds support for Globus environment targeting via `static.json` ([3771174](https://github.com/globus/static-data-portal/commit/3771174a70f2cbb47f674f2ecadf33e227dc2d79))
* adds support for MDX ([#142](https://github.com/globus/static-data-portal/issues/142)) ([7c02ca0](https://github.com/globus/static-data-portal/commit/7c02ca05eff386194e6200ec350ab5dfa20dadaf))
* Adds support for mkdir and rename in destination browser. ([#58](https://github.com/globus/static-data-portal/issues/58)) ([a1e93a4](https://github.com/globus/static-data-portal/commit/a1e93a4a182492926d0381224f3d3571c1d42f59))
* adds utils/static, enables dynamic resolving of 'redirect_uri' ([cd8b16b](https://github.com/globus/static-data-portal/commit/cd8b16b1ceb93b342ac10215e6941f5805241db0))
* basic directory traversal ([0f89750](https://github.com/globus/static-data-portal/commit/0f89750b8ed0341a500fad3182723deff4d7de83))
* basic transfer functionality ([b0c7111](https://github.com/globus/static-data-portal/commit/b0c71115f40efdd670b6cd705852abaa95e4296e))
* globus-auth-context + Authorization ([617c7b6](https://github.com/globus/static-data-portal/commit/617c7b692e2478101c4274c5562313918735f9b2))
* http download, collection path display, and error formatting ([dc715e3](https://github.com/globus/static-data-portal/commit/dc715e337e12feccfb50d221ed494871f2733bc6))
* improved Modified Date and Size rendering ([32e3c4f](https://github.com/globus/static-data-portal/commit/32e3c4fd82b9c3619f235e73bb9934276cbf1911))
* introduces authorization_parameters error handling ([0f76136](https://github.com/globus/static-data-portal/commit/0f76136c9f48c12cbefc4debcd34b085951b3bf0))
* **main:** adds support for 'data.attributes.tagline' for customizing the tagline displayed when logged out. ([60b1db9](https://github.com/globus/static-data-portal/commit/60b1db9e6baf46296091cc1df7169c936fb144ae))
* Move to npm packaging and update to new static.json format ([#1](https://github.com/globus/static-data-portal/issues/1)) ([6032914](https://github.com/globus/static-data-portal/commit/60329147912516f61413955b65f3a169f17958ba))
* updates Header authenticated state to render username; name and organization included in menu. ([#34](https://github.com/globus/static-data-portal/issues/34)) ([3771174](https://github.com/globus/static-data-portal/commit/3771174a70f2cbb47f674f2ecadf33e227dc2d79))


### Fixes

* add 'redirect_uri' for deployment ([c409a41](https://github.com/globus/static-data-portal/commit/c409a411551b68a82626bcb867d0fb9cde518bfc))
* Adds Globus logo to "Powered by Globus" footer. ([d74bf52](https://github.com/globus/static-data-portal/commit/d74bf52420b3d96a06dbcbf75cfeca9d48f6bf3e))
* disable 'Start Transfer' button for now... ([4b72ba6](https://github.com/globus/static-data-portal/commit/4b72ba6358dc657ffae9979306ab876523517a4a))
* ensure 'Up One Folder' interaction works on initial load when no 'path' is provided ([2ffe7f1](https://github.com/globus/static-data-portal/commit/2ffe7f1acb37f149656a40ac1fa759458a3b921e))
* improves integration with @globus/sdk authorization ([3771174](https://github.com/globus/static-data-portal/commit/3771174a70f2cbb47f674f2ecadf33e227dc2d79))
* move GitHub workflows to proper directory ([86b2a66](https://github.com/globus/static-data-portal/commit/86b2a66cd41ee024a1b2f30b2dbcfa947aa47d38))
* proper @globus/sdk reference ([cacf77b](https://github.com/globus/static-data-portal/commit/cacf77b94ca9f767d3f3ce1ffa8db59117e9c011))
* use _static.host for redirect_uri when available ([8103c47](https://github.com/globus/static-data-portal/commit/8103c4769e8942e8be903d0481aa8979bbf3acfc))
* various typescript errors and fallback error for file browser ([65daca1](https://github.com/globus/static-data-portal/commit/65daca1d37d77c0b3ca79aeccccad8b666775903))

## [1.5.0](https://github.com/globus/static-data-portal/compare/1.4.0...1.5.0) (2024-07-10)


### Features

* adds support for content.subtitle ([#140](https://github.com/globus/static-data-portal/issues/140)) ([d74bf52](https://github.com/globus/static-data-portal/commit/d74bf52420b3d96a06dbcbf75cfeca9d48f6bf3e))
* adds support for MDX ([#142](https://github.com/globus/static-data-portal/issues/142)) ([7c02ca0](https://github.com/globus/static-data-portal/commit/7c02ca05eff386194e6200ec350ab5dfa20dadaf))


### Fixes

* Adds Globus logo to "Powered by Globus" footer. ([d74bf52](https://github.com/globus/static-data-portal/commit/d74bf52420b3d96a06dbcbf75cfeca9d48f6bf3e))

## [1.4.0](https://github.com/globus/static-data-portal/compare/1.3.0...1.4.0) (2024-06-18)


### Features

* Adds support for mkdir and rename in destination browser. ([#58](https://github.com/globus/static-data-portal/issues/58)) ([a1e93a4](https://github.com/globus/static-data-portal/commit/a1e93a4a182492926d0381224f3d3571c1d42f59))

## 1.3.0 (2024-05-01)

## What's Changed
* deps: bump the typescript-eslint group across 1 directory with 2 updates by @dependabot in https://github.com/globus/static-data-portal/pull/51
* deps: bump the next group across 1 directory with 2 updates by @dependabot in https://github.com/globus/static-data-portal/pull/53
* deps: bump @types/react from 18.2.78 to 18.2.79 in the react group by @dependabot in https://github.com/globus/static-data-portal/pull/45
* deps: bump the react group with 4 updates by @dependabot in https://github.com/globus/static-data-portal/pull/55
* deps: bump eslint-plugin-react-hooks from 4.6.0 to 4.6.1 by @dependabot in https://github.com/globus/static-data-portal/pull/56
* chore: adds Apache-2.0 LICENSE by @jbottigliero in https://github.com/globus/static-data-portal/pull/57
* deps: bump the react group with 3 updates by @dependabot in https://github.com/globus/static-data-portal/pull/59
* deps: bump eslint-plugin-react-hooks from 4.6.1 to 4.6.2 by @dependabot in https://github.com/globus/static-data-portal/pull/60
* deps: bump @globus/sdk from 3.0.0-alpha.17 to 3.0.0 by @dependabot in https://github.com/globus/static-data-portal/pull/61
* deps: bump the typescript-eslint group with 2 updates by @dependabot in https://github.com/globus/static-data-portal/pull/62
* feat: add link to Globus Web App Task Overview on successful Transfer task creation. by @jbottigliero in https://github.com/globus/static-data-portal/pull/63
* feat: adds support for `data.attributes.theme` by @jbottigliero in https://github.com/globus/static-data-portal/pull/64


**Full Changelog**: https://github.com/globus/static-data-portal/compare/1.2.3...1.3.0

## 1.2.3 (2024-04-24)

## What's Changed
* deps: bump framer-motion from 11.0.28 to 11.1.7 by @dependabot in https://github.com/globus/static-data-portal/pull/50


**Full Changelog**: https://github.com/globus/static-data-portal/compare/1.2.2...1.2.3

## 1.2.2 (2024-04-15)

## What's Changed
* deps: bump @emotion/styled from 11.11.0 to 11.11.5 by @dependabot in https://github.com/globus/static-data-portal/pull/41
* deps: bump framer-motion from 11.0.24 to 11.0.28 by @dependabot in https://github.com/globus/static-data-portal/pull/42


**Full Changelog**: https://github.com/globus/static-data-portal/compare/1.2.1...1.2.2

## 1.2.1 (2024-04-15)

**Full Changelog**: https://github.com/globus/static-data-portal/compare/1.2.0...1.2.1

## 1.2.0 (2024-04-15)

## What's Changed
* deps: bump @types/react from 18.2.55 to 18.2.70 by @dependabot in https://github.com/globus/static-data-portal/pull/4
* deps: bump framer-motion from 11.0.20 to 11.0.24 by @dependabot in https://github.com/globus/static-data-portal/pull/24
* deps: bump eslint from 8.56.0 to 8.57.0 by @dependabot in https://github.com/globus/static-data-portal/pull/17
* deps: bump next from 14.1.0 to 14.1.4 by @dependabot in https://github.com/globus/static-data-portal/pull/18
* feat: updates Header authenticated state to render username; name and organization included in menu. by @jbottigliero in https://github.com/globus/static-data-portal/pull/34
* deps: bump @types/react-dom from 18.2.19 to 18.2.25 by @dependabot in https://github.com/globus/static-data-portal/pull/33
* deps: bump eslint-plugin-react from 7.33.2 to 7.34.1 by @dependabot in https://github.com/globus/static-data-portal/pull/32
* deps: bump @emotion/react from 11.11.3 to 11.11.4 by @dependabot in https://github.com/globus/static-data-portal/pull/27
* deps: bump typescript from 5.3.3 to 5.4.5 by @dependabot in https://github.com/globus/static-data-portal/pull/31
* deps: bump next from 14.1.4 to 14.2.1 by @dependabot in https://github.com/globus/static-data-portal/pull/36
* deps: bump @types/react from 18.2.70 to 18.2.78 in the react group by @dependabot in https://github.com/globus/static-data-portal/pull/35
* deps: bump eslint-config-next from 14.1.4 to 14.2.1 by @dependabot in https://github.com/globus/static-data-portal/pull/39
* deps: bump typedoc from 0.25.12 to 0.25.13 by @dependabot in https://github.com/globus/static-data-portal/pull/38
* deps: bump @types/node from 20.11.19 to 20.12.7 by @dependabot in https://github.com/globus/static-data-portal/pull/37


**Full Changelog**: https://github.com/globus/static-data-portal/compare/1.1.0...1.2.0

## 1.1.0 (2024-03-25)

## What's Changed
* deps: bump @globus/sdk from 3.0.0-alpha.6 to 3.0.0-alpha.8 by @dependabot in https://github.com/globus/static-data-portal/pull/11


**Full Changelog**: https://github.com/globus/static-data-portal/compare/1.0.5...1.1.0

## 1.0.5 (2024-03-25)

## What's Changed
* deps: bump @heroicons/react from 2.1.1 to 2.1.3 by @dependabot in https://github.com/globus/static-data-portal/pull/10
* deps: bump eslint-config-next from 14.1.0 to 14.1.4 by @dependabot in https://github.com/globus/static-data-portal/pull/6


**Full Changelog**: https://github.com/globus/static-data-portal/compare/1.0.4...1.0.5

## 1.0.4 (2024-03-25)

## What's Changed
* feat!: Move to npm packaging and update to new static.json format by @jbottigliero in https://github.com/globus/static-data-portal/pull/1
* chore: bootstrap releases for path: . by @jbottigliero in https://github.com/globus/static-data-portal/pull/2
* ops: adds release-please GitHub Action by @jbottigliero in https://github.com/globus/static-data-portal/pull/3
* deps: bump framer-motion from 11.0.5 to 11.0.20 by @dependabot in https://github.com/globus/static-data-portal/pull/8

## New Contributors
* @jbottigliero made their first contribution in https://github.com/globus/static-data-portal/pull/1
* @dependabot made their first contribution in https://github.com/globus/static-data-portal/pull/8

**Full Changelog**: https://github.com/globus/static-data-portal/commits/static-data-portal-1.0.4
