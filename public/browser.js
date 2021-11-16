function itemTemplate({ _id, text }) {
  return `
	<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
		<span class="item-text">${text}</span>
		<div>
			<button data-id="${_id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
			<button data-id="${_id}" class="delete-me btn btn-danger btn-sm">Delete</button>
		</div>
	</li>
	`;
}

//Initial page load render
let todoList = items.map((item) => itemTemplate(item)).join("");
document.getElementById("item-list").insertAdjacentHTML("beforeend", todoList);

//Create Feature
let createField = document.getElementById("create-field");

document.getElementById("create-form").addEventListener("submit", function (e) {
  e.preventDefault();
  axios
    .post("/create-item", { text: createField.value })
    .then(function (response) {
      document
        .getElementById("item-list")
        .insertAdjacentHTML(
          "beforeend",
          itemTemplate({ _id: response.data, text: createField.value })
        );
      createField.value = "";
      createField.focus();
    })
    .catch(function () {
      console.log(id);
    });
});

document.addEventListener("click", function (e) {
  let id = e.target.getAttribute("data-id");

  //Delete Feature
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Do you really want to delete this item permanently?")) {
      axios
        .post("/delete-item", { id })
        .then(function () {
          e.target.parentElement.parentElement.remove();
        })
        .catch(function () {
          console.log(id);
        });
    }
  }

  //Update Feature
  if (e.target.classList.contains("edit-me")) {
    let currentText =
      e.target.parentElement.parentElement.querySelector(
        ".item-text"
      ).innerHTML;
    let text = prompt("Enter your desired new text", currentText);
    if (text) {
      axios
        .post("/update-item", { text, id })
        .then(function () {
          e.target.parentElement.parentElement.querySelector(
            ".item-text"
          ).innerHTML = text;
        })
        .catch(function () {
          console.log(text);
        });
    }
  }
});
