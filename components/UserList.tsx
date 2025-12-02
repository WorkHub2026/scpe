import { Edit2, Trash2 } from "lucide-react";

const UserList = ({
  users,
  onEdit,
  onDelete,
}: {
  users: Array<{
    user_id: number;
    username: string;
    ministry: string | { name: string };
    email: string;
    role: string;
    status: boolean;
  }>;
  onEdit: (user: {
    user_id: number;
    username: string;
    ministry: string | { name: string };
    email: string;
    role: string;
    status: boolean;
  }) => void;
  onDelete: (userId: number) => void;
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-[#004225]/30 overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#004225]/10 to-[#004225]/5 border-b border-[#004225]/30">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                Ministry
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                Phone Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.user_id}
                className="border-b border-[#004225]/20 hover:bg-[#004225]/5 transition-colors duration-300"
              >
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                  {user.username}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {typeof user.ministry === "string"
                    ? user.ministry
                    : user.ministry?.name || "Admin"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      user.status == true
                        ? "bg-[#004225]/20 text-[#004225] border border-[#004225]/50"
                        : "bg-gray-100/80 text-gray-700 border border-gray-300/50"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        user.status == true ? "bg-[#004225]" : "bg-gray-500"
                      }`}
                    ></div>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-[#004225] hover:bg-[#004225]/10 rounded-lg transition-colors duration-300"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user.user_id)}
                    className="p-2 text-red-600 hover:bg-red-100/80 rounded-lg transition-colors duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
