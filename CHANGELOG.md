# Changelog

## [3.0.2](https://github.com/globus/static-data-portal/compare/3.0.1...3.0.2) (2026-01-09)


### Fixes

* Run Dependency Audits and Upgrade Dependencies ([#502](https://github.com/globus/static-data-portal/issues/502)) ([fe0506d](https://github.com/globus/static-data-portal/commit/fe0506d9831d4043f8497048d3a84369eb2efafe))

## [3.0.1](https://github.com/globus/static-data-portal/compare/3.0.0...3.0.1) (2026-01-09)


### Fixes

* Upgrade to next@15.5.9 ([#500](https://github.com/globus/static-data-portal/issues/500)) ([a4a1a63](https://github.com/globus/static-data-portal/commit/a4a1a633d04f65ad0704f1f4f6e0318b5a206ae5)), closes [#499](https://github.com/globus/static-data-portal/issues/499)

## [3.0.0](https://github.com/globus/static-data-portal/compare/2.1.0...3.0.0) (2025-04-03)


### ⚠ BREAKING CHANGES

* Upgrades core dependencies (Next.js + React) ([#451](https://github.com/globus/static-data-portal/issues/451))

### Features

* Adds improved Collection Browser for selecting a destination. ([#458](https://github.com/globus/static-data-portal/issues/458)) ([3cc4ecb](https://github.com/globus/static-data-portal/commit/3cc4ecb1454a2a078555104568f9a9fb5169e2a7))
* Upgrades core dependencies (Next.js + React) ([#451](https://github.com/globus/static-data-portal/issues/451)) ([6a5dd9b](https://github.com/globus/static-data-portal/commit/6a5dd9b3d6240ff7cd7054f6a6e9e13b16f179b0))

## [2.1.0](https://github.com/globus/static-data-portal/compare/2.0.0...2.1.0) (2024-11-15)


### Features

* Adds "Clear Selected" button to the source file browser. ([79058b6](https://github.com/globus/static-data-portal/commit/79058b6b2828a7c30f4c9552e42e7a730d7ca9c5))
* Adds "Search All Collections" toggle in the search panel. ([79058b6](https://github.com/globus/static-data-portal/commit/79058b6b2828a7c30f4c9552e42e7a730d7ca9c5))
* Updates Destination search to hide collections the user does not have Transfer-related permissions on (by default) ([#370](https://github.com/globus/static-data-portal/issues/370)) ([79058b6](https://github.com/globus/static-data-portal/commit/79058b6b2828a7c30f4c9552e42e7a730d7ca9c5))


### Fixes

* Address issue causing the default header image not rendering on deep pages when portal was published. ([#369](https://github.com/globus/static-data-portal/issues/369)) ([ac3b7d2](https://github.com/globus/static-data-portal/commit/ac3b7d23abbe241968b98aec993479691148ff71))

## [2.0.0](https://github.com/globus/static-data-portal/compare/1.12.0...2.0.0) (2024-10-29)


### ⚠ BREAKING CHANGES

* Use in-memory based storage for authorization tokens, by default. ([#347](https://github.com/globus/static-data-portal/issues/347))

### Features

* Use in-memory based storage for authorization tokens, by default. ([#347](https://github.com/globus/static-data-portal/issues/347)) ([c6ac0f8](https://github.com/globus/static-data-portal/commit/c6ac0f881531cd2dd7e5cfc234b6b6065d77b3b5))

## [1.12.0](https://github.com/globus/static-data-portal/compare/1.11.0...1.12.0) (2024-10-25)


### Features

* Adds button to open files in a new tab when collections support HTTPS. ([#337](https://github.com/globus/static-data-portal/issues/337)) ([d6cc729](https://github.com/globus/static-data-portal/commit/d6cc729252243fd79c434f4dd8fdf2041803c7b0))


### Fixes

* use zustand for state management and resolve various state issues in the File Browser ([#335](https://github.com/globus/static-data-portal/issues/335)) ([6b221e5](https://github.com/globus/static-data-portal/commit/6b221e598067c5a945582a50820618d4b3bef503))

## [1.11.0](https://github.com/globus/static-data-portal/compare/1.10.2...1.11.0) (2024-10-09)


### Features

* **Theming:** Use "primary" and "secondary" color palettes for theming instead of "brand". ([#319](https://github.com/globus/static-data-portal/issues/319)) ([2a9c5f6](https://github.com/globus/static-data-portal/commit/2a9c5f67d28e7a0433648880166691fbbdca8e73))


### Fixes

* Addresses an issue preventing Transfers being initiated to the "server default" path on a destination collection. ([#312](https://github.com/globus/static-data-portal/issues/312)) ([e72ff70](https://github.com/globus/static-data-portal/commit/e72ff70837edb6bca3090b3ff38733cdb32234e5))

## [1.10.2](https://github.com/globus/static-data-portal/compare/1.10.1...1.10.2) (2024-10-02)


### Fixes

* Addresses issue preventing HTTPS download button appearing on file entries. ([#295](https://github.com/globus/static-data-portal/issues/295)) ([27effc7](https://github.com/globus/static-data-portal/commit/27effc7bb4da866284cfa0b396ee4153935cae7b))

## [1.10.1](https://github.com/globus/static-data-portal/compare/1.10.0...1.10.1) (2024-09-19)


### Fixes

* Addresses issue causing new folders being prefixed with "undefined", updates file listing to be sorted by "Name" ([#278](https://github.com/globus/static-data-portal/issues/278)) ([1e1431c](https://github.com/globus/static-data-portal/commit/1e1431c8502668d422b856e0db51a902c17574ba))

## [1.10.0](https://github.com/globus/static-data-portal/compare/1.9.0...1.10.0) (2024-09-18)


### Features

* Adds Source Selection support. ([#271](https://github.com/globus/static-data-portal/issues/271)) ([2ea1da9](https://github.com/globus/static-data-portal/commit/2ea1da9c96d0fbd40289855ceb3c8be79c1f13a0))


### Fixes

* ensure AuthorizationManager methods are awaited ([#263](https://github.com/globus/static-data-portal/issues/263)) ([1306141](https://github.com/globus/static-data-portal/commit/1306141e20a72432f3a71f09a062a75da58956dd))

## [1.9.0](https://github.com/globus/static-data-portal/compare/1.8.0...1.9.0) (2024-08-26)


### Features

* Updates the "Path" field to be editable for easy directory navigation. ([#242](https://github.com/globus/static-data-portal/issues/242)) ([a3a2d03](https://github.com/globus/static-data-portal/commit/a3a2d03bc4857e413c596f6884397467c259b612))


### Fixes

* Address scenarios where post-consent an existing (refreshed) token would be used instead of the result of the token response. ([a3a2d03](https://github.com/globus/static-data-portal/commit/a3a2d03bc4857e413c596f6884397467c259b612))
* **Search:** Ensures GCSv5 Endpoints ("nonfunctional" endpoints that do not support transfer) are not displayed in destination collection search results. ([#231](https://github.com/globus/static-data-portal/issues/231)) ([1702e62](https://github.com/globus/static-data-portal/commit/1702e629f4ca7f01ee692481669a5c7d165762f2))

## [1.8.0](https://github.com/globus/static-data-portal/compare/1.7.1...1.8.0) (2024-08-19)


### Features

* adds support for "content" directory ([#159](https://github.com/globus/static-data-portal/issues/159)) ([8a21371](https://github.com/globus/static-data-portal/commit/8a213718b6aed456fae275ad08cc60c6f78da0ce))
* Globus Transfer interactions have been moved to the /transfer route. This allows for custom homepages on `/` using a `index.(mdx/tsx)` file. ([#204](https://github.com/globus/static-data-portal/issues/204)) ([c282f81](https://github.com/globus/static-data-portal/commit/c282f8176a37be64e582edbd640f41ec5f04b586))
* Improves network request performance and loading states by implementing a cache layer. ([#194](https://github.com/globus/static-data-portal/issues/194)) ([070ab91](https://github.com/globus/static-data-portal/commit/070ab91789faf2424fa8bce4e1839e059a6ef9bb))
* support content/assets/* =&gt; public/* ([2e5945d](https://github.com/globus/static-data-portal/commit/2e5945dd220a29782c1e860a7f796be174c73873))
* upgrade to @globus/sdk 3.8.0 and use new Transfer utility methods ([#199](https://github.com/globus/static-data-portal/issues/199)) ([989cc44](https://github.com/globus/static-data-portal/commit/989cc446d3b96a407c32f32ad46271eb8c491c76))


### Fixes

* `content` file overrides for well-known pages (e.g. `index.*`, `privacy-policy.*`), no longer need to match the generator's extension ([#224](https://github.com/globus/static-data-portal/issues/224)) ([e3754a9](https://github.com/globus/static-data-portal/commit/e3754a9ad0e22daa4c4b6e676782f39ee12b1704))
* Adds external link icon to external links in the main navigation and reorders custom links. ([34b6915](https://github.com/globus/static-data-portal/commit/34b691519b54826d64751e1e933c64b2224dcd13))
* Adds loading states to "Refresh" and "Start Transfer" buttons. ([070ab91](https://github.com/globus/static-data-portal/commit/070ab91789faf2424fa8bce4e1839e059a6ef9bb))
* adds predev script (runs prebuild) ([d027fe4](https://github.com/globus/static-data-portal/commit/d027fe49efe012e4e866a47824a2cbd6e9907d78))
* adds useLayout hook and improves rendering of pages by sharing a Container ([#207](https://github.com/globus/static-data-portal/issues/207)) ([68bccd8](https://github.com/globus/static-data-portal/commit/68bccd82e389ee3ff7f8d85e4449201922cf9015))
* Ensure full hosted base path is used in various image rendering contexts. ([#218](https://github.com/globus/static-data-portal/issues/218)) ([03a3c43](https://github.com/globus/static-data-portal/commit/03a3c4387ab63deb6a8d657a0117029427d87695))
* Ensure relative links in Markdown use Next.js Link component for rendering. ([#206](https://github.com/globus/static-data-portal/issues/206)) ([34b6915](https://github.com/globus/static-data-portal/commit/34b691519b54826d64751e1e933c64b2224dcd13))
* ensure relative paths can be used for images in Markdown ([#217](https://github.com/globus/static-data-portal/issues/217)) ([92ebdf3](https://github.com/globus/static-data-portal/commit/92ebdf3f056a52a936a5c8a3399b9403b4cc84d3))
* ensure the /authorization route refreshes tokens (when returning from an authorization_requirements prompt) ([#195](https://github.com/globus/static-data-portal/issues/195)) ([b042a81](https://github.com/globus/static-data-portal/commit/b042a818963d9fc98f48c596a4d4bc2172cb9c26))
* Improves base Markdown rendering for various elements ([#216](https://github.com/globus/static-data-portal/issues/216)) ([b3e1f30](https://github.com/globus/static-data-portal/commit/b3e1f30fd10a9a07497a617e6557369c158ae371))
* improves the loading states of file browsers ([#205](https://github.com/globus/static-data-portal/issues/205)) ([fe58559](https://github.com/globus/static-data-portal/commit/fe585599c1bbbace33fc257b2e5a1c3ae4c38367))
* Only render "Size" values for files in file browsers. ([a89c2d0](https://github.com/globus/static-data-portal/commit/a89c2d067e92dd603daad8b7c063b3670dc246bc))
* Throttles the `&lt;CollectionSearch&gt;` requests. ([070ab91](https://github.com/globus/static-data-portal/commit/070ab91789faf2424fa8bce4e1839e059a6ef9bb))

## [1.7.1](https://github.com/globus/static-data-portal/compare/1.7.0...1.7.1) (2024-07-11)


### Fixes

* improve header rendering on smaller devices ([#154](https://github.com/globus/static-data-portal/issues/154)) ([3de3e29](https://github.com/globus/static-data-portal/commit/3de3e29b5c385c375a9366530a5234395ea3583c))

## [1.7.0](https://github.com/globus/static-data-portal/compare/1.6.0...1.7.0) (2024-07-10)


### Features

* Persist collection (destination) selection state in session storage ([#128](https://github.com/globus/static-data-portal/issues/128)) ([d6a0d12](https://github.com/globus/static-data-portal/commit/d6a0d123e24367ebc3d3720d36bcac69b98d1af9))


### Fixes

* build error encountered due to image configurations ([bbf2cfc](https://github.com/globus/static-data-portal/commit/bbf2cfcca305daf0c168db451af366bb69b1e68e))

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
