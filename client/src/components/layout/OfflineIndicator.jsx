import React from 'react';
import { WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const OfflineIndicator = () => {
    const { isOnline } = useApp();

    if (isOnline) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-sm font-medium text-black">
            <WifiOff size={16} />
            Offline — showing cached data
        </div>
    );
};

export default OfflineIndicator;