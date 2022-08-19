const $tableID = $('#table');
const newTr = `
<tr>
<th class="text-center">Size</th>
<th class="text-center">Số lượng</th>

</tr>
</thead>
<tbody>
<tr>
<td class="pt-3-half" contenteditable="true">0</td>
<td class="pt-3-half" contenteditable="true">0</td>
</tr>
  `;
  $('.table-add').on('click', 'i', () => {
    const clone = $tableID.find('tbody tr').last();
    console.log(clone);
     if ($tableID.find('tbody tr ').length === 0) {
    $('tbody').append(newTr);
    }
    $tableID.find('table').append(newTr);
});
var modal = document.getElementById("myModal");
jQuery.fn.shift = [].shift;
function getProductItem(){
    const $rows = $tableID.find('tr');
    const headers = [];
    const data = []; // Get the headers
    $rows.each(function() {
        const $td = $(this).find('td');
        const h = {size:$td.eq(0).text(),inventory:$td.eq(1).text()}; 
        add(data,h);
    });
    return data;
}
function deleteDataModal(){
    modal.style.display = "none";
    document.getElementById('name').value='';
    document.getElementById('price').value= '';
    document.getElementById('date').value='';
    document.getElementById('brand').value= '';
    document.getElementById('sex').value= ''
    document.getElementById('category').value= '';
    document.getElementById('description').value= '';
    document.getElementById('detail').value='';
    document.getElementById('product_items').innerHTML=`
    <thead>
        <tr>
            <th class="text-center">Size</th>
            <th class="text-center">Số lượng</th>
        </tr>
    </thead>`;
    document.getElementsByClassName('input-images-2')[0].innerHTML='';
}
function createProduct (){
    const form = new FormData();
    let name= document.getElementById('name').value;
    let price= document.getElementById('price').value;
    let date = document.getElementById('date').value;
    let sex= document.getElementById('sex').value;
    let des= document.getElementById('description').value;
    let detail = document.getElementById('detail').value;
    let isSelling= document.getElementById ('isSelling').value;
    let category = document.getElementById('category').value;
    let brand = document.getElementById('brand').value;
    form.append('name',name);
    form.append('price',price);
    form.append('date',date);
    form.append('sex', sex);
    form.append('des', des);
    form.append('detail', detail);
    form.append('isSelling', isSelling);
    form.append('category',category);
    form.append('brand', brand);
    form.append('items',JSON.stringify(getProductItem()));
    const fileUpload = document.getElementById('fileImages').files;
    for(let i = 0; i< fileUpload.length;i++)
    {
        form.append('file',fileUpload[i])
    }  
    axios.request({
        method: 'post',
        url: '/api/product/create',
        data: form,
        headers: {
            "Content-Type": "multipart/form-data",
          }
    }).then((data)=>{
        console.log(data);
    }).catch((err)=>{
        console.log(err);
    })
}
window.onload = function(){ 
 
    // Get the button that opens the modal
    var btn = document.getElementById("btn-addProduct");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // When the user clicks on the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
        document.getElementById('btn-save').onclick= createProduct;
        document.getElementById('btn-save').innerText= 'Lưu';
    }
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {   
      deleteDataModal()
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        deleteDataModal()
    }  
}
};
var id_product=0;
function getOneProduct(id){
    id_product =id;
    modal.style.display= 'block';
    axios.get(`/api/product/get`,{params:{id:id}}).then((res)=>{
        document.getElementById('name').value= res.data.product.name;
        document.getElementById('price').value= res.data.product.price;
        let datestart= new Date(res.data.product.sellStartDate)
        document.getElementById('date').value= datestart.toLocaleDateString('en-CA');
        document.getElementById('brand').value= res.data.product.BRAND.ID;
        document.getElementById('sex').value= res.data.product.suitableFor;
        document.getElementById('category').value= res.data.product.product_categories[0].CATEGORY.ID;
        document.getElementById('description').value= res.data.product.descriptions;
        document.getElementById('detail').value= res.data.product.specifications;
        document.getElementById('btn-save').onclick= modifyProduct;
        document.getElementById('btn-save').innerText= 'Lưu thay đổi';
        let product_item_table = document.getElementById('product_items');
        res.data.product_item.forEach(element=>{
            const tr = document.createElement('tr');
            tr.innerHTML=`<td  contenteditable="true">${element.size}</td>
            <td  contenteditable="true">${element.inventory}</td>
            `;
            product_item_table.appendChild(tr);
        });   
    });
    axios.get('/api/product_img/get',{params:{id:id}}).then((res)=>{
        console.log(res.data)
        $('.input-images-2').imageUploader({
            preloaded: res.data,
            imagesInputName: 'photos',
            preloadedInputName: 'old'
        });
    }).catch((err)=>{
        console.log(err)
    })
}
function modifyProduct(){
    let name= document.getElementById('name').value;
    let price= document.getElementById('price').value;
    let date = document.getElementById('date').value;
    let sex= document.getElementById('sex').value;
    let des= document.getElementById('description').value;
    let detail = document.getElementById('detail').value;
    let isSelling= document.getElementById ('isSelling').value;
    let category = document.getElementById('category').value;
    let brand = document.getElementById('brand').value;
    axios.post('/api/product/update',{
        id:id_product,
        name,
        price,
        date,
        sex,
        des,
        detail,
        isSelling,
        brand,
        category,
        item:getProductItem(),
    }).then ((res)=>{
       alert(res.data);
    }).catch((err)=>{
       alert(err)
    })
}
function add(arr,object){
    if (object.size==0) return;
    for(element of arr){
      if(object.size==element.size){
        return 
      }
    }
     arr.push(object);
  }
  