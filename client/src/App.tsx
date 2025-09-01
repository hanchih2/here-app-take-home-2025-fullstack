import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
        <RouterProvider router={router}/>
      </header>
    </div>
  );
}

export default App;
