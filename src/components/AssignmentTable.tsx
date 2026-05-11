import React from 'react';
import { Assignment } from '../services/assignmentService';

interface AssignmentTableProps {
  assignments: Assignment[];
  onReturn: (id: string) => void;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({ assignments, onReturn }) => {
  return (
    <div className="overflow-x-auto glass rounded-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-text-dim text-sm uppercase tracking-wider">
            <th className="px-6 py-4 font-medium">Vehicle</th>
            <th className="px-6 py-4 font-medium">Driver</th>
            <th className="px-6 py-4 font-medium">Assigned</th>
            <th className="px-6 py-4 font-medium">Returned</th>
            <th className="px-6 py-4 font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {assignments.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-text-dim">
                No assignments found.
              </td>
            </tr>
          ) : (
            assignments.map((asgn) => (
              <tr key={asgn.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{asgn.vehicle.plateNumber}</span>
                    <span className="text-xs text-text-dim">{asgn.vehicle.make} {asgn.vehicle.model}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{asgn.driver.name}</span>
                    <span className="text-xs text-text-dim">{asgn.driver.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-text-dim text-sm">
                  {new Date(asgn.assignedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  {asgn.returnedAt ? (
                    <span className="text-green-400">{new Date(asgn.returnedAt).toLocaleDateString()}</span>
                  ) : (
                    <span className="text-yellow-400 font-bold">In Use</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {!asgn.returnedAt && (
                    <button 
                      onClick={() => onReturn(asgn.id)}
                      className="text-xs bg-primary/20 hover:bg-primary/40 text-primary px-3 py-1 rounded-md transition-all"
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentTable;
