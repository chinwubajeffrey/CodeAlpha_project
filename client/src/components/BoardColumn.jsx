import React, { useState } from "react";
import TaskCard from "./TaskCard.jsx";
import API from "../api/axios.js";
import { useAuthStore } from "../store/authStore.js";

const BoardColumn = ({ board }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const createTask = await API.post(`/boards/${board.id}/tasks`, {
        title: taskTitle,
        createdById: user.id,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="border p-3">
        {board.name} {board.tasks.length}
        {board.tasks.map((task) => (
          <TaskCard task={task} key={task.id} priority={task.priority} />
        ))}
        {showForm && (
          <div className="form">
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="Title"
                onChange={(e) => setTaskTitle(e.target.value)}
                value={taskTitle}
              />
              <button type="submit">Create Task</button>
              <button onClick={(e) => setShowForm(false)}>Cancel</button>
            </form>
          </div>
        )}
        <button onClick={() => setShowForm(true)}>Add Task</button>
      </div>
    </div>
  );
};

export default BoardColumn;
