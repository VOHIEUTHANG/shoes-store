const $tableID = $("#table");
const newTr = `
<tr>
<th class="text-center">ID</th>
<th class="text-center">Size</th>
<th class="text-center">Số lượng</th>
</tr>
</thead>
<tbody>
<tr>
<td class="pt-3-half"></td>
<td class="pt-3-half" contenteditable="true">35</td>
<td class="pt-3-half" contenteditable="true">10</td>
</tr>
  `;
$(".table-add").on("click", "i", () => {
  const clone = $tableID.find("tbody tr").last();
  if ($tableID.find("tbody tr ").length === 0) {
    $("tbody").append(newTr);
  }
  $tableID.find("table").append(newTr);
});
var modal = document.getElementById("myModal");
jQuery.fn.shift = [].shift;
function getProductItem() {
  const $rows = $tableID.find("tr");
  console.log($rows);
  const headers = [];
  const data = []; // Get the headers
  $rows.each(function() {
    const $td = $(this).find("td");
    const h = {
      id: $td.eq(0).text(),
      size: $td.eq(1).text(),
      inventory: $td.eq(2).text()
    };
    add(data, h);
  });
  return data;
}
function deleteDataModal() {
  modal.style.display = "none";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("date").value = "";
  document.getElementById("brand").value = "";
  document.getElementById("sex").value = "";
  document.getElementById("category").value = "";
  document.getElementById("description").value = "";
  document.getElementById("detail").value = "";
  document.getElementById("product_items").innerHTML = `
    <thead>
        <tr>
            <th class="text-center">ID</th>
            <th class="text-center">Size</th>
            <th class="text-center">Số lượng</th>
        </tr>
    </thead>`;
  document.getElementsByClassName("input-images-2")[0].innerHTML = "";
}
function createProduct() {
  const form = new FormData();
  let name = document.getElementById("name").value;
  let price = document.getElementById("price").value;
  let date = document.getElementById("date").value;
  let sex = document.getElementById("sex").value;
  let des = document.getElementById("description").value;
  let detail = document.getElementById("detail").value;
  let isSelling = document.getElementById("isSelling").value;
  let category = document.getElementById("category").value;
  let brand = document.getElementById("brand").value;
  form.append("name", name);
  form.append("price", price);
  form.append("date", date);
  form.append("sex", sex);
  form.append("des", des);
  form.append("detail", detail);
  form.append("isSelling", isSelling);
  form.append("category", category);
  form.append("brand", brand);
  form.append("items", JSON.stringify(getProductItem()));
  const fileUpload = document.getElementById("image-product").files;
  for (let i = 0; i < fileUpload.length; i++) {
    form.append("file", fileUpload[i]);
  }
  axios
    .request({
      method: "post",
      url: "/api/product/create",
      data: form,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });
}
window.onload = function() {
  // Get the button that opens the modal
  var btn = document.getElementById("btn-addProduct");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
    document.getElementById("btn-save").onclick = createProduct;
    document.getElementById("btn-save").innerText = "Lưu";
    $(".input-images-2").imageUploader({});
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    deleteDataModal();
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      deleteDataModal();
    }
  };
};

