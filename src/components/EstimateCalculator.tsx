import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, FileText, DollarSign, Truck, Users, Fuel } from 'lucide-react';

// Virginia Business Configuration
const BUSINESS_CONFIG = {
  address: "337 Ayers Orchard Road, Stuart, VA 24171",
  employees: { fullTime: 2, partTime: 1, hourlyWage: 12 },
  blendedLaborRate: 45, // Including taxes, benefits, overhead
  supplier: "SealMaster, 703 West Decatur Street, Madison, NC 27025"
};

// Material Costs (Virginia 2025)
const MATERIAL_COSTS = {
  sealMasterPMM: 3.79, // per gallon
  sand50lb: 10.00, // per bag
  prepSeal5gal: 50.00, // per bucket
  fastDry5gal: 50.00, // per bucket
  crackMaster30lb: 44.95 // per box
};

// Application Rates & Coverage
const APPLICATION_RATES = {
  sealcoat: {
    firstCoat: 0.0144, // gal/sq ft
    additionalCoats: 0.0111 // gal/sq ft
  },
  sandMixRatio: 300, // lbs per 100 gallons (6 bags)
  waterRatio: 0.20, // 20% by volume
  crackFilling: { min: 0.50, max: 3.00 }, // per linear foot
  lineStriping: { min: 0.75, max: 1.00 }, // per linear foot
  patchingHotMix: { min: 2.00, max: 5.00 }, // per sq ft
  patchingColdMix: { min: 2.00, max: 4.00 } // per sq ft
};

interface EstimateData {
  projectType: string;
  squareFootage: number;
  linearFootage: number;
  numberOfCoats: number;
  crackSeverity: string;
  oilSpotArea: number;
  parkingStalls: number;
  clientName: string;
  jobSiteAddress: string;
  travelDistance: number;
  profitMargin: number;
  additionalNotes: string;
}

