import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mfApi, Scheme } from '../services/mfApi';
import { mockBackend } from '../services/mockBackend';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { Skeleton } from '../components/Skeleton';
import { Search, Plus, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
export function Home() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingToWatchlist, setAddingToWatchlist] = useState<Set<number>>(
    new Set()
  );
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await mfApi.searchSchemes(debouncedQuery);
        setResults(data.slice(0, 50)); // Limit to 50 results for performance
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    search();
  }, [debouncedQuery]);
  const handleAddToWatchlist = async (scheme: Scheme) => {
    if (!user) {
      toast.error('Please sign in to add to watchlist');
      navigate('/login');
      return;
    }
    try {
      setAddingToWatchlist((prev) => new Set(prev).add(scheme.schemeCode));
      await mockBackend.addToWatchlist(scheme);
      toast.success('Added to watchlist');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to watchlist');
    } finally {
      setAddingToWatchlist((prev) => {
        const next = new Set(prev);
        next.delete(scheme.schemeCode);
        return next;
      });
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Discover Mutual Funds
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Search through thousands of Indian mutual funds, track their
          performance, and build your personal portfolio watchlist.
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          className="pl-10 h-14 text-lg rounded-xl shadow-sm"
          placeholder="Search by fund name or scheme code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} />
        
      </div>

      <div className="space-y-4">
        {isLoading &&
        <div className="space-y-3">
            {[1, 2, 3, 4].map((i) =>
          <Card key={i}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-9 w-24 ml-4" />
                </CardContent>
              </Card>
          )}
          </div>
        }

        {error &&
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        }

        {!isLoading && !error && results.length > 0 &&
        <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground mb-4">
              Showing {results.length} results for "{debouncedQuery}"
            </h2>
            {results.map((scheme) =>
          <Card
            key={scheme.schemeCode}
            className="transition-all hover:shadow-md">
            
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-medium leading-tight">
                      {scheme.schemeName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {scheme.schemeCode}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate(`/fund/${scheme.schemeCode}`)}>
                  
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                  className="w-full sm:w-auto"
                  onClick={() => handleAddToWatchlist(scheme)}
                  disabled={addingToWatchlist.has(scheme.schemeCode)}>
                  
                      <Plus className="h-4 w-4 mr-2" />
                      {addingToWatchlist.has(scheme.schemeCode) ?
                  'Adding...' :
                  'Watchlist'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
          )}
          </div>
        }

        {!isLoading && !error && query && results.length === 0 &&
        <div className="text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No funds found</p>
            <p>Try adjusting your search terms</p>
          </div>
        }
      </div>
    </div>);

}