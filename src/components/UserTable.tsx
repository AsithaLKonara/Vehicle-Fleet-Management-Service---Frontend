import React from 'react';
import { User } from '../services/userService';

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <div className="overflow-x-auto glass rounded-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-text-dim text-sm uppercase tracking-wider">
            <th className="px-6 py-4 font-medium">Name</th>
            <th className="px-6 py-4 font-medium">Email</th>
            <th className="px-6 py-4 font-medium">Role</th>
            <th className="px-6 py-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-text-dim">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                <td className="px-6 py-4 text-text-dim">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                    user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                    user.role === 'FLEET_MANAGER' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-xs text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Active
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

export default UserTable;
