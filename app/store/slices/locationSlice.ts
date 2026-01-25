import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
    lat: number | null;
    lng: number | null;
    address: string | null;
    city: string | null;
    permissionStatus: 'idle' | 'granted' | 'denied' | 'prompt';
    loading: boolean;
    error: string | null;
}

// Initial state, trying to recover from localStorage if available (client-side only check safe in useEffect usually, but initial state for hydration safety usually null)
const initialState: LocationState = {
    lat: null,
    lng: null,
    address: null,
    city: null,
    permissionStatus: 'idle',
    loading: false,
    error: null,
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setCoordinates: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
            state.lat = action.payload.lat;
            state.lng = action.payload.lng;
            state.error = null;
        },
        setAddress: (state, action: PayloadAction<string>) => {
            state.address = action.payload;
        },
        setCity: (state, action: PayloadAction<string>) => {
            state.city = action.payload;
        },
        setPermissionStatus: (state, action: PayloadAction<LocationState['permissionStatus']>) => {
            state.permissionStatus = action.payload;
        },
        setLocationLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setLocationError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setCoordinates, setAddress, setCity, setPermissionStatus, setLocationLoading, setLocationError } = locationSlice.actions;

export const selectLocation = (state: any) => state.location;

export default locationSlice.reducer;
