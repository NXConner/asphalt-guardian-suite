import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Truck, MapPin, Fuel, Clock, AlertTriangle, CheckCircle, Plus, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FleetAsset {
  id: string;
  name: string;
  type: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  license_plate: string;
  registration_expiry: string;
  image_url: string;
  registration_card_url: string;
  created_at: string;
}

interface VehicleDetail {
  id: string;
  vehicle_id: string;
  vin: string;
  license_plate: string;
  registration_expiry: string;
  insurance_expiry: string;
  oil_capacity_quarts: number;
  last_oil_change_date: string;
  last_oil_change_mileage: number;
  next_oil_change_due_mileage: number;
  oil_change_interval_miles: number;
  tire_pressure_front: number;
  tire_pressure_rear: number;
  oil_type: string;
  engine_type: string;
  insurance_company: string;
  insurance_policy_number: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  last_seen: string;
  user_id: string;
  vehicle_id: string;
  metadata: any;
}

const FleetTracking = () => {
  const [fleetAssets, setFleetAssets] = useState<FleetAsset[]>([]);
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetail[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetAsset | null>(null);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: 'truck',
    make: '',
    model: '',
    year: 2024,
    vin: '',
    license_plate: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFleetAssets();
    fetchDevices();
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      fetchVehicleDetails(selectedVehicle.id);
    }
  }, [selectedVehicle]);

  const fetchFleetAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('fleet_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFleetAssets(data || []);
    } catch (error) {
      console.error('Error fetching fleet assets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch fleet assets",
        variant: "destructive",
      });
    }
  };

  const fetchVehicleDetails = async (vehicleId: string) => {
    try {
      const { data, error } = await supabase
        .from('vehicle_details')
        .select('*')
        .eq('vehicle_id', vehicleId);

      if (error) throw error;
      setVehicleDetails(data || []);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    }
  };

  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('last_seen', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const addFleetAsset = async () => {
    try {
      const { data, error } = await supabase
        .from('fleet_assets')
        .insert([newVehicle])
        .select()
        .single();

      if (error) throw error;

      setFleetAssets(prev => [data, ...prev]);
      setIsAddingVehicle(false);
      setNewVehicle({
        name: '',
        type: 'truck',
        make: '',
        model: '',
        year: 2024,
        vin: '',
        license_plate: ''
      });

      toast({
        title: "Success",
        description: "Vehicle added to fleet successfully",
      });
    } catch (error) {
      console.error('Error adding fleet asset:', error);
      toast({
        title: "Error",
        description: "Failed to add vehicle to fleet",
        variant: "destructive",
      });
    }
  };

  const getVehicleStatusColor = (vehicle: FleetAsset) => {
    const device = devices.find(d => d.vehicle_id === vehicle.id);
    if (!device) return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    
    const lastSeen = new Date(device.last_seen);
    const hoursSinceLastSeen = (Date.now() - lastSeen.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastSeen < 1) return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (hoursSinceLastSeen < 24) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  const getVehicleStatus = (vehicle: FleetAsset) => {
    const device = devices.find(d => d.vehicle_id === vehicle.id);
    if (!device) return 'Offline';
    
    const lastSeen = new Date(device.last_seen);
    const hoursSinceLastSeen = (Date.now() - lastSeen.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastSeen < 1) return 'Active';
    if (hoursSinceLastSeen < 24) return 'Idle';
    return 'Offline';
  };

  const isMaintenanceDue = (details: VehicleDetail) => {
    if (!details.next_oil_change_due_mileage) return false;
    // For demo purposes, assume current mileage is 10% higher than last service
    const estimatedCurrentMileage = details.last_oil_change_mileage * 1.1;
    return estimatedCurrentMileage >= details.next_oil_change_due_mileage;
  };

  const isRegistrationExpiring = (vehicle: FleetAsset) => {
    if (!vehicle.registration_expiry) return false;
    const expiryDate = new Date(vehicle.registration_expiry);
    const daysUntilExpiry = (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 30; // Warning if expiring within 30 days
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Fleet Management</h2>
          <p className="text-muted-foreground">Track and manage your asphalt equipment and vehicles</p>
        </div>
        <Button 
          onClick={() => setIsAddingVehicle(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Fleet Overview</TabsTrigger>
          <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Fleet Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Vehicles</p>
                    <p className="text-2xl font-bold text-foreground">{fleetAssets.length}</p>
                  </div>
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Vehicles</p>
                    <p className="text-2xl font-bold text-foreground">
                      {fleetAssets.filter(v => getVehicleStatus(v) === 'Active').length}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Maintenance Due</p>
                    <p className="text-2xl font-bold text-foreground">
                      {vehicleDetails.filter(d => isMaintenanceDue(d)).length}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-yellow-500/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">GPS Devices</p>
                    <p className="text-2xl font-bold text-foreground">{devices.length}</p>
                  </div>
                  <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fleet Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fleetAssets.map((vehicle) => (
              <Card 
                key={vehicle.id} 
                className="bg-card border-border shadow-industrial hover:shadow-glow transition-shadow cursor-pointer"
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">{vehicle.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{vehicle.make} {vehicle.model} {vehicle.year}</p>
                    </div>
                    <Badge className={getVehicleStatusColor(vehicle)}>
                      {getVehicleStatus(vehicle)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{vehicle.type}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">License:</span>
                    <span className="font-medium">{vehicle.license_plate}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Registration:</span>
                    <span className={`font-medium ${isRegistrationExpiring(vehicle) ? 'text-yellow-400' : ''}`}>
                      {vehicle.registration_expiry ? new Date(vehicle.registration_expiry).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>

                  {isRegistrationExpiring(vehicle) && (
                    <div className="flex items-center gap-2 text-sm text-yellow-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Registration expiring soon</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <span className="text-xs text-muted-foreground">VIN: {vehicle.vin}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card className="bg-card border-border shadow-industrial">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Live Vehicle Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devices.map((device) => {
                  const vehicle = fleetAssets.find(v => v.id === device.vehicle_id);
                  if (!vehicle) return null;

                  const lastSeen = new Date(device.last_seen);
                  const hoursAgo = Math.floor((Date.now() - lastSeen.getTime()) / (1000 * 60 * 60));
                  
                  return (
                    <div key={device.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`h-3 w-3 rounded-full ${device.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                        <div>
                          <h4 className="font-semibold text-foreground">{vehicle.name}</h4>
                          <p className="text-sm text-muted-foreground">{device.name} - {device.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getVehicleStatusColor(vehicle)}>
                          {getVehicleStatus(vehicle)}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last seen: {hoursAgo === 0 ? 'Now' : `${hoursAgo}h ago`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card className="bg-card border-border shadow-industrial">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Maintenance Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicleDetails.map((detail) => {
                  const vehicle = fleetAssets.find(v => v.id === detail.vehicle_id);
                  if (!vehicle) return null;

                  const maintenanceDue = isMaintenanceDue(detail);
                  
                  return (
                    <div key={detail.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{vehicle.name}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Last Oil Change</p>
                            <p className="font-medium">
                              {detail.last_oil_change_date ? new Date(detail.last_oil_change_date).toLocaleDateString() : 'Not recorded'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Mileage</p>
                            <p className="font-medium">{detail.last_oil_change_mileage?.toLocaleString() || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Next Service Due</p>
                            <p className="font-medium">{detail.next_oil_change_due_mileage?.toLocaleString() || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Oil Type</p>
                            <p className="font-medium">{detail.oil_type || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={maintenanceDue ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}>
                          {maintenanceDue ? 'Service Due' : 'Up to Date'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                
                {vehicleDetails.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No maintenance records found. Add vehicle details to track maintenance schedules.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card className="bg-card border-border shadow-industrial">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Compliance & Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fleetAssets.map((vehicle) => {
                  const registrationExpiring = isRegistrationExpiring(vehicle);
                  const detail = vehicleDetails.find(d => d.vehicle_id === vehicle.id);
                  
                  return (
                    <div key={vehicle.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{vehicle.name}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Registration Expiry</p>
                            <p className={`font-medium ${registrationExpiring ? 'text-yellow-400' : ''}`}>
                              {vehicle.registration_expiry ? new Date(vehicle.registration_expiry).toLocaleDateString() : 'Not set'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Insurance Expiry</p>
                            <p className="font-medium">
                              {detail?.insurance_expiry ? new Date(detail.insurance_expiry).toLocaleDateString() : 'Not set'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Insurance Company</p>
                            <p className="font-medium">{detail?.insurance_company || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={registrationExpiring ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}>
                          {registrationExpiring ? 'Action Required' : 'Compliant'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Vehicle Modal */}
      {isAddingVehicle && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-card border-border shadow-industrial">
            <CardHeader>
              <CardTitle className="text-foreground">Add New Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-name">Vehicle Name</Label>
                  <Input
                    id="vehicle-name"
                    value={newVehicle.name}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Truck #1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle-type">Vehicle Type</Label>
                  <Select value={newVehicle.type} onValueChange={(value) => setNewVehicle(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="trailer">Trailer</SelectItem>
                      <SelectItem value="paver">Paver</SelectItem>
                      <SelectItem value="roller">Roller</SelectItem>
                      <SelectItem value="sealcoat_tank">Sealcoat Tank</SelectItem>
                      <SelectItem value="other">Other Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, make: e.target.value }))}
                    placeholder="e.g., Chevrolet"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="e.g., Silverado"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, year: parseInt(e.target.value) || 2024 }))}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN</Label>
                  <Input
                    id="vin"
                    value={newVehicle.vin}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, vin: e.target.value }))}
                    placeholder="Vehicle Identification Number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license-plate">License Plate</Label>
                  <Input
                    id="license-plate"
                    value={newVehicle.license_plate}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, license_plate: e.target.value }))}
                    placeholder="ABC-1234"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setIsAddingVehicle(false)}>
                  Cancel
                </Button>
                <Button onClick={addFleetAsset} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Add Vehicle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FleetTracking;