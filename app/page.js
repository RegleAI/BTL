'use client'

import React, { useState, useEffect } from 'react';
import { Calculator, Home, TrendingUp, Percent, PoundSterling, Calendar } from 'lucide-react';

export default function BTLCalculator() {
  const [inputs, setInputs] = useState({
    purchasePrice: 420000,
    monthlyIncome: 3832.50,
    depositPercent: 25,
    mortgageRate: 4.9,
    mortgageYears: 5,
    managementFeePercent: 18,
    occupancyRate: 70,
    avgPricePerNight: 180,
    councilTax: 183.75,
    utilities: 150,
    renovationCost: 5000,
    legalBrokerFees: 2328,
    arrangementFee: 4000,
    country: 'england',
    propertyType: 'additional'
  });

  const [calculations, setCalculations] = useState({});

  // Calculate stamp duty based on country
  const calculateStampDuty = (price, country, propertyType) => {
    let stampDuty = 0;
    
    if (country === 'england') {
      // England Stamp Duty Land Tax rates (as of 2024/2025)
      if (propertyType === 'first') {
        // First-time buyer rates
        if (price <= 425000) {
          // No stamp duty on first £425,000
          stampDuty = 0;
        } else if (price <= 625000) {
          // 5% on portion from £425,001 to £625,000
          stampDuty = (price - 425000) * 0.05;
        } else {
          // First-time buyer relief not available above £625,000 - use standard rates
          const bands = [
            { limit: 250000, rate: 0 },
            { limit: 925000, rate: 0.05 },
            { limit: 1500000, rate: 0.10 },
            { limit: Infinity, rate: 0.12 }
          ];
          
          let previousLimit = 0;
          for (const band of bands) {
            if (price <= previousLimit) break;
            const taxableAmount = Math.min(price, band.limit) - previousLimit;
            stampDuty += taxableAmount * band.rate;
            previousLimit = band.limit;
          }
        }
      } else if (propertyType === 'next') {
        // Standard residential rates
        const bands = [
          { limit: 250000, rate: 0 },
          { limit: 925000, rate: 0.05 },
          { limit: 1500000, rate: 0.10 },
          { limit: Infinity, rate: 0.12 }
        ];
        
        let previousLimit = 0;
        for (const band of bands) {
          if (price <= previousLimit) break;
          const taxableAmount = Math.min(price, band.limit) - previousLimit;
          stampDuty += taxableAmount * band.rate;
          previousLimit = band.limit;
        }
      } else {
        // Additional property - 3% surcharge on top of standard rates
        const bands = [
          { limit: 250000, rate: 0.03 },
          { limit: 925000, rate: 0.08 },
          { limit: 1500000, rate: 0.13 },
          { limit: Infinity, rate: 0.15 }
        ];
        
        let previousLimit = 0;
        for (const band of bands) {
          if (price <= previousLimit) break;
          const taxableAmount = Math.min(price, band.limit) - previousLimit;
          stampDuty += taxableAmount * band.rate;
          previousLimit = band.limit;
        }
      }
    } else {
      // Wales Land Transaction Tax rates (as of 2024/2025)
      if (propertyType === 'first') {
        // First-time buyer rates in Wales
        const bands = [
          { limit: 225000, rate: 0 },
          { limit: 400000, rate: 0.06 },
          { limit: 750000, rate: 0.075 },
          { limit: 1500000, rate: 0.10 },
          { limit: Infinity, rate: 0.12 }
        ];
        
        let previousLimit = 0;
        for (const band of bands) {
          if (price <= previousLimit) break;
          const taxableAmount = Math.min(price, band.limit) - previousLimit;
          stampDuty += taxableAmount * band.rate;
          previousLimit = band.limit;
        }
      } else if (propertyType === 'next') {
        // Standard residential rates in Wales
        const bands = [
          { limit: 225000, rate: 0 },
          { limit: 400000, rate: 0.06 },
          { limit: 750000, rate: 0.075 },
          { limit: 1500000, rate: 0.10 },
          { limit: Infinity, rate: 0.12 }
        ];
        
        let previousLimit = 0;
        for (const band of bands) {
          if (price <= previousLimit) break;
          const taxableAmount = Math.min(price, band.limit) - previousLimit;
          stampDuty += taxableAmount * band.rate;
          previousLimit = band.limit;
        }
      } else {
        // Additional property in Wales - higher rates
        const bands = [
          { limit: 180000, rate: 0.04 },
          { limit: 250000, rate: 0.075 },
          { limit: 400000, rate: 0.09 },
          { limit: 750000, rate: 0.115 },
          { limit: 1500000, rate: 0.14 },
          { limit: Infinity, rate: 0.16 }
        ];
        
        let previousLimit = 0;
        for (const band of bands) {
          if (price <= previousLimit) break;
          const taxableAmount = Math.min(price, band.limit) - previousLimit;
          stampDuty += taxableAmount * band.rate;
          previousLimit = band.limit;
        }
      }
    }
    
    return stampDuty;
  };

  // Perform all calculations
  useEffect(() => {
    const {
      purchasePrice,
      monthlyIncome,
      depositPercent,
      mortgageRate,
      mortgageYears,
      managementFeePercent,
      occupancyRate,
      avgPricePerNight,
      councilTax,
      utilities,
      renovationCost,
      legalBrokerFees,
      arrangementFee,
      country,
      propertyType
    } = inputs;

    // Calculate derived values
    const daysOccupiedPerMonth = (365 * (occupancyRate / 100)) / 12;
    const monthlyIncomeAirbnb = daysOccupiedPerMonth * avgPricePerNight;
    const depositAmount = purchasePrice * (depositPercent / 100);
    const mortgageAmount = purchasePrice - depositAmount;
    const stampDuty = calculateStampDuty(purchasePrice, country, propertyType);
    
    // Total money in
    const totalMoneyIn = depositAmount + stampDuty + legalBrokerFees + renovationCost;
    
    // Monthly expenditure
    const monthlyMortgagePayment = (mortgageAmount * (mortgageRate / 100) / 12) + (arrangementFee / (mortgageYears * 12));
    const managementFees = (monthlyIncomeAirbnb * (managementFeePercent / 100)) + 300;
    const totalMonthlyExpenditure = monthlyMortgagePayment + managementFees + councilTax + utilities;
    
    // Profitability
    const monthlyProfit = monthlyIncomeAirbnb - totalMonthlyExpenditure;
    const annualProfit = monthlyProfit * 12;
    
    // Corporation tax calculation with UK thresholds (2025 rates)
    let corporationTax = 0;
    let effectiveTaxRate = 0;
    if (annualProfit > 0) {
      if (annualProfit <= 50000) {
        // Small profits rate: 19%
        corporationTax = annualProfit * 0.19;
        effectiveTaxRate = 19.0;
      } else if (annualProfit <= 250000) {
        // Marginal relief zone: gradual increase from 19% to 25%
        // Standard calculation: 25% with marginal relief deduction
        const standardTax = annualProfit * 0.25;
        const marginalRelief = (250000 - annualProfit) * (3/200); // 3/200 = 0.015 marginal relief fraction
        corporationTax = standardTax - marginalRelief;
        effectiveTaxRate = (corporationTax / annualProfit) * 100;
      } else {
        // Main rate: 25%
        corporationTax = annualProfit * 0.25;
        effectiveTaxRate = 25.0;
      }
    }
    const netAnnualProfit = annualProfit - corporationTax;
    
    // ROI (using net annual profit after corporation tax)
    const roi = (netAnnualProfit / totalMoneyIn) * 100;
    
    // Mortgage stress test (5.5% rate)
    const stressTestRate = 5.5;
    const stressTestMonthlyPayment = (mortgageAmount * (stressTestRate / 100) / 12);
    const minRequiredRent = stressTestMonthlyPayment * 1.25;

    setCalculations({
      daysOccupiedPerMonth: daysOccupiedPerMonth.toFixed(1),
      monthlyIncomeAirbnb: monthlyIncomeAirbnb.toFixed(2),
      depositAmount,
      mortgageAmount,
      stampDuty: stampDuty.toFixed(0),
      totalMoneyIn: totalMoneyIn.toFixed(0),
      monthlyMortgagePayment: monthlyMortgagePayment.toFixed(2),
      managementFees: managementFees.toFixed(2),
      totalMonthlyExpenditure: totalMonthlyExpenditure.toFixed(2),
      monthlyProfit: monthlyProfit.toFixed(2),
      annualProfit: annualProfit.toFixed(2),
      corporationTax: corporationTax.toFixed(2),
      effectiveTaxRate: effectiveTaxRate.toFixed(1),
      netAnnualProfit: netAnnualProfit.toFixed(2),
      roi: roi.toFixed(2),
      minRequiredRent: minRequiredRent.toFixed(2),
      passesStressTest: monthlyIncomeAirbnb >= minRequiredRent
    });
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const formatCurrency = (amount) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-8">
            <Home className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Buy-to-Let Property Viability Calculator</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Property Details */}
            <div className="bg-blue-50 rounded-lg p-6 space-y-4">
              <h2 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Property Details
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={inputs.purchasePrice}
                    onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deposit %</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={inputs.depositPercent}
                    onChange={(e) => handleInputChange('depositPercent', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={inputs.country}
                  onChange={(e) => setInputs(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="england">England</option>
                  <option value="wales">Wales</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  value={inputs.propertyType}
                  onChange={(e) => setInputs(prev => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="first">First Home</option>
                  <option value="next">Next Home (Main Residence)</option>
                  <option value="additional">Additional Property / BTL</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Renovation & Furniture</label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={inputs.renovationCost}
                    onChange={(e) => handleInputChange('renovationCost', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Legal & Broker Fees</label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={inputs.legalBrokerFees}
                    onChange={(e) => handleInputChange('legalBrokerFees', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Mortgage Details */}
            <div className="bg-green-50 rounded-lg p-6 space-y-4">
              <h2 className="font-semibold text-lg text-green-900 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Mortgage Details
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate %</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.mortgageRate}
                    onChange={(e) => handleInputChange('mortgageRate', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mortgage Term (Years)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={inputs.mortgageYears}
                    onChange={(e) => handleInputChange('mortgageYears', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arrangement Fee</label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={inputs.arrangementFee}
                    onChange={(e) => handleInputChange('arrangementFee', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Rental Income */}
            <div className="bg-purple-50 rounded-lg p-6 space-y-4">
              <h2 className="font-semibold text-lg text-purple-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Rental Income (Airbnb)
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Average Price per Night</label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={inputs.avgPricePerNight}
                    onChange={(e) => handleInputChange('avgPricePerNight', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupancy Rate %</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={inputs.occupancyRate}
                    onChange={(e) => handleInputChange('occupancyRate', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Management Fee %</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={inputs.managementFeePercent}
                    onChange={(e) => handleInputChange('managementFeePercent', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Council Tax/Business Rates</label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={inputs.councilTax}
                    onChange={(e) => handleInputChange('councilTax', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Utilities & Insurance</label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={inputs.utilities}
                    onChange={(e) => handleInputChange('utilities', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Initial Investment */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg text-blue-900 mb-4">Initial Investment</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Deposit</span>
                  <span className="font-medium">{formatCurrency(calculations.depositAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Stamp Duty</span>
                  <span className="font-medium">{formatCurrency(calculations.stampDuty)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Legal & Broker</span>
                  <span className="font-medium">{formatCurrency(inputs.legalBrokerFees)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Renovation</span>
                  <span className="font-medium">{formatCurrency(inputs.renovationCost)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-200">
                  <span className="text-gray-700 font-semibold">Total Investment</span>
                  <span className="font-bold text-blue-900">{formatCurrency(calculations.totalMoneyIn)}</span>
                </div>
              </div>
            </div>
            
            {/* Monthly Cash Flow */}
            <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg text-green-900 mb-4">Monthly Cash Flow</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Rental Income</span>
                  <span className="font-medium text-green-700">+{formatCurrency(calculations.monthlyIncomeAirbnb)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Mortgage</span>
                  <span className="font-medium text-red-700">-{formatCurrency(calculations.monthlyMortgagePayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Management</span>
                  <span className="font-medium text-red-700">-{formatCurrency(calculations.managementFees)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Council Tax</span>
                  <span className="font-medium text-red-700">-{formatCurrency(inputs.councilTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Utilities</span>
                  <span className="font-medium text-red-700">-{formatCurrency(inputs.utilities)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-green-200">
                  <span className="text-gray-700 font-semibold">Monthly Profit</span>
                  <span className={`font-bold ${parseFloat(calculations.monthlyProfit) >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                    {formatCurrency(calculations.monthlyProfit)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Annual Returns */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg text-purple-900 mb-4">Annual Returns</h3>
              <div className="space-y-2">
                <div className="flex justify-between pt-2 border-b border-purple-200 pb-2">
                  <span className="text-gray-700 font-semibold">Annual Profit</span>
                  <span className={`font-bold ${parseFloat(calculations.annualProfit) >= 0 ? 'text-purple-900' : 'text-red-900'}`}>
                    {formatCurrency(calculations.annualProfit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Corporation Tax ({calculations.effectiveTaxRate}%)</span>
                  <span className="font-medium text-red-700">-{formatCurrency(calculations.corporationTax)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-purple-200">
                  <span className="text-gray-700 font-semibold">Net Annual Profit</span>
                  <span className="font-bold text-purple-900">{formatCurrency(calculations.netAnnualProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-semibold">ROI</span>
                  <span className={`font-bold text-2xl ${parseFloat(calculations.roi) >= 0 ? 'text-purple-900' : 'text-red-900'}`}>
                    {calculations.roi}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mortgage Stress Test */}
          <div className="mt-6 bg-orange-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg text-orange-900 mb-2">Mortgage Stress Test (5.5%)</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700">Minimum Required Rent: {formatCurrency(calculations.minRequiredRent)}/month</p>
              </div>
              <div className={`text-2xl font-bold ${calculations.passesStressTest ? 'text-green-600' : 'text-red-600'}`}>
                {calculations.passesStressTest ? '✅ PASS' : '❌ FAIL'}
              </div>
            </div>
          </div>
          
          {/* Stamp Duty Breakdown */}
          <div className="mt-6 bg-indigo-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg text-indigo-900 mb-2">
              {inputs.country === 'england' ? 'Stamp Duty Land Tax' : 'Land Transaction Tax'} Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Property Type</p>
                <p className="font-medium">
                  {inputs.propertyType === 'first' ? 'First Home Buyer' : 
                   inputs.propertyType === 'next' ? 'Next Home (Main Residence)' : 
                   'Additional Property / Buy-to-Let'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tax Region</p>
                <p className="font-medium">{inputs.country === 'england' ? 'England' : 'Wales'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Purchase Price</p>
                <p className="font-medium">{formatCurrency(inputs.purchasePrice)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Tax Due</p>
                <p className="font-bold text-indigo-900 text-xl">{formatCurrency(calculations.stampDuty)}</p>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              {inputs.propertyType === 'additional' && (
                <p>* Includes {inputs.country === 'england' ? '3%' : 'higher rate'} surcharge for additional properties</p>
              )}
              {inputs.propertyType === 'first' && inputs.country === 'england' && inputs.purchasePrice > 625000 && (
                <p>* First-time buyer relief not available above £625,000</p>
              )}
            </div>
          </div>
          
          {/* Additional Metrics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Days Occupied/Month</p>
              <p className="text-2xl font-bold text-gray-900">{calculations.daysOccupiedPerMonth}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Mortgage Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculations.mortgageAmount)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Monthly Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculations.totalMonthlyExpenditure)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Break Even (Years)</p>
              <p className="text-2xl font-bold text-gray-900">
                {parseFloat(calculations.annualProfit) > 0 ? (parseFloat(calculations.totalMoneyIn) / parseFloat(calculations.annualProfit)).toFixed(1) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
