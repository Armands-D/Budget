
function Login({toggleLogin}: {toggleLogin: any}){

    async function handleLogin(){
      const email: any = (document.getElementById('email') as HTMLInputElement).value
      const password : any = (document.getElementById('password') as HTMLInputElement).value
      console.log(email, password)
      if(await requestLogin(email, password)){
        toggleLogin()
      }
    }

    async function requestLogin(email: string, password: string) : Promise<boolean>{
      return fetch(`http://localhost:3001/login`)
      .then( response => {return response.json()})
      .then( data => {
        return true
      })
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