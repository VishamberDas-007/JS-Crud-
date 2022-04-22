// Globally declard constants, variables
const nameValue = document.getElementById("name");
const emailValue = document.getElementById("email");
const phoneValue = document.getElementById("phone");
const submitBtn = document.getElementById("btn");
const userTable = document.querySelector(".table");
const tbody = document.getElementById("tbody");
var searchBtn = document.getElementById("searchBtn");
let searchBox = document.getElementById("searchBox");
const phoneError = document.getElementById("phoneError");
const emailError = document.getElementById("emailError");
const nameError = document.getElementById("nameError");
let tr = tbody.rows;
var array = [];
let dropDownButton = document.getElementById("dropdownMenu");
let opt,
  updatedFlag = 0;
let removeBtn, editBtn;
var emailFlag = 0,
  editFlag = 0,
  phoneFlag = 0,
  emailPresentFlag = 0,
  phonePresentFlag = 0;
const validRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneno = /^\d{10}$/;
console.log(emailError);
let curRow,
  lastRow,
  bId = 0,
  idVal = 0,
  istrue = 0,
  user = {},
  selectedRow = null,
  userAll = [];

// Dragging feature extension
let draggingEle;
let draggingRowIndex;
let placeholder;
let list;
let isDraggingStarted = false;

// This addevent listener is called onclick of submit button
submitBtn.addEventListener("click", inputValue);

// This function is used for validation purpose
function validation() {
  emailFlag = 0;
  phoneFlag = 0;
  emailPresentFlag = 0;
  phonePresentFlag = 0;
  if (phoneValue.value === "") {
    phoneError.innerHTML = "Fill The Details";
  } else if (!phoneValue.value.match(phoneno)) {
    phoneError.innerHTML = "Fill Phone number Correctly";
  } else {
    phoneError.innerHTML = "";
    phoneFlag = 1;
  }

  if (emailValue.value === "") {
    emailError.innerHTML = "Fill The Details";
  } else if (!emailValue.value.toLowerCase().match(validRegex)) {
    emailError.innerHTML = "Fill Email Correctly";
  } else {
    emailError.innerHTML = "";
    emailFlag = 1;
  }

  if (nameValue.value === "") {
    nameError.innerHTML = "Fill The Details";
  } else {
    nameError.innerHTML = "";
  }
}

