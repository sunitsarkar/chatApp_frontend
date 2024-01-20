import './App.css';
import io from 'socket.io-client'
import {useState,useEffect} from 'react'

// const socket=io.connect("http://localhost:8000");
const socket=io.connect("https://chatapp-backend-qmqc.onrender.com");


function App() {

  const [message,setMessage]=useState('');
  const [received,setReceived]=useState('');
  const [room,setRoom]=useState('')

  const joinRoom=()=>{
    if(room !== ""){
      socket.emit("join_room", room)
    }
  }

  const sendMessage=()=>{
    message?socket.emit('message',{
      message:message,
      room:room
    }):alert('cannot send empty message')
    setMessage('')
  }

  useEffect(()=>{
    socket.on('received_message',(data)=>{
      setReceived(data.message)
    })
  },[socket])

  return (
    <div className="App">
      <input placeholder='type room no to join' value={room}  style={{height:'30px',width:'250px'}} onChange={(e)=>{setRoom(e.target.value)}}/>
      <button style={{height:'30px',width:'150px'}} onClick={joinRoom}>join private room</button>
      <input placeholder='type message' value={message}  style={{height:'30px',width:'250px'}} onChange={(e)=>{setMessage(e.target.value)}}/>
      <button style={{height:'30px',width:'150px'}} onClick={sendMessage}>send message</button>
      <h3>Messages of room {room}</h3>
      {
        received?<li>{received}</li>:null
      }
    </div>
  );
}

export default App;
