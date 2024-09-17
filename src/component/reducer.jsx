export const initialState = {
    todos: [],
    filter: 'ALL',
};

export function todoReducer(state, action) {
    console.log(state, "STATE");
    console.log(action, "ACTION");
    console.log(action.payload, "PAYLOAD");
    const allCompleted = state.todos.every((todo) => todo.completed);
    
    switch (action.type) {
        case 'ADD_TODO':
            return {
                ...state,
                todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }],
            };
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
                ),
            };
        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter((todo) => todo.id !== action.payload),
            };
        case 'CLEAR_COMPLETE':
            return {
                ...state,
                todos: state.todos.filter((todo) => todo.completed !== true),
            };
        case 'EDIT_TODO':
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
                ),
            };
        case 'SET_FILTER':
            return {
                ...state,
                filter: action.payload,
            };

        case 'CHECK_ALL':
            return {
                ...state,
                todos: state.todos.map((todo) => ({ ...todo, completed: !allCompleted })),
            };
        default:
            return state;
    }
}
