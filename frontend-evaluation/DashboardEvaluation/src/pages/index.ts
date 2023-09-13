export interface IRoute {
  component: any,
  props?: any,
  visibility?: "public"|"private"|"both",
  caps?: any []
}

// export const RegisteredRoutes = {
//   '/editpages': { component: require ( './EditPages' ).default },
// }

export type Routes = { [key: string]: IRoute | any }
