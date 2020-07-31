import fetch from 'isomorphic-fetch'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

type Props = {}

const App: NextPage<Props> = () => {

  const [socket, setSocket] = useState(null)
  const [text, setText] = useState("")
  const [messages, setMessages] = useState([])

  // add messages from server to the state
  const handleMessage = (message) => {
    setMessages(state => state.concat(message))
  }

  const handleChange = (event) => {
    setText(event.target.value)
  }

  // send messages to server and add them to the state
  const handleSubmit = (event) => {
    event.preventDefault()

    // create message object
    const message = {
      id: (new Date()).getTime(),
      value: text,
    }

    // send object to WS server
    socket.emit('message', message)

    // add it to state and clean current input value
    setText("")
    setMessages(state => state.concat(message))
  }



  useEffect(() => {

    const socket = io('https://turkey-time.vercel.app/')
    socket.on('message', handleMessage)

    setSocket(socket)

    // close socket connection
    return () => {
      socket.off('message', handleMessage)
      socket.close()
    }

  }, [])

  return (
    <main>
      <div>
        <h1>Turkey Test</h1>
        <ul>
          {messages.map(message =>
            <li key={message.id}>{message.value}</li>
          )}
        </ul>
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            type="text"
            placeholder="Hello world!"
            value={text}
          />
          <button>Send</button>
        </form>
      </div>
    </main>
  )

}

App.getInitialProps = async ({ }) => {
  const response = await fetch('https://turkey-time.vercel.app/messages')
  const messages = await response.json()
  return { messages }
}

export default App