import React, { useEffect, useState } from 'react';
import "./ToDoProject.css";
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";
import noTask from "./No_Task.png"

const ToDoProject = () => {

    //Task Popup 
    const [taskPopup, setTaskPopup] = useState(false);

    function handleTaskPopup(){
        setTaskPopup(taskPopup ? false : true);
    }
    // Data Fetching
    const [tasks,setTasks] = useState([]);
    useEffect(() =>{
        axios.get("http://localhost:3000/tasks")
        .then((res)=>(setTasks(res.data)))
        .catch((err)=>(console.log("Something went wrong"+err)))
    },[])


    // Data Adding
    let id = tasks.length;
    const initialState = {id: "",title:"",content:""};
    const [newTask,setNewTask] = useState(initialState);

    // update stateVariables
    const [isupdate, setIsUpdate] = useState(false);
    const [updateId, setUpdateId] = useState(null);

    const addpost = ()=>{
        axios.post("http://localhost:3000/tasks",newTask)
        .then((res)=>(setTasks([...tasks, res.data])))
        .catch((err)=>(console.log("Something went wrong"+err)))
        setNewTask(initialState)
    }

    // update task
    const updateTask = () =>{
        axios.put(`http://localhost:3000/tasks/${updateId}`,newTask)
        .then((res)=>{
            setTasks(tasks.map((task) => (task.id === updateId ? res.data : task)))
        })
        .catch((err)=> console.log("Something went wrong"))
        setIsUpdate(false);
        setUpdateId(null);
    };

    function handelSubmit(){
        if(isupdate){
            updateTask();
        } else{
            addpost();
        }
    }

    const resetForm = () =>{
        setNewTask(initialState);
        setIsUpdate(false);
    };

    // Delete tasks

    const deleteTask = (id) =>{
        axios.delete(`http://localhost:3000/tasks/${id}`)
        .then((res)=> setTasks(tasks.filter((task) => task.id !== id)))
        .catch((err)=>(console.log("Something went wrong")))
    };

    // Update Task click
    const handleUpdate = (task) => {
        setTaskPopup(true);
        setIsUpdate(true);
        setNewTask({title: task.title, content: task.content})
        setUpdateId(task.id);
    }

  return (
    <div className='container'>
        <div className="header">
            <h1>TODO-Project</h1>
            <button className='addtask' onClick={() => handleTaskPopup()}>Add Task</button>
        </div>
        {taskPopup ? <div className="task">
            <MdOutlineCancel  className='cancel-icon' onClick={handleTaskPopup}/>
            <h2>Add New Task</h2>
            <input type="text" placeholder='Title' value={newTask.title} onChange={(e)=> setNewTask({...newTask, id: JSON.stringify(id+1),title:e.target.value})}/>
            <input type="text" placeholder='Content' value={newTask.content} onChange={(e)=> setNewTask({...newTask, content:e.target.value})} />
            <div className="form-button">
                <button className='add-btn' onClick={handelSubmit}>{isupdate ? "Update" : "Add"}</button>
                <button className='reset-btn' onClick={resetForm}>Reset</button>
            </div>
        </div> :" "}
        <div className="yourtasks">
            <h2>Your Tasks:</h2>
            {tasks.length === 0 ? 
            <div className='no_task'>
                <img src={noTask} alt="No_Tasks"/>
                <p>Chill! There is No Task for you right now.</p>
            </div> : 
            (tasks.map((task)=>(
                <div className="tasklist" key={task.id}>
                    <h4>Task Title: {task.title}</h4>
                    <p>Task Content: {task.content}</p>
                <div className="action-btn">
                    <button className='update-btn' onClick={()=> handleUpdate(task)}>Update</button>
                    <button className='delete-btn' onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
            </div>
            )))}
        </div>
    </div>
  )
}

export default ToDoProject