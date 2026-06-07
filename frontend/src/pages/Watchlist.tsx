import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { mockBackend, WatchlistItem } from '../services/mockBackend';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Skeleton } from '../components/Skeleton';
import { Trash2, TrendingUp, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
export function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) return;
    const fetchWatchlist = async () => {
      try {
        const data = await mockBackend.getWatchlist();
        // Sort by addedAt descending
        setWatchlist(data.sort((a, b) => b.addedAt - a.addedAt));
      } catch (error) {
        toast.error('Failed to load watchlist');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWatchlist();
  }, [user]);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const handleRemove = async (schemeCode: number) => {
    try {
      setRemovingId(schemeCode);
      await mockBackend.removeFromWatchlist(schemeCode);
      setWatchlist((prev) =>
      prev.filter((item) => item.schemeCode !== schemeCode)
      );
      toast.success('Removed from watchlist');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Watchlist</h1>
          <p className="text-muted-foreground mt-1">
            Track and monitor your favorite mutual funds
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {watchlist.length} {watchlist.length === 1 ? 'Fund' : 'Funds'}
        </Badge>
      </div>

      {isLoading ?
      <div className="space-y-3">
          {[1, 2, 3].map((i) =>
        <Card key={i}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </CardContent>
            </Card>
        )}
        </div> :
      watchlist.length === 0 ?
      <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="bg-muted p-4 rounded-full">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Your watchlist is empty</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Start discovering mutual funds and add them to your watchlist to
                track their performance.
              </p>
            </div>
            <Button onClick={() => navigate('/')} className="mt-4">
              Discover Funds
            </Button>
          </CardContent>
        </Card> :

      <div className="grid gap-4">
          {watchlist.map((item) =>
        <Card
          key={item.schemeCode}
          className="group transition-all hover:border-primary/50">
          
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium leading-tight text-lg">
                    {item.schemeName}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.schemeCode}
                    </Badge>
                    <span>Added {format(item.addedAt, 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                className="w-full sm:w-auto"
                onClick={() => navigate(`/fund/${item.schemeCode}`)}>
                
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Performance
                  </Button>
                  <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleRemove(item.schemeCode)}
                disabled={removingId === item.schemeCode}
                title="Remove from watchlist">
                
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
        )}
        </div>
      }
    </div>);

}