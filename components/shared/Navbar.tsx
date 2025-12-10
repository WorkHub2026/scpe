import { LogOut } from "lucide-react";
import Image from "next/image";
import NotificationBell from "../NotificationBell";

export default function Navbar({
  user,
  ministry,

  onLogout,
}: {
  user: { username: string; type: string; role: "Admin" | "MinistryUser" };
  ministry?: string;
  onLogout: () => void;
}) {
  return (
    <nav className="bg-[#004225] border-b border-[#003218] sticky top-0 z-50 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/somaliland-seal.png"
                alt="Somaliland Seal"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">
                Republic of Somaliland
              </h1>
              <p className="text-sm font-semibold text-white/90">
                Government Communications
              </p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-6">
            {/* User info */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/20 rounded-lg border border-white/30">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="text-sm">
                <p className="font-medium text-white">{user.username}</p>
                {ministry && (
                  <p className="text-xs text-white/60">{ministry}</p>
                )}
              </div>
            </div>

            {/* Notification Bell */}
            {user.role === "Admin" && <NotificationBell />}

            {/* Logout */}
            <button
              onClick={onLogout}
              className="text-white/80 hover:text-white transition-all duration-300 flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
