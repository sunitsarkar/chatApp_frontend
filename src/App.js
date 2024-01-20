import './App.css';
import io from 'socket.io-client'
import {useState,useEffect} from 'react'

const socket=io.connect("http://localhost:8000");

function App() {

  const [message,setMessage]=useState('');
  const [received,setReceived]=useState('')

  const sendMessage=()=>{
    message?socket.emit('message',{
      message:message
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
      <input placeholder='type message' value={message}  style={{height:'30px',width:'250px'}} onChange={(e)=>{setMessage(e.target.value)}}/>
      <button style={{height:'30px',width:'150px'}} onClick={sendMessage}>send message</button>
      <h1>Messages</h1>
      {
        received?<li>{received}</li>:null
      }
    </div>
  );
}

export default App;
