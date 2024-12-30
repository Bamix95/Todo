let todo_input = document.querySelector(".todo_input");
let radio = document.querySelector("#radio");
let todo_list_wrapper = document.querySelector(".todo_list_wrapper");
let todo_array = [];
const body = document.body;
let mode_btn = document.querySelector(".mode_btn");
let light_icon = document.querySelector(".icon_light");
const header = document.querySelector(".header");

//Handle Theme
const handleTheme = () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    light_icon.src = "/images/icon-sun.svg";
    header.style.backgroundImage = 'url("/images/bg-desktop-dark.jpg")';
  } else {
    light_icon.src = "/images/icon-moon.svg";
    header.style.backgroundImage = 'url("/images/bg-desktop-light.jpg")';
  }
  localStorage.setItem(
    "theme",
    body.classList.contains("dark-mode") ? "dark" : "light"
  );
};
mode_btn.addEventListener("click", handleTheme);

//Initailize Theme on Document load
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    light_icon.src = "/images/icon-sun.svg";
    header.style.backgroundImage = 'url("/images/bg-desktop-dark.jpg")';
  } else {
    body.classList.remove("dark-mode");
    light_icon.src = "/images/icon-moon.svg";
    header.style.backgroundImage = 'url("/images/bg-desktop-light.jpg")';
  }
};

document.addEventListener("DOMContentLoaded", initializeTheme);

const submitTodo = () => {
  if (!todo_input.value) return;
  let todo_obj = {
    todo: todo_input.value,
    id: crypto.randomUUID(),
    status: "pending",
  };
  todo_array.push(todo_obj);
  todo_input.value = "";
  console.log(todo_obj);
  handleUI();
};

//Create Todo List UI

const handleUI = (todos = todo_array) => {
  todo_list_wrapper.innerHTML = "";

  let todosHTML = todos
    .map(
      (todo) => `
      <div class="todo_container">
        <div class="todo_content">
          <div class="comp_radio_container">
            <input
              type="checkbox"
              class="todo_radio"
              data-id="${todo.id}"
              id="todo_radio_${todo.id}"  
            />
            <label for="todo_radio_${todo.id}" class="label"></label> 
          </div>
          <p class="todo_text ${
            todo.status === "completed" ? "completed" : ""
          }">${todo.todo}</p>
        </div>
        <button data-id="${
          todo.id
        }" class="del_btn"><img src="../images/icon-cross.svg" alt="Delete" class="todo_delete-icon" /></button>
      </div>
    `
    )
    .join("");

  todo_list_wrapper.innerHTML = todosHTML;

  // Handle Todo Delete
  let delete_btn = document.querySelectorAll(".del_btn");

  delete_btn.forEach((del_btn) => {
    del_btn.addEventListener("click", () => {
      let id_to_delete = del_btn.getAttribute("data-id");

      let updated_array = todo_array.filter(
        (filtered_array) => filtered_array.id !== id_to_delete
      );
      todo_array = updated_array;

      handleUI();
    });
  });

  // Handle Completed
  let radio_btns = Array.from(document.querySelectorAll(".todo_radio"));

  radio_btns.forEach((rad_btn) => {
    rad_btn.addEventListener("change", () => {
      let id_to_update = rad_btn.getAttribute("data-id");

      let todo_to_update = todo_array.find((todo) => todo.id === id_to_update);

      todo_to_update.status =
        todo_to_update.status === "pending" ? "completed" : "pending";

      handleUI();
    });
  });

  handleTodosLeft();
};

radio.addEventListener("click", submitTodo);

//Handle Display Active Todos
let active_btn = document.querySelector(".active_btn");

active_btn.addEventListener("click", () => {
  let active_arrays = todo_array.filter(
    (active) => active.status === "pending"
  );
  handleUI(active_arrays);
});

//Handle Completed Todos
let completed_btn = document.querySelector(".completed_btn");

completed_btn.addEventListener("click", () => {
  let completed_array = todo_array.filter(
    (completed) => completed.status === "completed"
  );
  handleUI(completed_array);
});

//Handle All Todos
let all_btn = document.querySelector("#all_btn");

all_btn.addEventListener("click", () => {
  handleUI(todo_array);
});

//Clear Completed Array
let clear_comp_btn = document.querySelector(".clear_comp_btn");

clear_comp_btn.addEventListener("click", () => {
  let uncleared_todo = todo_array.filter(
    (uncleared) => uncleared.status !== "completed"
  );
  handleUI(uncleared_todo);
});

//Handle Todos Remaining

const handleTodosLeft = () => {
  let todo_left = todo_array.filter((todo) => todo.status === "pending");
  document.querySelector(".left").innerHTML = todo_left.length;
};
