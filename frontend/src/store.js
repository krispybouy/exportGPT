import { configureStore, createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
    name: 'language',
    initialState: { value: 'English' },
    reducers: {
        setLanguage: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setLanguage } = languageSlice.actions;

const store = configureStore({
    reducer: {
        language: languageSlice.reducer,
    },
});

export default store;
