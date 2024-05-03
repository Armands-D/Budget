
function Login({toggleLogin}: {toggleLogin: any}){

    function handleLogin(){
      const email: any = (document.getElementById('email') as HTMLInputElement).value
      const password : any = (document.getElementById('password') as HTMLInputElement).value
      console.log(email, password)
    }

    return <div>
      <label htmlFor="email">Email:</label>
      <input type="text" id="email"/>
      <label htmlFor="password">Password:</label>
      <input type="password" id="password"/>
      <button onClick={toggleLogin}>Login</button>
    </div>
}

export {Login}