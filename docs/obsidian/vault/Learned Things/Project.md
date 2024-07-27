**Tags:
 npm #http #fetch

# Node Packages
## nodemon
Auto refresh node server on file change. Useful for refreshing express app on server code change.

# HTTP Request

## Fetch POST
Requires Content-Type & Accept headers to be set when sending POST requests or else body will be undefined.

**Curl
```sh
curl -X POST  http://localhost:3001/login \
	-H "Content-Type: application/json" \
	-H "Accept: application/json" \
	-d '{"email":"ad", "password": "ad"}'
```

**Fetch
```js
fetch(`http://localhost:3001/login/`,{
		method: 'POST',
		body: JSON.stringify({email: email, password: password}),
		headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	}
})
.then( response => {return response.json()})
.then( data => { return data })
```

# Local Packages
`package.json` is a configuration file which contains dependencies for your project, node or local packages. If code is outside the `rootDir` then the package needs to be included as dependency. 
[Stack Overflow Solution ](https://stackoverflow.com/questions/53716244/how-to-create-a-local-module-in-typescript)

List the local package directory as a dependency for in the `package.json` of the project importing the package.
```json
// client's package.json
// Linking to my own local server package
"dependencies": {
	"API": "file:../server",
	...
}
```

The you need to npm install your module.
```sh
# client's project directory
npm i API
```

Now you can safely import your module's exports.
```ts
// client's source code
import {ApiError} from "API/src/data_types/MainApi"
```

# Cookies
[Stack Overflow Solution](https://stackoverflow.com/questions/46288437/set-cookies-for-cross-origin-requests)

## Client
Needs to allow the sending of credentials (cookies), explains credentials for server side header.

> A client can ask that credentials should be included in cross-site requests in several ways:
 >- Using [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch), by setting the [`credentials`](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#credentials) option to `"include"`.
> - Using [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), by setting the [`XMLHttpRequest.withCredentials`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials) property to `true`.
> - Using [`EventSource()`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource), by setting the [`EventSource.withCredentials`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/withCredentials) property to `true`.
>
> [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)
## Server
### CORS
**CORS Config
```ts
import cors from 'cors';
app.use(cors({origin: "http://localhost:3000",credentials: true,}))

```

**Headers:
```json
req.setHeader("Access-Control-Allow-Origin", "http://localhost:3001") // Client side host with http protocol specified
```

### Cookies
[Blog Explaining express response cookie options](https://dev.to/alexmercedcoder/expressjs-handling-cross-origin-cookies-38l9)

**Express
```ts
import cookieParser from 'cookie-parser';
app.use(cookieParser());

...
app.post('/login', async (req, res) => {
	...
	res.cookie("token", user_details.token, {
		httpOnly: true, // Allow http for localhost dev work
		path: "/", // Path to place cookie
		domain: "localhost", // domain cookies is allowed on
		secure: false, // allow sending cookie over http
		sameSite: "none", // Only allow sending cookies over same origin
		maxAge: 1000 * 60 * 60, // 1 hour
	})
	...
	res.send({token: token})
```

# Express

## Best Practices
- [Use gzip compression](https://expressjs.com/en/advanced/best-practice-performance.html#use-gzip-compression)
- [Don’t use synchronous functions](https://expressjs.com/en/advanced/best-practice-performance.html#dont-use-synchronous-functions)
- [Do logging correctly](https://expressjs.com/en/advanced/best-practice-performance.html#do-logging-correctly)
- [Handle exceptions properly](https://expressjs.com/en/advanced/best-practice-performance.html#handle-exceptions-properly)