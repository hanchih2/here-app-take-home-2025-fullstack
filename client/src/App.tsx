import './App.css';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import AttendanceView from './pages/AttendanceView';
import LogView from './pages/LogView';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "/attendance",
          element: <AttendanceView/>
        },
        {
          path: "/logs",
          element: <LogView/>
        }
      ]
    }
  ])

  return (
    <div className="App">
      <header className="App-header">
        <span>
         <a href="/attendance">Attendance</a>
         <> | </>
         <a href="/logs">Logs</a>
        </span>
        <RouterProvider router={router}/>
      </header>
    </div>
  );
}

export default App;
