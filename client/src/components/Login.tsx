
function Login({toggleLogin}: {toggleLogin: any}){
    return <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name"/>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password"/>
        <button onClick={toggleLogin}>Login</button>
    </div>
}

export {Login}