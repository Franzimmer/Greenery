import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      bg: string;
      main: string;
      button: string;
      second: string;
    };
  }
}
