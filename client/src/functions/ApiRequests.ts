import {ApiError} from "API/src/data_types/MainApi"

export const API_PORT: number = 3011;
export const API_URL: string = `http://localhost:${API_PORT}`

export async function fetchAPI(url: string, options?: RequestInit) : Promise<ApiError | Record<string, any>>{
  const default_headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
  let fetch_promise : Promise<Response>;
  if (!options) fetch_promise = fetch(url)
  else fetch_promise = fetch(url,
      JSON.parse(JSON.stringify(
      {...options,  credentials: 'include', headers: {...default_headers, ...options.headers}}
    )))

  return fetch_promise
    .then(response => response.json())
    .then(json => json.hasOwnProperty("error") ? json as ApiError : json )
}

export function isError(response: ApiError | Record<string, any>): response is ApiError {
  return ('error' in response && 'message' in response && 'status' in response)
}