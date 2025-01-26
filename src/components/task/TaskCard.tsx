import React, { useState } from "react";
import "./TaskCard.css";
import Form from "../form/Form";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (updatedTask: Task) => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    assignedTo: task.assignedTo,
  });

  const fields = [
    { label: "Title", name: "title", type: "text" },
    { label: "Description", name: "description", type: "text" },
    { label: "Due Date", name: "dueDate", type: "date" },
    { label: "Assign To", name: "assignedTo", type: "text" },
  ];

  const handleEdit = (updatedData: Record<string, string>) => {
    onEdit({ ...task, ...updatedData });
  };

  return (
    <div className="task-card">
      <p className="task-title">{task.title}</p>
      <p className="task-description">{task.description}</p>
      <p className="task-due-date">Due: {task.dueDate}</p>
      <p className="task-assigned-to">Assigned to: {task.assignedTo}</p>
      <div className="task-actions">
        <Form
          btnTitle="Edit Task"
          fields={fields}
          onSuccess={handleEdit}
          formData={formData}
          setFormData={setFormData}
        />
        <button onClick={onDelete} className="delete-task-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
