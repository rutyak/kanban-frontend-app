import React, { useState } from "react";
import Task from "../task/TaskCard";
import "./Column.css"; // Import the CSS file

interface TaskType {
  id: number;
  title: string;
}

interface ColumnProps {
  column: { id: number; name: string; tasks: TaskType[] };
  onRemove: () => void;
}

const Column: React.FC<ColumnProps> = ({ column, onRemove }) => {
  const [tasks, setTasks] = useState<TaskType[]>(column.tasks);

  const handleAddTask = () => {
    const taskTitle = prompt("Enter task title:");
    if (taskTitle) {
      const newTask: TaskType = { id: Date.now(), title: taskTitle }; // Generate unique ID
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
  };

  return (
    <div className="column">
      <h3>{column.name}</h3>
      <button onClick={handleAddTask}>Add Task</button>
      <button onClick={onRemove}>Remove Column</button>
      {/* <div className="task-list">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div> */}
    </div>
  );
};

export default Column;
