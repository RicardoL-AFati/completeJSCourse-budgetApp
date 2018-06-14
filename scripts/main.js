define(function(require) {
  // requiring modules and creating new instances of each
  const Budget = require('./budget.js');
  const UIController = require('./uiController.js');
  const ui = new UIController();
  // budget is intialized with two empty arrays
  const budget = new Budget([], []);
  // Gets strings to select elements with and adds event listeners 
  function setEventListeners() {
    const domStrings = ui.getDomStrings();
    // click event listener to add a budget item
    document.querySelector(domStrings.addItemBtn).addEventListener('click', handleInput);
    // change event listener for the budget item dropdown. Toggles css class to change input fields appearance.
    document.querySelector(domStrings.itemType).addEventListener('change', () => ui.changeType());
    // click event listener for lists. For event delegation to delete budget items.   
    document.querySelectorAll(`${domStrings.incomeList}, ${domStrings.expensesList}`)
      .forEach((list) => list.addEventListener('click', handleDelete));        
    // keypress event listener for enter key to add a budget item
    window.addEventListener('keypress', (e) => {
    if (e.keyCode === 13 || e.which === 13) handleInput();
    });
  }
  /* Gets input data, Adds constructed item (from data) to corresponding list 
     and updates budget and list on UI */   
  function handleInput() {
    // If not all inputs were filled, return
    if (!ui.checkInputs()) return;
    // input object will be - itemObject (desc and value) and it's type (inc or exp)
    const input = ui.getInput();
    // Adding the item to budget
    budget.addItem(input.itemObject, input.type);
    // Updating the budget and list displays on UI with new list
    ui.updateBudget(budget.getBudgetData());
    ui.updateList(budget.getListAndTotal(input.type), input.type);
    // clearing input fields
    ui.clearInputs();
  }
  /* Runs when click target was icon element. 
     Removes corresponding item from budget and updates budget and list on UI */
  function handleDelete(e) {
    // return if target was not on icon
    if (!e.target.matches('i')) return;
    /* icons are nested four div's deep. 
       Outer div's id attribute contains the item type and index */
    const [itemType, itemIndex] = 
    (e.target.parentNode.parentNode.parentNode.parentNode).id.split('-');
    // removes item from its correspoding budget array
    budget.deleteItem(itemType, itemIndex);
    // Updating the budget and list on UI with new list
    ui.updateBudget(budget.getBudgetData());
    ui.updateList(budget.getListAndTotal(itemType), itemType);
  }
  // updates date and budget displays and sets up event listeners
  function init() {
    ui.updateDate();
    ui.updateBudget({});
    setEventListeners();
  }
  // initialization function called on page load
  init();
  
});
