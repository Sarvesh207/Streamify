import { Home, ThumbsUp, History, Video, Folder, Users, CircleHelp, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ThumbsUp, label: 'Liked Videos', path: '/liked' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Video, label: 'My content', path: '/content' },
    { icon: Folder, label: 'Collection', path: '/collection' },
    { icon: Users, label: 'Subscribers', path: '/subscribers' },
  ];

  const bottomItems = [
    { icon: CircleHelp, label: 'Support', path: '/support' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const NavItem = ({ item }: { item: any }) => (
    <li>
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center p-3 text-base font-medium rounded-lg group transition-all duration-200 border border-transparent
           ${isActive
            ? 'bg-gray-800 text-white border-gray-700'
            : 'text-gray-400 hover:bg-gray-900 hover:text-white hover:border-gray-800'
          } ${isOpen ? 'justify-start' : 'justify-center'}`
        }
        title={!isOpen ? item.label : ''}
      >
        <item.icon className={`transition duration-75 group-hover:text-white ${isOpen ? 'w-5 h-5' : 'w-6 h-6'}`} />
        <span className={`ms-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}`}>
          {item.label}
        </span>
      </NavLink>
    </li>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen pt-20 transition-all duration-300 bg-black border-r border-gray-800 hidden sm:block
        ${isOpen ? 'w-64 translate-x-0' : 'w-20 translate-x-0'}
      `}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-black flex flex-col justify-between scrollbar-hide">

        {/* Main Menu */}
        <ul className="space-y-2 font-medium mt-4">
          {menuItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </ul>

        {/* Bottom Menu */}
        <div className={`pt-4 mt-4 border-t border-gray-800 ${isOpen ? '' : 'flex flex-col items-center'}`}>
          <ul className="space-y-2 font-medium w-full">
            {bottomItems.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
