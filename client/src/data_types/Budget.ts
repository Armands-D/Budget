

export interface Budget{
  budgetId: number
  [SectionType.income] : Section
  [SectionType.expenses] : Section
}

export enum SectionType {income = 'income', expenses='expenses'}

export interface Section {
  categories: (Category)[]
  total: number
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

class UserBudget implements Budget{

  budgetId: number;
  [SectionType.income] : Section
  [SectionType.expenses] : Section
  constructor(budget: Budget){
    this.budgetId = budget.budgetId
    this[SectionType.income] = budget[SectionType.income]
    this[SectionType.expenses] = budget[SectionType.income]
  }
  static add(a:number, b:number, ...numbers: number[]): number{
    let by100 = (n:number) => Number(n.toFixed(2)) * 100
    let sum: number = by100(a) + by100(b)
    let n: number;
    for(n of numbers){
      sum += by100(n)
    }
    return Number((sum / 100).toFixed(2))
  }

  static subtract(a:number, b:number, ...numbers: number[]): number{
    let by100 = (n:number) => Number(n.toFixed(2)) * 100
    let sum: number = by100(a) - by100(b)
    let n: number;
    for(n of numbers){
      sum -= by100(n)
    }
    return Number((sum / 100).toFixed(2))
  }
}