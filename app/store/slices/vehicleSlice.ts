import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VEHICLE_TYPE } from '@/app/beService/vehicle-service';

export interface Vehicle {
    id: string;
    vehicle_type: VEHICLE_TYPE;
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

            // Try to restore selection from localStorage
            let restoredVehicle = null;
            if (typeof window !== 'undefined') {
                const savedId = localStorage.getItem('selectedVehicleId');
                if (savedId) {
                    restoredVehicle = state.vehicles.find(v => v.id === savedId);
                }
            }

            if (restoredVehicle) {
                state.selectedVehicle = restoredVehicle;
            } else if (state.vehicles.length > 0) {
                // Default to first if no valid selection restored
                state.selectedVehicle = state.vehicles[0];
                if (typeof window !== 'undefined') {
                    localStorage.setItem('selectedVehicleId', state.vehicles[0].id);
                }
            } else {
                state.selectedVehicle = null;
            }
        },
        selectVehicle: (state, action: PayloadAction<string>) => {
            const vehicle = state.vehicles.find((v) => v.id === action.payload);
            if (vehicle) {
                state.selectedVehicle = vehicle;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('selectedVehicleId', action.payload);
                }
            }
        },
        addVehicle: (state, action: PayloadAction<Vehicle>) => {
            state.vehicles.unshift(action.payload);
            if (!state.selectedVehicle) {
                state.selectedVehicle = action.payload;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('selectedVehicleId', action.payload.id);
                }
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
