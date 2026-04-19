import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Phone, Star } from 'lucide-react';
import { updateOrderStatus } from '../services/orderService';

// Custom icons using Lucide/SVG data URIs or defaults
const driverIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2983/2983602.png', // Delivery bike icon
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

const homeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
    iconSize: [30, 30],
});

// Zomato/Swiggy style generic Indian names for realism
const DELIVERY_NAMES = ['Rahul Sharma', 'Vikram Singh', 'Aman Gupta', 'Deepak Verma', 'Suresh Kumar', 'Ravi Patel'];

// Simulated Map Component
export const LiveTracker = ({ orderId, isDelivered, city }: { orderId: string, isDelivered: boolean, city: string }) => {
    const [driverName] = useState(() => DELIVERY_NAMES[Math.floor(Math.random() * DELIVERY_NAMES.length)]);
    const [rating] = useState(() => (4.5 + Math.random() * 0.5).toFixed(1));

    // Dynamic Mock Coordinates per city
    const getCoords = (cityName: string): { rest: [number, number], user: [number, number] } => {
        const c = cityName.toLowerCase();
        
        // Mumbai Scope
        if (c.includes('mumbai')) return { rest: [19.0760, 72.8777], user: [19.0880, 72.8800] };
        
        // Pune Scope
        if (c.includes('pune')) return { rest: [18.5204, 73.8567], user: [18.5304, 73.8667] };
        
        // Default Delhi Scope
        return { rest: [28.6328, 77.2197], user: [28.6448, 77.2160] };
    };

    const { rest: restaurantCoords, user: userCoords } = getCoords(city || 'Delhi');
    
    // Live moving driver location
    const [driverCoords, setDriverCoords] = useState<[number, number]>(restaurantCoords);

    useEffect(() => {
        if (isDelivered) {
            setDriverCoords(userCoords);
            return;
        }

        // Simulate driver moving from restaurant to user over 30 seconds
        let step = 0;
        const totalSteps = 150; // 30 seconds at 5 ticks per sec
        
        const interval = setInterval(() => {
            step++;
            if (step > totalSteps) {
                clearInterval(interval);
                // When bike hits home, trigger backend to mark delivered instantly.
                updateOrderStatus(orderId, 'delivered').catch(console.error);
                return;
            }
            
            const progress = step / totalSteps;
            const newLat = restaurantCoords[0] + (userCoords[0] - restaurantCoords[0]) * progress;
            const newLng = restaurantCoords[1] + (userCoords[1] - restaurantCoords[1]) * progress;
            
            setDriverCoords([newLat, newLng]);
        }, 200);

        return () => clearInterval(interval);
    }, [isDelivered]);

    return (
        <div className="mt-6 border-4 border-black bg-white shadow-[8px_8px_0px_#00E59B]">
            {/* Driver Info Header */}
            <div className="p-4 border-b-4 border-black flex items-center justify-between bg-[#f4f0ea]">
                <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${driverName}&background=00E59B&color=000&rounded=true`} className="w-12 h-12 border-2 border-black rounded-full" />
                    <div>
                        <h4 className="font-black uppercase text-xl leading-none">{driverName}</h4>
                        <div className="flex items-center gap-1 font-bold text-gray-500 text-sm mt-1">
                            Valet • {rating} <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </div>
                    </div>
                </div>
                <button className="bg-black text-[#FFD700] p-3 rounded-full hover:scale-110 transition-transform shadow-[2px_2px_0px_#00E59B]">
                    <Phone className="w-5 h-5 stroke-[2.5]" />
                </button>
            </div>

            {/* Map Container */}
            <div className="h-64 w-full relative z-0">
                <MapContainer center={driverCoords} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; OpenStreetMap & CARTO'
                    />
                    <Marker position={userCoords} icon={homeIcon}>
                        <Popup>Your Location</Popup>
                    </Marker>
                    <Marker position={driverCoords} icon={driverIcon}>
                        <Popup>Driver is on the way!</Popup>
                    </Marker>

                    {/* Auto-pan map to follow driver */}
                    <MapPanner coords={driverCoords} />
                </MapContainer>
            </div>
        </div>
    );
};

// Sub-component to smoothly pan map as driver moves
const MapPanner = ({ coords }: { coords: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(coords); // smoothly updates map center
    }, [coords, map]);
    return null;
};
