/* eslint-disable import/no-extraneous-dependencies */
import { createBrowserHistory } from 'history'
import { stringify, parse } from 'qs'
import { Routes } from '../pages'
import config from "../config/config";

interface RouteParams {
  [key: string]: any
}

export interface NavigationOptions {
  replace?: boolean
  state?: any
  props?: { [key: string]: any }
}

// navigation history with basename
export const history = createBrowserHistory({ basename: config.BASENAME });

export const replaceMatchParams = (page: string, params: Record<string, any>) => {
  Object.keys(params).forEach((key) => {
    // @ts-ignore
    if (page.includes(`:${key}`)) {
      // @ts-ignore
      page = page.replace(`:${key}`, params[key]) as Routes
      delete params[key]
    }
  })
  return page
}

export function reloadApp() {
  setTimeout(() => {
    window.location.reload()
  }, 500)
}

export function navigate(_path: string, routeParams?: RouteParams, options?: NavigationOptions): void {
  // add query params to path
  const route = routeParams ? replaceMatchParams(_path, routeParams) : _path
  const stringParams = routeParams ? stringify(routeParams, { arrayFormat: 'repeat' }) : ''
  const path = `${route}${stringParams ? `?${stringParams}` : ''}`
  const props = options ? options.props : undefined

  options && options.replace ? history.replace(path, props) : history.push(path, options?.state)
}

export function navigateBack(): void {
  history.goBack()
}

export function refresh(queryParams?: RouteParams) {
  navigate(history.location.pathname, queryParams)
}

export function getMatchParams(props: any) {
  return props.match.params
}

export function getLocationState(props: any) {
  return props.location.state
}

export function getQueryParams(): Record<string, any> {
  const { search } = history.location
  const queryParams = search && search.charAt(0) === '?' ? search.substring(1) : search
  return parse(queryParams)
}

export function addQueryParams(newParams: Record<string, unknown>, reset = false): void {
  const { search } = history.location
  const queryParams = reset ? {} : parse(search && search.charAt(0) === '?' ? search.substring(1) : search)
  const params = {
    ...queryParams,
    ...newParams,
  }
  let paramsString = ''
  Object.keys(params).map((key) => (paramsString += `${key}=${params[key]}&`))
  if (paramsString.length > 0) paramsString = paramsString.substring(0, paramsString.length - 1)
  const encoded = paramsString ? `?${encodeURI(paramsString)}` : ''
  if (search !== encoded) history.push(encoded)
}

export function setQueryParams(newParams: Record<string, any>) {
  addQueryParams(newParams, true)
}
