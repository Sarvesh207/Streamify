import { Home, Clock, Folder, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Clock, label: 'History', path: '/history' },
    { icon: Folder, label: 'Collection', path: '/collection' },
    { icon: Users, label: 'Subscribers', path: '/subscribers' },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-black border-t border-gray-800 sm:hidden">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `inline-flex flex-col items-center justify-center px-5 hover:bg-gray-900 group ${
                isActive ? 'text-white' : 'text-gray-500'
              }`
            }
          >
            <item.icon
              className={`w-6 h-6 mb-1 ${
                // Active state styling handled by NavLink's isActive logic if needed, 
                // but usually text color is enough. Adding explicit icon fill or color:
                '' 
              }`}
              // set stroke color based on parent class
              color="currentColor" 
            />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
