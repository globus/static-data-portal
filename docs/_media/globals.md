[**@globus/static-data-portal**](README.md)

***

# @globus/static-data-portal

## Modules

- [\<internal\>](-internal-.md)

## Type Aliases

### Base

> **Base** = `object`

Defined in: [utils/static.ts:9](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/utils/static.ts#L9)

The base type for a `static.json` file.

#### Properties

##### \_static

> **\_static**: `object`

Defined in: [utils/static.ts:10](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/utils/static.ts#L10)

###### generator

> **generator**: `object`

###### generator.name

> **name**: `string`

The name of the generator used to build the `static.json` file.
This should be a reference to the package name of the generator.

###### Example

```ts
"@globus/static-data-portal"
```

###### host?

> `optional` **host**: `object`

GitHub Action-injected environment variables.

###### See

https://github.com/from-static/actions

###### host.base\_path

> **base\_path**: `string`

###### host.base\_url

> **base\_url**: `string`

###### host.host

> **host**: `string`

###### host.origin

> **origin**: `string`

##### data

> **data**: `object`

Defined in: [utils/static.ts:30](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/utils/static.ts#L30)

###### attributes

> **attributes**: [`Record`](-internal-.md#record)\<`string`, `unknown`\>

###### version

> **version**: `string`

***

### Data

> **Data** = `object`

Defined in: [utils/static.ts:39](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/utils/static.ts#L39)

The type used for `data` by the [@globus/static-data-portal generator](https://github.com/globus/static-data-portal).

#### Properties

##### attributes

> **attributes**: `object`

Defined in: [utils/static.ts:46](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/utils/static.ts#L46)

###### content

> **content**: `object`

###### content.image?

> `optional` **image**: `string`

The URL of the portal's header image.

###### content.navigation?

> `optional` **navigation**: [`NavigationOptions`](-internal-.md#navigationoptions)

The navigation items for the portal.

###### content.privacy\_policy?

> `optional` **privacy\_policy**: `string`

A privacy policy to be rendered at `/privacy-policy`.
This is especially useful for associating the published URL with your registered Globus Auth application.

###### content.subtitle?

> `optional` **subtitle**: `string`

The subtitle of the research data portal.

###### content.tagline?

> `optional` **tagline**: `string`

###### Deprecated

`tagline` will be removed in a future release. For customization of the homepage, use a `index.mdx` file.

###### content.terms\_of\_service?

> `optional` **terms\_of\_service**: `string`

Terms and conditions to be rendered at `/terms-and-conditions`.
This is especially useful for associating the published URL with your registered Globus Auth application.

###### content.title

> **title**: `string`

The title of the research data portal.

###### features?

> `optional` **features**: `object`

###### features.useLocalStorage?

> `optional` **useLocalStorage**: `boolean`

###### globus

> **globus**: `object`

###### globus.application

> **application**: `object`

Information about your registered Globus Auth Application (Client)

###### See

https://docs.globus.org/api/auth/developer-guide/#developing-apps

###### globus.application.client\_id

> **client\_id**: `string`

The UUID of the client application.

###### globus.application.redirect\_uri?

> `optional` **redirect\_uri**: `string`

The redirect URI for the Globus Auth login page to complete the OAuth2 flow.
The portal will make a reasonable effort to determine this URI, but this field is provided as a fallback.
To use the portal's built-in authorization handling, redirects should be sent to `/authenticate` on the host.

###### Example

```ts
"https://example.com/data-portal/authenticate"
```

###### globus.transfer

> **transfer**: [`TransferCollectionConfiguration`](-internal-.md#transfercollectionconfiguration) \| \{ `collections`: [`TransferCollectionConfiguration`](-internal-.md#transfercollectionconfiguration)[]; \}

Configuration for Transfer-related functionality in the portal.

###### theme?

> `optional` **theme**: [`ThemeSettings`](-internal-.md#themesettings)

##### version

> **version**: `string`

Defined in: [utils/static.ts:45](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/utils/static.ts#L45)

The version of the `data` object, which is used to determine how
the generator will render its `attributes`.

###### Example

```ts
"1.0.0"
```

***

### Static

> **Static** = [`Base`](#base) & `object`

Defined in: [utils/static.ts:118](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/utils/static.ts#L118)

#### Type declaration

##### data

> **data**: [`Data`](#data-1)
