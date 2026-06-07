import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mfApi, SchemeDetails, NavData } from '../services/mfApi';
import { mockBackend } from '../services/mockBackend';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription } from
'../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Skeleton } from '../components/Skeleton';
import { ToggleGroup, ToggleGroupItem } from '../components/ToggleGroup';
import { Separator } from '../components/Separator';
import { ArrowLeft, Plus, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { parse, subYears, isAfter, format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { formatCurrency } from '../lib/utils';
type TimeRange = '1Y' | '3Y' | '5Y' | 'ALL';
// Helper to parse dd-mm-yyyy
const parseDate = (dateStr: string) => parse(dateStr, 'dd-MM-yyyy', new Date());
export function FundDetail() {
  const { id } = useParams<{
    id: string;
  }>();
  const [details, setDetails] = useState<SchemeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('5Y');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mfApi.getSchemeDetails(id);
        if (!data.data || data.data.length === 0) {
          throw new Error('No NAV data available for this scheme');
        }
        setDetails(data);
        // Check watchlist status if logged in
        if (user) {
          const watchlist = await mockBackend.getWatchlist();
          setIsInWatchlist(
            watchlist.some((item) => item.schemeCode.toString() === id)
          );
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load fund details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, user]);
  const handleWatchlistToggle = async () => {
    if (!user) {
      toast.error('Please sign in to manage your watchlist');
      navigate('/login');
      return;
    }
    if (!details) return;
    try {
      setIsAdding(true);
      if (isInWatchlist) {
        await mockBackend.removeFromWatchlist(details.meta.scheme_code);
        setIsInWatchlist(false);
        toast.success('Removed from watchlist');
      } else {
        await mockBackend.addToWatchlist({
          schemeCode: details.meta.scheme_code,
          schemeName: details.meta.scheme_name
        });
        setIsInWatchlist(true);
        toast.success('Added to watchlist');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update watchlist');
    } finally {
      setIsAdding(false);
    }
  };
  // Process and filter chart data
  const chartData = useMemo(() => {
    if (!details?.data) return [];
    // Data from API is usually newest first. We need oldest first for the chart.
    // Also parse dates and NAVs
    const processed = details.data.
    map((item) => ({
      dateObj: parseDate(item.date),
      dateStr: item.date,
      nav: parseFloat(item.nav)
    })).
    sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    if (timeRange === 'ALL') return processed;
    const now = new Date();
    let cutoffDate: Date;
    switch (timeRange) {
      case '1Y':
        cutoffDate = subYears(now, 1);
        break;
      case '3Y':
        cutoffDate = subYears(now, 3);
        break;
      case '5Y':
        cutoffDate = subYears(now, 5);
        break;
      default:
        cutoffDate = subYears(now, 5);
    }
    return processed.filter((item) => isAfter(item.dateObj, cutoffDate));
  }, [details, timeRange]);
  const latestNav =
  chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const oldestNav = chartData.length > 0 ? chartData[0] : null;
  const absoluteReturn =
  latestNav && oldestNav ?
  (latestNav.nav - oldestNav.nav) / oldestNav.nav * 100 :
  0;
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" disabled className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>);

  }
  if (error || !details) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-destructive">
                Error Loading Fund
              </h3>
              <p className="text-muted-foreground">
                {error || 'Fund details not found'}
              </p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>);

  }
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="w-fit -ml-4 text-muted-foreground hover:text-foreground">
        
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {details.meta.scheme_name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="secondary">{details.meta.scheme_category}</Badge>
            <Badge variant="outline">{details.meta.scheme_type}</Badge>
            <span className="text-muted-foreground font-mono">
              Code: {details.meta.scheme_code}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="text-right">
            <div className="text-3xl font-bold">
              {formatCurrency(latestNav?.nav || 0)}
            </div>
            <div
              className={`text-sm font-medium ${absoluteReturn >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
              
              {absoluteReturn >= 0 ? '+' : ''}
              {absoluteReturn.toFixed(2)}% ({timeRange})
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              As of {latestNav?.dateStr}
            </div>
          </div>
          <Button
            onClick={handleWatchlistToggle}
            disabled={isAdding}
            variant={isInWatchlist ? 'secondary' : 'default'}
            className="w-full sm:w-auto">
            
            {isInWatchlist ?
            <>
                <Check className="mr-2 h-4 w-4" /> In Watchlist
              </> :

            <>
                <Plus className="mr-2 h-4 w-4" /> Add to Watchlist
              </>
            }
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <CardTitle>Net Asset Value (NAV)</CardTitle>
            <CardDescription>Historical performance over time</CardDescription>
          </div>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(v) => v && setTimeRange(v as TimeRange)}
            className="justify-start">
            
            <ToggleGroupItem value="1Y" aria-label="1 Year">
              1Y
            </ToggleGroupItem>
            <ToggleGroupItem value="3Y" aria-label="3 Years">
              3Y
            </ToggleGroupItem>
            <ToggleGroupItem value="5Y" aria-label="5 Years">
              5Y
            </ToggleGroupItem>
            <ToggleGroupItem value="ALL" aria-label="All Time">
              All
            </ToggleGroupItem>
          </ToggleGroup>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            {chartData.length > 0 ?
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 5
                }}>
                
                  <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)" />
                
                  <XAxis
                  dataKey="dateObj"
                  tickFormatter={(date) => format(date, 'MMM yy')}
                  minTickGap={50}
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false} />
                
                  <YAxis
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => `₹${val.toFixed(0)}`}
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={60} />
                
                  <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3 space-y-1">
                            <p className="text-sm font-medium">
                              {payload[0].payload.dateStr}
                            </p>
                            <p className="text-sm text-primary font-bold">
                              {formatCurrency(payload[0].value as number)}
                            </p>
                          </div>);

                    }
                    return null;
                  }} />
                
                  <Line
                  type="monotone"
                  dataKey="nav"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: 'var(--primary)'
                  }} />
                
                </LineChart>
              </ResponsiveContainer> :

            <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available for this time range
              </div>
            }
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fund Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Fund House</span>
              <span className="font-medium text-right">
                {details.meta.fund_house}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium text-right">
                {details.meta.scheme_category}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium text-right">
                {details.meta.scheme_type}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

}