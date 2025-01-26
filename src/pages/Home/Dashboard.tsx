import React, { useState, useEffect } from "react";
import TaskCard from "../../components/task/TaskCard";
import "./Dashboard.css";
import Form from "../../components/form/Form";
import { toast } from "react-toastify";
import { useTasks } from "../../context/TaskContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  columnId?: string;
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
  }, []);

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
    if (success) toast.success("Task removed successfully");
  };

  const handleDragEnd = async (result: any) => {
    const { destination, source } = result;

    // If dropped outside any column
    if (!destination) {
      return;
    }

    // If the task is dropped in the same position
    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return;
    }

    const sourceColumn = columns.find((column) => column._id === source.droppableId);
    const destColumn = columns.find((column) => column._id === destination.droppableId);

    if (sourceColumn && destColumn) {
      // Remove the task from source column
      const [removedTask] = sourceColumn.tasks.splice(source.index, 1);

      // Add the task to the destination column
      destColumn.tasks.splice(destination.index, 0, removedTask);

      setColumns((prevColumns) =>
        prevColumns.map((column) =>
          column._id === sourceColumn._id ? { ...column, tasks: sourceColumn.tasks } :
          column._id === destColumn._id ? { ...column, tasks: destColumn.tasks } : column
        )
      );

      // Now update the task's columnId in the backend
      const updatedTask = { ...removedTask, columnId: destColumn._id };
      const { success } = await updateTask(updatedTask.id, updatedTask);

      if (success) {
        toast.success("Task moved successfully");
      } else {
        toast.error("Failed to update task");
        setColumns((prevColumns) =>
          prevColumns.map((column) =>
            column._id === sourceColumn._id ? { ...column, tasks: sourceColumn.tasks } :
            column._id === destColumn._id ? { ...column, tasks: destColumn.tasks } : column
          )
        );
      }
    }
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="task-board">
          {columns.map((column) => (
            <Droppable key={column._id} droppableId={column._id} direction="vertical">
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
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

                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          className="task-card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onEdit={() => console.log("Edit task", task.id)}
                            onDelete={() => handleRemoveTask(column._id, task.id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  <Form
                    btnTitle="Add Task"
                    fields={fields}
                    onSuccess={() => handleAddTask(column._id, column.columnName)}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
              )}
            </Droppable>
          ))}
          <Form
            btnTitle="Add Column"
            fields={columnField}
            onSuccess={handleAddColumn}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
