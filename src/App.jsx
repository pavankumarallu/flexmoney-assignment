import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const server = import.meta.env.VITE_SERVER_URL

  const [schedule, setSchedule] = useState({})

  useEffect(() => {
    const schedule = async (email) => {

      const response = await fetch(`${server}/getScheduleData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
        })
      })
      const data = await response.json()
      setSchedule(data.schedule)
    }
    schedule(JSON.parse(localStorage.user).email)
  }, [])

  const handleMonthPayment = async () => {
    const response = await fetch(`${server}/payMonth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: schedule.email,
      })
    })
    const data = await response.json()
    setSchedule(data.schedule)
  }

  const handleBatchUpdate = async () => {
    const response = await fetch(`${server}/updateBatch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: schedule.email,
        batch: schedule.currentMonthBatch,
      })
    })
    const data = await response.json()
    setSchedule(data.schedule)
  }

  return (
    <div className="App">
      <p>
        Email: {schedule.email}
      </p>
      <p>
        Name: {schedule.name}
      </p>
      Payment Status: {schedule.payedCurrentMonth ? <p style={{ color: "green" }}>Payed Current Month</p> : <p style={{ color: "red" }}>Not Payed Current Month</p>}
      Schedule Time :
      {schedule.currentMonthBatch == 0 && <p>No Batch</p>}
      {schedule.currentMonthBatch == 1 && <p>6-7AM</p>}
      {schedule.currentMonthBatch == 2 && <p>7-8AM</p>}
      {schedule.currentMonthBatch == 3 && <p>8-9AM</p>}
      {schedule.currentMonthBatch == 4 && <p>5-6PM</p>}
      <button onClick={handleMonthPayment}>
        Pay This Month
      </button>

      <p>Time  - Number</p>
      <p>6-7AM - 1</p>
      <p>7-8AM - 2</p>
      <p>8-9AM - 3</p>
      <p>5-6PM - 4</p>

      <input type="number" onChange={(e) => {
        schedule.currentMonthBatch = e.target.value
      }} placeholder="Batch Number" />

      <button onClick={handleBatchUpdate}>
        Change Batch
      </button>

    </div>
  )
}

export default App
