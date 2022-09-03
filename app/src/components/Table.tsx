// Components
import {ListingRows} from './ListingRows'

function Table(){
  const headings =
    <tr>
      <th>Expenses</th>
      <th>Income</th>
    </tr>

  const data = require("../sample.json")
  const expenses = data.expenses
  const incomes = data.incomes
  let max_rows :number = (expenses.length > incomes.length ? expenses.length : incomes.length )
  const listingRows = <ListingRows></ListingRows>
  
  const table =
    <table>
      {headings}
    </table>
  
  return table
}

export {Table}