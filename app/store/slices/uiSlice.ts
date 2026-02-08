import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
    detailedReportOpen: boolean;
}

const initialState: UIState = {
    detailedReportOpen: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setDetailedReportOpen: (state, action: PayloadAction<boolean>) => {
            state.detailedReportOpen = action.payload;
        },
    },
});

export const { setDetailedReportOpen } = uiSlice.actions;
export default uiSlice.reducer;
