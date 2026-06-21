let expenses = [];
let editId = null;

let budget = 0;

const setBudgetBtn =
document.getElementById("setBudgetBtn");

setBudgetBtn.addEventListener(
    "click",
    setBudget
);


function setBudget(){

    budget =
    Number(
        document.getElementById(
            "budgetInput"
        ).value
    );

    localStorage.setItem(
        "budget",
        budget
    );

    document.getElementById(
        "budgetAmount"
    ).textContent = budget;

    updateRemaining();
}

function updateRemaining(){

    const total =
        expenses.reduce(
            (sum, expense) =>
                sum + expense.amount,
            0
        );

    document.getElementById(
        "remainingAmount"
    ).textContent =
        budget - total;
}

const addBtn = document.getElementById("addBtn");
const expenseList = document.getElementById("expenseList");
const totalExpense = document.getElementById("totalExpense");

addBtn.addEventListener("click", addExpense);

function addExpense()
{

    const name =
        document.getElementById("name").value;

    const amount =
        document.getElementById("amount").value;

    const category =
        document.getElementById("category").value;

    const date =
        document.getElementById("date").value;

    if(
        name === "" ||
        amount === "" ||
        date === ""
    ){
        alert("Please fill all fields");
        return;
    }

    const expense = {

        id: Date.now(),

        name: name,

        amount: Number(amount),

        category: category,

        date: date
    };

    if(editId){

    const index =
        expenses.findIndex(
            expense =>
                expense.id === editId
        );

    expenses[index] = {
        id: editId,
        name,
        amount:Number(amount),
        category,
        date
    };

    editId = null;

    addBtn.textContent =
        "Add Expense";

}else{

    const expense = {

        id: Date.now(),
        name,
        amount:Number(amount),
        category,
        date
    };

    expenses.push(expense);
}

    //expenses.push(expense);
    saveExpenses();
    renderExpenses();
    console.log(expenses);
}

function renderExpenses(){

    expenseList.innerHTML = "";

    let total = 0;

    expenses.forEach(expense => {

        total += expense.amount;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${expense.name}</td>
            <td>₹${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>
                <button
                    onclick="editExpense(${expense.id})">
                    Edit
                </button>
                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})"
                >
                    Delete
                </button>
            </td>
        `;

        expenseList.appendChild(row);

    });

    //totalExpense.textContent = total;
    totalExpense.textContent = total;

updateRemaining();
}

function deleteExpense(id)
{

    expenses = expenses.filter(
        expense => expense.id !== id
    );

    saveExpenses();

    renderExpenses();
}

function saveExpenses()
{

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}

function loadExpenses(){

    const storedExpenses =
        localStorage.getItem("expenses");

    if(storedExpenses){

        expenses =
            JSON.parse(storedExpenses);

        renderExpenses();
    }

}

function loadBudget(){

    const storedBudget =
        localStorage.getItem("budget");

    if(storedBudget){

        budget =
            Number(storedBudget);

        document.getElementById(
            "budgetAmount"
        ).textContent = budget;

        updateRemaining();
    }
}
loadExpenses();
loadBudget();

const searchInput =
document.getElementById("searchInput");

searchInput.addEventListener(
    "input",
    searchExpense
);

function searchExpense(){

    const keyword =
        searchInput.value.toLowerCase();

    const filteredExpenses =
        expenses.filter(expense =>
            expense.name
                .toLowerCase()
                .includes(keyword)
        );

    renderFilteredExpenses(
        filteredExpenses
    );
}

function renderFilteredExpenses(data){

    expenseList.innerHTML = "";

    let total = 0;

    data.forEach(expense => {

        total += expense.amount;

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${expense.name}</td>
            <td>₹${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>
                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})"
                >
                    Delete
                </button>
            </td>
        `;

        expenseList.appendChild(row);

    });

}

const filterCategory =
document.getElementById(
    "filterCategory"
);

filterCategory.addEventListener(
    "change",
    filterExpenses
);

function filterExpenses(){

    const selected =
        filterCategory.value;

    if(selected === "All"){

        renderExpenses();

        return;
    }

    const filtered =
        expenses.filter(
            expense =>
                expense.category
                === selected
        );

    renderFilteredExpenses(
        filtered
    );
}

function editExpense(id){

    const expense =
        expenses.find(
            expense => expense.id === id
        );
        document.getElementById("name").value =
            expense.name;

        document.getElementById("amount").value =
            expense.amount;

        document.getElementById("category").value =
            expense.category;

        document.getElementById("date").value =
            expense.date;

        editId = id;

        addBtn.textContent = "Update Expense";
}