import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

interface UserSession {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  screenName: string;
  createdAt: string;
}

const Taskmanager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get user session from localStorage
  useEffect(() => {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
      setUserSession(JSON.parse(sessionData));
    } else {
      setInitialLoading(false);
    }
  }, []);

  // Fetch tasks for the logged-in user
  useEffect(() => {
    if (userSession?.uid) {
      fetchTasks();
    } else if (userSession === null) {
      setInitialLoading(false);
    }
  }, [userSession]);

  const fetchTasks = async () => {
    if (!userSession?.uid) return;

    setLoading(true);
    setError(null);
    
    try {
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', userSession.uid)
      );
      const querySnapshot = await getDocs(q);
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      
      // Sort in memory by creation date (newest first)
      tasksData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please check your connection.');
      setTasks([]);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    e.stopPropagation(); // Stop event propagation
    
    if (!userSession?.uid || !newTask.title.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const taskData = {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        userId: userSession.uid
      };

      // Add the task to Firestore
      const docRef = await addDoc(collection(db, 'tasks'), taskData);
      console.log('Task added successfully with ID:', docRef.id);

      // Clear the form and close it
      setNewTask({ title: '', description: '' });
      setShowAddForm(false);
      setSuccess('Task added successfully!');

      // Add the new task to the current state immediately
      const newTaskWithId = {
        id: docRef.id,
        ...taskData
      };
      setTasks(prevTasks => [newTaskWithId, ...prevTasks]);

      // Try to refresh from server (optional)
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
        await fetchTasks();
      } catch (fetchError) {
        console.error('Error fetching tasks after adding:', fetchError);
        // Don't show error since the task was added successfully
      }
      
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
      // Clear success message after 3 seconds
      if (success) {
        setTimeout(() => setSuccess(null), 3000);
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setLoading(true);
    setError(null);
    
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      // Remove from local state immediately
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setSuccess('Task deleted successfully!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = async (taskId: string, completed: boolean) => {
    setError(null);
    
    try {
      await updateDoc(doc(db, 'tasks', taskId), { completed: !completed });
      // Update local state immediately
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  // Clear messages after some time
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Show loading spinner only on initial load
  if (initialLoading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (!userSession) {
    return (
      <div className="container-fluid" style={{ padding: '20px' }}>
        <div className="alert alert-warning text-center" role="alert">
          <h4>Please log in to manage your tasks</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ padding: '15px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Success Message */}
      {success && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-success d-flex justify-content-between align-items-center" role="alert">
              <span>{success}</span>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess(null)}
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
              <span>{error}</span>
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card" style={{ border: 'none', backgroundColor: '#f8f9fa' }}>
            <div className="card-body text-center">
              <h2 className="mb-2" style={{ color: '#495057', fontWeight: '600' }}>
                Task Manager
              </h2>
              <p className="mb-0" style={{ color: '#6c757d' }}>
                Welcome back, {userSession.firstName || userSession.screenName || 'User'}!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Button */}
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h4 style={{ color: '#495057', margin: 0 }}>Your Tasks ({tasks.length})</h4>
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center"
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ 
              borderRadius: '25px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: '500'
            }}
            disabled={loading}
          >
            <span style={{ marginRight: '5px' }}>+</span>
            Add Task
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card" style={{ border: '1px solid #dee2e6', borderRadius: '10px' }}>
              <div className="card-body">
                <form onSubmit={addTask} method="post">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '500', color: '#495057' }}>
                        Task Title *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Enter task title..."
                        required
                        disabled={loading}
                        style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '500', color: '#495057' }}>
                        Description
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Enter description (optional)..."
                        disabled={loading}
                        style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewTask({ title: '', description: '' });
                        setError(null);
                      }}
                      disabled={loading}
                      style={{ borderRadius: '20px', padding: '6px 16px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={loading || !newTask.title.trim()}
                      style={{ borderRadius: '20px', padding: '6px 16px' }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Adding...
                        </>
                      ) : (
                        'Add Task'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="row">
        {tasks.length === 0 && !loading ? (
          <div className="col-12">
            <div className="card text-center" style={{ border: '2px dashed #dee2e6', borderRadius: '10px' }}>
              <div className="card-body" style={{ padding: '40px 20px' }}>
                <h5 style={{ color: '#6c757d' }}>No tasks yet!</h5>
                <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                  Click the "Add Task" button to create your first task.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowAddForm(true)}
                  style={{ borderRadius: '25px', padding: '8px 20px' }}
                >
                  Create First Task
                </button>
              </div>
            </div>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="col-12 col-md-6 col-lg-4 mb-3">
              <div 
                className="card h-100"
                style={{ 
                  border: '1px solid #dee2e6',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                  opacity: task.completed ? 0.7 : 1
                }}
              >
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskComplete(task.id, task.completed)}
                        style={{ marginTop: '2px' }}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteTask(task.id)}
                      disabled={loading}
                      style={{ 
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  
                  <h6 
                    className="card-title mb-2"
                    style={{ 
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? '#6c757d' : '#495057',
                      fontWeight: '600',
                      fontSize: '16px'
                    }}
                  >
                    {task.title}
                  </h6>
                  
                  {task.description && (
                    <p 
                      className="card-text mb-3"
                      style={{ 
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? '#6c757d' : '#6c757d',
                        fontSize: '14px',
                        lineHeight: '1.4'
                      }}
                    >
                      {task.description}
                    </p>
                  )}
                  
                  <div className="mt-auto">
                    <small className="text-muted" style={{ fontSize: '12px' }}>
                      {new Date(task.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                    {task.completed && (
                      <span 
                        className="badge bg-success ms-2"
                        style={{ fontSize: '10px' }}
                      >
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Taskmanager;
