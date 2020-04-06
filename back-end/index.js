let uuid=require('uuid');
let fs=require('fs');
const express=require('express');
const app=express();
const bp=require('body-parser');
const cors=require('cors');

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({extended:true}));

const config= {port:process.env.PORT?process.env.PORT:3000};


app.get('/', (req, res) => {
    console.log('get request was made for data');
    res.status(200).sendFile(__dirname+'/todo.json');
});

app.get('/:id', (req, res) => {
    console.log('get request was made for specific data:');
    console.log(req.params.id);
    const data = JSON.parse(fs.readFileSync('./todo.json','utf8')).find((d) => d.id == req.params.id);
    // const data = db.find((d) => d.id == req.params.id)
    if(data.length)
        res.status(200).json(data);
    else
        res.status(404).json({err:true, msg: 'There\'s no task with the entered id!'})
});

app.put('/:id',(req,res) =>{
    console.log('put request was made');
    console.log(req.body);
    console.log(req.params.id);
    const indexForUp = JSON.parse(fs.readFileSync('./todo.json','utf8')).findIndex((d) => d.id == req.params.id);
    const upDb = JSON.parse(fs.readFileSync('./todo.json','utf8')).filter((d) => d.id != req.params.id);
    if(indexForUp!==-1){
        const dataForUp = {
            task:req.body.task,
            id:req.params.id
        }
        upDb.splice(indexForUp,0,dataForUp);
        fs.writeFile('./todo.json',JSON.stringify(upDb,null,1),err=>{if(err){console.error(err)}});
        res.status(200).json({err: false, msg: 'Task Updated Successfully :)'});
    }
    else
        res.status(404).json({err: true, msg: 'There\'s no task with the entered id!'});
})

app.post('/',(req,res) =>{
    console.log('post request was made');
    console.log(req.body);
    if(req.body.task.length){
        const newTask={
            task:req.body.task,
            id:uuid.v1()
        }
        const upDb= JSON.parse(fs.readFileSync('./todo.json','utf8'));
        upDb.push(newTask);
        fs.writeFile('./todo.json',JSON.stringify(upDb,null,1),err=>{if(err){console.error(err)}});
        res.status(200).json({err: false, msg: 'Task added successfullly :)'});
    }
    else
        res.status(305).json({err: true, msg: 'Please enter a valid input!'})
})

app.delete('/:id',(req,res) => {
    console.log('delete request was made');
    console.log(req.params.id);
    let upDb=JSON.parse(fs.readFileSync('./todo.json','utf8'));
    if(upDb.findIndex(d=>d.id===req.params.id)!==-1){
        upDb=upDb.filter(d=>d.id!==req.params.id);
        fs.writeFile('./todo.json',JSON.stringify(upDb,null,1),err=> {if(err){console.error(err)}});
        res.status(200).json({err: false, msg: 'Task deleted successfullly :)'});
    }
    else
        res.status(404).json({err: true, msg: 'There\'s no task with the entered id!'});
})

app.listen(config.port,(err)=>{
    if(err){
        console.error(err)
    }
    console.log(`App running at port ${config.port}`);
});


let argv = process.argv.slice(2);
let tasks = [];

function display(data)
{
    data.forEach((element,index) => {
        console.log(`${index+1}. ${element.task}`)
    });
}

