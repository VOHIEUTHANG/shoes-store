
var modal = document.getElementById("myModal");
const data = [];
function addItem(){
    const list = document.getElementById('size-list');
    const inputSize = document.getElementById('inputSize').value;
    const inputInventory= document.getElementById('inputInventory').value;
    const li = document.createElement('li');
    let flag =true;
    if(data.length==0){
        data.push({inputSize,inputInventory});
        li.innerHTML = `Size: ${inputSize} Số lượng: ${inputInventory}`;
        li.id= `${inputSize}`;
        list.appendChild(li);
    }
    else{
        for( item of data )
        if(String(item.inputSize) == String(inputSize))
        {   flag=false;
            item.inputInventory = inputInventory;
            document.getElementById(`${inputSize}`).innerHTML = `Size: ${inputSize} Số lượng: ${inputInventory}`;
        }
        if(flag){
            data.push({inputSize,inputInventory});
            li.innerHTML = `Size: ${inputSize} Số lượng: ${inputInventory}`;
            li.id= `${inputSize}`;
            list.appendChild(li);
        }
     
    } 
}
function createProduct (){
    let name= document.getElementById('name').value;
    let price= document.getElementById('price').value;
    let date = document.getElementById('date').value;
    let sex= document.getElementById('sex').value;
    let des= document.getElementById('description').value;
    let detail = document.getElementById('detail').value;
    let isSelling= document.getElementById ('isSelling').value;
    let category = document.getElementById('category').value;
    let brand = document.getElementById('brand').value;
    axios.post('/api/product/create',{
        name,
        price,
        date,
        sex,
        des,
        detail,
        isSelling,
        brand,
        category,
        data,
    }).then ((res)=>{
        alert(res.data);
        data =[];
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
    }
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {   
      modal.style.display = "none";
      document.getElementById('name').value='';
      document.getElementById('price').value= '';
      document.getElementById('date').value='';
      document.getElementById('brand').value= '';
      document.getElementById('sex').value= ''
      document.getElementById('category').value= '';
      document.getElementById('description').value= '';
      document.getElementById('detail').value='';
      document.getElementById('btn-save').onclick= createProduct;
      document.getElementById('btn-save').innerText= 'Lưu';
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }  
};
var id_product=0;
function getOneProduct(id){
    id_product =id;
    modal.style.display= 'block';
    axios.get(`/api/product/get`,{params:{id:id}}).then((res)=>{
        document.getElementById('name').value= res.data.name;
        document.getElementById('price').value= res.data.price;
        let datestart= new Date(res.data.sellStartDate)
        document.getElementById('date').value= datestart.toLocaleDateString('en-CA');
        document.getElementById('brand').value= res.data.BRAND.ID;
        document.getElementById('sex').value= res.data.suitableFor;
        document.getElementById('category').value= res.data.product_categories[0].CATEGORY.ID;
        document.getElementById('description').value= res.data.descriptions;
        document.getElementById('detail').value= res.data.specifications;
        document.getElementById('btn-save').onclick= modifyProduct;
        document.getElementById('btn-save').innerText= 'Lưu thay đổi';
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
    }).then ((res)=>{
       alert(res.data);
    }).catch((err)=>{
       alert(err)
    })
}