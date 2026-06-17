import {
    MoreVertical
} from "lucide-react";
import { NavLink } from "react-router-dom";

// Types
export interface Todo {
  id: string;
  title: string;
  dueDate?: string;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
  status: 'pending' | 'completed';
}

// TodoItem Component
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
}

const ToDoItem: React.FC<TodoItemProps> = ({ todo, onToggle }) => {
    

    return (
        <div className="flex items-start gap-3 p-4 bg-green hover:bg-green-700 transition-colors">
            <input
                type="checkbox"
                checked={todo.status === 'completed'}
                onChange={() => onToggle(todo.id)}
                className="mt-1 w-4 h-4 rounded border-gray-300 "
            />

            <div className="flex-1 min-w-0">
                
                <NavLink to={`/todoapp/tasks/${todo.id}`}>
                    <h3 className={`text-sm font-medium ${todo.status === 'completed' ? 'line-through text-white' : 'text-white'}`}>
                        {todo.title}
                    </h3>
                </NavLink>

            </div>

            <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
            </div>
        </div>

        
    );
};

export default ToDoItem