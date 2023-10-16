/* Variables */
const form = document.querySelector('.add');
const incomeList = document.querySelector('.income-list');
const expenseList = document.querySelector('.expense-list');
const balanceSpan = document.querySelector('#balance');
const expenseSpan = document.querySelector('#expense');
const incomeSpan = document.querySelector('#income');

/* storing the available transactions in localStorage to transactions Array when page is refreshed */
let transactions = localStorage.getItem('transactions') !== null ? JSON.parse(localStorage.getItem('transactions')) : [] ;

function updateStatistics(){
    let balance = 0;
    let expense = 0;
    let income = 0; 

    for(var i = 0;i<transactions.length;i++){
        if(Number(transactions[i].amount) > 0){
            income += Number(transactions[i].amount);
        }
        else{
            expense += Math.abs(Number(transactions[i].amount)) ;
        }

        balance += Number(transactions[i].amount);
        
    }
    balanceSpan.innerText = `${balance}`;
    incomeSpan.innerText = `${income}`;
    expenseSpan.innerText = `${expense}`;
}

/* function to get transactions from the local storage when page reloads */
function getTransaction() {
    transactions.forEach((transaction) => {
        if(transaction.amount > 0){
            incomeList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time)
        }
        else{
            expenseList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time)
        }
    })
    updateStatistics();
}
/* generate li element */
function generateTemplate(id,source,amount,time){
    return `<li data-id ="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                <span> ₹${Math.abs(amount)}</span>
                <i class="bi bi-trash delete"></i>
            </li>`
}

/* Dom Manipulation function on income and expense list */
function addTransactionDOM(id, source, amount, time){
    if(amount > 0){
            incomeList.innerHTML += generateTemplate(id, source, amount, time)
    }else{
            expenseList.innerHTML += generateTemplate(id, source, amount, time)
    }

}

/* Transaction function */
function addTransaction(source,amount){
    const time = new Date()
    const transaction = {
        id: Math.floor(Math.random() * 100000),
        source: form.source.value,
        amount: form.amount.value,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    }

    transactions.push(transaction);

    localStorage.setItem('transactions',JSON.stringify(transactions));

    /* calling the addTransactionDOM function */
    addTransactionDOM(transaction.id, source, amount, transaction.time);
}

/* Adding event listener on the form element */
form.addEventListener('submit', (event) => {
    event.preventDefault();

    if(form.source.value.trim() === "" || form.amount.value === ""){
        return alert('Please enter proper values in the fields!!')
    }
   
    /* calling the add transaction function */
    addTransaction(form.source.value.trim(), form.amount.value);
    updateStatistics();

    /* resetting the form */
    form.reset();

})

function deleteTransaction(id){
     transactions = transactions.filter((transaction) => {

        return transaction.id !== id
     })

     localStorage.setItem('transactions', JSON.stringify(transactions));
    
}

incomeList.addEventListener('click' , event => {
    if(event.target.classList.contains('delete')){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        updateStatistics();
    }
})

expenseList.addEventListener('click' , event => {
    if(event.target.classList.contains('delete')){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        updateStatistics();
    }
})


/* first call of the code */

function init(){
    /* calling the updateStatistics */
updateStatistics();

/* calling the getTransaction function when page reloads */
getTransaction();

}

init();