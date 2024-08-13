import {fetchAPI, isError} from "../functions/ApiRequests"
import {ApiError} from "../api_interfaces/MainApi"

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

    return <div id='login'>
      <label 
      id='labal1'
      htmlFor="email">
        Email:
      </label>
      <input
      defaultValue={"a.d@g.com"}
      type="text"
      id="email"/>
      <label
      id='lbl2'
      htmlFor="password">
        Password:
      </label>
      <input
      defaultValue={"armands"}
      type="password"
      id="password"/>
      <button
      id='butloggy'
      onClick={handleLogin}>
        Login
      </button>
    </div>
}

export {Login}