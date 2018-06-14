define(function () {

return class Budget {
// Constuctor with income and expense arrays  
constructor(income, expenses) {
  this.income = income;
  this.expenses = expenses;
}
// takes income or expenses string as parameter. Calls reduce on specified array  
calculateTotal(transactionType) {
  // converts the value of each transaction to a float and adds to total
  return this[transactionType].reduce((total, transaction) => {
    return total + parseFloat(transaction.value);
  }, 0);
}
/* returns an object with: totals, available budget, 
   and the percentage of income - expenses are*/
getBudgetData() {
  const incomeTotal = this.calculateTotal('income');
  const expensesTotal = this.calculateTotal('expenses');
  /* expensesPercent is not calculated if incomeTotal is 0 
     (dividing by 0) is instead set to -1 */
  const expensesPercent = (incomeTotal > 0) ? 
    Math.round((expensesTotal / incomeTotal) * 100) * -1 : -1;
    return {
    incomeTotal,
    expensesTotal,
    budget: incomeTotal + expensesTotal,
    expensesPercent,
  }
}
// Getter for specified list and the total of it's values
getListAndTotal(listType) {
  return {
    list: this[listType],
    total: this.calculateTotal(listType),
  }
}
// Adds item to corresponding list. If item is an expense - made negative before adding. 
addItem(itemObject, itemType) {
  if (itemType === 'expenses') itemObject.value *= -1;
  this[itemType].push(itemObject);
}
// Removes item from corresponding list, using specified index
deleteItem(itemType, itemIndex) {
  this[itemType].splice(itemIndex, 1);
}
}
});