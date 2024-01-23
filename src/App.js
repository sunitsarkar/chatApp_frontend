import './App.css';
import io from 'socket.io-client'
import { useState, useEffect } from 'react'

// const socket = io.connect("http://localhost:8000");
const socket=io.connect("https://chatapp-backend-qmqc.onrender.com");


function App() {

  const [message, setMessage] = useState('');
  const [received, setReceived] = useState('');
  const [room, setRoom] = useState('');
  const [roomno, setRoomno] = useState(false);
  const [storedMessage, setStoredMessage] = useState([])
  console.log(storedMessage)

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      setRoomno(true)
    }
  }

  const sendMessage = () => {
    if (message) {
      if (sessionStorage.message) {
        sessionStorage.message = `${sessionStorage.message}$${JSON.stringify({
          author:"you",
          message: message,
          room: room
        })}`;
        setStoredMessage(sessionStorage.message.split('$').map((a) => {
          return JSON.parse(a)
        }))
        console.log(sessionStorage.message)
      } else {
        sessionStorage.message = JSON.stringify({
          author:"you",
          message: message,
          room: room
        });

      }
      socket.emit('message', {
        message: message,
        room: room
      })
    }
    else alert('cannot send empty message')
    setMessage('')
  }

  useEffect(() => {
    socket.on('received_message', (data) => {
      setReceived(data);
      if (sessionStorage.message) {
        sessionStorage.message = `${sessionStorage.message}$${JSON.stringify({...data,"author":"sender"})}`;
        setStoredMessage(sessionStorage.message.split('$').map((a) => {
          return JSON.parse(a)
        }))
        console.log(sessionStorage.message)
      } else {
        sessionStorage.message = JSON.stringify({...data,"author":"sender"});

      }
    })

  }, [socket])

  return (
    <div className="App">
      <h1>Private Chat App</h1>
      <br />
      <input placeholder='Enter room code to join'  value={room} style={{ height: '30px', width: '250px' }} onChange={(e) => { setRoom(e.target.value) }} />
      <button style={{ height: '30px', width: '150px' }} onClick={joinRoom}>Join Private room</button>
      {
        roomno ? <div>
          <h2>Room {room}</h2>
          <input placeholder='type message' value={message} style={{ height: '30px', width: '250px' }} onChange={(e) => { setMessage(e.target.value) }} />
          <button style={{ height: '30px', width: '150px' }} onClick={sendMessage}>send message</button>
          <h3>Messages</h3>
          
          {
            storedMessage.map((item, idx) => {
              return <li key={idx}><span>{item.author}</span>--{item.message}</li>
            })
          }
        </div> : null
      }
    </div>
  );
}

export default App;
