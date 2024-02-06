import './home.css';
import io from 'socket.io-client'
import { useState, useEffect, useRef } from 'react'

// const socket = io.connect("http://localhost:8000");
const socket=io.connect("https://chatapp-backend-qmqc.onrender.com");


function Main() {

  const [message, setMessage] = useState('');
  const [received, setReceived] = useState('');
  const [room, setRoom] = useState('');
  const [roomno, setRoomno] = useState(false);
  const [storedMessages, setStoredMessage] = useState([]);
  const divRef = useRef(null);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      setRoomno(true)
    }
  }

  const sendMessage = async () => {
    if (message) {
      if (sessionStorage.message) {
        sessionStorage.message = `${sessionStorage.message}$${JSON.stringify({
          author: "you",
          message: message,
          room: room
        })}`;
        setStoredMessage(sessionStorage.message.split('$').map((a) => {
          return JSON.parse(a)
        }))
      } else {
        sessionStorage.message = JSON.stringify({
          author: "you",
          message: message,
          room: room
        });
        setStoredMessage([{
          author: "you",
          message: message,
          room: room
        }])

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
    // Scroll to the bottom of the div when new data is added
    divRef.current?.scrollIntoView()
  }, [storedMessages]);

  useEffect(() => {
    socket.on('received_message', (data) => {
      if (sessionStorage.message) {
        sessionStorage.message = `${sessionStorage.message}$${JSON.stringify({ ...data, "author": "sender" })}`;
        setStoredMessage(sessionStorage.message.split('$').map((a) => {
          return JSON.parse(a)
        }))
        console.log(sessionStorage.message)
      } else {
        sessionStorage.message = JSON.stringify({ ...data, "author": "sender" });
        setStoredMessage(sessionStorage.message.split('$').map((a) => {
          return JSON.parse(a)
        }))
      }
    })

  }, [socket])

  return (
    <div className="App">
      <h1>Private Chat App</h1>
      <br />
      <div>
      <input placeholder='Enter room code to join' value={room} style={{ height: '30px', width: '250px' }} onChange={(e) => { setRoom(e.target.value) }} />
      <button style={{ height: '30px', width: '150px' }} onClick={joinRoom}>Join Private room</button>
      </div>
      {
        roomno ? <div className='main'>
          <h3>Room {room} messages</h3>
          <div className='message-section' >
          {
            storedMessages.map((item, idx) => {
              return <p key={idx} className={item.author} >{item.message}</p>
            })
          }
          <div ref={divRef}/>
          </div>
          <div id='message-send' >
          <input placeholder='type message' value={message} style={{ height: '30px', width: '250px' }} onChange={(e) => { setMessage(e.target.value) }} />
          <button style={{ border:'none' }} onClick={sendMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
            </svg>
          </button>
          </div>
        </div> : null
      }
    </div>
  );
}

export default Main;
