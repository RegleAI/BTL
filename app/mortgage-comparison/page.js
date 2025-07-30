'use client'

import React, { useState, useEffect } from 'react';
import { BarChart3, Percent, PoundSterling, Calendar, Trophy, TrendingDown } from 'lucide-react';
import Navigation from '../../components/Navigation';

export default function MortgageComparison() {
  const [mortgages, setMortgages] = useState([
    {
      id: 1,
      name: 'Option 1',
      loanAmount: 315000,
      interestRate: 4.9,
      termYears: 25,
      arrangementFee: 4000,
      monthlyFee: 0,
      brokerFee: 0,
      legalFees: 800
    },
    {
      id: 2,
      name: 'Option 2',
      loanAmount: 315000,
      interestRate: 5.2,
      termYears: 25,
      arrangementFee: 2000,
      monthlyFee: 15,
      brokerFee: 2500,
      legalFees: 800
    },
    {
      id: 3,
      name: 'Option 3',
      loanAmount: 315000,
      interestRate: 4.7,
      termYears: 25,
      arrangementFee: 5999,
      monthlyFee: 0,
      brokerFee: 0,
      legalFees: 800
    }
  ]);

  const [calculations, setCalculations] = useState({});

  // Calculate mortgage details for each option
  useEffect(() => {
    const newCalculations = {};

    mortgages.forEach(mortgage => {
      const { loanAmount, interestRate, termYears, arrangementFee, monthlyFee, brokerFee, legalFees } = mortgage;
      
      // Monthly payment calculation using standard mortgage formula
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = termYears * 12;
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      // Total costs over the term
      const totalMonthlyPayments = monthlyPayment * numberOfPayments;
      const totalMonthlyFees = monthlyFee * numberOfPayments;
      const totalInterest = totalMonthlyPayments - loanAmount;
      const upfrontCosts = arrangementFee + brokerFee + legalFees;
      const totalCost = totalMonthlyPayments + totalMonthlyFees + upfrontCosts;
      
      // First year costs (useful for cash flow planning)
      const firstYearPayments = monthlyPayment * 12;
      const firstYearFees = monthlyFee * 12;
      const firstYearTotal = firstYearPayments + firstYearFees + upfrontCosts;
      
      // APR calculation (simplified - includes arrangement fee spread over term)
      const effectiveRate = ((totalCost - loanAmount) / loanAmount / termYears) * 100;

      newCalculations[mortgage.id] = {
        monthlyPayment: monthlyPayment.toFixed(2),
        totalMonthlyPayments: totalMonthlyPayments.toFixed(0),
        totalMonthlyFees: totalMonthlyFees.toFixed(0),
        totalInterest: totalInterest.toFixed(0),
        upfrontCosts: upfrontCosts.toFixed(0),
        totalCost: totalCost.toFixed(0),
        firstYearTotal: firstYearTotal.toFixed(0),
        effectiveRate: effectiveRate.toFixed(2)
      };
    });

    setCalculations(newCalculations);
  }, [mortgages]);

  // Find the cheapest option based on total cost
  const cheapestOption = mortgages.reduce((cheapest, current) => {
    const currentTotal = parseFloat(calculations[current.id]?.totalCost || 0);
    const cheapestTotal = parseFloat(calculations[cheapest.id]?.totalCost || Infinity);
    return currentTotal < cheapestTotal ? current : cheapest;
  }, mortgages[0]);

  const handleInputChange = (mortgageId, field, value) => {
    setMortgages(prev => prev.map(mortgage => 
      mortgage.id === mortgageId 
        ? { ...mortgage, [field]: parseFloat(value) || 0 }
        : mortgage
    ));
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

  const formatCurrencyDecimal = (amount) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Mortgage Comparison Calculator</h1>
            </div>
            
            {/* Input Section - Three Mortgage Options */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {mortgages.map((mortgage, index) => (
                <div key={mortgage.id} className={`rounded-lg p-6 space-y-4 ${
                  mortgage.id === cheapestOption.id 
                    ? 'bg-green-50 border-2 border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg text-gray-900">
                      {mortgage.name}
                    </h2>
                    {mortgage.id === cheapestOption.id && (
                      <div className="flex items-center gap-1 text-green-700">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm font-medium">Cheapest</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mortgage Name</label>
                    <input
                      type="text"
                      value={mortgage.name}
                      onChange={(e) => setMortgages(prev => prev.map(m => 
                        m.id === mortgage.id ? { ...m, name: e.target.value } : m
                      ))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={mortgage.loanAmount}
                        onChange={(e) => handleInputChange(mortgage.id, 'loanAmount', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate %</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        step="0.1"
                        value={mortgage.interestRate}
                        onChange={(e) => handleInputChange(mortgage.id, 'interestRate', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Term (Years)</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={mortgage.termYears}
                        onChange={(e) => handleInputChange(mortgage.id, 'termYears', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Arrangement Fee</label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={mortgage.arrangementFee}
                        onChange={(e) => handleInputChange(mortgage.id, 'arrangementFee', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fee</label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={mortgage.monthlyFee}
                        onChange={(e) => handleInputChange(mortgage.id, 'monthlyFee', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Broker Fee</label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={mortgage.brokerFee}
                        onChange={(e) => handleInputChange(mortgage.id, 'brokerFee', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Legal Fees</label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={mortgage.legalFees}
                        onChange={(e) => handleInputChange(mortgage.id, 'legalFees', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Results Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {mortgages.map((mortgage) => {
                const calc = calculations[mortgage.id] || {};
                const isWinner = mortgage.id === cheapestOption.id;
                
                return (
                  <div key={mortgage.id} className={`rounded-lg p-6 ${
                    isWinner 
                      ? 'bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-200' 
                      : 'bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-semibold text-lg ${isWinner ? 'text-green-900' : 'text-blue-900'}`}>
                        {mortgage.name}
                      </h3>
                      {isWinner && (
                        <div className="flex items-center gap-1 text-green-700">
                          <Trophy className="w-5 h-5" />
                          <span className="text-sm font-bold">WINNER</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Monthly Payment</span>
                        <span className="font-bold text-lg">{formatCurrencyDecimal(calc.monthlyPayment)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-700">Upfront Costs</span>
                        <span className="font-medium">{formatCurrency(calc.upfrontCosts)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-700">First Year Total</span>
                        <span className="font-medium">{formatCurrency(calc.firstYearTotal)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total Interest</span>
                        <span className="font-medium">{formatCurrency(calc.totalInterest)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-700">Effective Rate</span>
                        <span className="font-medium">{calc.effectiveRate}%</span>
                      </div>
                      
                      <div className="flex justify-between pt-2 border-t border-gray-300">
                        <span className="text-gray-700 font-semibold">Total Cost</span>
                        <span className={`font-bold text-xl ${isWinner ? 'text-green-900' : 'text-blue-900'}`}>
                          {formatCurrency(calc.totalCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Winner Summary */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-500 rounded-full p-2">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-900">Best Option: {cheapestOption.name}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-green-700 mb-1">Monthly Payment</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrencyDecimal(calculations[cheapestOption.id]?.monthlyPayment)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-700 mb-1">Total Cost Over Term</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(calculations[cheapestOption.id]?.totalCost)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-700 mb-1">Savings vs Most Expensive</p>
                  <p className="text-2xl font-bold text-green-900">
                    {(() => {
                      const maxCost = Math.max(...mortgages.map(m => parseFloat(calculations[m.id]?.totalCost || 0)));
                      const minCost = parseFloat(calculations[cheapestOption.id]?.totalCost || 0);
                      return formatCurrency(maxCost - minCost);
                    })()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Additional Metrics */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Mortgage</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Monthly Payment</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Upfront Costs</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Total Interest</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Total Cost</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mortgages.map((mortgage) => {
                      const calc = calculations[mortgage.id] || {};
                      const cheapestCost = parseFloat(calculations[cheapestOption.id]?.totalCost || 0);
                      const thisCost = parseFloat(calc.totalCost || 0);
                      const difference = thisCost - cheapestCost;
                      const isWinner = mortgage.id === cheapestOption.id;
                      
                      return (
                        <tr key={mortgage.id} className={isWinner ? 'bg-green-50' : ''}>
                          <td className="border border-gray-300 px-4 py-2 font-medium">
                            {mortgage.name}
                            {isWinner && <span className="ml-2 text-green-600">👑</span>}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                            {formatCurrencyDecimal(calc.monthlyPayment)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {formatCurrency(calc.upfrontCosts)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {formatCurrency(calc.totalInterest)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right font-bold">
                            {formatCurrency(calc.totalCost)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {difference === 0 ? (
                              <span className="text-green-600 font-medium">Best Option</span>
                            ) : (
                              <span className="text-red-600">+{formatCurrency(difference)}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
