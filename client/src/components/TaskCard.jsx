const TaskCard = ({ task, priority }) => {
  const getBadgeClasses = (priority) => {
    if (priority === "HIGH") {
      return `bg-red-500 `;
    } else if (priority === "LOW") {
      return `text-green-800`;
    } else {
      return `text-yellow-500`;
    }
  };

  const dateCol = (task) => {
    if (new Date(task.dueDate) < new Date()) {
      return `text-red-500`;
    } else {
      return `text-black`;
    }
  };

  return (
    <div className="card" onClick={() => console.log("Click the task card")}>
      <div className="head">
        <h1>{task.title}</h1>
        <div className={getBadgeClasses(priority)}>{priority}</div>
      </div>

      {task.dueDate && (
        <div className={dateCol(task)}>
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
      {task.assignedTo && (
        <div className="assignee">{task.assignedTo.name}</div>
      )}
      <div className="counts">{task._count.comments}</div>
    </div>
  );
};

export default TaskCard;
