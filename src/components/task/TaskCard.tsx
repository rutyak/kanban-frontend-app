import React from "react";
import "./TaskCard.css";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    <div className="task-card">
      <p className="task-title">{task.title}</p>
      <p className="task-description">{task.description}</p>
      <p className="task-due-date">Due: {task.dueDate}</p>
      <p className="task-assigned-to">Assigned to: {task.assignedTo}</p>
      <div className="task-actions">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default TaskCard;
