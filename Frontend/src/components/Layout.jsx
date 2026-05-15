import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

function Layout({ children, title, subtitle }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-center bg-white p-4 shadow-sm rounded-xl mb-8 border border-gray-100">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
               {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </header>

        <main>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
