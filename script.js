const get = (str) => document.querySelector(`${str}`);
const getAll = (str) => document.querySelectorAll(`${str}`);

const transactionsUl = get('#transactions');
const transactionsForm = get('#form');
const inputs = getAll('input');

const transactions = [
  { id: 1, name: 'Salary', amount: 1200 },
  { id: 2, name: 'Market', amount: -300 },
  { id: 3, name: 'Freelance', amount: 350 },
];

const addTransactionIntoDOM = ({ name, amount }) => {
  const liClass = amount > 0 ? 'income' : 'expense';
  const spanClass = amount > 0 ? 'green' : 'red';
  const li = document.createElement('li');

  li.classList.add(liClass);
  li.innerHTML = `<small>${name}</small> <span class="${spanClass}">$ ${Math.abs(amount).toFixed(2)}</span>`;

  transactionsUl.appendChild(li);
};

const updateCurrentBalance = () => {
  const currentBalance = get('#balance');
  const total = transactions
    .reduce((acc, { amount }) => acc + amount, 0)
    .toFixed(2);
  currentBalance.textContent = `$ ${total}`;
};

const updateIncomesAndExpenses = () => {
  const incomes = get('#incomes');
  const expenses = get('#expenses');
  const incomesTotal = transactions
    .filter(({ amount }) => amount > 0)
    .reduce((acc, { amount }) => acc + amount, 0)
    .toFixed(2);
  const expensesTotal = Math.abs(transactions
    .filter(({ amount }) => amount < 0)
    .reduce((acc, { amount }) => acc + amount, 0))
    .toFixed(2);

  incomes.textContent = `$ ${incomesTotal}`;
  expenses.textContent = `$ ${expensesTotal}`;
};

const handleAddTransactionButton = () => {
  const addButton = get('.add');
  addButton.classList.add('disabled');
  addButton.disabled = true;

  inputs.forEach((input) => {
    input.addEventListener('keyup', () => {
      if (inputs[0].value.trim() !== '' && inputs[1].value.trim() !== '') {
        addButton.classList.remove('disabled');
        addButton.disabled = false;
      } else {
        addButton.classList.add('disabled');
        addButton.disabled = true;
      }
    });
  });
};

const init = () => {
  transactionsUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateCurrentBalance();
  updateIncomesAndExpenses();
  handleAddTransactionButton();
};

init();

const generateRandomID = () => Math.round(Math.random() * 100);

transactionsForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const newTransaction = { id: generateRandomID(), name: inputs[0].value, amount: Number(inputs[1].value) };
  transactions.push(newTransaction);

  inputs[0].value = '';
  inputs[1].value = '';
  init();
});