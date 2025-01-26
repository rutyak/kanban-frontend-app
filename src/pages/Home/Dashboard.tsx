import React, { useState, useEffect } from "react";
import TaskCard from "../../components/task/TaskCard";
import "./Dashboard.css";
import Form from "../../components/form/Form";
import { toast } from "react-toastify";
import { useTasks } from "../../context/TaskContext";

interface Column {
  _id: string;
  columnName: string;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
}

const Dashboard: React.FC = () => {
  const {
    getTasks,
    addColumn,
    addTask,
    updateTask,
    updateColumn,
    deleteTask,
    deleteColumn,
    getColumns,
  } = useTasks();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const res = await getColumns();
        console.log("Fetched columns: ", res);
        if (Array.isArray(res?.data)) {
          setColumns(res.data);
        } else {
          console.error("Unexpected response format: ", res?.data);
          setColumns([]);
        }
      } catch (error) {
        console.error("Error fetching columns: ", error);
        toast.error("Failed to load columns");
        setColumns([]);
      }
    };

    fetchColumns();
  }, [getTasks]);

  const fields = [
    { label: "Title", name: "title", type: "text" },
    { label: "Description", name: "description", type: "text" },
    { label: "Due Date", name: "dueDate", type: "date" },
    { label: "Assign To", name: "assignedTo", type: "text" },
  ];

  const columnField = [
    { label: "Column Name", name: "columnName", type: "text" },
  ];

  const handleAddColumn = async () => {
    try {
      const newColumn = {
        id: Date.now().toString(),
        columnName: formData.columnName,
        tasks: [],
      };

      const { success } = await addColumn(newColumn);
      setColumns((prev: any) => [...prev, newColumn]);
      setFormData({ columnName: "" });
      if (success) toast.success("Column added successfully");
    } catch (error) {
      console.error("Error adding column: ", error);
      toast.error("Failed to add column");
    }
  };

  const handleRenameColumn = async (id: string, newName: string) => {
    const { success } = await updateColumn(id, newName);
    if (success) toast.success("Column renamed successfully");
  };

  const handleRemoveColumn = async (id: string) => {
    const { success } = await deleteColumn(id);
    if (success) toast.success("Column removed successfully");
  };

  const handleAddTask = async (columnId: string, columnName: string) => {
    try {
      const newTask: Task = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description || "",
        dueDate: formData.dueDate || "",
        assignedTo: formData.assignedTo || "",
      };

      const payload = {
        task: newTask,
        columnName,
      };
      // Call the updated addTask function
      const { success } = await addTask(payload);

      if (success) {
        toast.success("Task added successfully");
      }
    } catch (error) {
      console.error("Error adding task: ", error);
      toast.error("Failed to add task");
    }
  };

  const handleRemoveTask = async (columnId: string, taskId: string) => {
    const payload: any = {
      columnId,
      taskId,
    };
    const { success } = await deleteTask(payload);
    if(success) toast.success("Task removed successfully");
  };

  return (
    <div>
      <div className="task-board">
        {columns.map((column) => (
          <div className="column" key={column._id}>
            <div className="column-header">
              <h3
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleRenameColumn(
                    column._id,
                    e.currentTarget.textContent || column.columnName
                  )
                }
              >
                {column.columnName}
              </h3>
              <button onClick={() => handleRemoveColumn(column._id)}>X</button>
            </div>
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => console.log("Edit task", task.id)}
                onDelete={() => handleRemoveTask(column._id, task.id)}
              />
            ))}
            <Form
              btnTitle="Add Task"
              fields={fields}
              onSuccess={() => handleAddTask(column?._id, column.columnName)}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        ))}
        <Form
          btnTitle="Add Column"
          fields={columnField}
          onSuccess={handleAddColumn}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
