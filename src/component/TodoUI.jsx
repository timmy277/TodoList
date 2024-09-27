import { useEffect, useReducer, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import { todoReducer } from "./reducer";
import styled from "styled-components";
import circle from "../assets/circle.svg"
import tick from "../assets/tick.svg"

const initialState = {
    todos: [],
    filter: 'ALL',
};

const StyledDiv = styled.div`
    position: relative;
    &::after {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        width: 100%;
        height: 1px;
        background-color: red;
    };
    content: '★';
    margin-left: 5px;
    
}`

const getInitialTodos = () => {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
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
    const [state, dispatch] = useReducer(todoReducer, { ...initialState, todos: getInitialTodos() });
    const [newTodo, setNewTodo] = useState('');
    const [showClose, setShowClose] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editedText, setEditedText] = useState('');

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(state.todos));
    }, [state.todos]);

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
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-xl px-2 py-4 bg-white rounded-lg shadow-lg">

                    <form onSubmit={handleAddTodo} className="flex items-center mt-6 pl-[0.9rem]">
                        <MdKeyboardArrowDown className="w-8 h-8 mr-6 scale-125" onClick={() => dispatch({ type: 'CHECK_ALL' })} />
                        <input
                            type="text"
                            className="flex-1 text-gray-700 placeholder-gray-400 placeholder-opacity-50 border-b-2 placeholder:italic focus:outline-none placeholder:text-2xl placeholder:font-semibold"
                            placeholder="What needs to be done?"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                        />
                    </form>

                    <ul className="mt-6 space-y-2">
                        {getFilteredTodos(state.todos, state.filter).map((todo) => (
                            <li key={todo.id} onMouseEnter={() => setShowClose(todo.id)} onMouseLeave={() => setShowClose(null)}
                                className="flex items-center justify-between p-2 border-b-2 ">
                                <div className="flex items-center">
                                    {editingId !== todo.id &&
                                        <span
                                            onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                                            className="mr-2 cursor-pointer"
                                        >
                                            {todo.completed ? (
                                                <img src={tick} alt="tick" />
                                            ) : (
                                                <img src={circle} alt="circle" />
                                            )}
                                        </span>
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
                                        <StyledDiv
                                            className={`${todo.completed ? ' text-gray-400 flex items-center' : ''}`}
                                            onDoubleClick={() => handleEditTodo(todo)}
                                        >
                                            <span className="relative -top-[2.6px]">{todo.text}</span>
                                        </StyledDiv>
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


                    <div className="flex items-center justify-between mt-6 text-sm text-gray-500">
                        <span>{state.todos.filter((todo) => !todo.completed).length} item(s) left</span>
                        <div>
                            <button
                                className={`mx-1 p-2 hover:border hover:border-purple-200 ${state.filter === 'ALL' ? 'border border-purple-400 p-2 rounded hover:border-purple-400' : ''}`}
                                onClick={() => dispatch({ type: 'SET_FILTER', payload: 'ALL' })}
                            >
                                All
                            </button>
                            <button
                                className={`mx-1 p-2 hover:border hover:border-purple-200 ${state.filter === 'ACTIVE' ? 'border p-2 border-purple-400 rounded hover:border-purple-400' : ''}`}
                                onClick={() => dispatch({ type: 'SET_FILTER', payload: 'ACTIVE' })}
                            >
                                Active
                            </button>
                            <button
                                className={`mx-1 p-2 hover:border hover:border-purple-200 ${state.filter === 'COMPLETED' ? 'border p-2 border-purple-400 rounded hover:border-purple-400' : ''}`}
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
