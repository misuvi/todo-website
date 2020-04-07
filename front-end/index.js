const myDiv = document.getElementById('main');
const button = document.getElementById('myButton');

const ipField = document.createElement('input');
ipField.setAttribute('type','text');
ipField.setAttribute('class','basicInput');
ipField.setAttribute('required','');
ipField.setAttribute('pattern','^(?!\s*$).+');

const newTask = document.getElementById('newTask');
newTask.focus();

let task=[];

async function get(){
    const response= await fetch('http://localhost:3000/todo');
    const todo= await response.json();
    task=todo.data;
    const {data,...resp} = todo;
    console.log(resp);
    display(task);
}

async function put(id){
    const upData={
        task:ipField.value
    }
    ipField.value=null;
    const response= await fetch(`http://localhost:3000/${id}`,{
        method:'put',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(upData)
    });
    const data= await response.json();
    console.log(data);
    get();
}

async function post(individualTask){
    const response= await fetch('http://localhost:3000/',{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(individualTask)
    });
    const data= await response.json();
    console.log(data);
    get();
}

async function del(id){
    const response= await fetch(`http://localhost:3000/${id}`,{
        method:'delete',
        headers:{'Content-Type':'application/json'},
    });
    const data= await response.json();
    console.log(data);
    get();
}

function doneFunction(){
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
    }
    else{
        newTask.reportValidity();
    }
    newTask.focus();
}

newTask.addEventListener('keydown',(event)=>{if(event.keyCode==13){event.preventDefault();addElement();}});
button.addEventListener('click',addElement);
get();
