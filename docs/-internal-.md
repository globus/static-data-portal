[**@globus/static-data-portal**](README.md) • **Docs**

***

# \<internal\>

## Type Aliases

### ColorDefinition

> **ColorDefinition**: `object` \| `string`

#### Defined in

[theme.ts:5](https://github.com/globus/static-data-portal/blob/1b3fe99b60b8d3ee1c63518384fabe5e257a214e/theme.ts#L5)

***

### NavigationItem

> **NavigationItem**: `object` \| `object`

#### Defined in

[components/Navigation.tsx:21](https://github.com/globus/static-data-portal/blob/1b3fe99b60b8d3ee1c63518384fabe5e257a214e/components/Navigation.tsx#L21)

***

### NavigationOptions

> **NavigationOptions**: `object`

#### Type declaration

##### items

> **items**: [`NavigationItem`](-internal-.md#navigationitem)[]

#### Defined in

[components/Navigation.tsx:33](https://github.com/globus/static-data-portal/blob/1b3fe99b60b8d3ee1c63518384fabe5e257a214e/components/Navigation.tsx#L33)

***

### Parameters\<T\>

> **Parameters**\<`T`\>: `T` *extends* (...`args`) => `any` ? `P` : `never`

Obtain the parameters of a function type in a tuple

#### Type Parameters

• **T** *extends* (...`args`) => `any`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1633

***

### Record\<K, T\>

> **Record**\<`K`, `T`\>: `{ [P in K]: T }`

Construct a type with a set of properties K of type T

#### Type Parameters

• **K** *extends* keyof `any`

• **T**

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1606

***

### ThemeSettings

> **ThemeSettings**: `object`

#### Type declaration

##### colorScheme?

> `optional` **colorScheme**: `string`

Apply a default color scheme to all components.
This supports all Chakra UI color schemes and is not provided by default.

###### See

https://v2.chakra-ui.com/docs/styled-system/theme#colors for available color schemes.

##### colors?

> `optional` **colors**: [`Record`](-internal-.md#recordk-t)\<`string`, [`ColorDefinition`](-internal-.md#colordefinition)\>

Specific color definitions to use in the theme.
The most common use case is to define a `brand` color.

###### Example

```json
{
  "colors": {
    "brand": {
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

##### extendTheme?

> `optional` **extendTheme**: [`Parameters`](-internal-.md#parameterst)\<*typeof* [`extendTheme`](-internal-.md#extendtheme-1)\>\[`0`\]

Extend the Chakra UI theme.

###### See

https://v2.chakra-ui.com/docs/styled-system/customize-theme#using-theme-extensions

#### Defined in

[theme.ts:20](https://github.com/globus/static-data-portal/blob/1b3fe99b60b8d3ee1c63518384fabe5e257a214e/theme.ts#L20)

## Functions

### extendTheme()

> **extendTheme**(...`extensions`): [`Record`](-internal-.md#recordk-t)\<`string`, `any`\>

#### Parameters

• ...**extensions**: ([`Record`](-internal-.md#recordk-t)\<`string`, `any`\> \| (`theme`) => [`Record`](-internal-.md#recordk-t)\<`string`, `any`\>)[]

#### Returns

[`Record`](-internal-.md#recordk-t)\<`string`, `any`\>

#### Defined in

node\_modules/@chakra-ui/theme-utils/dist/extend-theme.d.ts:19
