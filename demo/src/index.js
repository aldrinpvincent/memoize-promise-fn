import "./styles.css";

import memoizePromiseFn from "memoize-promise-fn";

const productIdEl = document.getElementById("productId");
const dataEl = document.getElementById("data");

const incrementBtn = document.getElementById("increment");

const decrementBtn = document.getElementById("decrement");

function fetchTodo(id) {
  return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      return json;
    });
}

let cachedFetchTodos = memoizePromiseFn(fetchTodo);

let currentId = 1;

function getTodoById(id) {
  currentId = id;
  dataEl.innerText = "Loading...";
  productIdEl.innerText = id;
  cachedFetchTodos(id).
    then((response) => {
      dataEl.innerText = JSON.stringify(response, 2, null);
    })
    .catch((error) => {
      dataEl.innerText = "ERROR" + JSON.stringify(error);
    });
}

incrementBtn.addEventListener("click", () => {
  getTodoById(currentId + 1);
});

decrementBtn.addEventListener("click", () => {
  getTodoById(currentId - 1);
});


getTodoById(1);

// async function getTodos() {
//   let cachedFetchTodos = memoizePromiseFn(fetchTodo);

//   let response1 = await cachedFetchTodos(1); // Call to server with id 1
//   let response2 = await cachedFetchTodos(2); // Call to server with id 2
//   let response3 = await cachedFetchTodos(1); // Id is 1, will be served from cache
//   let response4 = await cachedFetchTodos(3); // Call to server with id 3
//   let response5 = await cachedFetchTodos(2); // Id is 2, will be served from cache}
// }
// getTodos();
