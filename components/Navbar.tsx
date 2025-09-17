import React from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout");
    localStorage.clear();
    router.replace("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow">
      <div className="text-xl font-bold">AI Search Visibility Tracker</div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
