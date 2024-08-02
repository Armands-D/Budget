export interface ApiError{
  error: string
  status: number
  message: string
}

export const missing_authorization_error : ApiError = {
  message: "Authorization Header Missing",
  status: 403,
  error: "Failed to authorize user request because authorization header is missing"
}

export namespace Database{
  export let error_db_connect: ApiError = {
    error: 'Critical Server Error',
    status: 500,
    message: 'Failed to Connect to DB'
  }
}

// TODO: Figure out namespaces
// GET user:userId/budget:budgetId

export namespace UserBudget {

  export interface Reponse{
    budgetId: number
    income: {
      categories: (Category)[]
      total: number
    }
    expenses: {
      categories: (Category)[]
      total: number
    }
  }

  export interface Category {
    name: string
    categoryId: number
    entries: Entry[]
    total: number
  }

  export interface Entry {
    entryId: number
    name: string
    amount: number
  }

  export interface Results{
    [index: number]:
      {
        username: string
        userId: number
        budgetId: number
        categoryId: number
        type: string
        category: string
        entryId: number
        name: string
        amount: number
      }
  }
}

export namespace Login {
  export const error_auth: ApiError = {
    message: "Failed to autheticate: email or password incorrect",
    status: 401,
    error: "Failed to authenticate login"
  }

  export const error_multiple_users: ApiError = {
    message: "Critical Server Error",
    status: 500,
    error: "Multiple Login Users By Email"
  }

  export  let error_body : ApiError = {
    error: "Client Error",
    status: 401, 
    message: "Body requires password and email."
  }

  export interface UserDetails{
    userId: number
    username: string
    email: string
    password: string
    create_time: string
    token: string
  }
}