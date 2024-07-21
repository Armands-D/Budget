
function Login({toggleLogin}: {toggleLogin: any}){

    async function handleLogin(){
      const email: any = (document.getElementById('email') as HTMLInputElement).value
      const password : any = (document.getElementById('password') as HTMLInputElement).value
      console.log("email: ", email, "password: ", password)
      let response =  await fetchLogin(email, password)
      if(response.hasOwnProperty('error')) return
      sessionStorage.setItem("token", response.token)
      console.log(response)
      toggleLogin()
    }

    async function fetchLogin(email: string, password: string) : Promise<any>{
      return fetch(`http://localhost:3001/login/`,{
        method: 'POST',
        body: JSON.stringify({email: email, password: password}),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        }
      })
      .then( response => { return response.json()})
      .then( data => { return data })
    }

    return <div>
      <label htmlFor="email">Email:</label>
      <input type="text" id="email"/>
      <label htmlFor="password">Password:</label>
      <input type="password" id="password"/>
      <button onClick={handleLogin}>Login</button>
    </div>
}

export {Login}