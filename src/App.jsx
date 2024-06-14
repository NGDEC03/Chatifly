import React, { useState } from 'react';
import Axios from 'axios'
import Image0 from './brightness.png';
import Image1 from './dark-mode.png';
import { useEffect } from 'react';
function App(props) {

  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const iconSrc = isDarkMode ? Image0 : Image1;
  const [time, setTime] = useState([])
  useEffect(() => {
    async function helper() {
      const response = await Axios.post("http://localhost:3000/fetchMessage", { userName: props.userName });
      console.log(response.data);
      const fetchedMessages = response.data.map(item => item.message);
      const fetchedTimes = response.data.map(item => item.sentAt)
      console.log(fetchedMessages); // Assuming response.data is an array of messages
      setChats([...fetchedMessages]);
      setTime([...fetchedTimes])
    }
    helper()
  }, [])

  function buildMessage(e) {
    setMessage(e.target.value);
  }

  async function showMessage(e) {
    // let time=`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`

    const resp = await Axios.post("http://localhost:3000/setMessage", { message, userName: props.userName })
    // console.log(props.userName);
    console.log(typeof time);
    setChats([...chats, message]);
    let date = new Date()
    setTime([...time, new Date().toLocaleTimeString()])
    setMessage('');
  }

  function SwitchMode() {
    setIsDarkMode(prevMode => !prevMode);
  }

  return (
    <>
      <div className={`h-screen w-screen ${isDarkMode ? 'bg-black' : 'bg-white'} flex relative`}>
        <img
          id="icon"
          className={`bottom-2 absolute top-4 left-2 h-10 w-10 cursor-pointer`}
          onClick={SwitchMode}
          src={iconSrc}
          alt="icon"
        />
        <div className={`flex flex-col justify-end flex-grow px-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          <div className='w-full flex justify-end mr-4 overflow-scroll'>
            <div>
              {chats.map((ele, index) => (
                <div key={index} className={`rounded-lg w-40 mt-2 p-2 font-extralight ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} relative`}>
                  <p className={`font-Poppins font-semibold relative  inline`}>{props.userName}:</p>
                  <p className={`break-words font-Poppins`}>{chats[chats.length - 1 - index]}</p>
                  <span className='text-xs  absolute right-1  bottom-1'>{time[time.length - 1 - index]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className='h-8'></div>
          <input
            onChange={buildMessage}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                showMessage()
                // setChats([...chats, message]);
                // setMessage('');
              }
            }}
            value={message}
            className={` font-Poppins mb-2 p-1 ${isDarkMode ? 'text-white bg-gray-700' : 'text-black bg-gray-300'} rounded placeholder:font-Poppins ${isDarkMode ? 'placeholder-white-800' : 'placeholder-black'}`}
            placeholder={`Type something...`}
          />
          <input
            onClick={showMessage}
            type='submit'
            className="p-1 text-white bg-blue-500 rounded cursor-pointer font-Poppins mb-2"
            value="Submit"
          />
        </div>
      </div>
    </>
  );
}

export default App;
