let API = "http://localhost:8000/products";

let title = document.querySelector("#title");
let price = document.querySelector("#price");
let desc = document.querySelector("#desc");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");

let list = document.querySelector("#product-list");

// pagination
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let currentPage = 1;
let pageTotalCount = 1;

// search
let search = document.querySelector("#search");
let searchVal = "";

//  elements for edit
let edittitle = document.querySelector("#edit-title");
let editprice = document.querySelector("#edit-price");
let editdesc = document.querySelector("#edit-desc");
let editimage = document.querySelector("#edit-image");
let editSaveBtn = document.querySelector("#btn-save-edit");
let editModal = document.querySelector("#exampleModal");

btnAdd.addEventListener("click", async () => {
  let obj = {
    title: title.value,
    price: price.value,
    desc: desc.value,
    image: image.value,
  };
  if (
    !obj.title.trim() ||
    !obj.price.trim() ||
    !obj.desc.trim() ||
    !obj.image.trim()
  ) {
    alert("заполните все поля!");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  title.value = "";
  price.value = "";
  desc.value = "";
  image.value = "";
  render();
});
// function for read product-list
async function render() {
  // product-list from server
  let res = await fetch(`${API}?q=&_page=${currentPage}&_limit=3`);
  let products = await res.json();
  console.log(searchVal);
  // clear list
  list.innerHTML = "";

  // every product array
  products.forEach((elem) => {
    // create div
    let newElem = document.createElement("div");
    // give id for div
    newElem.id = elem.id;
    // created div enter code
    newElem.innerHTML = `
    <div class="card m-5" style="width: 18rem;">
  <img src="${elem.image}" class="card-img-top " alt="...">
  <div class="card-body">
    <h5 class="card-title">${elem.title}</h5>
    <p class="card-text">${elem.desc}</p>
    <p class="card-text">${elem.price}</p>
    
    <a href="#" id='${elem.id}' class="btn btn-danger btn-delete">Delete</a>
    <a href="#" id='${elem.id}' class="btn btn-warning btn-edit" 
     data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</a>
  </div>
</div>
    `;
    //add div with card inner to list
    list.append(newElem);
  });
  drowPaginationButtons();
}
render();

// delete product

// native for all document
document.addEventListener("click", (e) => {
  // checking, if elem have class btn-delete
  if (e.target.classList.contains("btn-delete")) {
    // get id
    let id = e.target.id;
    // make native for delete and coll render for show aktual data's
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() => render());
  }
});

// give native for edit
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
    // get id
    let id = e.target.id;
    // get datas edited product
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // entered inputs into Modal ,then get with server
        edittitle.value = data.title;
        editprice.value = data.price;
        editdesc.value = data.desc;
        editimage.value = data.image;
        // give id for save changes
        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

// function for send edited data's into server
editSaveBtn.addEventListener("click", function () {
  let id = this.id;
  // get datas from modal inputs
  let title = edittitle.value;
  let desc = editdesc.value;
  let price = editprice.value;
  let img = editimage.value;
  // check
  if (!title.trim() || !desc.trim() || !price.trim() || !img.trim()) {
    alert("Enter info-place!");
    return;
  }
  // create obj , is modal's inputs
  let editedProd = {
    price,
    desc,
    img,
    title,
  };
  // write function for save in server

  saveEdit(editedProd, id);
});

// function for save in server
function saveEdit(editedProduct, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedProduct),
  }).then(() => render());
  console.log(editedProduct);
  // close the modal window
  let modal = bootstrap.Modal.getInstance(editModal);
  modal.hide();
}

// ! pagination
// function for show  bottons pagination
function drowPaginationButtons() {
  // send sapros  for becam all products
  fetch(`${API}?p=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      // schitaem obshee kolichestwo stranix
      pageTotalCount = Math.ceil(data.length / 3);
      paginationList.innerHTML = ""; // clear list ,becouse be not duble
      for (let i = 1; i <= pageTotalCount; i++) {
        // create buttons with numbers for page give a class activ
        if (currentPage == i) {
          let page1 = document.createElement("li");
          page1.innerHTML = `
           <li class="page-item active"><a class="page-link  page_number" href="#">${i}</a></li> 
          `;
          paginationList.append(page1);
        } else {
          let page1 = document.createElement("li");
          page1.innerHTML = `
           <li class="page-item "><a class="page-link page_number" href="#">${i}</a></li> 
          `;
          paginationList.append(page1);
        }
      }
      // give color grey prev/next buttons
      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }
      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}

// native for the button prev
prev.addEventListener("click", () => {
  // check when we are into 1 page
  if (currentPage <= 1) {
    return;
  }
  // check when we are not  into 1 page ,currentPage minus 1 and take the render
  currentPage--;
  render();
});

next.addEventListener("click", () => {
  // check when we are into lets Page
  if (currentPage >= pageTotalCount) {
    return;
  }
  // check when we are not  into lets Page, currentpage plus 1 and take the render
  currentPage++;
  render();
});

search.addEventListener("input", () => {
  searchVal = search.value;
  render();
});

console.log("Hallo Welt");
