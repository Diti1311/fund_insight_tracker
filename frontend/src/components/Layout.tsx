import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { Toaster } from './Sonner';
import {
  TrendingUp,
  Search,
  Bookmark,
  LogOut,
  User as UserIcon } from
'lucide-react';
export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary font-semibold text-lg">
            
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <TrendingUp className="h-5 w-5" />
            </div>
            Aureva
          </Link>

          <nav className="flex items-center gap-6">
            {user ?
            <>
                <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
                
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Discover</span>
                </Link>
                <Link
                to="/watchlist"
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${location.pathname === '/watchlist' ? 'text-primary' : 'text-muted-foreground'}`}>
                
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Watchlist</span>
                </Link>
                <div className="flex items-center gap-4 ml-4 pl-4 border-l">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.username}</span>
                  </div>
                  <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Logout">
                  
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </> :

            <Link to="/login">
                <Button>Sign In</Button>
              </Link>
            }
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <Toaster position="top-right" />
    </div>);

}