const operation=argv[0].toLowerCase();
// console.log(uuid);
// console.log('------------------------------------');
// console.log(argv);
// console.log('------------------------------------');
// console.log(argv[1])
switch(operation){
    case 'insert':case 'add'
            :   if(argv[1]){
                    let currentData= fs.readFileSync('todo.json','utf8')
                    // console.log(currentData.length);
                    if(currentData.length || currentData==='[]'){
                        tasks=JSON.parse(currentData);
                        // console.log(tasks);
                    }
                    // console.log(tasks);
                    let individualTaskObj={
                        task:argv.slice(1).join(' '),
                        id:uuid.v1()
                    }
                    tasks.push(individualTaskObj);
                    fs.writeFile('todo.json',JSON.stringify(tasks,null,1),err=>{if(err){console.log(err);}});
                    console.log('Task Added Successfully :)');
                }
                else
                    console.log('Please enter a valid input!');  
                
                break;
    case 'update':case 'change':case 'edit' 
            :   if(!argv[1]||!argv[2])
                {
                    console.log('Please Enter valid details to update!');
                }
                else{
                    let jsonData=fs.readFileSync('todo.json','utf8')
                    if(!jsonData.length || jsonData==='[]')
                        console.log('Sorry, There are no tasks at present.')
                    else{
                        // let flag=0;
                        let upid=argv[1]
                        let updata=argv.slice(2).join(' ');;
                        tasks=JSON.parse(jsonData);
                        let index=tasks.findIndex(itask=>itask.id===upid)
                        if(index===-1){
                            console.log('There\'s no task with the entered id!');
                        }
                        else{
                            console.log(`Task with id:${upid} (previous value "${tasks[index].task}") successfully updated to \"${updata}\" :)`)
                            tasks[index].task=updata;
                            fs.writeFile('todo.json',JSON.stringify(tasks,null,1),err=>{if(err){console.log(err)}})
                        }
                        // tasks.forEach(itask => {
                        //     if(itask.id==upid)
                        //     {
                        //         itask.task=updata;
                        //         fs.writeFile('todo.json',JSON.stringify(tasks,null,1),err=>{if(err){console.log(err)}})
                        //         flag++;
                        //         console.log(`Task with id:${upid} successfully updated to \"${updata}\" :)`)
                        //     }
                        // });
                        // if(!flag)
                            // console.log('There\'s no task with the entered id!');
                    }
                }
                break;
    case 'show':case 'display':case 'list'
            :   let fileData=fs.readFileSync('todo.json','utf8');
                if(!fileData.length || fileData==='[]')
                    console.log('Oops! There\'re no tasks!')
                else{
                    tasks=JSON.parse(fileData);
                    if(argv[1]=='id')
                    {
                        tasks.forEach((element,index)=> {
                            console.log(`${index+1}. ${element.id}`)
                        });
                    }
                    else{
                        display(tasks);
                    }
                }
                break;
    case 'delete':case 'remove':case 'completed'
            :   if(!argv[1])
                    console.log('Please Enter a task id to remove -_-')
                else{
                    fs.appendFileSync('todo.json','');
                    let fileData=fs.readFileSync('todo.json','utf8');
                    // console.log(fileData);
                    if(!fileData.length || fileData==='[]')
                        console.log('Sorry, There are no tasks at present.');
                    else{
                        // console.log(fileData);
                        let delid=argv[1];
                        let i=0;
                        tasks=JSON.parse(fileData);
                        let oldLength=tasks.length;
                        tasks=tasks.filter(itask=>itask.id!==delid);
                        if(tasks.length!==oldLength){
                            fs.writeFile('todo.json',JSON.stringify(tasks,null,1),err=>{if(err){console.log(err)}});
                            console.log(`Task with id : ${delid} deleted successfully :)`);
                        }
                        else
                            console.log('There\'s no task with the entered id!');
                        // for(;i<tasks.length;i++)
                        // {
                        //     if(tasks[i].id===delid)
                        //         break;
                        // }
                        // if(i>=tasks.length)
                        //     console.log('There\'s no task with the entered id!');
                        // else{
                        //     tasks.splice(i,1);
                        //     fs.writeFile('todo.json',JSON.stringify(tasks,null,1),err=>{if(err){console.log(err)}});
                        //     console.log(`Task with id:${delid} deleted successfully :)`);
                        // }
                    }
                }
                break;
    default 
            :   console.log('Please Specify an operation as command line argument! You can Insert, Delete, Update and Display tasks.');
}

