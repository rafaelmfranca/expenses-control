const get = (str) => document.querySelector(`${str}`);

const transactionsUl = get('#transactions');

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
  li.innerHTML = `<small>${name}</small> <span class="${spanClass}">$ ${Math.abs(amount)}</span>`;

  transactionsUl.appendChild(li);
};

const init = () => {
  transactions.forEach(addTransactionIntoDOM);
};

init();