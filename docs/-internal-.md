[**@globus/static-data-portal**](README.md)

***

# \<internal\>

## Type Aliases

### ColorDefinition

> **ColorDefinition** = \{ `100`: `string`; `200`: `string`; `300`: `string`; `400`: `string`; `50`: `string`; `500`: `string`; `600`: `string`; `700`: `string`; `800`: `string`; `900`: `string`; \} \| `string`

Defined in: [theme.ts:9](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/theme.ts#L9)

***

### NavigationItem

> **NavigationItem** = \{ `authenticated`: `boolean`; `label`: `string`; `to`: `string`; \} \| \{ `authenticated`: `boolean`; `href`: `string`; `label`: `string`; \}

Defined in: [components/Navigation.tsx:21](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/components/Navigation.tsx#L21)

***

### NavigationOptions

> **NavigationOptions** = `object`

Defined in: [components/Navigation.tsx:33](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/components/Navigation.tsx#L33)

#### Properties

##### items

> **items**: [`NavigationItem`](#navigationitem)[]

Defined in: [components/Navigation.tsx:34](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/components/Navigation.tsx#L34)

***

### Parameters\<T\>

> **Parameters**\<`T`\> = `T` *extends* (...`args`) => `any` ? `P` : `never`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1633

Obtain the parameters of a function type in a tuple

#### Type Parameters

##### T

`T` *extends* (...`args`) => `any`

***

### Record\<K, T\>

> **Record**\<`K`, `T`\> = `{ [P in K]: T }`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1606

Construct a type with a set of properties K of type T

#### Type Parameters

##### K

`K` *extends* keyof `any`

##### T

`T`

***

### ThemeSettings

> **ThemeSettings** = `object`

Defined in: [theme.ts:24](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/theme.ts#L24)

#### Properties

##### colors?

> `optional` **colors**: [`Record`](#record)\<`string`, [`ColorDefinition`](#colordefinition)\>

Defined in: [theme.ts:55](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/theme.ts#L55)

Specific color definitions to use in the theme.
The most common use case is to define a `primary` color.

###### Example

```json
{
  "colors": {
    "primary": {
     "50": "#E5F2FF",
     "100": "#B8DBFF",
     "200": "#8AC4FF",
     "300": "#5CADFF",
     "400": "#2E96FF",
     "500": "#007FFF",
     "600": "#0066CC",
     "700": "#004C99",
     "800": "#00264c",
     "900": "#001933"
  }
 }
}
```

###### See

https://v2.chakra-ui.com/docs/styled-system/theme#colors

##### colorScheme?

> `optional` **colorScheme**: `string`

Defined in: [theme.ts:30](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/theme.ts#L30)

Apply a default color scheme to all components.
This supports all Chakra UI color schemes and is not provided by default.

###### See

https://v2.chakra-ui.com/docs/styled-system/theme#colors for available color schemes.

##### extendTheme?

> `optional` **extendTheme**: [`Parameters`](#parameters)\<*typeof* [`extendTheme`](#extendtheme-1)\>\[`0`\]

Defined in: [theme.ts:60](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/theme.ts#L60)

Extend the Chakra UI theme.

###### See

https://v2.chakra-ui.com/docs/styled-system/customize-theme#using-theme-extensions

***

### TransferCollectionConfiguration

> **TransferCollectionConfiguration** = `object`

Defined in: [pages/transfer.tsx:30](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/pages/transfer.tsx#L30)

#### Properties

##### collection\_id

> **collection\_id**: `string`

Defined in: [pages/transfer.tsx:34](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/pages/transfer.tsx#L34)

The UUID of the Globus collection to list and transfer files from.

##### label?

> `optional` **label**: `string`

Defined in: [pages/transfer.tsx:43](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/pages/transfer.tsx#L43)

A human-readable label for the Source Selector. If not provided,
the Collection's `display_name` (and `path`) will be used.

##### path?

> `optional` **path**: `string`

Defined in: [pages/transfer.tsx:38](https://github.com/globus/static-data-portal/blob/6b5f445e1cca02afbeb9b639919c2df04214a85d/pages/transfer.tsx#L38)

The path on the collection to list and transfer files from.

## Variables

### extendTheme()

> `const` **extendTheme**: (...`extensions`) => [`Record`](#record)\<`string`, `any`\>

Defined in: node\_modules/@chakra-ui/react/dist/types/extend-theme/extend-theme.d.ts:19

#### Parameters

##### extensions

...([`Record`](#record)\<`string`, `any`\> \| (`theme`) => [`Record`](#record)\<`string`, `any`\>)[]

#### Returns

[`Record`](#record)\<`string`, `any`\>
