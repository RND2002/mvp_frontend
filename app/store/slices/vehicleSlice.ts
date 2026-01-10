import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Vehicle {
    id: string;
    vehicle_type: 'two_wheeler' | 'three_wheeler' | 'four_wheeler' | 'xuv_suv' | 'heavy_vehicle';
    brand: string;
    model: string;
    year: number;
    fuel_type: string;
    registration_number?: string;
    created_at: string;
}

interface VehicleState {
    vehicles: Vehicle[];
    selectedVehicle: Vehicle | null;
}

const initialState: VehicleState = {
    vehicles: [],
    selectedVehicle: null,
};

const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
            state.vehicles = action.payload;
            // Auto-select first vehicle if none selected or if selection not in new list
            if (state.vehicles.length > 0) {
                const currentSelectedStillExists = state.selectedVehicle && state.vehicles.find(v => v.id === state.selectedVehicle?.id);
                if (!state.selectedVehicle || !currentSelectedStillExists) {
                    state.selectedVehicle = state.vehicles[0];
                }
            } else {
                state.selectedVehicle = null;
            }
        },
        selectVehicle: (state, action: PayloadAction<string>) => {
            const vehicle = state.vehicles.find((v) => v.id === action.payload);
            if (vehicle) {
                state.selectedVehicle = vehicle;
            }
        },
        addVehicle: (state, action: PayloadAction<Vehicle>) => {
            state.vehicles.unshift(action.payload);
            if (!state.selectedVehicle) {
                state.selectedVehicle = action.payload;
            }
        },
        clearVehicles: (state) => {
            state.vehicles = [];
            state.selectedVehicle = null;
        }
    },
});

export const { setVehicles, selectVehicle, addVehicle, clearVehicles } = vehicleSlice.actions;

export const selectSelectedVehicle = (state: { vehicle: VehicleState }) => state.vehicle.selectedVehicle;

export default vehicleSlice.reducer;
