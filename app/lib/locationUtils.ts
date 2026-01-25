export const reverseGeocode = async (lat: number, lng: number): Promise<{ formattedAddress: string; city: string } | null> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        if (!response.ok) {
            throw new Error('Failed to fetch address');
        }
        const data = await response.json();

        // Construct a readable string similar to Zepto/Blinkit
        // e.g. "Sector 45, Gurgaon" or "Building Name, Street"
        const address = data.address;
        const parts = [];

        if (address.suburb) parts.push(address.suburb);
        else if (address.neighbourhood) parts.push(address.neighbourhood);
        else if (address.road) parts.push(address.road);

        if (address.city) parts.push(address.city);
        else if (address.state_district) parts.push(address.state_district);

        let formattedAddress = '';

        if (parts.length === 0) {
            formattedAddress = data.display_name.split(',').slice(0, 2).join(',');
        } else {
            formattedAddress = parts.join(', ');
        }

        const city = address.city || address.town || address.village || address.state_district || "";

        return { formattedAddress, city };
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return null;
    }
};
