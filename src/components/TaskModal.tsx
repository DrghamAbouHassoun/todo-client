import { FormEvent, useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import Modal from "react-modal";
import variables from "../constants/variables";

interface TaskModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const TaskModal = ({ isOpen, setIsOpen }: TaskModalProps) => {
  const [data, setData] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(`${variables.REACT_APP_API}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        completed: false,
      }),
    });
    if (!response.ok) {
      setError(response.statusText);
      setData({ title: "", description: "" });
      setLoading(false);
      return;
    }
    const body = await response.json();
    if (!body.success) {
      setError(body.message);
      setData({ title: "", description: "" });
      setLoading(false);
      return;
    }

  };

  return (
    <Modal
      isOpen={isOpen}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          width: "100%",
          maxWidth: "500px",
          margin: "0 auto",
          height: "300px",
          overflow: "hidden",
        },
      }}
    >
      <div className="text-gray-500">
        <button
          type="button"
          className="close text-2xl absolute top-5 right-5"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>
        <h1 className="text-xl font-bold">Add Task:</h1>
        {error? <p className="text-red-600 border border-red-600 p-2 w-full text-center">{error}</p> : null}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col my-3">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              className="p-1 text-md rounded border border-gray-200"
              value={data.title}
              onChange={(e) => setData({
                ...data,
                title: e.target.value
              })}
            />
          </div>
          <div className="flex flex-col my-3">
            <label>Description:</label>
            <textarea
              name="description"
              className="p-1 text-md rounded border border-gray-200"
              value={data.description}
              onChange={(e) => setData({
                ...data,
                description: e.target.value
              })}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-lg text-white rounded my-3 hover:bg-blue-400 transition-colors duration-500 shadow-sm"
          >
            {loading ? <LuLoader2 /> : "SUBMIT"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default TaskModal;
