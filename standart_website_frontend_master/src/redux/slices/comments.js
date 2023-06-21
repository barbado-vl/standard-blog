import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios.js';

export const fetchComments = createAsyncThunk('comments/fetchComments', async () => {
    const { data } = await axios.get('/comments');
    return data;
});

export const fetchRemoveComment = createAsyncThunk('comments/fetchRemoveComments', async (id) => {
    await axios.delete(`/comments/${id}`);
});
 
const initialState = {
    items: [],
    status: 'loading',
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: {
        // Получение новых комментариев
        [fetchComments.pending]: (state) => {
            state.items = [];
            state.status = 'loading';
        },
        [fetchComments.fulfilled]: (state, action) => {
            state.items = action.payload;
            state.status = 'loaded';
        },
        [fetchComments.rejected]: (state) => {
            state.items = [];
            state.status = 'error';
        },
        // Удалить комментарий
        [fetchRemoveComment.pending]: (state, action) => {
            state.items = state.items.filter(obj => obj._id !== action.meta.arg);
        },
    },
});

export const commentsReducer = commentsSlice.reducer;