const EstimateCalculator = () => {
  const [estimateData, setEstimateData] = useState<EstimateData>({
    projectType: '',
    squareFootage: 0,
    linearFootage: 0,
    numberOfCoats: 1,
    crackSeverity: 'light',
    oilSpotArea: 0,
    parkingStalls: 0,
    clientName: '',
    jobSiteAddress: '',
    travelDistance: 0,
    profitMargin: 20,
    additionalNotes: ''
  });

  const [calculatedEstimate, setCalculatedEstimate] = useState<any>(null);

  const calculateMaterials = useCallback(() => {
    const { squareFootage, numberOfCoats, linearFootage, oilSpotArea, crackSeverity } = estimateData;
    
    let materials = {
      sealMasterPMM: 0,
      sand: 0,
      water: 0,
      prepSeal: 0,
      fastDry: 0,
      crackMaster: 0,
      totalMaterialCost: 0
    };

    // Sealcoating calculations
    if (squareFootage > 0) {
      // First coat
      const firstCoatGallons = squareFootage * APPLICATION_RATES.sealcoat.firstCoat;
      let totalPMM = firstCoatGallons;
      
      // Additional coats
      if (numberOfCoats > 1) {
        const additionalCoatsGallons = squareFootage * APPLICATION_RATES.sealcoat.additionalCoats * (numberOfCoats - 1);
        totalPMM += additionalCoatsGallons;
      }

      materials.sealMasterPMM = totalPMM;
      materials.sand = (totalPMM / 100) * APPLICATION_RATES.sandMixRatio; // lbs
      materials.water = totalPMM * APPLICATION_RATES.waterRatio;
      
      // Fast Dry additive (2 gal per 125 gal of concentrate)
      materials.fastDry = (totalPMM / 125) * 2;
    }

    // Oil spot primer
    if (oilSpotArea > 0) {
      materials.prepSeal = Math.ceil(oilSpotArea / 175); // 175 sq ft per gallon average
    }

    // Crack filling
    if (linearFootage > 0) {
      const crackMultiplier = crackSeverity === 'severe' ? 1.5 : crackSeverity === 'moderate' ? 1.2 : 1.0;
      materials.crackMaster = Math.ceil((linearFootage * crackMultiplier) / 100); // boxes needed
    }

    // Calculate costs
    const costs = {
      sealMasterPMM: materials.sealMasterPMM * MATERIAL_COSTS.sealMasterPMM,
      sand: Math.ceil(materials.sand / 50) * MATERIAL_COSTS.sand50lb, // convert lbs to bags
      prepSeal: materials.prepSeal * MATERIAL_COSTS.prepSeal5gal,
      fastDry: Math.ceil(materials.fastDry / 5) * MATERIAL_COSTS.fastDry5gal, // 5-gal buckets
      crackMaster: materials.crackMaster * MATERIAL_COSTS.crackMaster30lb
    };

    materials.totalMaterialCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);

    return { materials, costs };
  }, [estimateData]);

  const calculateLaborAndEquipment = useCallback(() => {
    const { squareFootage, linearFootage, travelDistance } = estimateData;
    
    // Labor calculations
    let laborHours = 0;
    
    // Sealcoating labor (including prep and cleanup)
    if (squareFootage > 0) {
      laborHours += (squareFootage / 1000) * 2; // 2 hours per 1000 sq ft
    }
    
    // Crack filling labor
    if (linearFootage > 0) {
      laborHours += linearFootage / 100; // 1 hour per 100 linear feet
    }
    
    // Minimum 4-hour job
    laborHours = Math.max(laborHours, 4);
    
    const laborCost = laborHours * BUSINESS_CONFIG.blendedLaborRate * 3; // 3-person crew

    // Equipment and fuel
    const equipmentHours = laborHours;
    const equipmentCost = equipmentHours * 50; // $50/hour for equipment operation
    
    // Travel costs
    const roundTripMiles = travelDistance * 2;
    const fuelCost = (roundTripMiles / 15) * 4.50; // 15 MPG, $4.50/gallon
    
    return {
      laborHours,
      laborCost,
      equipmentCost,
      fuelCost,
      totalLabor: laborCost + equipmentCost + fuelCost
    };
  }, [estimateData]);

  const generateEstimate = () => {
    const { materials, costs } = calculateMaterials();
    const labor = calculateLaborAndEquipment();
    
    const subtotal = materials.totalMaterialCost + labor.totalLabor;
    const overhead = subtotal * 0.15; // 15% overhead
    const profit = subtotal * (estimateData.profitMargin / 100);
    const total = subtotal + overhead + profit;

    const estimate = {
      materials,
      costs,
      labor,
      subtotal,
      overhead,
      profit,
      total,
      timestamp: new Date().toISOString()
    };

    setCalculatedEstimate(estimate);
  };

  const handleInputChange = (field: keyof EstimateData, value: any) => {
    setEstimateData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border shadow-industrial">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Professional Estimate Calculator
          </CardTitle>
          <p className="text-muted-foreground">
            Generate accurate estimates for asphalt services based on Virginia pricing and industry standards
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-type">Project Type</Label>
              <Select value={estimateData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sealcoating">Sealcoating</SelectItem>
                  <SelectItem value="crack-filling">Crack Filling</SelectItem>
                  <SelectItem value="patching">Asphalt Patching</SelectItem>
                  <SelectItem value="line-striping">Line Striping</SelectItem>
                  <SelectItem value="combination">Combination Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                value={estimateData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Enter client name"
              />
            </div>
          </div>

          {/* Area Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="square-footage">Square Footage</Label>
              <Input
                id="square-footage"
                type="number"
                value={estimateData.squareFootage || ''}
                onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linear-footage">Linear Footage (Cracks)</Label>
              <Input
                id="linear-footage"
                type="number"
                value={estimateData.linearFootage || ''}
                onChange={(e) => handleInputChange('linearFootage', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coats">Number of Coats</Label>
              <Select value={estimateData.numberOfCoats.toString()} onValueChange={(value) => handleInputChange('numberOfCoats', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Coat</SelectItem>
                  <SelectItem value="2">2 Coats</SelectItem>
                  <SelectItem value="3">3 Coats</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="crack-severity">Crack Severity</Label>
              <Select value={estimateData.crackSeverity} onValueChange={(value) => handleInputChange('crackSeverity', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Cracking</SelectItem>
                  <SelectItem value="moderate">Moderate Cracking</SelectItem>
                  <SelectItem value="severe">Severe Cracking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="oil-spots">Oil Spot Area (sq ft)</Label>
              <Input
                id="oil-spots"
                type="number"
                value={estimateData.oilSpotArea || ''}
                onChange={(e) => handleInputChange('oilSpotArea', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Location and Distance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job-site">Job Site Address</Label>
              <Input
                id="job-site"
                value={estimateData.jobSiteAddress}
                onChange={(e) => handleInputChange('jobSiteAddress', e.target.value)}
                placeholder="Enter job site address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="travel-distance">Travel Distance (miles)</Label>
              <Input
                id="travel-distance"
                type="number"
                value={estimateData.travelDistance || ''}
                onChange={(e) => handleInputChange('travelDistance', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Profit Margin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profit-margin">Profit Margin (%)</Label>
              <Input
                id="profit-margin"
                type="number"
                value={estimateData.profitMargin}
                onChange={(e) => handleInputChange('profitMargin', parseInt(e.target.value) || 20)}
                placeholder="20"
                min="0"
                max="50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parking-stalls">Parking Stalls (if applicable)</Label>
              <Input
                id="parking-stalls"
                type="number"
                value={estimateData.parkingStalls || ''}
                onChange={(e) => handleInputChange('parkingStalls', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={estimateData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Special requirements, conditions, or notes..."
              rows={3}
            />
          </div>

          <Button 
            onClick={generateEstimate} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Generate Professional Estimate
          </Button>
        </CardContent>
      </Card>

      {/* Estimate Results */}
      {calculatedEstimate && (
        <Card className="bg-card border-border shadow-industrial">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              Professional Estimate Results
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary">
                {estimateData.clientName || 'Client'}
              </Badge>
              <Badge variant="secondary">
                {new Date(calculatedEstimate.timestamp).toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Materials Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Materials & Supplies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calculatedEstimate.materials.sealMasterPMM > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">SealMaster PMM ({calculatedEstimate.materials.sealMasterPMM.toFixed(1)} gal)</span>
                    <span className="font-medium">${calculatedEstimate.costs.sealMasterPMM.toFixed(2)}</span>
                  </div>
                )}
                {calculatedEstimate.materials.sand > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sand ({Math.ceil(calculatedEstimate.materials.sand / 50)} bags)</span>
                    <span className="font-medium">${calculatedEstimate.costs.sand.toFixed(2)}</span>
                  </div>
                )}
                {calculatedEstimate.costs.prepSeal > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Prep Seal ({calculatedEstimate.materials.prepSeal} buckets)</span>
                    <span className="font-medium">${calculatedEstimate.costs.prepSeal.toFixed(2)}</span>
                  </div>
                )}
                {calculatedEstimate.costs.fastDry > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Fast Dry ({Math.ceil(calculatedEstimate.materials.fastDry / 5)} buckets)</span>
                    <span className="font-medium">${calculatedEstimate.costs.fastDry.toFixed(2)}</span>
                  </div>
                )}
                {calculatedEstimate.costs.crackMaster > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">CrackMaster ({calculatedEstimate.materials.crackMaster} boxes)</span>
                    <span className="font-medium">${calculatedEstimate.costs.crackMaster.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between items-center font-semibold">
                <span>Total Materials:</span>
                <span className="text-primary">${calculatedEstimate.materials.totalMaterialCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Labor & Equipment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Labor & Equipment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Labor ({calculatedEstimate.labor.laborHours.toFixed(1)} hrs @ 3-person crew)</span>
                  <span className="font-medium">${calculatedEstimate.labor.laborCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Equipment Operation</span>
                  <span className="font-medium">${calculatedEstimate.labor.equipmentCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Fuel & Travel ({estimateData.travelDistance * 2} miles)</span>
                  <span className="font-medium">${calculatedEstimate.labor.fuelCost.toFixed(2)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-semibold">
                <span>Total Labor & Equipment:</span>
                <span className="text-primary">${calculatedEstimate.labor.totalLabor.toFixed(2)}</span>
              </div>
            </div>

            {/* Final Totals */}
            <div className="space-y-4 bg-secondary/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Estimate Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${calculatedEstimate.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Overhead (15%):</span>
                  <span className="font-medium">${calculatedEstimate.overhead.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Profit ({estimateData.profitMargin}%):</span>
                  <span className="font-medium">${calculatedEstimate.profit.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-foreground">Total Estimate:</span>
                  <span className="text-primary">${calculatedEstimate.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Business Information</h4>
              <p className="text-sm text-muted-foreground mb-1">{BUSINESS_CONFIG.address}</p>
              <p className="text-sm text-muted-foreground mb-1">Materials sourced from: {BUSINESS_CONFIG.supplier}</p>
              <p className="text-sm text-muted-foreground">Estimate valid for 30 days. Subject to site inspection.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EstimateCalculator;