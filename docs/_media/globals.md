[**@globus/static-data-portal**](README.md) • **Docs**

***

# @globus/static-data-portal

## Type Aliases

### Base

> **Base**: `object`

The base type for a `static.json` file.

#### Type declaration

##### \_static

> **\_static**: `object`

##### \_static.generator

> **generator**: `object`

##### \_static.generator.name

> **name**: `string`

The name of the generator used to build the `static.json` file.
This should be a reference to the package name of the generator.

###### Example

```ts
"@globus/static-data-portal"
```

##### \_static.host?

> `optional` **host**: `object`

GitHub Action-injected environment variables.

###### See

https://github.com/from-static/actions

##### \_static.host.base\_path

> **base\_path**: `string`

##### \_static.host.base\_url

> **base\_url**: `string`

##### \_static.host.host

> **host**: `string`

##### \_static.host.origin

> **origin**: `string`

##### data

> **data**: `object`

##### data.attributes

> **attributes**: [`Record`](-internal-.md#recordk-t)\<`string`, `unknown`\>

##### data.version

> **version**: `string`

#### Defined in

[utils/static.ts:9](https://github.com/globus/static-data-portal/blob/7049be242b3135e7c2d5b874f564022879c85966/utils/static.ts#L9)

***

### Data

> **Data**: `object`

The type used for `data` by the [@globus/static-data-portal generator](https://github.com/globus/static-data-portal).

#### Type declaration

##### attributes

> **attributes**: `object`

##### attributes.content

> **content**: `object`

##### attributes.content.image?

> `optional` **image**: `string`

The URL of the portal's header image.

##### attributes.content.navigation?

> `optional` **navigation**: [`NavigationOptions`](-internal-.md#navigationoptions)

The navigation items for the portal.

##### attributes.content.privacy\_policy?

> `optional` **privacy\_policy**: `string`

A privacy policy to be rendered at `/privacy-policy`.
This is especially useful for associating the published URL with your registered Globus Auth application.

##### attributes.content.subtitle?

> `optional` **subtitle**: `string`

The subtitle of the research data portal.

##### attributes.content.tagline?

> `optional` **tagline**: `string`

###### Deprecated

`tagline` will be removed in a future release. For customization of the homepage, use a `index.mdx` file.

##### attributes.content.terms\_of\_service?

> `optional` **terms\_of\_service**: `string`

Terms and conditions to be rendered at `/terms-and-conditions`.
This is especially useful for associating the published URL with your registered Globus Auth application.

##### attributes.content.title

> **title**: `string`

The title of the research data portal.

##### attributes.globus

> **globus**: `object`

##### attributes.globus.application

> **application**: `object`

Information about your registered Globus Auth Application (Client)

###### See

https://docs.globus.org/api/auth/developer-guide/#developing-apps

##### attributes.globus.application.client\_id

> **client\_id**: `string`

The UUID of the client application.

##### attributes.globus.application.redirect\_uri?

> `optional` **redirect\_uri**: `string`

The redirect URI for the Globus Auth login page to complete the OAuth2 flow.
The portal will make a reasonable effort to determine this URI, but this field is provided as a fallback.
To use the portal's built-in authorization handling, redirects should be sent to `/authenticate` on the host.

###### Example

```ts
"https://example.com/data-portal/authenticate"
```

##### attributes.globus.transfer

> **transfer**: [`TransferCollectionConfiguration`](-internal-.md#transfercollectionconfiguration) \| `object`

Configuration for Transfer-related functionality in the portal.

##### attributes.theme?

> `optional` **theme**: [`ThemeSettings`](-internal-.md#themesettings)

##### version

> **version**: `string`

The version of the `data` object, which is used to determine how
the generator will render its `attributes`.

###### Example

```ts
"1.0.0"
```

#### Defined in

[utils/static.ts:39](https://github.com/globus/static-data-portal/blob/7049be242b3135e7c2d5b874f564022879c85966/utils/static.ts#L39)

***

### Static

> **Static**: [`Base`](globals.md#base) & `object`

#### Type declaration

##### data

> **data**: [`Data`](globals.md#data-1)

#### Defined in

[utils/static.ts:115](https://github.com/globus/static-data-portal/blob/7049be242b3135e7c2d5b874f564022879c85966/utils/static.ts#L115)

## Modules

- [\<internal\>](-internal-.md)