//This function runs when submit button is clicked
function inputValue() {
  if (editFlag == 1) {
    updateRow();
    console.log("UpdateRow Working");
  } else {
    console.log("Submit In progress" + editFlag);
    idVal = Math.round(new Date().getTime() / 1000);
    removeBtn = document.createElement(
      "button"
    ).innerHTML = `<button  id = ${idVal}  onclick='deleteRows(this)'>X</button>`;
    editBtn = document.createElement(
      "button"
    ).innerHTML = `<button id = ${idVal} onclick='editRow(this)'>Edit</button>`;

    validation();

    if (nameValue.value != "" && emailFlag == 1 && phoneFlag == 1) {
      window.localStorage.setItem("userAllArray", JSON.stringify(userAll));

      if (userAll != null) {
        userAll = JSON.parse(window.localStorage.getItem("userAllArray"));
        for (let i = 0; i < userAll.length; i++) {
          if (userAll[i].email === emailValue.value) {
            emailPresentFlag = 1;
            console.log(emailPresentFlag);
          }
          if (userAll[i].phone === phoneValue.value) {
            phonePresentFlag = 1;
            console.log(phonePresentFlag);
          }
        }
      }
      if (phonePresentFlag == 0 && emailPresentFlag == 0) {
        user = {
          id: idVal,
          name: nameValue.value,
          email: emailValue.value,
          phone: phoneValue.value,
          // rowDrag: true,
        };
        userAll.push(user);
        window.localStorage.setItem("userAllArray", JSON.stringify(userAll));
        let rowTable = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${removeBtn}</td>
            <td>${editBtn}</td>
            `;
        lastRow = tbody.insertRow();
        lastRow.innerHTML = rowTable;
        console.log(userAll);
        lastRow.className = "tr";
        lastRow.setAttribute("id", idVal);
        lastRow.setAttribute("draggable", "true");
        lastRow.setAttribute("ondragover", "dragover()");
        lastRow.setAttribute("ondragstart", "start()");

        console.log(lastRow);
        opt = document.createElement("option");
        opt.innerHTML = idVal;
        opt.setAttribute("value", idVal);
        console.log(opt.innerHTML);
        dropDownButton.options.add(opt);
        clearRow();
      } else {
        if (emailPresentFlag == 1) {
          emailError.innerHTML = "Email already present";
        }
        if (phonePresentFlag == 1) {
          phoneError.innerHTML = "Phone number already present";
        }
      }
      emailFlag = 0;
      phoneFlag = 0;
      emailPresentFlag = 0;
      phonePresentFlag = 0;
    }
  }

  console.log(tr.length);
}

// deleteRows function calleed on click of X(delete) button
function deleteRows(button) {
  let tableRow = button.parentNode.parentNode;
  userAll = JSON.parse(window.localStorage.getItem("userAllArray"));
  opt = document.getElementsByTagName("option");
  console.log(opt[0].value);
  tableRow.parentNode.removeChild(tableRow);
  console.log(tableRow.id);
  for (let i = 0; i < userAll.length; i++) {
    if (userAll[i].id == tableRow.id) {
      userAll.splice(i, 1);
      dropDownButton.options.remove(i + 1);
      printArray(userAll);
    }
  }
  window.localStorage.setItem("userAllArray", JSON.stringify(userAll));
  console.log(userAll);
}

//edit row function called on click of edit button
function editRow(button) {
  submitBtn.innerHTML = "Update";
  editFlag = 1;
  selectedRow = button.parentNode.parentNode;
  for (let i = 0; i < userAll.length; i++) {
    if (selectedRow.id == userAll[i].id) {
      nameValue.value = userAll[i].name;
      emailValue.value = userAll[i].email;
      phoneValue.value = userAll[i].phone;
      console.log(selectedRow.id);
    }
  }
  console.log(button + " EditRow");
  console.log(selectedRow);
  console.log("EditRow Working");
}

// updateBtn.addEventListener("click", updateRow);

function updateRow() {
  validation();
  userAll = JSON.parse(window.localStorage.getItem("userAllArray"));
  console.log("userAll" + userAll);
  if (nameValue.value != "" && emailFlag == 1 && phoneFlag == 1) {
    for (let i = 0; i < userAll.length; i++) {
      if (selectedRow.id == userAll[i].id) {
        continue;
      }
      if (userAll[i].email == emailValue.value) {
        emailPresentFlag = 1;
      }
      if (userAll[i].phone == phoneValue.value) {
        phonePresentFlag = 1;
      }
    }
    if (phonePresentFlag == 0 && emailPresentFlag == 0) {
      selectedRow.cells[0].innerHTML = selectedRow.id;
      selectedRow.cells[1].innerHTML = nameValue.value;
      selectedRow.cells[2].innerHTML = emailValue.value;
      selectedRow.cells[3].innerHTML = phoneValue.value;
      for (let i = 0; i < userAll.length; i++) {
        if (userAll[i].id == selectedRow.id) {
          userAll[i].name = nameValue.value;
          userAll[i].email = emailValue.value;
          userAll[i].phone = phoneValue.value;
        }
      }
      console.log(userAll);
      submitBtn.innerHTML = "Submit";
      editFlag = 0;
      clearRow();
    } else {
      if (emailPresentFlag == 1) {
        emailError.innerHTML = "Email already present";
      }
      if (phonePresentFlag == 1) {
        phoneError.innerHTML = "Phone number already present";
      }
    }
  }
  emailFlag = 0;
  phoneFlag = 0;
  emailPresentFlag = 0;
  phonePresentFlag = 0;
  window.localStorage.setItem("userAllArray", JSON.stringify(userAll));
}

// Function to clear row
function clearRow() {
  document.getElementById("form").reset();
}

// Searching the array elements

searchBox.addEventListener("input", function () {
  var searching = searchBox.value;
  userAll = JSON.parse(window.localStorage.getItem("userAllArray"));
  clearTable();
  if (searching == "") {
    // clearTable();
    addDataToTableFromArray();
  } else if (searching != "") {
    array = userAll.filter(function (item) {
      return (
        item.name.toUpperCase().match(searching.toUpperCase()) ||
        item.email.toUpperCase().match(searching.toUpperCase()) ||
        item.phone.match(searching)
      );
    });
    console.log(array);
    printArray(array);
  }
});

function printArray(array) {
  clearTable();
  removeBtn = document.createElement(
    "button"
  ).innerHTML = `<button  id = ${idVal}  onclick='deleteRows(this)'>X</button>`;
  editBtn = document.createElement(
    "button"
  ).innerHTML = `<button id = ${idVal} onclick='editRow(this)'>Edit</button>`;
  var rowTableToDisplaySearchedData;
  console.log("PrintArray working");
  window.localStorage.setItem("userAllArray", JSON.stringify(userAll));
  userAll = JSON.parse(window.localStorage.getItem("userAllArray"));
  if (array != null) {
    for (let i = 0; i < array.length; i++) {
      rowTableToDisplaySearchedData = `
      <td>${array[i].id}</td>
      <td>${array[i].name}</td>
      <td>${array[i].email}</td>
      <td>${array[i].phone}</td>
      <td>${removeBtn}</td>
      <td>${editBtn}</td>
      `;
      let lastRow2 = tbody.insertRow(-1);
      console.log(lastRow2);
      lastRow2.setAttribute("id", array[i].id);
      lastRow2.setAttribute("draggable", "true");
      lastRow2.setAttribute("ondragover", "dragover()");
      lastRow2.setAttribute("ondragstart", "start()");
      console.log(lastRow2.id);
      lastRow2.innerHTML = rowTableToDisplaySearchedData;
      // removeBtn.setAttribute();
    }
  }
}

function clearTable() {
  console.log("Clear table" + tr.length);
  for (let i = tr.length - 1; i >= 0; i--) {
    tr[i].remove();
    console.log(i);
  }
}

function addDataToTableFromArray() {
  // clearTable();
  userAll = JSON.parse(window.localStorage.getItem("userAllArray"));
  printArray(userAll);
}

//  Drop down add event listener

dropDownButton.addEventListener("change", selectOption);

function selectOption() {
  // alert(opt.value);
  clearTable();
  userAll = JSON.parse(window.localStorage.getItem("userAllArray"));
  var e = document.getElementById("dropdownMenu");
  var optionValue = e.options[e.selectedIndex].value;
  array = userAll.filter(function (item) {
    return optionValue == item.id;
  });
  printArray(array);
  if (optionValue == "select") {
    printArray(userAll);
  }
}

// draggable event

var row;

function start() {
  // row = e.parentNode;
  row = event.target;
  console.log("Working");
}

function dragover() {
  var e = event;
  let temp1 = 0,
    temp2 = 0;

  e.preventDefault();
  // console.log(e);
  userAll = JSON.parse(window.localStorage.getItem("userAllArray"));
  let children = Array.from(e.target.parentNode.parentNode.children);
  console.log("Current " + e.target.parentNode.id);

  if (children.indexOf(e.target.parentNode) > children.indexOf(row)) {
    e.target.parentNode.after(row);
    console.log("After " + e.target.parentNode.id);
  } else {
    e.target.parentNode.before(row);
    console.log("Before " + e.target.parentNode.id);
  }
  console.log(tr);
  for (let i = 0; i < userAll.length; i++) {
    if (tr[i].id == e.target.parentNode.id) {
      // curIndex = i + 1;
      temp1 = i;
      // temp1Flag = 1;
      console.log(temp1 + " " + temp2);
    }
    if (userAll[i].id == e.target.parentNode.id) {
      temp2 = i;
      // temp2Flag = 1;
    }
  }
  let temp = userAll[temp1];
  userAll[temp1] = userAll[temp2];
  userAll[temp2] = temp;
  console.log(userAll);
  window.localStorage.setItem("userAllArray", JSON.stringify(userAll));
}

document.body.onload = function () {
  // if (userAll.length > 0)
  // else {
  userAll = JSON.parse(window.localStorage.getItem("userAllArray"));
  if (userAll == null) {
    userAll = [];
    // window.localStorage.setItem("userAllArray", JSON.stringify(userAll));
  }
  printArray(userAll);
  // }
};
