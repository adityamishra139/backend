
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'


function App() {
  const [jokes, setJokes] = useState([])

  useEffect(() => {
    axios
      .get('/api/jokes')
      .then((res) => {
        setJokes(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  },)

  return (
    <>
      <h1>Chai and Full Stack</h1>

      <p>JOKES: {jokes.length}</p>

      {jokes.map((joke) => (
        <div key={joke.id}>
          <h2>{joke.title}</h2>
          <p>{joke.punchline}</p>
        </div>
      ))}
    </>
  )
}

export default App
