import { useEffect, useState } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { IAttendance, ILog } from './models/model';
import axios from 'axios';
import AttendanceView from './pages/AttendanceView';
import LogView from './pages/LogView';

type AttendanceResp = {
  message: string,
  data: Array<IAttendance>
}

type LogResp = {
  message: string,
  data: Array<ILog>
}

function App() {
  const [attendance, setAttendance] = useState<IAttendance[]>([])
  const [logs, setLogs] = useState<ILog[]>([])
  useEffect( () => {
    const fetchAttendance = async () => {
      console.log("fetch attendance")
      try {
        const resp = await axios.create({baseURL: 'http://127.0.0.1:4000'}).get<AttendanceResp>('attendance')
        console.log(resp.data.data[0].date)
        setAttendance(resp.data.data)
      } catch(e) {
        if (e instanceof Error) {
          console.log("Error: " + e.message)
        }
      }
    }
    fetchAttendance()   
  }, [])

  useEffect( () => {
    const fetchLogs = async () => {
      console.log("fetch logs")
      try {
        const resp = await axios.create({baseURL: 'http://127.0.0.1:4000'}).get<LogResp>('logs')
        // console.log(resp.data.data[0].date)
        setLogs(resp.data.data)
      } catch(e) {
        if (e instanceof Error) {
          console.log("Error: " + e.message)
        }
      }
    }
    fetchLogs()   
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "/attendance",
          element: <AttendanceView attendance={attendance}/>
        },
        {
          path: "/logs",
          element: <LogView logs={logs}/>
        }
      ]
    }
  ])

  return (
    <div className="App">
      <header className="App-header">
        <RouterProvider router={router}/>
      </header>
    </div>
  );
}

export default App;
