// Transaction object to store transaction details
class Transaction {
  constructor(type, description, amount) {
    this.type = type;
    this.description = description;
    this.amount = amount;
  }
}

// Track transactions and update balance
class FinanceTracker {
  constructor() {
    this.transactions = [];
    this.balance = 0;
  }

  // Add a new transaction
  addTransaction(type, description, amount) {
    const transaction = new Transaction(type, description, amount);
    this.transactions.push(transaction);
    this.updateBalance();
    this.saveData();
  }

  // Delete a transaction by index
  deleteTransaction(index) {
    this.transactions.splice(index, 1);
    this.updateBalance();
    this.saveData();
  }

  // Update the balance
  updateBalance() {
    this.balance = this.transactions.reduce((total, transaction) => {
      return transaction.type === 'income' ? total + transaction.amount : total - transaction.amount;
    }, 0);
  }

  // Save transaction data to local storage
  saveData() {
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }

  // Load transaction data from local storage
  loadData() {
    const data = localStorage.getItem('transactions');
    if (data) {
      this.transactions = JSON.parse(data);
      this.updateBalance();
    }
  }
}

// DOM manipulation and event handling
document.addEventListener('DOMContentLoaded', () => {
  const financeTracker = new FinanceTracker();
  const transactionForm = document.getElementById('transaction-form');
  const transactionList = document.getElementById('transactions');
  const balanceDiv = document.getElementById('balance');

  // Function to display the current balance
  function displayBalance() {
    balanceDiv.textContent = `Balance: $${financeTracker.balance.toFixed(2)}`;
  }

  // Function to display transactions
  function displayTransactions() {
    transactionList.innerHTML = '';

    financeTracker.transactions.forEach((transaction, index) => {
      const transactionDiv = document.createElement('div');
      transactionDiv.classList.add('transaction');

      const typeSpan = document.createElement('span');
      typeSpan.classList.add('type');
      typeSpan.textContent = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
      transactionDiv.appendChild(typeSpan);

      const descriptionP = document.createElement('p');
      descriptionP.classList.add('description');
      descriptionP.textContent = transaction.description;
      transactionDiv.appendChild(descriptionP);

      const amountP = document.createElement('p');
      amountP.textContent = `$${transaction.amount.toFixed(2)}`;
      transactionDiv.appendChild(amountP);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        financeTracker.deleteTransaction(index);
        displayTransactions();
        displayBalance();
      });
      transactionDiv.appendChild(deleteBtn);

      transactionList.appendChild(transactionDiv);
    });
  }

  // Function to handle form submission
  function handleFormSubmit(event) {
    event.preventDefault();

    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (isNaN(amount)) {
      alert('Please enter a valid amount.');
      return;
    }

    financeTracker.addTransaction(type, description, amount);
    displayTransactions();
    displayBalance();

    // Clear form inputs
    transactionForm.reset();
  }

  // Event listener for form submission
  transactionForm.addEventListener('submit', handleFormSubmit);

  // Load saved transaction data on page load
  financeTracker.loadData();
  displayTransactions();
  displayBalance();
});
