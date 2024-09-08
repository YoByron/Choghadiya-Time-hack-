import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Compass, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LocationPickerProps {
  onClose: () => void;
  setLocation: (lat: number, lon: number) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onClose, setLocation }) => {
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleManualSubmit = () => {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError('Please enter valid latitude (-90 to 90) and longitude (-180 to 180)');
      return;
    }
    setLocation(lat, lon);
    toast({
      title: "Location Set",
      description: `Latitude: ${lat}, Longitude: ${lon}`,
    });
    onClose();
  };

  const handleAutoLocation = () => {
    setIsLoading(true);
    setError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude);
          setIsLoading(false);
          toast({
            title: "Location Set",
            description: "Using your current location",
          });
          onClose();
        },
        (err) => {
          setError('Failed to get location: ' + err.message);
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('Failed to search location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    setLocation(parseFloat(result.lat), parseFloat(result.lon));
    toast({
      title: "Location Set",
      description: result.display_name,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={handleAutoLocation} disabled={isLoading} className="w-full">
            <Compass className="mr-2 h-4 w-4" />
            {isLoading ? 'Getting location...' : 'Use Current Location'}
          </Button>
          <div className="text-center">or</div>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={isLoading} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
          {searchResults.length > 0 && (
            <div className="max-h-40 overflow-y-auto">
              {searchResults.map((result, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => handleSelectSearchResult(result)}
                >
                  {result.display_name}
                </Button>
              ))}
            </div>
          )}
          <div className="text-center">or</div>
          <Input
            type="text"
            placeholder="Latitude"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Longitude"
            value={manualLon}
            onChange={(e) => setManualLon(e.target.value)}
          />
          <Button onClick={handleManualSubmit} className="w-full">
            <MapPin className="mr-2 h-4 w-4" />
            Set Manual Location
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPicker;