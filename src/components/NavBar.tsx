import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Home, Users, AlertCircle } from "lucide-react";

const NavBar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="ml-2 text-xl font-bold text-medical-dark">
                ReAdmit
              </span>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/")
                    ? "border-medical-primary text-medical-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <Home className="mr-1 h-4 w-4" />
                Dashboard
              </Link>

              <Link
                to="/patients"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/patients")
                    ? "border-medical-primary text-medical-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <Users className="mr-1 h-4 w-4" />
                Patients
              </Link>

              <Link
                to="/analytics"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/analytics")
                    ? "border-medical-primary text-medical-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <BarChart3 className="mr-1 h-4 w-4" />
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className="md:hidden border-t border-gray-200">
        <div className="grid grid-cols-3 text-xs text-gray-500">
          <Link
            to="/"
            className={`flex flex-col items-center py-2 ${
              isActive("/") && "text-medical-primary"
            }`}
          >
            <Home className="h-6 w-6" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/patients"
            className={`flex flex-col items-center py-2 ${
              isActive("/patients") && "text-medical-primary"
            }`}
          >
            <Users className="h-6 w-6" />
            <span>Patients</span>
          </Link>

          <Link
            to="/analytics"
            className={`flex flex-col items-center py-2 ${
              isActive("/analytics") && "text-medical-primary"
            }`}
          >
            <BarChart3 className="h-6 w-6" />
            <span>Analytics</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
