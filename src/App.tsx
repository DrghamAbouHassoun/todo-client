import { useEffect, useState } from 'react'
import './App.css'
import Task from './interfaces/task.interface';
import TaskModal from './components/TaskModal';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { LuLoader2 } from 'react-icons/lu';
import variables from './constants/variables';

function App() {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleDelete = async (id: string) => {
    const response = await fetch(`${variables.REACT_APP_API}/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      setError(response.statusText);
      setLoading(false);
      return;
    }
    const body = await response.json();
    if (!body) {
      setError(body.messages[0]);
      setLoading(false);
      return;
    }
    setError("");
    setLoading(false);
    setData(data.filter(task => task._id!== id));
    return;
  }
  
  useEffect(() => {
    console.log("API URL: ", variables.REACT_APP_API);
    const fetchData = async () => {
      const response = await fetch(`${variables.REACT_APP_API}/api/tasks`);
      if (!response.ok) {
        setError(response.statusText);
        setLoading(false);
        return;
      }
      const body = await response.json();
      console.log("Body: ", body)
      if (!body.success) {
        setError(body.messages[0]);
        setLoading(false);
        return;
      }
      setData(body.data);
      setError("");
      setLoading(false);
      return;
      
    }
    fetchData();
  }, []);

  return (
    <>
    <TaskModal 
      isOpen={isModalOpen} 
      setIsOpen={setIsModalOpen}
    />
    <div className="flex justify-center items-center">

      <div className="w-[100%] max-w-[500px] p-4 m-4 rounded border border-gray-200">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold text-gray-500">Todo List</h1>
          <button 
            type="button" 
            className="rounded bg-blue-500 text-white font-bold hover:bg-blue-300 transition-colors duration-500 p-2 shadow-md flex gap-2 items-center"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />ADD
          </button>
        </div>
        <ul className="my-2">
        {data && !error ? data.map((item) => (
          <li key={item._id} className="p-3 border-b border-b-gray-200 last-of-type:border-b-0 flex justify-between items-center">
            <p>{item.title}</p>
            <div>
              <button type="button" className="bg-red-500 text-white rounded p-[0.5rem]" onClick={() => handleDelete(item._id)}>
                {loading ? <LuLoader2 /> : <FaTrash />}
              </button>
            </div>
          </li>
        )) : null}
      </ul>
      </div>
      
    </div>
    </>
  )
}

export default App
