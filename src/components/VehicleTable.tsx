import React from 'react';
import { Vehicle } from '../services/vehicleService';

interface VehicleTableProps {
  vehicles: Vehicle[];
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles }) => {
  return (
    <div className="overflow-x-auto glass rounded-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-text-dim text-sm uppercase tracking-wider">
            <th className="px-6 py-4 font-medium">Plate Number</th>
            <th className="px-6 py-4 font-medium">Vehicle</th>
            <th className="px-6 py-4 font-medium">Year</th>
            <th className="px-6 py-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-text-dim">
                No vehicles found.
              </td>
            </tr>
          ) : (
            vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-primary font-bold">{vehicle.plateNumber}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{vehicle.make} {vehicle.model}</span>
                    <span className="text-xs text-text-dim uppercase tracking-tighter">{vehicle.type || 'Unknown'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-text-dim">{vehicle.year}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                    vehicle.status === 'AVAILABLE' ? 'bg-green-500/20 text-green-400' :
                    vehicle.status === 'ASSIGNED' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {vehicle.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
