define(function () {

    return class UIController {
    // constructor contains months of the year and strings for DOM selection  
    constructor() {
      this.monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
      // Each property contains string to select corresponding DOM element with
      this.domStrings = {
        monthDisplay: '.budget__title--month',
        budgetDisplay: '.budget__value',
        incomeTotal: '.budget__income--value',
        expensesTotal: '.budget__expenses--value',
        expensesPercent: '.budget__expenses--percentage',
        itemType: '.add__type',
        itemDescription: '.add__description',
        itemValue: '.add__value',
        incomeList: '.income__list',
        expensesList: '.expenses__list',
        addItemBtn: '.add__btn',
      }
    }
    
    getDomStrings() {
        return this.domStrings;
    }
    // Retrieves values from input fields and returns an object of those values
    getInput() {
        const type = document.querySelector(this.domStrings.itemType).value;  
        const description = document.querySelector(this.domStrings.itemDescription).value;  
        const value = document.querySelector(this.domStrings.itemValue).value;
        return {
            itemObject: { description, value, },
            type,
        };
    }
    // Selects item type and input fields and toggles CSS class
    changeType() {
      [...document.querySelectorAll(
        `${this.domStrings.itemType}, ${this.domStrings.itemDescription}, ${this.domStrings.itemValue}`)
      ].forEach((field) => {
          field.classList.toggle('red-focus');
        });
      document.querySelector(this.domStrings.addItemBtn).classList.toggle('red');          
    }
    // Checks if inputs fields are filled, changes placeholder text if not, returns true or false
    checkInputs() {
      // filled is initialized to true, changed to false if a field is not filled  
      let filled = true;
      // selecting both input elements and iterating over
      [...document.querySelectorAll(
        `${this.domStrings.itemDescription}, ${this.domStrings.itemValue}`)
      ].forEach((field) => {
        // if the text field - if value is nothing or null, change placeholder and set filled to false  
        if (field.type === 'text' ) {
            if (field.value === '' || field.value === null) {
                field.placeholder = 'Please fill required field';
                filled = false;
            }
        } else {
            // if the number fields - if value is nothing or <= 0 change placeholder and set filled to false
            if (field.value === '' || field.value <= 0) {
                field.placeholder = 'Invalid';
                filled = false;
            }
        }   
      });
      // if both fields were filled - will return true, else false
      return filled;
    }
    // reset placeholder text for input fields and clear value
    clearInputs() {
      [...document.querySelectorAll(
        `${this.domStrings.itemDescription}, ${this.domStrings.itemValue}`)
      ].forEach((field) => {
        field.placeholder = (field.type === 'text') ? 'Add description' : 'Value'; 
        field.value = '';
      });
    }
    /* takes budget list - returns new list 
       with budget item value changed to two decimal places (.00 if whole) */
    setDecimals(listArray) {
      return listArray.map((itemObj) => {
        itemObj.value = parseFloat(itemObj.value).toFixed(2);
        return itemObj;    
      });    
    }
    // Updates date display with current month and year
    updateDate() {
      const now = new Date();
      document.querySelector(this.domStrings.monthDisplay).textContent = 
        `${this.monthNames[now.getMonth()]}, ${now.getFullYear()}`;
    }
    // Updates budget display using a budget object
    updateBudget(budgetObj) {
      /* Iterating over budget object, if number is integer - format with commas + '.00' on end 
         else - format with commas */  
      Object.entries(budgetObj).forEach(([key, number]) => {
        number = (number % 1 === 0) ? `${parseFloat(number.toFixed(2)).toLocaleString()}.00` :   
        parseFloat(number.toFixed(2)).toLocaleString();
        budgetObj[key] = number;
      });
      // Setting each display element's innerHTML to corresponding budget entry   
      document.querySelector(this.domStrings.budgetDisplay).innerHTML = budgetObj.budget || '0';
      // Adding '+' in front of income total. If total < 0 - sets to nothing
      document.querySelector(this.domStrings.incomeTotal).innerHTML = 
        `${budgetObj.incomeTotal > 0 ? `+ ${budgetObj.incomeTotal}` : ''}`;
      document.querySelector(this.domStrings.expensesTotal).innerHTML = budgetObj.expensesTotal || '';
      // displays expensesPercent (as integer) with '%'. If expensesPercent < 0  display '---'
      document.querySelector(this.domStrings.expensesPercent).innerHTML = 
      `${budgetObj.expensesPercent > 0 ? `${parseInt(budgetObj.expensesPercent)}%` : '---'}`;           
    }
    // Runs whenever an item is added or deleted from either list. Indexes of budget items change
    // Takes the list and it's total - and list type
    updateList(listAndTotal, listType) {
        // formatting budget item values with decimals   
        const list = this.setDecimals(listAndTotal.list);
        // if absolute value of total < 0 - set to -1 (expenses has negative total) 
        const total = (Math.abs(listAndTotal.total) > 0) ? Math.abs(listAndTotal.total) : -1;
        // Using appropriate list string from domStrings
        const selector = this.domStrings[`${listType}List`];
        // calling reduce on list array changing list's innerHTML to returned html value
        document.querySelector(selector).innerHTML = list.reduce((html, itemObj, i) => {
            // Percentage of current budget item in relation to list. If total <= 0 - set to '---'
            const itemPercent = (total === -1) ? '---' : Math.abs(Math.round((itemObj.value / total) * 100)); 
            // Formatting budget item value with commas. If integer format with '.00' on end
            let itemValue = parseFloat(itemObj.value).toLocaleString();
            if (itemObj.value % 1 === 0) itemValue = `${parseFloat(itemObj.value).toLocaleString()}.00`;        
            // Each budget item 'block' contains: id=listType-index, desc, value, percent   
            return html +=
            `<div class="item clearfix" id="${listType}-${i}">
            <div class="item__description">${itemObj.description}</div>
            <div class="right clearfix"><div class="item__value">${listType === 'income' ? '+ ' : ''}${itemValue}</div>
            <div class="item__percentage">${itemPercent}</div><div class="item__delete">
            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
        }, '');    
    }
}
});
