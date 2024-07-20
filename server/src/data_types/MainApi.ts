export interface ApiError{
  error: string
  status: number
  message: string
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
    id: number
    income: Record<string, Category>
    expenses: Record<string, Category>
  }

  export interface Category {
    name: string
    entries: Entry[]
  }

  export interface Entry {
    id: number
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

export interface ResultSetHeader{
  fieldCount: number
  affectedRows: number
  insertId: number
  info: string
  serverStatus: number
  warningStatus: number
  stateChanges: {
    systemVariables: any,
    schema: string
    gtids: any
    trackStateChange: any
  },
  changedRows: number
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
    username: string
    email: string
    password: string
    create_time: string
  }
}