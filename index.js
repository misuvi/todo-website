const myDiv = document.getElementById('main');

const button = document.getElementById('myButton');

const ipField = document.createElement('input')
ipField.setAttribute('type','text');
ipField.setAttribute('class','basicInput')
ipField.setAttribute('required','');
ipField.setAttribute('pattern','^(?!\s*$).+');

const newTask = document.getElementById('newTask');

newTask.focus();

let task=[];

async function get(){
    const Response= await fetch('http://localhost:3000/');
    // console.log(Response);
    const data= await Response.json();
    task=data;
    // console.log(data)
    display(task);
}

async function put(id){
    const upData={
        task:ipField.value
    }
    ipField.value=null;
    const Response= await fetch(`http://localhost:3000/${id}`,{
        method:'put',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(upData)
    });
    const data= await Response.json();
    // task=data;
    console.log(data);
    get();
    // display(task);
}

async function post(individualTask){
    const Response= await fetch('http://localhost:3000/',{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(individualTask)
    });
    const data= await Response.json();
    // task=data;
    console.log(data);
    get();
    // display(task);
}

async function del(id){
    const Response= await fetch(`http://localhost:3000/${id}`,{
        method:'delete',
        headers:{'Content-Type':'application/json'},
    });
    const data= await Response.json();
    // task=data;
    console.log(data);
    get();
    // display(task);
}

function doneFunction(){
    // console.log(this.id);
    // task.splice(this.id,1);
    // display(task);
    del(this.id);
    newTask.focus();
}

function editFunction(){
    display(task,this.id);
}

function saveFunction(){
    var isValid = ipField.checkValidity();
    console.log(isValid)
    if(isValid)
    {
        put(ipField.id);
        // task[this.id].task=ipField.value;
        // display(task);
        // newTask.focus();
    }
    else{
        ipField.reportValidity();
    }
}

function cancelFunction(){
    display(task);
    newTask.focus();
}

function display(task,eId=null){
    myDiv.innerHTML=null;
    newTask.value=null;
    task.forEach(element => {
        // console.log('ok');
        const ulTag=document.createElement('ul');
        const liTag=document.createElement('li');
        liTag.setAttribute('style','list-style-type:decimal');
        if(element.id!=eId)
        {
            liTag.innerText=element.task;
            (function () {
                const tDone = document.createElement('button')
                tDone.innerText='Done'
                tDone.setAttribute('class','tbutton')
                const tEdit = document.createElement('button')
                tEdit.innerText='Edit'
                tEdit.setAttribute('class','tbutton');
                tDone.setAttribute('id',`${element.id}`);
                tEdit.setAttribute('id',`${element.id}`);
                liTag.appendChild(tEdit)
                liTag.appendChild(tDone)
                myDiv.appendChild(liTag)
                myDiv.appendChild(ulTag)
                tDone.addEventListener('click',doneFunction);
                tEdit.addEventListener('click',editFunction);
            } ()) ;
        }
        else
        {
            (function () {
                console.log(element.task);
                ipField.value=element.task;
                ipField.setAttribute('id',`${element.id}`);
                const eSave = document.createElement('button');
                eSave.innerText='Save';
                eSave.setAttribute('class','tbutton')
                const eCancel = document.createElement('button');
                eCancel.innerText='Cancel';
                eCancel.setAttribute('class','tbutton');
                eSave.setAttribute('id',`${element.id}`);
                eCancel.setAttribute('id',`${element.id}`);
                liTag.appendChild(ipField);
                liTag.appendChild(eCancel);
                liTag.appendChild(eSave);
                myDiv.appendChild(liTag);
                myDiv.appendChild(ulTag);
                ipField.addEventListener('keydown',(event)=>{if(event.keyCode==13){event.preventDefault();saveFunction()}})
                eSave.addEventListener('click',saveFunction);
                eCancel.addEventListener('click',cancelFunction);
                ipField.focus();
                ipField.select();
                // id++;
            } ()) ;
        }
    });

}
function addElement(){
    var isValid = newTask.checkValidity();
    console.log(isValid)
    if(isValid)
    {
        let individualTask={
            task:document.getElementById('newTask').value
        };
        post(individualTask);
        // individualTask[individualTask.length]=document.getElementById('newTask').value;
        // individualTask.push(i);
        // console.log(individualTask);
        // console.log(JSON.stringify(individualTask))
        // task[task.length]=individualTask;
        // console.log(JSON.stringify(task));
        // console.log(task)
        // display(task);
    }
    else{
        newTask.reportValidity();
    }
    newTask.focus();
    // i++;
    // const m = document.createElement('ul');
    // const k = document.createElement('li')
    // k.setAttribute('style','list-style: none')
    // // k.style.color='blue';
    // k.innerText=document.getElementById('newTask').value
    // k.setAttribute('id',`${i}`) 
    


}

newTask.addEventListener('keydown',(event)=>{if(event.keyCode==13){event.preventDefault();addElement();}}) 
button.addEventListener('click',addElement);


// fetch('/To-do/data.json')
// .then(Response=>
//      Response.json().then(data=>
//         {
//             task=data.task;
//             display(task);
//         }))
// .catch(err=>console.log("Oops! Error occured"));


// (async function fetchData(){
//     const Response= await fetch('http://localhost:3000/');
//     console.log(Response);
//     const data= await Response.json();
//     task=data;
//     // console.log(data)
//     // display(task);
// }());
get()
// console.log(task);