const lists = document.querySelector("#lecture-list ul");
const update = document.querySelector("#update");

function deleteMe(_id) {
  axios
    .delete(`https://infodev-server.herokuapp.com/api/todos/${_id}`)
    .then(function (response) {
      showlist();
    })
    .catch((err) => console.log(err));
}
function taskComplete(_id) {
  axios({
    method: "PUT",
    url: `https://infodev-server.herokuapp.com/api/todos/${_id}`,
    data: {
      completed: true,
    },
  })
    .then(function (response) {
      console.log("success");
      showlist();
    })
    .catch((err) => console.log(err));
}

function edit(_id, inputField, badge, textArea) {
  axios({
    method: "PUT",
    url: `https://infodev-server.herokuapp.com/api/todos/${_id}`,
    data: {
      name: inputField,
      priority: badge,
      description: textArea,
      completed: false,
    },
  })
    .then(function (response) {
      editButton.setAttribute("id", "hidden");
      showlist();
    })
    .catch((err) => console.log(err));
}
function showlist() {
  const lisArray = [];
  const URL = "https://infodev-server.herokuapp.com/api/todos";
  axios
    .get(URL)
    .then(function (response) {
      const task = response.data;
      task.forEach((element) => {
        const li = document.createElement("li");
        const div1 = document.createElement("div");
        const div2 = document.createElement("div");
        const h6 = document.createElement("h6");
        const span = document.createElement("span");
        const p = document.createElement("p");
        const button1 = document.createElement("button");
        const button2 = document.createElement("button");
        const button3 = document.createElement("button");

        li.setAttribute("id", `${element._id}`);
        if (element.completed === true) {
          h6.setAttribute("class", "title completed ");
          button2.setAttribute("id", "hidden");
          button3.setAttribute("id", "hidden");
        } else {
          h6.setAttribute("class", "title");
        }

        if (element.priority === 0) {
          span.innerText = "Low";
          span.setAttribute("class", "ml-2 badge badge-info");
        } else if (element.priority === 1) {
          span.innerText = "Medium";
          span.setAttribute("class", "ml-2 badge badge-warning");
        } else {
          span.setAttribute("class", "ml-2 badge badge-danger");
          span.innerText = "High";
        }
        p.classList.add("description");
        button1.setAttribute("class", "btn btn-danger");
        button1.innerHTML = '<i class="far fa-trash-alt">';

        button2.setAttribute("class", "btn btn-success");
        button2.innerHTML = '<i class="fas fa-check">';

        button3.setAttribute("class", "btn btn-warning");
        button3.innerHTML = '<i class="fas fa-pencil">';

        h6.innerText = element.name;
        p.innerHTML = element.description;
        h6.append(span);
        div1.append(h6, p);
        div2.append(button2, button3, button1);

        li.append(div1, div2);
        lisArray.push(li);
      });
      lists.replaceChildren(...lisArray);
    })

    .catch((error) => console.log(error));
}

document.addEventListener("DOMContentLoaded", function (event) {
  showlist();

  const forms = document.forms["lecture-add"];

  forms.addEventListener("submit", function (event) {
    event.preventDefault();

    const inputField = forms.querySelector("input[type='text']").value;
    const badge = forms.querySelector("select").value;
    const textArea = forms.querySelector("textarea").value;
    if (inputField && textArea) {
      const URL = "https://infodev-server.herokuapp.com/api/todos";
      axios({
        method: "POST",
        url: URL,
        data: {
          name: inputField,
          priority: badge,
          description: textArea,
          completed: false,
        },
      })
        .then(function (response) {
          inputField.value = "";
          textArea.value = "";
          lists.innerHTML = "";
          showlist();
        })
        .catch((error) => console.log(error));
    }
  });
  // document
  //   .querySelector(".btn btn-warning")
  //   .addEventListener("click", function () {
  //     console.log("hello");
  //   });

  //yo code le null return gareraxa,idk button nai read vaena so list bata call gareko

  //maele product_id li ma save gareko xu

  //button element vitra feri arko i element xa. so button ma click garda
  // delete hunxa tara tyo i ma click garda delete hudaina
  //due to diffferent parent element
  lists.addEventListener("click", function (event) {
    if (event.target.className === "btn btn-danger") {
      const div = event.target.parentElement;
      const li = div.parentElement.id;
      deleteMe(li);
    }
    if (event.target.className === "far fa-trash-alt") {
      const button = event.target.parentElement;
      const div = button.parentElement;
      const li = div.parentElement.id;
      deleteMe(li);
    }
    if (event.target.className === "btn btn-success") {
      const successDiv = event.target.parentElement;
      const successLi = successDiv.parentElement.id;
      taskComplete(successLi);
    }
    if (event.target.className === "fas fa-check") {
      const buttonDiv = event.target.parentElement;
      const successDiv = buttonDiv.parentElement;
      const successLi = successDiv.parentElement.id;
      taskComplete(successLi);
    }
    if (event.target.className === "btn btn-warning") {
      const successDiv = event.target.parentElement;
      const successLi = successDiv.parentElement.id;
      alert("enter the new details in the form!");
      editButton.setAttribute("id", "not-hidden");
      editButton.addEventListener("click", function (e) {
        console.log("edit button working");
        const inputField = forms.querySelector("input[type='text']").value;
        const badge = forms.querySelector("select").value;
        const textArea = forms.querySelector("textarea").value;
        if (inputField && textArea) {
          edit(successLi, inputField, badge, textArea);
        }
      });
    }
  });
});

const editButton = document.createElement("button");
editButton.setAttribute("class", "btn btn-warning style");
editButton.innerText = "Edit";
editButton.setAttribute("id", "hidden");
editButton.setAttribute("type", "submit");
update.append(editButton);
