
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
function sendData (){
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
        console.log(res);
    })
}