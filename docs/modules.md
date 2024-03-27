# @globus/static-data-portal

## Type Aliases

### Base

Ƭ **Base**: `Object`

The base type for a `static.json` file.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_static` | \{ `generator`: \{ `name`: `string`  } ; `host?`: \{ `base_path`: `string` ; `base_url`: `string` ; `host`: `string` ; `origin`: `string`  }  } |
| `_static.generator` | \{ `name`: `string`  } |
| `_static.generator.name` | `string` |
| `_static.host?` | \{ `base_path`: `string` ; `base_url`: `string` ; `host`: `string` ; `origin`: `string`  } |
| `_static.host.base_path` | `string` |
| `_static.host.base_url` | `string` |
| `_static.host.host` | `string` |
| `_static.host.origin` | `string` |
| `data` | \{ `attributes`: `Record`\<`string`, `unknown`\> ; `version`: `string`  } |
| `data.attributes` | `Record`\<`string`, `unknown`\> |
| `data.version` | `string` |

#### Defined in

[static.ts:6](https://github.com/globus/static-data-portal/blob/a31cee6/utils/static.ts#L6)

___

### Data

Ƭ **Data**: `Object`

The type used for `data` by the [@globus/static-data-portal generator](https://github.com/globus/static-data-portal).

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `attributes` | \{ `content`: \{ `privacy_policy?`: `string` ; `tagline?`: `string` ; `terms_of_service?`: `string` ; `title`: `string`  } ; `globus`: \{ `application`: \{ `client_id`: `string` ; `redirect_uri?`: `string`  } ; `transfer`: \{ `collection_id`: `string` ; `path?`: `string`  }  }  } | - |
| `attributes.content` | \{ `privacy_policy?`: `string` ; `tagline?`: `string` ; `terms_of_service?`: `string` ; `title`: `string`  } | - |
| `attributes.content.privacy_policy?` | `string` | A privacy policy to be rendered at `/privacy-policy`. This is especially useful for associating the published URL with your registered Globus Auth application. |
| `attributes.content.tagline?` | `string` | - |
| `attributes.content.terms_of_service?` | `string` | Terms and conditions to be rendered at `/terms-and-conditions`. This is especially useful for associating the published URL with your registered Globus Auth application. |
| `attributes.content.title` | `string` | The title of the research data portal. |
| `attributes.globus` | \{ `application`: \{ `client_id`: `string` ; `redirect_uri?`: `string`  } ; `transfer`: \{ `collection_id`: `string` ; `path?`: `string`  }  } | - |
| `attributes.globus.application` | \{ `client_id`: `string` ; `redirect_uri?`: `string`  } | Information about your registered Globus Auth Application (Client) **`See`** https://docs.globus.org/api/auth/developer-guide/#developing-apps |
| `attributes.globus.application.client_id` | `string` | The UUID of the client application. |
| `attributes.globus.application.redirect_uri?` | `string` | The redirect URI for the Globus Auth login page to complete the OAuth2 flow. The portal will make a reasonable effort to determine this URI, but this field is provided as a fallback. To use the portal's built-in authorization handling, redirects should be sent to `/authenticate` on the host. **`Example`** ```ts "https://example.com/data-portal/authenticate" ``` |
| `attributes.globus.transfer` | \{ `collection_id`: `string` ; `path?`: `string`  } | Configuration for Transfer-related functionality in the portal. |
| `attributes.globus.transfer.collection_id` | `string` | The UUID of the Globus collection to list and transfer files from. |
| `attributes.globus.transfer.path?` | `string` | The path on the collection to list and transfer files from. |
| `version` | `string` | The version of the `data` object, which is used to determine how the generator will render its `attributes`. **`Example`** ```ts "1.0.0" ``` |

#### Defined in

[static.ts:36](https://github.com/globus/static-data-portal/blob/a31cee6/utils/static.ts#L36)

___

### Static

Ƭ **Static**: [`Base`](modules.md#base) & \{ `data`: [`Data`](modules.md#data)  }

#### Defined in

[static.ts:96](https://github.com/globus/static-data-portal/blob/a31cee6/utils/static.ts#L96)
