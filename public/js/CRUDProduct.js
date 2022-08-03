
const data = [];
function addItem(){
    const list = document.getElementById('size-list');
    const inputSize = document.getElementById('inputSize').value;
    const inputInventory= document.getElementById('inputInventory').value;
    const li = document.createElement('li');
    li.innerHTML = `Size: ${inputSize} Số lượng: ${inputInventory}`;
    data.push({inputSize,inputInventory});
    list.appendChild(li);
}
function sendData (){
    let name= document.getElementById('name').value;
    let price= document.getElementById('price').value;
    let date = document.getElementById('date').value;
    let sex= document.getElementById('sex').value;
    let des= document.getElementById('description').value;
    let detail = document.getElementById('detail').value;
    let isSelling= document.getElementById ('isSelling').value;
    axios.post('/api/product/create',{
        name,
        price,
        date,
        sex,
        des,
        detail,
        isSelling,
        data,
    }).then ((res)=>{
        console.log(res);
    })
}