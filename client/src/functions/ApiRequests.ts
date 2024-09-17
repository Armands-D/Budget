import {ApiError} from "../data_types/MainApi"

export const API_PORT: number = 3011;
export const API_URL: string = `http://localhost:${API_PORT}`

export type Result<T, E = undefined> = { ok: true, value: T }
  | { ok: false, error: E | undefined };

export const Ok = <T>(data: T): Result<T, never> => {
    return { ok: true, value: data };
};
 
export const Err = <E>(error?: E): Result<never, E> => {
    return { ok: false, error };
};

export async function fetchAPI(url: string, options?: RequestInit) : Promise<Result<any, ApiError>>{
  const default_headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
  let fetch_promise : Promise<Response>;
  if (!options) fetch_promise = fetch(url)
  else fetch_promise = fetch(url,
      JSON.parse(JSON.stringify(
        {...options,
          credentials: 'include',
          headers: {...default_headers, ...options.headers}
        }
      )
    ))

  let response : Response  = await fetch_promise
  let json = await response.json()
  return response.ok ? Ok(json) : Err(json)
}

export function isError(response: ApiError | Record<string, any>): response is ApiError {
  return ('error' in response && 'message' in response && 'status' in response)
}