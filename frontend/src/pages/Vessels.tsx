import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Ship } from 'lucide-react';

interface Vessel {
  id: number;
  name: string;
  imo_number?: string;
  vessel_type: string;
  flag_state: string;
  gross_tonnage?: number;
  length?: number;
  beam?: number;
  year_built?: number;
  is_active: boolean;
}

const Vessels: React.FC = () => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVessels = async () => {
      try {
        const vesselData = await apiClient.getVessels();
        setVessels(vesselData);
      } catch (error) {
        console.error('Failed to fetch vessels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVessels();
  }, []);

  if (loading) {
    return <div className="text-center">Loading vessels...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vessels</h1>
          <p className="text-gray-600">Manage your fleet of vessels</p>
        </div>
      </div>

      {vessels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Ship className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vessels found</h3>
            <p className="text-gray-500 text-center">
              Get started by adding your first vessel to the fleet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vessels.map((vessel) => (
            <Card key={vessel.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{vessel.name}</CardTitle>
                  <Badge variant={vessel.is_active ? 'default' : 'secondary'}>
                    {vessel.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Type:</span>
                    <p className="text-gray-600">{vessel.vessel_type}</p>
                  </div>
                  <div>
                    <span className="font-medium">Flag:</span>
                    <p className="text-gray-600">{vessel.flag_state}</p>
                  </div>
                  {vessel.imo_number && (
                    <div>
                      <span className="font-medium">IMO:</span>
                      <p className="text-gray-600">{vessel.imo_number}</p>
                    </div>
                  )}
                  {vessel.year_built && (
                    <div>
                      <span className="font-medium">Built:</span>
                      <p className="text-gray-600">{vessel.year_built}</p>
                    </div>
                  )}
                  {vessel.gross_tonnage && (
                    <div>
                      <span className="font-medium">GT:</span>
                      <p className="text-gray-600">{vessel.gross_tonnage.toLocaleString()}</p>
                    </div>
                  )}
                  {vessel.length && (
                    <div>
                      <span className="font-medium">Length:</span>
                      <p className="text-gray-600">{vessel.length}m</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vessels;
