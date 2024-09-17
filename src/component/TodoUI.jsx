import { useReducer, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import { todoReducer } from "./reducer";

const initialState = {
    todos: [],
    filter: 'ALL',
};


const getFilteredTodos = (todos, filter) => {
    switch (filter) {
        case 'ACTIVE':
            return todos.filter((todo) => !todo.completed);
        case 'COMPLETED':
            return todos.filter((todo) => todo.completed);
        default:
            return todos;
    }
};


const TodoUI = () => {
    const [state, dispatch] = useReducer(todoReducer, initialState);
    const [newTodo, setNewTodo] = useState('');
    const [showClose, setShowClose] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editedText, setEditedText] = useState('');

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (newTodo.trim() !== '') {
            dispatch({ type: 'ADD_TODO', payload: newTodo });
            setNewTodo('');
        }
    };

    const handleEditTodo = (todo) => {
        setEditingId(todo.id);
        setEditedText(todo.text);
    };

    const handleSaveTodo = (todo) => {
        if (editedText.trim() !== '') {
            dispatch({ type: 'EDIT_TODO', payload: { id: todo.id, text: editedText } });
        }
        setEditingId(null);
    };

    const handleKeyDown = (e, todo) => {
        if (e.key === 'Enter') {
            handleSaveTodo(todo);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="bg-white shadow-lg rounded-lg py-4 px-2 w-full max-w-xl">

                    <form onSubmit={handleAddTodo} className="mt-6 flex items-center ">
                        <MdKeyboardArrowDown className="mx-2" onClick={() => dispatch({ type: 'CHECK_ALL' })} />
                        <input
                            type="text"
                            className="flex-1 border-b-2 text-gray-700 placeholder-gray-400 placeholder-opacity-50 focus:outline-none"
                            placeholder="What needs to be done?"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                        />
                    </form>

                    <ul className="mt-6 space-y-2">
                        {getFilteredTodos(state.todos, state.filter).map((todo) => (
                            <li key={todo.id} onMouseEnter={() => setShowClose(todo.id)} onMouseLeave={() => setShowClose(null)}
                                className="flex justify-between items-center border-b-2 p-2 ">
                                <div className="flex items-center">
                                    {editingId !== todo.id &&
                                        < input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                                            className="mr-2 cursor-pointer rounded-[100%] "
                                        />
                                    }
                                    {editingId === todo.id ? (
                                        <input
                                            type="text"
                                            className="flex-1 p-2 border-b-2 text-gray-700 w-[525px] ml-6"
                                            value={editedText}
                                            onChange={(e) => setEditedText(e.target.value)}
                                            onBlur={() => handleSaveTodo(todo)}
                                            onKeyDown={(e) => handleKeyDown(e, todo)}
                                            autoFocus
                                        />
                                    ) : (
                                        <span
                                            className={`${todo.completed ? 'line-through text-gray-400' : ''}`}
                                            onDoubleClick={() => handleEditTodo(todo)}
                                        >
                                            {todo.text}
                                        </span>
                                    )}
                                </div>
                                {showClose === todo.id && editingId !== todo.id &&
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
                                    >
                                        <IoMdClose />
                                    </button>
                                }
                            </li>
                        ))}
                    </ul>


                    <div className="flex justify-between mt-6 text-sm text-gray-500">
                        <span>{state.todos.filter((todo) => !todo.completed).length} item(s) left</span>
                        <div>
                            <button
                                className={`mx-1 ${state.filter === 'ALL' ? 'border border-purple-400 p-2 rounded hover:border-purple-100' : ''}`}
                                onClick={() => dispatch({ type: 'SET_FILTER', payload: 'ALL' })}
                            >
                                All
                            </button>
                            <button
                                className={`mx-1 ${state.filter === 'ACTIVE' ? 'border p-2 border-purple-400 rounded hover:border-purple-100' : ''}`}
                                onClick={() => dispatch({ type: 'SET_FILTER', payload: 'ACTIVE' })}
                            >
                                Active
                            </button>
                            <button
                                className={`mx-1 ${state.filter === 'COMPLETED' ? 'border p-2 border-purple-400 rounded hover:border-purple-100' : ''}`}
                                onClick={() => dispatch({ type: 'SET_FILTER', payload: 'COMPLETED' })}
                            >
                                Completed
                            </button>
                        </div>
                        <div>
                            {
                                state.todos.filter((todo) => todo.completed).length > 0 &&
                                <div>
                                    <button className="hover:underline" onClick={() => dispatch({ type: 'CLEAR_COMPLETE' })}>
                                        Clear completed
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TodoUI
