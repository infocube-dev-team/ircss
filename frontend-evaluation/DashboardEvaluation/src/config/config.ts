/* eslint-disable import/no-anonymous-default-export */
export default {
  BACKEND_API: process.env.REACT_APP_BACKEND_URL ?? "http://localhost:8080/api/",
  STORAGE_API: process.env.REACT_APP_STORAGE_URL ?? "http://localhost:8080/api/",
  BASENAME: process.env.REACT_APP_BASENAME ?? "/dashboard/#!/",
  SSO_LOGIN: process.env.REACT_APP_SSO_LOGIN ?? 'false',
}
