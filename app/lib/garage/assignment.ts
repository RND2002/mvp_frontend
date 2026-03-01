// import supabase from "@/app/api/supabaseClient";

export interface Garage {
    id: string;
    name: string;
    address: string;
    city: string;
    total_slots: number;
    current_bookings: number;
    location: string;
    lat?: number;
    lng?: number;
    distance_in_meters?: number;
}

// Helper to parse PostGIS EWKB Hex string to Lat/Lng
// Assumes Little Endian (01) and SRID presence (20) which is standard for Supabase geography(Point)
function parseGeographyPoint(hex: string): { lat: number, lng: number } | null {
    try {
        if (!hex || hex.length < 50) return null;

        // Convert hex to buffer
        const buffer = Buffer.from(hex, 'hex');

        // Byte 0: Endianness (01 = Little Endian)
        const isLittleEndian = buffer[0] === 0x01;

        if (!isLittleEndian) {
            // We only support LE for now as it's standard for x86/Postgres default usually
            // Implementing BE would require readDoubleBE
            return null;
        }

        // Structure for EWKB Point with SRID:
        // 0: Endianness (1 byte)
        // 1-4: Type (4 bytes)
        // 5-8: SRID (4 bytes)
        // 9-16: X (8 bytes double)
        // 17-24: Y (8 bytes double)

        // In EWKB, X is Longitude, Y is Latitude
        const lng = buffer.readDoubleLE(9);
        const lat = buffer.readDoubleLE(17);

        return { lat, lng };
    } catch (e) {
        console.error("Error parsing geography info:", e);
        return null;
    }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

import { SupabaseClient } from '@supabase/supabase-js';

type NearestGarageResult = {
    id: string;
    name: string;
    distance_meters: number;
};

export async function findNearestGarage(
    supabase: SupabaseClient,
    lat: number,
    lng: number,
    city: string,
    radiusMeters = 20000 // default 20km
): Promise<NearestGarageResult | null> {
    const { data, error } = await supabase.rpc(
        'find_nearest_garage',
        {
            user_lat: lat,
            user_lng: lng,
            user_city: city,
            search_radius: radiusMeters
        }
    );

    if (error) {
        console.error('findNearestGarage error:', error);
        throw error;
    }

    if (!data || data.length === 0) {
        return null;
    }

    return data[0];
}
