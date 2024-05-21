import { STATIC } from "./utils/static";

import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

export type ColorDefinition =
  | {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    }
  | string;

export type ThemeSettings = {
  /**
   * Apply a default color scheme to all components.
   * This supports all Chakra UI color schemes and is not provided by default.
   * @see https://v2.chakra-ui.com/docs/styled-system/theme#colors for available color schemes.
   */
  colorScheme?: string;
  /**
   * Specific color definitions to use in the theme.
   * The most common use case is to define a `brand` color.
   * @example
   * ```json
   * {
   *   "colors": {
   *     "brand": {
   *      "50": "#E5F2FF",
   *      "100": "#B8DBFF",
   *      "200": "#8AC4FF",
   *      "300": "#5CADFF",
   *      "400": "#2E96FF",
   *      "500": "#007FFF",
   *      "600": "#0066CC",
   *      "700": "#004C99",
   *      "800": "#00264c",
   *      "900": "#001933"
   *   }
   *  }
   * }
   * ```
   * @see https://v2.chakra-ui.com/docs/styled-system/theme#colors
   */
  colors?: Record<string, ColorDefinition>;
  /**
   * Extend the Chakra UI theme.
   * @see https://v2.chakra-ui.com/docs/styled-system/customize-theme#using-theme-extensions
   */
  extendTheme?: Parameters<typeof extendTheme>[0];
};

const brand: ColorDefinition = {
  "50": "#E5F2FF",
  "100": "#B8DBFF",
  "200": "#8AC4FF",
  "300": "#5CADFF",
  "400": "#2E96FF",
  "500": "#007FFF",
  "600": "#0066CC",
  "700": "#004C99",
  "800": "#00264c",
  "900": "#001933",
};

let colorScheme = {};
if (STATIC.data.attributes.theme?.colorScheme) {
  colorScheme = withDefaultColorScheme({
    colorScheme: STATIC.data.attributes.theme?.colorScheme,
  });
}

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};

const theme = extendTheme(
  {
    components: {
      Form: {
        variants: {
          floating: {
            container: {
              _focusWithin: {
                label: {
                  ...activeLabelStyles,
                },
              },
              "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
                {
                  ...activeLabelStyles,
                },
              label: {
                top: 0,
                left: 0,
                zIndex: 2,
                position: "absolute",
                backgroundColor: "white",
                pointerEvents: "none",
                mx: 3,
                px: 1,
                my: 2,
                transformOrigin: "left top",
              },
            },
          },
        },
      },
    },
  },
  {
    colors: {
      brand,
      ...(STATIC.data.attributes.theme?.colors || {}),
    },
  },
  colorScheme,
  STATIC.data.attributes.theme?.extendTheme || {},
);

export default theme;
