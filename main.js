const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input");
const listElement = document.querySelector("#tasks");

window.addEventListener("load", () => {
  const getData = () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    savedTasks.forEach((task) => {
      const { editButton, inputElement, deleteButton, doneButton, item } =
        createItem(task);

      editButton.addEventListener("click", (e) => {
        editItem(e, inputElement);
      });

      doneButton.addEventListener("click", (e) => {
        toggleStrike(e, inputElement);
      });

      deleteButton.addEventListener("click", () => deleteItem(item));
    });
  };

  getData();
});

const isValidInput = (str) => {
  return !!str.trim();
};

const createItem = (savedItem) => {
  const task = savedItem?.task || input.value;

  if (!isValidInput(task)) {
    alert("please enter a valid task");
    return;
  }

  const item = document.createElement("div");
  item.classList.add("task");

  const task_content_el = document.createElement("div");
  task_content_el.classList.add("content");

  item.appendChild(task_content_el);

  const inputElement = document.createElement("input");
  inputElement.classList.add("text");
  inputElement.type = "text";
  inputElement.value = task;
  inputElement.setAttribute("readonly", "readonly");

  task_content_el.appendChild(inputElement);

  const task_actions_el = document.createElement("div");
  task_actions_el.classList.add("actions");

  const editButton = document.createElement("button");
  editButton.classList.add("edit");
  editButton.textContent = "Edit";

  const doneButton = document.createElement("button");
  doneButton.classList.add("done");
  if (savedItem) {
    doneButton.textContent = savedItem.status === "done" ? "undone" : "done";
    savedItem.status === "done" && inputElement.classList.toggle("strike");
  } else {
    doneButton.textContent = "done";
  }

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  deleteButton.textContent = "Delete";

  task_actions_el.appendChild(editButton);
  task_actions_el.appendChild(doneButton);
  task_actions_el.appendChild(deleteButton);

  item.appendChild(task_actions_el);

  listElement.appendChild(item);

  return {
    editButton,
    inputElement,
    deleteButton,
    doneButton,
    item,
  };
};

const deleteItem = (item) => {
  listElement.removeChild(item);
  saveData();
};

const toggleStrike = (e, inputElement) => {
  e.target.textContent =
    e.target.textContent.toLowerCase() === "done" ? "undone" : "Done";

  inputElement.classList.toggle("strike");
  saveData();
};

const editItem = (e, inputElement) => {
  if (e.target.textContent.toLowerCase() == "edit") {
    e.target.textContent = "Save";
    inputElement.removeAttribute("readonly");
    inputElement.focus();
  } else {
    if (!isValidInput(inputElement.value)) {
      alert("please enter a valid task");
      return;
    }
    e.target.textContent = "Edit";
    inputElement.setAttribute("readonly", "readonly");
  }

  saveData();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const { editButton, inputElement, deleteButton, doneButton, item } =
    createItem();

  saveData();

  input.value = "";

  editButton.addEventListener("click", (e) => {
    editItem(e, inputElement);
  });

  doneButton.addEventListener("click", (e) => {
    toggleStrike(e, inputElement);
  });

  deleteButton.addEventListener("click", () => {
    deleteItem(item);
  });
});

const saveData = () => {
  const tasks = listElement.querySelectorAll(".task");
  if (!tasks[0]) localStorage.removeItem("tasks");

  const tasksArr = [];
  tasks.forEach((task) => {
    const inputElement = task.querySelector("input");
    tasksArr.push({
      task: inputElement.value,
      status: inputElement.classList.contains("strike") ? "done" : "undone",
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
};
