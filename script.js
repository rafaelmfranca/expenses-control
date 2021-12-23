const get = (str) => document.querySelector(`${str}`);
const getAll = (str) => document.querySelectorAll(`${str}`);

const transactionsUl = get('#transactions');
const transactionsForm = get('#form');
const transactionsFilter = get('#filter');
const inputs = getAll('input');
let activeFilter = get('.active');

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);
let transactions = localStorageTransactions || [];

const addTransactionIntoDOM = ({ id, name, amount }) => {
  const liClass = amount > 0 ? 'income' : 'expense';
  const spanClass = amount > 0 ? 'green' : 'red';
  const li = document.createElement('li');

  li.classList.add(liClass);
  li.innerHTML = `
    <small>
      <a onclick="removeTransaction(${id})" class="remove">
        <i class="fas fa-times fa-xs"></i>
      </a>
      ${name}
    </small>
    <span class="${spanClass}">$ ${Math.abs(amount).toFixed(2)}</span>
  `;

  transactionsUl.appendChild(li);
};

const sumOfAllTransactions = () =>
  transactions.reduce((acc, { amount }) => acc + amount, 0).toFixed(2);

const updateCurrentBalance = () => {
  const currentBalance = get('#balance');
  const total = sumOfAllTransactions();

  currentBalance.textContent = `$ ${total}`;
};

const sumOfIncomes = () =>
  transactions
    .filter(({ amount }) => amount > 0)
    .reduce((acc, { amount }) => acc + amount, 0)
    .toFixed(2);

const sumOfExpenses = () =>
  Math.abs(
    transactions
      .filter(({ amount }) => amount < 0)
      .reduce((acc, { amount }) => acc + amount, 0)
  ).toFixed(2);

const updateIncomesAndExpenses = () => {
  const incomes = get('#incomes');
  const expenses = get('#expenses');
  const incomesTotal = sumOfIncomes();
  const expensesTotal = sumOfExpenses();

  incomes.textContent = `$ ${incomesTotal}`;
  expenses.textContent = `$ ${expensesTotal}`;
};

const updateAddTransactionBtn = (addButton) => {
  const addBtn = addButton;
  inputs.forEach((input) => {
    input.addEventListener('keyup', () => {
      if ([...inputs].every((inp) => inp.value.trim() !== '')) {
        addBtn.classList.remove('disabled');
        addBtn.disabled = false;
      } else {
        addBtn.classList.add('disabled');
        addBtn.disabled = true;
      }
    });
  });
};

const handleAddTransactionBtn = () => {
  const addButton = get('.add');
  addButton.classList.add('disabled');
  addButton.disabled = true;

  updateAddTransactionBtn(addButton);
};

const updateLocalStorage = () =>
  localStorage.setItem('transactions', JSON.stringify(transactions));
const generateRandomID = () => Math.round(Math.random() * 100);
const clearInputs = () => transactionsForm.reset();

const getAllTransactions = () => transactions.forEach(addTransactionIntoDOM);
const getIncTransactions = () =>
  transactions
    .filter(({ amount }) => amount > 0)
    .forEach(addTransactionIntoDOM);
const getExpTransactions = () =>
  transactions
    .filter(({ amount }) => amount < 0)
    .forEach(addTransactionIntoDOM);

const addNewTransaction = () => {
  const nameInput = inputs[0].value;
  const amountInput = Number(inputs[1].value);
  const newTransaction = {
    id: generateRandomID(),
    name: nameInput,
    amount: amountInput,
  };
  transactions.push(newTransaction);
};

const init = () => {
  transactionsUl.innerHTML = '';
  if (activeFilter.id === 'all') getAllTransactions();
  if (activeFilter.id === 'inc') getIncTransactions();
  if (activeFilter.id === 'exp') getExpTransactions();
  updateCurrentBalance();
  updateIncomesAndExpenses();
  handleAddTransactionBtn();
};

transactionsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addNewTransaction();
  init();
  updateLocalStorage();
  clearInputs();
});

const toggleActiveFilter = (event) => {
  const { target } = event;
  if (
    !target.classList.contains('active') &&
    target.classList.contains('filter-btn')
  ) {
    target.classList.add('active');
    activeFilter.classList.remove('active');
    activeFilter = target;
    init();
  }
};

transactionsFilter.addEventListener('click', toggleActiveFilter);

const removeTransaction = (removeId) => {
  transactions = transactions.filter(({ id }) => id !== removeId);
  init();
  updateLocalStorage();
};

window.onload = () => init();
