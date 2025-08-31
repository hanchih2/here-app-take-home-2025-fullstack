import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { IAttendance } from './models/model';
import axios from 'axios';
import AttendanceView from './pages/AttendanceView';

type AttendanceResp = {
  message: string,
  data: Array<IAttendance>
}

function App() {
  const [attendance, setAttendance] = useState<IAttendance[]>([])
  useEffect( () => {
    const fetchAttendance =async () => {
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

  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "/attendance",
          element: <AttendanceView attendance={attendance}/>
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
