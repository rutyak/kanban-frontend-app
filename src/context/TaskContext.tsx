import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";

const Base_url = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

console.log("Base_url:", Base_url);

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface TaskContextType {
  tasks: Task[];
  getTasks: any;
  getColumns: any;
  addTask: (formData: any) => Promise<{ success: boolean; message: string }>;
  addColumn: (formData: any) => Promise<{ success: boolean; message: string }>;
  updateTask: (
    taskId: string,
    updatedTask: Partial<Task>
  ) => Promise<{ success: boolean; message: string }>;
  updateColumn: any;
  deleteTask: (taskId: string) => Promise<{ success: boolean; message: string }>;
  deleteColumn: any;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getTasks = async (): Promise<{ success: boolean; message: string; data?: Task[] }> => {
    try {
      const { data } = await axios.get(`${Base_url}/tasks`);
      setTasks(data.tasks); 
      return { success: true, message: "Tasks fetched successfully!", data: data.tasks };
    } catch (error: any) {
      console.error("Failed to fetch tasks:", error.message);
      return { success: false, message: error.message };
    }
  };

  const getColumns = async (): Promise<{ success: boolean; message: string; data?: Column[] }> => {
    try {
      const { data } = await axios.get(`${Base_url}/columns`);
      return { success: true, message: "Columns fetched successfully!", data: data };
    } catch (error: any) {
      console.error("Failed to fetch columns:", error.message);
      return { success: false, message: error.message };
    }
  };

  const addTask = async (payload: any): Promise<{ success: boolean; message: string }> => {
    try {
      const { task, columnName } = payload;
      const { data } = await axios.post(`${Base_url}/create/task/${columnName}`, task);
  
      // Update state with the new task
      setTasks((prevTasks) => [...prevTasks, data.task]);
  
      return { success: true, message: "Task added successfully!" };
    } catch (error: any) {
      console.error("Failed to add task:", error.message);
      return { success: false, message: error.message };
    }
  };
  
  

  const addColumn = async (formData: any): Promise<{ success: boolean; message: string }> => {
    try {
      await axios.post(`${Base_url}/create/column`, formData);
      return { success: true, message: "Column added successfully!" };
    } catch (error: any) {
      console.error("Failed to add column:", error.message);
      return { success: false, message: error.message };
    }
  };

  const updateTask = async (
    taskId: string,
    updatedTask: Partial<Task>
  ): Promise<{ success: boolean; message: string }> => {
    try {
      await axios.put(`${Base_url}/update/${taskId}`, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task))
      );
      return { success: true, message: "Task updated successfully!" };
    } catch (error: any) {
      console.error("Failed to update task:", error.message);
      return { success: false, message: error.message };
    }
  };

  const updateColumn = async (
    id: string,
    newName: any
  ): Promise<{ success: boolean; message: string }> => {
    try {
      console.log("newName: ",newName);
      await axios.put(`${Base_url}/update/column/${id}`, newName);
      return { success: true, message: "Column updated successfully!" };
    } catch (error: any) {
      console.error("Failed to update task:", error.message);
      return { success: false, message: error.message };
    }
  };

  const deleteTask = async (payload: any): Promise<{ success: boolean; message: string }> => {
    try {
      const { columnId, taskId } = payload;
      await axios.delete(`${Base_url}/delete/${columnId}/${taskId}`);
      return { success: true, message: "Task deleted successfully!" };
    } catch (error: any) {
      console.error("Failed to delete task:", error.message);
      return { success: false, message: error.message };
    }
  };

  const deleteColumn = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log("delete column clikced");
      await axios.delete(`${Base_url}/delete/column/${id}`);
      setTasks((prevTasks) => prevTasks.filter((column) => column.id !== id));
      return { success: true, message: "Column deleted successfully!" };
    } catch (error: any) {
      console.error("Failed to delete task:", error.message);
      return { success: false, message: error.message };
    }
  };
  return (
    <TaskContext.Provider
      value={{
        tasks,
        getTasks,
        getColumns,
        addTask,
        addColumn,
        updateTask,
        updateColumn,
        deleteTask,
        deleteColumn
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
