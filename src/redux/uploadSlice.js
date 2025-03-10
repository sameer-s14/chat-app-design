import { createSlice } from '@reduxjs/toolkit';

export const uploadSlice = createSlice({
    name: 'upload',
    initialState: {
        percentage: 0
    },
    reducers: {
        updateUploadProgress: (state, action) => {
            state.percentage = action.payload.percentage;
        }
    }
});

export const { updateUploadProgress } = uploadSlice.actions;
export default uploadSlice.reducer;
