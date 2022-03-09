"use strict";

const transactionContainer = document.querySelector(".transaction");
const balanceElement = document.querySelector(".balance_value");
const summaryIn = document.querySelector(".total_deposit");
const summaryOut = document.querySelector(".total_withdrawal");
const creditIn = document.querySelector(".total_interest");
const loginUser = document.querySelector(".login_input_user");
const loginPin = document.querySelector(".login_input_pin");
const loginBtn = document.querySelector(".login_btn");
const mssg = document.querySelector(".start");
const container = document.querySelector(".main");
const transferTo = document.querySelector(".form_input_to");
const transferAmount = document.querySelector(".form_input_amount");
const transferBtn = document.querySelector(".transfer_btn");
const closeAccountBtn = document.querySelector(".close_btn");
const closeAccountInput = document.querySelector(".closeAccount_input");
const closeAccountPin = document.querySelector(".close_pin");
const loanInput = document.querySelector(".loan_input");
const loanBtn = document.querySelector(".loan_btn");
const sortBtn = document.querySelector(".btn_sort");
const balDate = document.querySelector(".date");
const logOut = document.querySelector(".timer");

const user1 = {
  owner: "Jeon Jungkook",
  transaction: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  transactionDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const user2 = {
  owner: "Kim Taehyung",
  transaction: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.2,
  pin: 2222,

  transactionDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [user1, user2];

//Function printing transactions
const printTransaction = function (accobj, sort) {
  transactionContainer.innerHTML = "";

  //sort functionality
  const transactionsort = sort
    ? accobj.transaction.slice().sort(function (a, b) {
        return a - b;
      })
    : accobj.transaction;
  transactionsort.forEach(function (n, i) {
    const type = n > 0 ? "deposit" : "withdrawal";
    const d = new Date(accobj.transactionDates[i]);

    const date = `${d.getDate()}`.padStart(2, 0);
    const mon = `${d.getMonth() + 1}`.padStart(2, 0);
    const year = d.getFullYear();
    const datedisplay = `${date}/${mon}/${year}`;

    const html = `<div class="transaction_row">
    <div class="transaction_type transaction_type_${type}">${
      i + 1
    } : ${type}</div>
    <div class="transaction_date">${datedisplay}</div>
    <div class="transaction_value">Rs ${n.toFixed(2)}</div>
</div>`;
    transactionContainer.insertAdjacentHTML("afterbegin", html);
  });
};

//Function to create username
const username = function (accounts) {
  accounts.forEach(function (n) {
    n.username = n.owner
      .toLowerCase()
      .split(" ")
      .map(function (n) {
        return n[0];
      })
      .join("");
  });
};

username(accounts);

///Display balance
const PrintBalance = function (acc) {
  const result = acc.transaction.reduce(function (acc, n) {
    return (acc += n);
  }, 0);
  acc.balance = result;
  balanceElement.textContent = `Rs ${result.toFixed(2)}`;
};

//Calculate summary of deposit and Withdrawal

const printSummary = function (transaction) {
  //deposit
  const totalDeposit = transaction
    .filter(function (n) {
      return n > 0;
    })
    .reduce(function (acc, n) {
      return acc + n;
    }, 0);
  summaryIn.textContent = `Rs ${totalDeposit.toFixed(2)}`;
  //withdrawal
  const totalWithdrawn = transaction
    .filter(function (n) {
      return n < 0;
    })
    .reduce(function (acc, n) {
      return acc + n;
    }, 0);
  summaryOut.textContent = `Rs ${Math.abs(totalWithdrawn.toFixed(2))}`;
  //credit interest
  const CreditInterest =
    (transaction
      .filter(function (n) {
        return n > 0;
      })
      .reduce(function (acc, n) {
        return acc + n;
      }, 0) *
      1.2) /
    100;
  creditIn.textContent = CreditInterest.toFixed(2);
};
//Logout Timer function

const logoutTimerStart = function () {
  let time = 60; //seconds
  const tick = function () {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    logOut.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      container.style.opacity = 0;
      mssg.textContent = `Login to get started`;
    }

    time -= 1;
  };

  tick();

  const timer = setInterval(tick, 1000);
  return timer;
};
//Event handlers for login
let currentUser, timer;

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  currentUser = accounts.find(function (n) {
    return n.username === loginUser.value;
  });
  if (currentUser && currentUser.pin === Number(loginPin.value)) {
    mssg.textContent = `Welcome User ${currentUser.owner.split(" ")[0]}`;
    container.style.opacity = 1;
    //Current date
    const now = new Date();
    const date = `${now.getDate()}`.padStart(2, 0);
    const mon = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    balDate.textContent = `${date}/${mon}/${year}, ${hour}:${min}`;
    //clearing input fields
    loginPin.value = loginUser.value = "";
    if (timer) {
      clearInterval(timer);
    }
    timer = logoutTimerStart();
    PrintBalance(currentUser);
    printTransaction(currentUser);
    printSummary(currentUser.transaction);
  }
});

//Transfer section

transferBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(transferAmount.value);
  const receiver = transferTo.value;
  const receiverobj = accounts.find(function (n) {
    return n.username === receiver;
  });
  if (
    amount > 0 &&
    receiverobj &&
    currentUser.balance > amount &&
    receiverobj.username !== currentUser.username
  ) {
    currentUser.transaction.push(-amount);
    receiverobj.transaction.push(amount);
    currentUser.transactionDates.push(new Date().toISOString());
    receiverobj.transactionDates.push(new Date().toISOString());
    PrintBalance(currentUser);
    printTransaction(currentUser);
    printSummary(currentUser.transaction);
    //reset the timer
    clearInterval(timer);
    timer = logoutTimerStart();
  }
  transferTo.value = transferAmount.value = "";
});

//Closing Account

closeAccountBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentUser.pin === Number(closeAccountPin.value) &&
    currentUser.username === closeAccountInput.value
  ) {
    const index = accounts.findIndex(function (n) {
      return n.username === currentUser.username;
    });
    closeAccountPin.value = closeAccountInput.value = "";
    //deleting account
    accounts.splice(index, 1);
    //hiding UI
    container.style.opacity = 0;
    mssg.textContent = "Login to get started";
  }
});

//Request Loan
//condition -->should have atleast 1 deposit with 10% of loan amount requested

loanBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(loanInput.value);

  if (
    amount > 0 &&
    currentUser.transaction.some(function (n) {
      return n >= 0.1 * amount;
    })
  ) {
    setTimeout(() => {
      currentUser.transaction.push(amount);
      currentUser.transactionDates.push(new Date().toISOString());
      PrintBalance(currentUser);
      printTransaction(currentUser);
      printSummary(currentUser.transaction);
      clearInterval(timer);
      timer = logoutTimerStart();
    }, 3000);
  } else {
    alert("Entered Amount exceeds the limit");
  }
  loanInput.value = "";
});

//sorting
let sort = false;
sortBtn.addEventListener("click", function (e) {
  e.preventDefault();
  printTransaction(currentUser, !sort);
  sort = !sort;
});
