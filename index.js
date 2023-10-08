window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;
window.IDBTransaction =
  window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.msIDBTransaction;
window.IDBKeyRange =
  window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
  alert("your browser not support indexedDB");
} else {
  alert("your browser support indexedDB");
}

var db;
var request = window.indexedDB.open("DBNew", 1);

request.onerror = function (e) {
  alert(e);
};

request.onsuccess = function () {
  db = request.result;
};

request.onupgradeneeded = function (e) {
  db = e.target.result;
  var objectStore = db.createObjectStore("employee", { keyPath: "id" });
};

function Save() {
  var request = db
    .transaction(["employee"], "readwrite")
    .objectStore("employee")
    .add({
      id: document.getElementById("id").value,
      name: document.getElementById("name").value,
      age: document.getElementById("age").value,
      email: document.getElementById("email").value,
    });
  request.onerror = function (e) {
    alert(
      `unabled to add data ${
        document.getElementById("name").value
      } is already exist`
    );
  };

  request.onsuccess = function () {
    alert(`${document.getElementById("name").value} is successfully added`);
  };
}

function Read() {
  const tableBody = document.getElementById("tbody");
  tableBody.innerHTML = "";
  var request = db
    .transaction(["employee"])
    .objectStore("employee")
    .get(document.getElementById("id").value);
  request.onerror = function (e) {
    alert(e);
  };
  request.onsuccess = function () {
    if (request.result) {
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `<td>${request.result.id}</td><td>${request.result.name}</td><td>${request.result.age}</td><td>${request.result.email}</td><td><button class="btn btn-danger" onClick="delteUser(event)">Delete</button></td>`;
      tableBody.appendChild(tableRow);
    } else {
      alert(`${document.getElementById("id").value} not found`);
    }
  };
}

function ReadAll() {
  const tableBody = document.getElementById("tbody");
  tableBody.innerHTML = "";

  var request = db
    .transaction(["employee"])
    .objectStore("employee")
    .openCursor();
  request.onsuccess = function (e) {
    var cursor = e.target.result;
    if (cursor) {
      console.log(cursor.value);

      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `<td>${cursor.value.id}</td><td>${cursor.value.name}</td><td>${cursor.value.age}</td><td>${cursor.value.email}</td><td><button class="btn btn-danger" onClick="delteUser(event)">Delete</button></td>`;
      tableBody.appendChild(tableRow);

      cursor.continue();
    }
  };
}

function Edit() {
  var request = db
    .transaction(["employee"], "readwrite")
    .objectStore("employee")
    .put({
      id: document.getElementById("id").value,
      name: document.getElementById("name").value,
      age: document.getElementById("age").value,
      email: document.getElementById("email").value,
    });
  request.onerror = function (e) {
    alert(e);
  };

  request.onsuccess = function () {
    alert(`${document.getElementById("name").value} is successfully updated`);
  };
}

function delteUser(e) {
  const tableBody = document.getElementById("tbody");
  const targetRow = e.target.parentElement.parentElement;

  console.log(targetRow.firstChild.innerText);

  var request = db
    .transaction(["employee"], "readwrite")
    .objectStore("employee")
    .delete(targetRow.firstChild.innerText);

  request.onerror = function (e) {
    alert("employee Not Found");
  };
  request.onsuccess = function () {
    console.log(targetRow);
    tableBody.removeChild(targetRow);
  };
}
