import {fetchAPI, isError} from "../functions/ApiRequests"
import {ApiError} from "API/src/data_types/MainApi"

function Login({toggleLogin}: {toggleLogin: () => void}){

    async function handleLogin(){
      const email: string = String((document.getElementById('email') as HTMLInputElement).value)
      const password : string = String((document.getElementById('password') as HTMLInputElement).value)
      let response: ApiError | Record<string, any> =  await fetchLogin(email, password)
      if(isError(response)) return
      // sessionStorage.setItem("token", response.token)
      toggleLogin()
    }

    async function fetchLogin(email: string, password: string) : Promise<any>{
      return fetchAPI(`http://localhost:3001/login/`,{
        method: 'POST',
        body: JSON.stringify({email: email, password: password}),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        }
      })
    }

    return <div>
      <label 
      htmlFor="email">
        Email:
      </label>
      <input
      defaultValue={"a.d@g.com"}
      type="text"
      id="email"/>
      <label
      htmlFor="password">
        Password:
      </label>
      <input
      defaultValue={"armands"}
      type="password"
      id="password"/>
      <button
      onClick={handleLogin}>
        Login
      </button>
    </div>
}

export {Login}