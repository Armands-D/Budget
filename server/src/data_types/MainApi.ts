export interface ApiError{
  error: string
  status: number
  message: string
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
