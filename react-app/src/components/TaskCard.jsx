import React from 'react';
import { Trash2, ArrowRightCircle, CheckCircle2, Clock } from 'lucide-react';

/**
 * TaskCard Component
 * Concepts:
 * 1. Props Passing: Receives `task` data and callback functions `onStatusChange` and `onDelete`.
 * 2. Lifting State Up: When the user clicks "Next Status" or "Delete", the child component calls
 *    the function provided by the parent.
 * 3. Dynamic Classes & Expressions: Using template literals for dynamic styling.
 */
export default function TaskCard({ task, onStatusChange, onDelete }) {
  // Determine next status cycle: Todo -> In Progress -> Completed -> Todo
  const getNextStatus = (current) => {
    if (current === 'Todo') return 'In Progress';
    if (current === 'In Progress') return 'Completed';
    return 'Todo';
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Todo': return 'status-todo';
      case 'In Progress': return 'status-in-progress';
      case 'Completed': return 'status-completed';
      default: return 'status-todo';
    }
  };

  return (
    <div className="task-card glass-panel">
      <div>
        <div className="task-card-header">
          <span className="task-category">{task.category || 'General'}</span>
          <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">{task.description}</p>
      </div>

      <div className="task-footer">
        <span className={`status-badge ${getStatusClass(task.status)}`}>
          {task.status === 'Completed' && <CheckCircle2 size={13} />}
          {task.status === 'In Progress' && <Clock size={13} />}
          {task.status}
        </span>

        <div className="task-actions">
          <button 
            className="icon-btn" 
            title={`Move to ${getNextStatus(task.status)}`}
            onClick={() => onStatusChange(task.id, getNextStatus(task.status))}
          >
            <ArrowRightCircle size={18} />
          </button>
          
          <button 
            className="icon-btn delete" 
            title="Delete task"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