var id_product = 0;
function getOneProduct(id) {
  id_product = id;
  modal.style.display = "block";
  axios.get(`/api/product/get`, { params: { id: id } }).then(res => {
    document.getElementById("name").value = res.data.product.name;
    document.getElementById("price").value = res.data.product.price;
    let datestart = new Date(res.data.product.sellStartDate);
    document.getElementById("date").value = datestart.toLocaleDateString(
      "en-CA"
    );
    document.getElementById("brand").value = res.data.product.BRAND.ID;
    document.getElementById("sex").value = res.data.product.suitableFor;
    document.getElementById("description").value =
      res.data.product.descriptions;
    document.getElementById("detail").value = res.data.product.specifications;
    document.getElementById("btn-save").onclick = modifyProduct;
    document.getElementById("btn-save").innerText = "Lưu thay đổi";
    let product_item_table = document.getElementById("product_items");
    res.data.product_item.forEach(element => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${element.ID}</td>
            <td  contenteditable="true">${element.size}</td>
            <td  contenteditable="true">${element.inventory}</td>
            `;
      product_item_table.appendChild(tr);
    });
    let product_categories_selected = [];
    for (let element of res.data.product.product_categories)
        product_categories_selected.push(element.CATEGORY_ID);
    $("#category").val(product_categories_selected);
  });
  axios
    .get("/api/product_img/get", { params: { id: id } })
    .then(res => {
      $(".input-images-2").imageUploader({
        preloaded: res.data,
        imagesInputName: "photos",
        preloadedInputName: "old"
      });
    })
    .catch(err => {
      console.log(err);
    });
}
function modifyProduct() {
  const form = new FormData();
  let name = document.getElementById("name").value;
  let price = document.getElementById("price").value;
  let date = document.getElementById("date").value;
  let sex = document.getElementById("sex").value;
  let des = document.getElementById("description").value;
  let detail = document.getElementById("detail").value;
  let isSelling = document.getElementById("isSelling").value;
  let categoryTag = document.getElementById("category").options;
  let category =[]
  for (let option of categoryTag)
  {
    if(option.selected)
     category.push(option.value)
  }
  let brand = document.getElementById("brand").value;
  form.append("id", id_product);
  form.append("name", name);
  form.append("price", price);
  form.append("date", date);
  form.append("sex", sex);
  form.append("des", des);
  form.append("detail", detail);
  form.append("isSelling", isSelling);
  form.append("category", JSON.stringify(category));
  form.append("brand", brand);
  form.append("items", JSON.stringify(getProductItem()));
  const fileUpload = document.getElementById("image-product").files;
  for (let i = 0; i < fileUpload.length; i++) {
    form.append("file", fileUpload[i]);
  }
  axios
    .request({
      method: "post",
      url: "/api/product/update",
      data: form,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(res => {
      let data = res.data;
      showToast(createToast(data.title, data.message));
    })
    .catch(err => {
      console.log(err);
    });
}
function add(arr, object) {
  if (object.size == 0) return;
  for (element of arr) {
    if (object.size == element.size) {
      return;
    }
  }
  arr.push(object);
}
function deleteImage(btn) {
  let parent = btn.closest("div");
  let link = parent.querySelector("img").src;
  let position = link.indexOf("/assets");
  let url = link.slice(position);
  if (parent.getAttribute("data-preloaded") == "true") {
    axios
      .delete("/api/product_img/delete", {
        data: {
          url: url
        }
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
function createToast(title, body) {
  return `
   <div class="toast-header"> 
     <strong class="me-auto">${title}</strong>
     <small class="text-muted">2 seconds ago</small>
     <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
   </div>
   <div class="toast-body">
     ${body}
   </div>
 `;
}
function showToast(str) {
  let toast = document.createElement("div");
  toast.classList.add("toast");
  toast.classList.add("show");
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  toast.innerHTML = str;
  document.getElementById("showToast").appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
(function showPagination() {
  axios
    .get("/api/product/getNumPage")
    .then(res => {
      let num = res.data.num;
      let url = window.location.href;
      let positionPage = url.indexOf("page=");
      let currentPage;
      if (positionPage != -1)
        currentPage = parseInt(url.slice(positionPage + 5));
      else currentPage = 0;
      console.log(currentPage,num);
      let paginationTag = document.getElementById('pagination');
      if (num <= 5) {
            for (let i = 1; i <= num; i++) {
               $("#pagination").append(`<li class ="page-item ${i==currentPage ? 'active':''}"><a class="page-link" href="/admin/Manage/product?page=${i}">${i}</a></li>`);
            }
      }
      if(num > 5 )
      { 
         for (let i = currentPage-2; i <= currentPage+2 && i<= num; i++) {
            if(i>0)
            $("#pagination").append(`<li class ="page-item ${i==currentPage ? 'active':''}"><a class="page-link" href="/admin/Manage/product?page=${i}">${i}</a></li>`);
         }
      }
    })
    .catch(err => {});
})();
