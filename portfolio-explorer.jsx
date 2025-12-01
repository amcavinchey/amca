import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell, ComposedChart, Area, ReferenceLine } from 'recharts';

const formatCurrency = (val) => `€${val?.toLocaleString() ?? 0}`;
const formatPercent = (val) => `${(val * 100).toFixed(1)}%`;

export default function PortfolioExplorer() {
  // Global Assumptions
  const [costPerHour, setCostPerHour] = useState(100);
  const [workingWeeksPerYear, setWorkingWeeksPerYear] = useState(46);
  const [workingHoursPerWeek, setWorkingHoursPerWeek] = useState(25);
  const [targetProfit, setTargetProfit] = useState(140000);
  
  // AI Model Assumptions
  const [buildPricePerWorkflow, setBuildPricePerWorkflow] = useState(15000);
  const [depositPerWorkflow, setDepositPerWorkflow] = useState(2000);
  const [buildHoursPerWorkflow, setBuildHoursPerWorkflow] = useState(80);
  const [maintenanceRetainer1WF, setMaintenanceRetainer1WF] = useState(3000);
  const [maintenanceRetainer2WF, setMaintenanceRetainer2WF] = useState(5000);
  const [maintenanceRetainer3WF, setMaintenanceRetainer3WF] = useState(7500);
  const [maintenanceHoursPerMonth, setMaintenanceHoursPerMonth] = useState(6);
  const [engagementLengthMonths, setEngagementLengthMonths] = useState(12);
  const [buildPhaseMonths, setBuildPhaseMonths] = useState(2);
  
  // NP Model Assumptions
  const [foundationPrice, setFoundationPrice] = useState(12000);
  const [growthPrice, setGrowthPrice] = useState(15000);
  const [partnershipPrice, setPartnershipPrice] = useState(18000);
  const [hoursPerNPClient, setHoursPerNPClient] = useState(67);
  
  // NP Detailed Hour Breakdown (per client per year)
  const [npHoursOnboarding, setNpHoursOnboarding] = useState(12);
  const [npHoursSetup, setNpHoursSetup] = useState(8);
  const [npHoursTraining, setNpHoursTraining] = useState(6);
  const [npHoursMonthlySupport, setNpHoursMonthlySupport] = useState(3);
  const [npHoursQuarterlyReview, setNpHoursQuarterlyReview] = useState(2);
  const [npHoursAnnualPlanning, setNpHoursAnnualPlanning] = useState(3);
  
  // AI Detailed Hour Breakdown
  const [aiHoursDiscovery, setAiHoursDiscovery] = useState(8);
  const [aiHoursDesign, setAiHoursDesign] = useState(16);
  const [aiHoursBuild, setAiHoursBuild] = useState(40);
  const [aiHoursTesting, setAiHoursTesting] = useState(10);
  const [aiHoursDocumentation, setAiHoursDocumentation] = useState(6);
  const [aiHoursMaintenanceMonthly, setAiHoursMaintenanceMonthly] = useState(6);
  
  // Portfolio Configuration
  const [aiClients, setAiClients] = useState(2);
  const [avgWorkflowsPerClient, setAvgWorkflowsPerClient] = useState(1);
  const [foundationClients, setFoundationClients] = useState(2);
  const [growthClients, setGrowthClients] = useState(2);
  const [partnershipClients, setPartnershipClients] = useState(1);
  
  // Team Configuration
  const [teamMode, setTeamMode] = useState(false);
  const [teamMembers, setTeamMembers] = useState(1);
  const [teamCostPerHour, setTeamCostPerHour] = useState(50);
  const [teamHoursPerYear, setTeamHoursPerYear] = useState(1000);
  const [managementHoursPerMember, setManagementHoursPerMember] = useState(80);
  
  // View State
  const [activeTab, setActiveTab] = useState('portfolio');
  const [showAssumptions, setShowAssumptions] = useState(false);

  // Computed Metrics
  const maxAnnualHours = useMemo(() => workingWeeksPerYear * workingHoursPerWeek, [workingWeeksPerYear, workingHoursPerWeek]);

  // Team economics
  const teamEconomics = useMemo(() => {
    if (!teamMode) {
      return {
        totalCapacity: maxAnnualHours,
        yourDeliveryHours: maxAnnualHours,
        teamDeliveryHours: 0,
        managementHours: 0,
        blendedCostPerHour: costPerHour,
        teamCost: 0,
        yourCost: 0
      };
    }
    
    const totalTeamHours = teamMembers * teamHoursPerYear;
    const totalManagementHours = teamMembers * managementHoursPerMember;
    const yourDeliveryHours = Math.max(0, maxAnnualHours - totalManagementHours);
    const totalDeliveryCapacity = yourDeliveryHours + totalTeamHours;
    
    // Blended cost = weighted average based on who delivers
    const yourCostTotal = yourDeliveryHours * costPerHour;
    const teamCostTotal = totalTeamHours * teamCostPerHour;
    const blendedCost = totalDeliveryCapacity > 0 
      ? (yourCostTotal + teamCostTotal) / totalDeliveryCapacity 
      : costPerHour;
    
    return {
      totalCapacity: totalDeliveryCapacity,
      yourDeliveryHours,
      teamDeliveryHours: totalTeamHours,
      managementHours: totalManagementHours,
      blendedCostPerHour: blendedCost,
      teamCost: teamCostTotal,
      yourCost: yourCostTotal
    };
  }, [teamMode, teamMembers, teamHoursPerYear, managementHoursPerMember, maxAnnualHours, costPerHour, teamCostPerHour]);

  // Effective cost rate (changes based on team mode)
  const effectiveCostRate = teamMode ? teamEconomics.blendedCostPerHour : costPerHour;
  const effectiveMaxHours = teamMode ? teamEconomics.totalCapacity : maxAnnualHours;

  // Computed NP hours from breakdown
  const npCalculatedHours = useMemo(() => {
    const onboarding = npHoursOnboarding + npHoursSetup + npHoursTraining;
    const ongoing = (npHoursMonthlySupport * 12) + (npHoursQuarterlyReview * 4) + npHoursAnnualPlanning;
    return { onboarding, ongoing, total: onboarding + ongoing };
  }, [npHoursOnboarding, npHoursSetup, npHoursTraining, npHoursMonthlySupport, npHoursQuarterlyReview, npHoursAnnualPlanning]);

  // Computed AI hours from breakdown
  const aiCalculatedHours = useMemo(() => {
    const build = aiHoursDiscovery + aiHoursDesign + aiHoursBuild + aiHoursTesting + aiHoursDocumentation;
    const maintenance = aiHoursMaintenanceMonthly * (engagementLengthMonths - buildPhaseMonths);
    return { build, maintenance, total: build + maintenance };
  }, [aiHoursDiscovery, aiHoursDesign, aiHoursBuild, aiHoursTesting, aiHoursDocumentation, aiHoursMaintenanceMonthly, engagementLengthMonths, buildPhaseMonths]);

  // AI Per-Workflow Calculations
  const aiWorkflowMetrics = useMemo(() => {
    const getRetainer = (wf) => wf === 1 ? maintenanceRetainer1WF : wf === 2 ? maintenanceRetainer2WF : maintenanceRetainer3WF;
    const maintenanceMonths = engagementLengthMonths - buildPhaseMonths;
    
    const buildRevenue = buildPricePerWorkflow;
    const maintenanceRevenue = getRetainer(1) * maintenanceMonths;
    const totalRevenue = buildRevenue + maintenanceRevenue;
    
    const buildHours = buildHoursPerWorkflow;
    const maintenanceHours = maintenanceHoursPerMonth * maintenanceMonths;
    const totalHours = buildHours + maintenanceHours;
    
    const effectiveRate = totalHours > 0 ? totalRevenue / totalHours : 0;
    const cost = totalHours * effectiveCostRate;
    const grossMargin = totalRevenue - cost;
    const marginPercent = totalRevenue > 0 ? grossMargin / totalRevenue : 0;
    
    return {
      buildRevenue, maintenanceRevenue, totalRevenue,
      buildHours, maintenanceHours, totalHours,
      effectiveRate, cost, grossMargin, marginPercent,
      maintenanceMonths
    };
  }, [buildPricePerWorkflow, maintenanceRetainer1WF, maintenanceHoursPerMonth, buildHoursPerWorkflow, engagementLengthMonths, buildPhaseMonths, effectiveCostRate]);

  // AI Single Client Monthly Pattern
  const aiMonthlyPattern = useMemo(() => {
    const getRetainer = (wf) => wf === 1 ? maintenanceRetainer1WF : wf === 2 ? maintenanceRetainer2WF : maintenanceRetainer3WF;
    const monthlyBuildHours = buildHoursPerWorkflow / buildPhaseMonths;
    const depositRevenue = depositPerWorkflow;
    const buildRevenue = (buildPricePerWorkflow - depositPerWorkflow) / buildPhaseMonths;
    
    return Array.from({ length: engagementLengthMonths }, (_, i) => {
      const month = i + 1;
      const isBuildPhase = month <= buildPhaseMonths;
      
      let revenue, hours;
      if (month === 1) {
        revenue = depositRevenue + buildRevenue + getRetainer(avgWorkflowsPerClient);
        hours = monthlyBuildHours;
      } else if (isBuildPhase) {
        revenue = buildRevenue + getRetainer(avgWorkflowsPerClient);
        hours = monthlyBuildHours;
      } else {
        revenue = getRetainer(avgWorkflowsPerClient);
        hours = maintenanceHoursPerMonth * avgWorkflowsPerClient;
      }
      
      return { month: `M${month}`, revenue: Math.round(revenue), hours: Math.round(hours), phase: isBuildPhase ? 'Build' : 'Maintain' };
    });
  }, [buildPricePerWorkflow, depositPerWorkflow, buildPhaseMonths, maintenanceRetainer1WF, maintenanceRetainer2WF, maintenanceRetainer3WF, maintenanceHoursPerMonth, buildHoursPerWorkflow, engagementLengthMonths, avgWorkflowsPerClient]);

  // NP Tier Metrics
  const npTierMetrics = useMemo(() => {
    const tiers = [
      { name: 'Foundation', price: foundationPrice, clients: foundationClients },
      { name: 'Growth', price: growthPrice, clients: growthClients },
      { name: 'Partnership', price: partnershipPrice, clients: partnershipClients }
    ];
    
    return tiers.map(t => {
      const revenue = t.price * t.clients;
      const hours = hoursPerNPClient * t.clients;
      const cost = hours * effectiveCostRate;
      const margin = revenue - cost;
      const marginPct = revenue > 0 ? margin / revenue : 0;
      const effectiveRate = hours > 0 ? revenue / hours : 0;
      
      return { ...t, revenue, hours, cost, margin, marginPct, effectiveRate };
    });
  }, [foundationPrice, growthPrice, partnershipPrice, foundationClients, growthClients, partnershipClients, hoursPerNPClient, effectiveCostRate]);

  // Total NP Metrics
  const npTotalMetrics = useMemo(() => {
    const totals = npTierMetrics.reduce((acc, t) => ({
      revenue: acc.revenue + t.revenue,
      hours: acc.hours + t.hours,
      cost: acc.cost + t.cost,
      margin: acc.margin + t.margin,
      clients: acc.clients + t.clients
    }), { revenue: 0, hours: 0, cost: 0, margin: 0, clients: 0 });
    
    return {
      ...totals,
      effectiveRate: totals.hours > 0 ? totals.revenue / totals.hours : 0,
      marginPct: totals.revenue > 0 ? totals.margin / totals.revenue : 0
    };
  }, [npTierMetrics]);

  // AI Total Metrics
  const aiTotalMetrics = useMemo(() => {
    const totalWorkflows = aiClients * avgWorkflowsPerClient;
    const revenue = aiWorkflowMetrics.totalRevenue * totalWorkflows;
    const hours = aiWorkflowMetrics.totalHours * totalWorkflows;
    const cost = hours * effectiveCostRate;
    const margin = revenue - cost;
    
    return {
      clients: aiClients,
      workflows: totalWorkflows,
      revenue, hours, cost, margin,
      effectiveRate: hours > 0 ? revenue / hours : 0,
      marginPct: revenue > 0 ? margin / revenue : 0
    };
  }, [aiClients, avgWorkflowsPerClient, aiWorkflowMetrics, effectiveCostRate]);

  // Combined Portfolio Metrics
  const portfolioMetrics = useMemo(() => {
    const revenue = aiTotalMetrics.revenue + npTotalMetrics.revenue;
    const hours = aiTotalMetrics.hours + npTotalMetrics.hours;
    const cost = aiTotalMetrics.cost + npTotalMetrics.cost;
    const margin = aiTotalMetrics.margin + npTotalMetrics.margin;
    
    const hitsProfit = margin >= targetProfit;
    const hitsHours = hours <= effectiveMaxHours;
    const status = hitsProfit && hitsHours ? 'green' : (hitsProfit || hitsHours) ? 'amber' : 'red';
    
    return {
      revenue, hours, cost, margin,
      effectiveRate: hours > 0 ? revenue / hours : 0,
      marginPct: revenue > 0 ? margin / revenue : 0,
      utilizationPct: hours / effectiveMaxHours,
      hitsProfit, hitsHours, status,
      aiShare: revenue > 0 ? aiTotalMetrics.revenue / revenue : 0,
      npShare: revenue > 0 ? npTotalMetrics.revenue / revenue : 0
    };
  }, [aiTotalMetrics, npTotalMetrics, targetProfit, effectiveMaxHours]);

  // Predefined Scenarios
  const scenarios = useMemo(() => [
    { name: 'AI Heavy', ai: 3, wf: 1, found: 1, grow: 1, part: 0, desc: 'Focus on high-margin AI work' },
    { name: 'Balanced', ai: 2, wf: 1, found: 2, grow: 1, part: 1, desc: 'Mix of AI & NP revenue' },
    { name: 'NP Heavy', ai: 1, wf: 1, found: 2, grow: 2, part: 2, desc: 'Stable nonprofit base' },
    { name: 'NP Only', ai: 0, wf: 0, found: 3, grow: 3, part: 2, desc: 'Predictable NP portfolio' }
  ].map(s => {
    const aiRev = s.ai * s.wf * aiWorkflowMetrics.totalRevenue;
    const aiHrs = s.ai * s.wf * aiWorkflowMetrics.totalHours;
    const npRev = s.found * foundationPrice + s.grow * growthPrice + s.part * partnershipPrice;
    const npHrs = (s.found + s.grow + s.part) * hoursPerNPClient;
    const rev = aiRev + npRev;
    const hrs = aiHrs + npHrs;
    const cost = hrs * effectiveCostRate;
    const margin = rev - cost;
    
    return { ...s, revenue: rev, hours: hrs, cost, margin, marginPct: rev > 0 ? margin / rev : 0, effectiveRate: hrs > 0 ? rev / hrs : 0 };
  }), [aiWorkflowMetrics, foundationPrice, growthPrice, partnershipPrice, hoursPerNPClient, effectiveCostRate]);

  // Scatter Data for Scenario Comparison
  const scatterData = useMemo(() => [
    ...scenarios.map(s => ({ ...s, type: 'preset' })),
    { name: 'Current', hours: portfolioMetrics.hours, margin: portfolioMetrics.margin, effectiveRate: portfolioMetrics.effectiveRate, type: 'current', desc: 'Your current configuration' }
  ], [scenarios, portfolioMetrics]);

  // Sensitivity Grid Data
  const sensitivityGrid = useMemo(() => {
    const maxAI = teamMode ? 8 : 5;
    const maxNP = teamMode ? 20 : 12;
    const aiRange = Array.from({ length: maxAI + 1 }, (_, i) => i);
    const npRange = Array.from({ length: maxNP + 1 }, (_, i) => i);
    
    // Calculate average NP price and use it for simplified NP client count
    const avgNPPrice = (foundationPrice + growthPrice + partnershipPrice) / 3;
    
    const grid = aiRange.map(ai => {
      return npRange.map(np => {
        const aiRev = ai * avgWorkflowsPerClient * aiWorkflowMetrics.totalRevenue;
        const aiHrs = ai * avgWorkflowsPerClient * aiWorkflowMetrics.totalHours;
        const npRev = np * avgNPPrice;
        const npHrs = np * hoursPerNPClient;
        const totalRev = aiRev + npRev;
        const totalHrs = aiHrs + npHrs;
        const cost = totalHrs * effectiveCostRate;
        const margin = totalRev - cost;
        
        const hitsProfit = margin >= targetProfit;
        const hitsHours = totalHrs <= effectiveMaxHours;
        const status = hitsProfit && hitsHours ? 'green' : hitsProfit ? 'over-hours' : hitsHours ? 'under-profit' : 'red';
        
        return {
          ai, np, revenue: totalRev, hours: totalHrs, margin, status,
          marginPct: totalRev > 0 ? margin / totalRev : 0,
          effectiveRate: totalHrs > 0 ? totalRev / totalHrs : 0
        };
      });
    });
    
    return { grid, aiRange, npRange, avgNPPrice };
  }, [teamMode, avgWorkflowsPerClient, aiWorkflowMetrics, foundationPrice, growthPrice, partnershipPrice, hoursPerNPClient, effectiveCostRate, effectiveMaxHours, targetProfit]);

  const applyScenario = (s) => {
    setAiClients(s.ai);
    setAvgWorkflowsPerClient(s.wf || 1);
    setFoundationClients(s.found);
    setGrowthClients(s.grow);
    setPartnershipClients(s.part);
  };

  const StatusBadge = ({ status }) => {
    const colors = { green: '#22c55e', amber: '#f59e0b', red: '#ef4444' };
    const labels = { green: 'On Track', amber: 'Review', red: 'Off Target' };
    return (
      <span style={{ 
        background: colors[status], 
        color: '#fff', 
        padding: '4px 12px', 
        borderRadius: '16px', 
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.5px'
      }}>
        {labels[status]}
      </span>
    );
  };

  const MetricCard = ({ label, value, subtext, highlight }) => (
    <div style={{ 
      background: highlight ? 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)' : '#1a1a1a',
      borderRadius: '12px',
      padding: '20px',
      border: highlight ? '1px solid #3d8b5a' : '1px solid #333'
    }}>
      <div style={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{label}</div>
      <div style={{ color: highlight ? '#7fd4a0' : '#fff', fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Georgia, serif' }}>{value}</div>
      {subtext && <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '4px' }}>{subtext}</div>}
    </div>
  );

  const SliderInput = ({ label, value, onChange, min, max, step = 1, format = (v) => v }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ color: '#999', fontSize: '0.8rem' }}>{label}</span>
        <span style={{ color: '#7fd4a0', fontSize: '0.8rem', fontWeight: 600 }}>{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#3d8b5a' }}
      />
    </div>
  );

  const NumberInput = ({ label, value, onChange, suffix = '', prefix = '', width = '80px' }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #222' }}>
      <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {prefix && <span style={{ color: '#666', fontSize: '0.85rem' }}>{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          style={{
            width,
            padding: '6px 10px',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '4px',
            color: '#7fd4a0',
            fontSize: '0.9rem',
            textAlign: 'right',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3d8b5a'}
          onBlur={(e) => e.target.style.borderColor = '#333'}
        />
        {suffix && <span style={{ color: '#666', fontSize: '0.85rem', minWidth: '40px' }}>{suffix}</span>}
      </div>
    </div>
  );

  const CalcSummaryRow = ({ label, value, highlight = false }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '10px 12px', 
      background: highlight ? 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)' : '#1a1a1a',
      borderRadius: '6px',
      marginTop: '8px'
    }}>
      <span style={{ color: highlight ? '#7fd4a0' : '#999', fontSize: '0.85rem', fontWeight: highlight ? 600 : 400 }}>{label}</span>
      <span style={{ color: highlight ? '#fff' : '#7fd4a0', fontSize: '0.95rem', fontWeight: 600 }}>{value}</span>
    </div>
  );

  const TabButton = ({ id, label, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        background: active ? 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)' : 'transparent',
        border: active ? '1px solid #3d8b5a' : '1px solid #333',
        color: active ? '#7fd4a0' : '#999',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 500,
        transition: 'all 0.2s'
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)', 
      color: '#e5e5e5', 
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: '32px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 700, 
            margin: 0,
            fontFamily: 'Georgia, serif',
            background: 'linear-gradient(90deg, #7fd4a0 0%, #f5a623 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AI & Nonprofit Portfolio Explorer
          </h1>
          <StatusBadge status={portfolioMetrics.status} />
          
          {/* Team Mode Toggle */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginLeft: 'auto',
            background: '#1a1a1a',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid #333'
          }}>
            <span style={{ color: !teamMode ? '#7fd4a0' : '#666', fontSize: '0.8rem', fontWeight: 500 }}>Solo</span>
            <button
              onClick={() => setTeamMode(!teamMode)}
              style={{
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                border: 'none',
                background: teamMode ? 'linear-gradient(135deg, #1a472a 0%, #3d8b5a 100%)' : '#333',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '3px',
                left: teamMode ? '23px' : '3px',
                transition: 'all 0.2s'
              }} />
            </button>
            <span style={{ color: teamMode ? '#7fd4a0' : '#666', fontSize: '0.8rem', fontWeight: 500 }}>Team</span>
          </div>
        </div>
        <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
          Economic & Ideal Business Model Analysis • Mount Arbor Business Growth Systems
          {teamMode && <span style={{ color: '#3d8b5a', marginLeft: '8px' }}>• Team Mode: {teamMembers} member{teamMembers > 1 ? 's' : ''} @ €{teamCostPerHour}/hr</span>}
        </p>
      </div>

      {/* Key Metrics Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '16px', 
        marginBottom: '32px' 
      }}>
        <MetricCard 
          label="Total Annual Profit" 
          value={formatCurrency(Math.round(portfolioMetrics.margin))} 
          subtext={`Target: ${formatCurrency(targetProfit)}`}
          highlight={portfolioMetrics.hitsProfit}
        />
        <MetricCard 
          label="Total Annual Hours" 
          value={Math.round(portfolioMetrics.hours).toLocaleString()} 
          subtext={`Capacity: ${effectiveMaxHours.toLocaleString()} hrs`}
          highlight={portfolioMetrics.hitsHours}
        />
        <MetricCard 
          label="Effective Rate" 
          value={`€${Math.round(portfolioMetrics.effectiveRate)}/hr`} 
          subtext={`Cost: €${Math.round(effectiveCostRate)}/hr${teamMode ? ' (blended)' : ''}`}
        />
        <MetricCard 
          label="Gross Margin" 
          value={formatPercent(portfolioMetrics.marginPct)} 
          subtext={`Revenue: ${formatCurrency(Math.round(portfolioMetrics.revenue))}`}
        />
        <MetricCard 
          label="Utilization" 
          value={formatPercent(portfolioMetrics.utilizationPct)} 
          subtext={teamMode 
            ? `You: ${teamEconomics.yourDeliveryHours}hrs + Team: ${teamEconomics.teamDeliveryHours}hrs`
            : `${Math.round(portfolioMetrics.hours / 52)} hrs/week avg`
          }
        />
      </div>

      {/* Assumptions Toggle */}
      <button
        onClick={() => setShowAssumptions(!showAssumptions)}
        style={{
          background: 'transparent',
          border: '1px solid #333',
          color: '#999',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '16px',
          fontSize: '0.8rem'
        }}
      >
        {showAssumptions ? '▼ Hide Assumptions' : '► Show Assumptions'}
      </button>

      {/* Assumptions Panel */}
      {showAssumptions && (
        <div style={{ 
          background: '#141414', 
          borderRadius: '12px', 
          padding: '24px', 
          marginBottom: '32px',
          border: '1px solid #222'
        }}>
          <h3 style={{ color: '#7fd4a0', marginTop: 0, marginBottom: '20px', fontSize: '1rem' }}>Global & Pricing Assumptions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            <div>
              <h4 style={{ color: '#f5a623', marginTop: 0, fontSize: '0.85rem', borderBottom: '1px solid #333', paddingBottom: '8px' }}>Global</h4>
              <SliderInput label="Cost per Hour" value={costPerHour} onChange={setCostPerHour} min={50} max={200} format={v => `€${v}`} />
              <SliderInput label="Working Weeks/Year" value={workingWeeksPerYear} onChange={setWorkingWeeksPerYear} min={40} max={52} />
              <SliderInput label="Hours/Week" value={workingHoursPerWeek} onChange={setWorkingHoursPerWeek} min={15} max={45} />
              <SliderInput label="Target Profit" value={targetProfit} onChange={setTargetProfit} min={50000} max={300000} step={5000} format={v => `€${v.toLocaleString()}`} />
            </div>
            <div>
              <h4 style={{ color: '#f5a623', marginTop: 0, fontSize: '0.85rem', borderBottom: '1px solid #333', paddingBottom: '8px' }}>AI Model Pricing</h4>
              <SliderInput label="Build Price/Workflow" value={buildPricePerWorkflow} onChange={setBuildPricePerWorkflow} min={10000} max={30000} step={1000} format={v => `€${v.toLocaleString()}`} />
              <SliderInput label="Build Hours/Workflow" value={buildHoursPerWorkflow} onChange={setBuildHoursPerWorkflow} min={40} max={160} step={5} />
              <SliderInput label="Maintenance Retainer (1 WF)" value={maintenanceRetainer1WF} onChange={setMaintenanceRetainer1WF} min={1500} max={5000} step={250} format={v => `€${v}/mo`} />
              <SliderInput label="Maintenance Retainer (2 WF)" value={maintenanceRetainer2WF} onChange={setMaintenanceRetainer2WF} min={3000} max={8000} step={250} format={v => `€${v}/mo`} />
              <SliderInput label="Maintenance Retainer (3 WF)" value={maintenanceRetainer3WF} onChange={setMaintenanceRetainer3WF} min={5000} max={12000} step={500} format={v => `€${v}/mo`} />
              <SliderInput label="Maintenance Hours/Mo" value={maintenanceHoursPerMonth} onChange={setMaintenanceHoursPerMonth} min={2} max={15} />
            </div>
            <div>
              <h4 style={{ color: '#f5a623', marginTop: 0, fontSize: '0.85rem', borderBottom: '1px solid #333', paddingBottom: '8px' }}>NP Model Pricing</h4>
              <SliderInput label="Foundation Price" value={foundationPrice} onChange={setFoundationPrice} min={8000} max={18000} step={500} format={v => `€${v.toLocaleString()}/yr`} />
              <SliderInput label="Growth Price" value={growthPrice} onChange={setGrowthPrice} min={12000} max={22000} step={500} format={v => `€${v.toLocaleString()}/yr`} />
              <SliderInput label="Partnership Price" value={partnershipPrice} onChange={setPartnershipPrice} min={15000} max={30000} step={500} format={v => `€${v.toLocaleString()}/yr`} />
              <SliderInput label="Hours/NP Client/Year" value={hoursPerNPClient} onChange={setHoursPerNPClient} min={40} max={120} />
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Controls */}
      <div style={{ 
        background: '#141414', 
        borderRadius: '12px', 
        padding: '24px', 
        marginBottom: '32px',
        border: '1px solid #222'
      }}>
        <h3 style={{ color: '#7fd4a0', marginTop: 0, marginBottom: '20px', fontSize: '1rem' }}>Portfolio Mix</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          <div>
            <h4 style={{ color: '#f5a623', marginTop: 0, fontSize: '0.85rem' }}>AI Clients</h4>
            <SliderInput label="Number of AI Clients" value={aiClients} onChange={setAiClients} min={0} max={12} />
            <SliderInput label="Avg Workflows/Client" value={avgWorkflowsPerClient} onChange={setAvgWorkflowsPerClient} min={1} max={3} />
          </div>
          <div>
            <h4 style={{ color: '#f5a623', marginTop: 0, fontSize: '0.85rem' }}>NP Clients</h4>
            <SliderInput label="Foundation Clients" value={foundationClients} onChange={setFoundationClients} min={0} max={20} />
            <SliderInput label="Growth Clients" value={growthClients} onChange={setGrowthClients} min={0} max={20} />
            <SliderInput label="Partnership Clients" value={partnershipClients} onChange={setPartnershipClients} min={0} max={20} />
          </div>
          <div>
            <h4 style={{ color: '#f5a623', marginTop: 0, fontSize: '0.85rem' }}>Quick Scenarios</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {scenarios.map(s => (
                <button
                  key={s.name}
                  onClick={() => applyScenario(s)}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    color: '#e5e5e5',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.borderColor = '#3d8b5a'}
                  onMouseOut={(e) => e.target.style.borderColor = '#333'}
                >
                  <strong>{s.name}</strong>
                  <span style={{ color: '#666', marginLeft: '8px' }}>{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <TabButton id="portfolio" label="Portfolio View" active={activeTab === 'portfolio'} />
        <TabButton id="assumptions-calc" label="Assumptions Calculator" active={activeTab === 'assumptions-calc'} />
        <TabButton id="ai-client" label="AI Client Economics" active={activeTab === 'ai-client'} />
        <TabButton id="np-tiers" label="NP Tier Comparison" active={activeTab === 'np-tiers'} />
        <TabButton id="scenarios" label="Scenario Explorer" active={activeTab === 'scenarios'} />
      </div>

      {/* Tab Content */}
      <div style={{ background: '#141414', borderRadius: '12px', padding: '24px', border: '1px solid #222' }}>
        {activeTab === 'assumptions-calc' && (
          <div>
            <h3 style={{ color: '#7fd4a0', marginTop: 0, marginBottom: '8px' }}>Assumptions Calculator</h3>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '24px' }}>
              Build up your per-client economics from first principles. Changes here propagate across all scenarios.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px' }}>
              {/* NP Model Calculator */}
              <div style={{ background: '#111', borderRadius: '10px', padding: '24px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '4px', height: '24px', background: '#f5a623', borderRadius: '2px' }}></div>
                  <h4 style={{ color: '#f5a623', margin: 0, fontSize: '1rem' }}>Nonprofit Model</h4>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ color: '#999', margin: '0 0 12px 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Annual Pricing by Tier</h5>
                  <NumberInput label="Foundation" value={foundationPrice} onChange={setFoundationPrice} prefix="€" suffix="/yr" width="90px" />
                  <NumberInput label="Growth" value={growthPrice} onChange={setGrowthPrice} prefix="€" suffix="/yr" width="90px" />
                  <NumberInput label="Partnership" value={partnershipPrice} onChange={setPartnershipPrice} prefix="€" suffix="/yr" width="90px" />
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ color: '#999', margin: '0 0 12px 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Onboarding Phase (Year 1)</h5>
                  <NumberInput label="Onboarding & Discovery" value={npHoursOnboarding} onChange={setNpHoursOnboarding} suffix="hrs" width="70px" />
                  <NumberInput label="Initial Setup & Config" value={npHoursSetup} onChange={setNpHoursSetup} suffix="hrs" width="70px" />
                  <NumberInput label="Training & Handover" value={npHoursTraining} onChange={setNpHoursTraining} suffix="hrs" width="70px" />
                  <CalcSummaryRow label="Subtotal: Onboarding" value={`${npCalculatedHours.onboarding} hrs`} />
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ color: '#999', margin: '0 0 12px 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Ongoing Support (per year)</h5>
                  <NumberInput label="Monthly Support" value={npHoursMonthlySupport} onChange={setNpHoursMonthlySupport} suffix="hrs/mo" width="70px" />
                  <NumberInput label="Quarterly Review" value={npHoursQuarterlyReview} onChange={setNpHoursQuarterlyReview} suffix="hrs/qtr" width="70px" />
                  <NumberInput label="Annual Planning" value={npHoursAnnualPlanning} onChange={setNpHoursAnnualPlanning} suffix="hrs" width="70px" />
                  <CalcSummaryRow label="Subtotal: Ongoing" value={`${npCalculatedHours.ongoing} hrs`} />
                </div>
                
                <CalcSummaryRow label="Total Hours per NP Client/Year" value={`${npCalculatedHours.total} hrs`} highlight />
                
                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div style={{ background: '#1a1a1a', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ color: '#666', fontSize: '0.7rem', marginBottom: '4px' }}>Foundation</div>
                    <div style={{ color: '#f5a623', fontSize: '0.9rem', fontWeight: 600 }}>€{Math.round(foundationPrice / npCalculatedHours.total)}/hr</div>
                  </div>
                  <div style={{ background: '#1a1a1a', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ color: '#666', fontSize: '0.7rem', marginBottom: '4px' }}>Growth</div>
                    <div style={{ color: '#f5a623', fontSize: '0.9rem', fontWeight: 600 }}>€{Math.round(growthPrice / npCalculatedHours.total)}/hr</div>
                  </div>
                  <div style={{ background: '#1a1a1a', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ color: '#666', fontSize: '0.7rem', marginBottom: '4px' }}>Partnership</div>
                    <div style={{ color: '#f5a623', fontSize: '0.9rem', fontWeight: 600 }}>€{Math.round(partnershipPrice / npCalculatedHours.total)}/hr</div>
                  </div>
                </div>
                
                <button
                  onClick={() => setHoursPerNPClient(npCalculatedHours.total)}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #3d5a28 0%, #4a6b32 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Apply {npCalculatedHours.total} hrs to Model →
                </button>
              </div>
              
              {/* AI Model Calculator */}
              <div style={{ background: '#111', borderRadius: '10px', padding: '24px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '4px', height: '24px', background: '#3d8b5a', borderRadius: '2px' }}></div>
                  <h4 style={{ color: '#3d8b5a', margin: 0, fontSize: '1rem' }}>AI Systems Model</h4>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ color: '#999', margin: '0 0 12px 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Build Phase Pricing</h5>
                  <NumberInput label="Upfront Build Price" value={buildPricePerWorkflow} onChange={setBuildPricePerWorkflow} prefix="€" suffix="/wf" width="90px" />
                  <NumberInput label="Deposit" value={depositPerWorkflow} onChange={setDepositPerWorkflow} prefix="€" suffix="" width="90px" />
                  <NumberInput label="Build Phase Length" value={buildPhaseMonths} onChange={setBuildPhaseMonths} suffix="months" width="70px" />
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ color: '#999', margin: '0 0 12px 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Build Phase Hours (per workflow)</h5>
                  <NumberInput label="Discovery & Scoping" value={aiHoursDiscovery} onChange={setAiHoursDiscovery} suffix="hrs" width="70px" />
                  <NumberInput label="Design & Architecture" value={aiHoursDesign} onChange={setAiHoursDesign} suffix="hrs" width="70px" />
                  <NumberInput label="Build & Development" value={aiHoursBuild} onChange={setAiHoursBuild} suffix="hrs" width="70px" />
                  <NumberInput label="Testing & QA" value={aiHoursTesting} onChange={setAiHoursTesting} suffix="hrs" width="70px" />
                  <NumberInput label="Documentation & Handover" value={aiHoursDocumentation} onChange={setAiHoursDocumentation} suffix="hrs" width="70px" />
                  <CalcSummaryRow label="Subtotal: Build Phase" value={`${aiCalculatedHours.build} hrs`} />
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ color: '#999', margin: '0 0 12px 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Maintenance Phase</h5>
                  <NumberInput label="Engagement Length" value={engagementLengthMonths} onChange={setEngagementLengthMonths} suffix="months" width="70px" />
                  <NumberInput label="Retainer (1 workflow)" value={maintenanceRetainer1WF} onChange={setMaintenanceRetainer1WF} prefix="€" suffix="/mo" width="90px" />
                  <NumberInput label="Retainer (2 workflows)" value={maintenanceRetainer2WF} onChange={setMaintenanceRetainer2WF} prefix="€" suffix="/mo" width="90px" />
                  <NumberInput label="Retainer (3 workflows)" value={maintenanceRetainer3WF} onChange={setMaintenanceRetainer3WF} prefix="€" suffix="/mo" width="90px" />
                  <NumberInput label="Monthly Support Hours" value={aiHoursMaintenanceMonthly} onChange={setAiHoursMaintenanceMonthly} suffix="hrs/mo" width="70px" />
                  <CalcSummaryRow label={`Subtotal: Maintenance (${engagementLengthMonths - buildPhaseMonths} mo)`} value={`${aiCalculatedHours.maintenance} hrs`} />
                </div>
                
                <CalcSummaryRow label="Total Hours per Workflow/Year" value={`${aiCalculatedHours.total} hrs`} highlight />
                
                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ background: '#1a1a1a', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ color: '#666', fontSize: '0.7rem', marginBottom: '4px' }}>Revenue/Workflow</div>
                    <div style={{ color: '#3d8b5a', fontSize: '0.9rem', fontWeight: 600 }}>€{(buildPricePerWorkflow + maintenanceRetainer1WF * (engagementLengthMonths - buildPhaseMonths)).toLocaleString()}</div>
                  </div>
                  <div style={{ background: '#1a1a1a', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ color: '#666', fontSize: '0.7rem', marginBottom: '4px' }}>Effective Rate</div>
                    <div style={{ color: '#3d8b5a', fontSize: '0.9rem', fontWeight: 600 }}>€{Math.round((buildPricePerWorkflow + maintenanceRetainer1WF * (engagementLengthMonths - buildPhaseMonths)) / aiCalculatedHours.total)}/hr</div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setBuildHoursPerWorkflow(aiCalculatedHours.build);
                    setMaintenanceHoursPerMonth(aiHoursMaintenanceMonthly);
                  }}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Apply {aiCalculatedHours.build} build + {aiHoursMaintenanceMonthly} maint hrs →
                </button>
              </div>
            </div>
            
            {/* Global Assumptions */}
            <div style={{ marginTop: '32px', background: '#111', borderRadius: '10px', padding: '24px', border: '1px solid #333' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '4px', height: '24px', background: '#666', borderRadius: '2px' }}></div>
                <h4 style={{ color: '#999', margin: 0, fontSize: '1rem' }}>Global Assumptions</h4>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                <div>
                  <NumberInput label="Your Cost Rate" value={costPerHour} onChange={setCostPerHour} prefix="€" suffix="/hr" width="80px" />
                  <NumberInput label="Working Weeks/Year" value={workingWeeksPerYear} onChange={setWorkingWeeksPerYear} suffix="weeks" width="70px" />
                  <NumberInput label="Working Hours/Week" value={workingHoursPerWeek} onChange={setWorkingHoursPerWeek} suffix="hrs" width="70px" />
                </div>
                <div>
                  <NumberInput label="Target Annual Profit" value={targetProfit} onChange={setTargetProfit} prefix="€" suffix="" width="100px" />
                  <CalcSummaryRow label="Your Annual Capacity" value={`${maxAnnualHours} hrs`} />
                  <CalcSummaryRow label="Avg Hours/Week Available" value={`${workingHoursPerWeek} hrs`} />
                </div>
              </div>
            </div>
            
            {/* Team Configuration */}
            <div style={{ marginTop: '32px', background: teamMode ? 'linear-gradient(135deg, #111 0%, #0d1a12 100%)' : '#111', borderRadius: '10px', padding: '24px', border: teamMode ? '1px solid #2d5a3d' : '1px solid #333' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '4px', height: '24px', background: teamMode ? '#3d8b5a' : '#666', borderRadius: '2px' }}></div>
                  <h4 style={{ color: teamMode ? '#7fd4a0' : '#999', margin: 0, fontSize: '1rem' }}>Team Configuration</h4>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  background: '#1a1a1a',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  border: '1px solid #333'
                }}>
                  <span style={{ color: !teamMode ? '#7fd4a0' : '#666', fontSize: '0.75rem' }}>Solo</span>
                  <button
                    onClick={() => setTeamMode(!teamMode)}
                    style={{
                      width: '36px',
                      height: '20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: teamMode ? '#3d8b5a' : '#333',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: '3px',
                      left: teamMode ? '19px' : '3px',
                      transition: 'all 0.2s'
                    }} />
                  </button>
                  <span style={{ color: teamMode ? '#7fd4a0' : '#666', fontSize: '0.75rem' }}>Team</span>
                </div>
              </div>
              
              {!teamMode ? (
                <div style={{ padding: '20px', background: '#1a1a1a', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ color: '#666', margin: 0, fontSize: '0.85rem' }}>
                    Currently modelling as a solo operation. Toggle to "Team" to explore hiring economics.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  <div>
                    <h5 style={{ color: '#999', margin: '0 0 12px 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Team Setup</h5>
                    <NumberInput label="Number of Team Members" value={teamMembers} onChange={setTeamMembers} suffix="people" width="70px" />
                    <NumberInput label="Team Cost Rate" value={teamCostPerHour} onChange={setTeamCostPerHour} prefix="€" suffix="/hr" width="80px" />
                    <NumberInput label="Hours per Member/Year" value={teamHoursPerYear} onChange={setTeamHoursPerYear} suffix="hrs" width="80px" />
                    <NumberInput label="Your Mgmt Hours/Member" value={managementHoursPerMember} onChange={setManagementHoursPerMember} suffix="hrs/yr" width="70px" />
                  </div>
                  
                  <div>
                    <h5 style={{ color: '#999', margin: '0 0 12px 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Capacity Breakdown</h5>
                    <CalcSummaryRow label="Your Base Capacity" value={`${maxAnnualHours} hrs`} />
                    <CalcSummaryRow label="Less: Management Overhead" value={`-${teamEconomics.managementHours} hrs`} />
                    <CalcSummaryRow label="Your Delivery Hours" value={`${teamEconomics.yourDeliveryHours} hrs`} />
                    <CalcSummaryRow label="Team Delivery Hours" value={`+${teamEconomics.teamDeliveryHours} hrs`} />
                    <CalcSummaryRow label="Total Delivery Capacity" value={`${teamEconomics.totalCapacity} hrs`} highlight />
                  </div>
                  
                  <div>
                    <h5 style={{ color: '#999', margin: '0 0 12px 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Cost Economics</h5>
                    <CalcSummaryRow label="Your Cost (delivery)" value={formatCurrency(teamEconomics.yourCost)} />
                    <CalcSummaryRow label="Team Cost" value={formatCurrency(teamEconomics.teamCost)} />
                    <CalcSummaryRow label="Blended Cost Rate" value={`€${Math.round(teamEconomics.blendedCostPerHour)}/hr`} highlight />
                    
                    <div style={{ marginTop: '16px', padding: '12px', background: '#111', borderRadius: '6px', border: '1px dashed #333' }}>
                      <p style={{ color: '#999', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
                        <strong style={{ color: '#7fd4a0' }}>Margin boost:</strong> You save €{costPerHour - teamCostPerHour}/hr on team-delivered work. 
                        At {teamEconomics.teamDeliveryHours} team hours, that's €{((costPerHour - teamCostPerHour) * teamEconomics.teamDeliveryHours).toLocaleString()} additional margin potential.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div>
            <h3 style={{ color: '#7fd4a0', marginTop: 0 }}>Portfolio Breakdown</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
              <div>
                <h4 style={{ color: '#999', marginBottom: '16px', fontSize: '0.85rem' }}>Revenue by Line</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: 'AI', revenue: aiTotalMetrics.revenue, hours: aiTotalMetrics.hours },
                    { name: 'Nonprofit', revenue: npTotalMetrics.revenue, hours: npTotalMetrics.hours }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" tickFormatter={(v) => `€${(v/1000)}k`} />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                      formatter={(v) => formatCurrency(v)}
                    />
                    <Bar dataKey="revenue" fill="#3d8b5a" name="Revenue" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 style={{ color: '#999', marginBottom: '16px', fontSize: '0.85rem' }}>Hours by Line</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: 'AI', hours: aiTotalMetrics.hours },
                    { name: 'Nonprofit', hours: npTotalMetrics.hours }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    />
                    <Bar dataKey="hours" fill="#f5a623" name="Hours" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Summary Table */}
            <div style={{ marginTop: '32px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    <th style={{ textAlign: 'left', padding: '12px', color: '#999' }}>Line</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#999' }}>Clients</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#999' }}>Revenue</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#999' }}>Hours</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#999' }}>Eff. Rate</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#999' }}>Margin</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#999' }}>Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '12px', color: '#3d8b5a' }}>AI Systems</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{aiTotalMetrics.clients} ({aiTotalMetrics.workflows} wf)</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{formatCurrency(Math.round(aiTotalMetrics.revenue))}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{Math.round(aiTotalMetrics.hours)}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>€{Math.round(aiTotalMetrics.effectiveRate)}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{formatCurrency(Math.round(aiTotalMetrics.margin))}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{formatPercent(aiTotalMetrics.marginPct)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '12px', color: '#f5a623' }}>Nonprofit CRM</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{npTotalMetrics.clients}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{formatCurrency(Math.round(npTotalMetrics.revenue))}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{Math.round(npTotalMetrics.hours)}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>€{Math.round(npTotalMetrics.effectiveRate)}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{formatCurrency(Math.round(npTotalMetrics.margin))}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{formatPercent(npTotalMetrics.marginPct)}</td>
                  </tr>
                  <tr style={{ fontWeight: 700, background: '#1a1a1a' }}>
                    <td style={{ padding: '12px' }}>Total Portfolio</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{aiTotalMetrics.clients + npTotalMetrics.clients}</td>
                    <td style={{ textAlign: 'right', padding: '12px', color: '#7fd4a0' }}>{formatCurrency(Math.round(portfolioMetrics.revenue))}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{Math.round(portfolioMetrics.hours)}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>€{Math.round(portfolioMetrics.effectiveRate)}</td>
                    <td style={{ textAlign: 'right', padding: '12px', color: '#7fd4a0' }}>{formatCurrency(Math.round(portfolioMetrics.margin))}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{formatPercent(portfolioMetrics.marginPct)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ai-client' && (
          <div>
            <h3 style={{ color: '#7fd4a0', marginTop: 0 }}>Single AI Client Economics (1 workflow)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '32px' }}>
              <MetricCard label="Total Revenue" value={formatCurrency(aiWorkflowMetrics.totalRevenue)} />
              <MetricCard label="Total Hours" value={aiWorkflowMetrics.totalHours} />
              <MetricCard label="Effective Rate" value={`€${Math.round(aiWorkflowMetrics.effectiveRate)}/hr`} />
              <MetricCard label="Gross Margin" value={formatCurrency(Math.round(aiWorkflowMetrics.grossMargin))} />
              <MetricCard label="Margin %" value={formatPercent(aiWorkflowMetrics.marginPercent)} />
            </div>
            
            <h4 style={{ color: '#999', marginBottom: '16px', fontSize: '0.85rem' }}>Monthly Cash Flow Pattern ({engagementLengthMonths} months)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={aiMonthlyPattern}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis yAxisId="left" stroke="#3d8b5a" tickFormatter={(v) => `€${(v/1000)}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#f5a623" />
                <Tooltip 
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  formatter={(v, name) => [name === 'revenue' ? formatCurrency(v) : `${v} hrs`, name]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#3d8b5a" name="Revenue" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="hours" stroke="#f5a623" strokeWidth={2} name="Hours" dot={{ fill: '#f5a623' }} />
              </ComposedChart>
            </ResponsiveContainer>
            
            <div style={{ marginTop: '24px', padding: '16px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
              <h4 style={{ color: '#f5a623', marginTop: 0, fontSize: '0.85rem' }}>Pattern Insight</h4>
              <p style={{ color: '#999', fontSize: '0.85rem', margin: 0 }}>
                Months 1-{buildPhaseMonths} show elevated revenue ({formatCurrency(aiMonthlyPattern[0]?.revenue)}) and hours ({aiMonthlyPattern[0]?.hours} hrs) during the build phase.
                Post-build, maintenance stabilizes at {formatCurrency(maintenanceRetainer1WF)}/mo with just {maintenanceHoursPerMonth} hours of support work.
                This creates a natural "spike then taper" cash flow pattern per client.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'np-tiers' && (
          <div>
            <h3 style={{ color: '#7fd4a0', marginTop: 0 }}>Nonprofit Tier Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={npTierMetrics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#666" tickFormatter={(v) => `€${(v/1000)}k`} />
                <YAxis type="category" dataKey="name" stroke="#666" width={100} />
                <Tooltip 
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  formatter={(v) => formatCurrency(v)}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#f5a623" name="Revenue" radius={[0, 4, 4, 0]} />
                <Bar dataKey="margin" fill="#3d8b5a" name="Margin" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            
            <div style={{ marginTop: '32px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    <th style={{ textAlign: 'left', padding: '12px', color: '#999' }}>Tier</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#999' }}>Price</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#999' }}>Clients</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#999' }}>Revenue</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#999' }}>Hours</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#999' }}>Eff. Rate</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#999' }}>Margin</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#999' }}>Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {npTierMetrics.map(t => (
                    <tr key={t.name} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '12px', color: '#f5a623' }}>{t.name}</td>
                      <td style={{ textAlign: 'right', padding: '12px' }}>{formatCurrency(t.price)}</td>
                      <td style={{ textAlign: 'right', padding: '12px' }}>{t.clients}</td>
                      <td style={{ textAlign: 'right', padding: '12px' }}>{formatCurrency(t.revenue)}</td>
                      <td style={{ textAlign: 'right', padding: '12px' }}>{Math.round(t.hours)}</td>
                      <td style={{ textAlign: 'right', padding: '12px' }}>€{Math.round(t.effectiveRate)}</td>
                      <td style={{ textAlign: 'right', padding: '12px' }}>{formatCurrency(Math.round(t.margin))}</td>
                      <td style={{ textAlign: 'right', padding: '12px' }}>{formatPercent(t.marginPct)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: '24px', padding: '16px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
              <h4 style={{ color: '#f5a623', marginTop: 0, fontSize: '0.85rem' }}>Tier Analysis</h4>
              <p style={{ color: '#999', fontSize: '0.85rem', margin: 0 }}>
                Partnership tier yields the highest effective rate at €{Math.round(partnershipPrice / hoursPerNPClient)}/hr, 
                while Foundation offers €{Math.round(foundationPrice / hoursPerNPClient)}/hr. 
                The spread of {formatPercent((partnershipPrice / hoursPerNPClient - foundationPrice / hoursPerNPClient) / (foundationPrice / hoursPerNPClient))} between tiers 
                suggests upselling to Partnership creates meaningful margin improvement.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div>
            <h3 style={{ color: '#7fd4a0', marginTop: 0, marginBottom: '8px' }}>Scenario Sensitivity Grid</h3>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '24px' }}>
              Explore all combinations of AI and NP clients. Each cell shows profit — coloured by whether it hits your targets.
              Click any cell to apply that configuration.
            </p>
            
            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '3px', background: 'linear-gradient(135deg, #1a472a 0%, #22c55e 100%)' }}></div>
                <span style={{ color: '#999', fontSize: '0.8rem' }}>Hits profit & hours</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '3px', background: 'linear-gradient(135deg, #4a3a0a 0%, #f59e0b 100%)' }}></div>
                <span style={{ color: '#999', fontSize: '0.8rem' }}>Hits profit, exceeds hours</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '3px', background: '#1a1a1a' }}></div>
                <span style={{ color: '#999', fontSize: '0.8rem' }}>Under profit target</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '3px', border: '2px solid #7fd4a0' }}></div>
                <span style={{ color: '#999', fontSize: '0.8rem' }}>Current selection</span>
              </div>
              <div style={{ marginLeft: 'auto', color: '#666', fontSize: '0.8rem' }}>
                Target: {formatCurrency(targetProfit)} profit • {effectiveMaxHours.toLocaleString()} hrs capacity
              </div>
            </div>
            
            {/* Sensitivity Grid */}
            <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
              <div style={{ display: 'inline-block', minWidth: 'fit-content' }}>
                {/* Header Row - NP Clients */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ width: '70px', padding: '8px', textAlign: 'center' }}>
                    <span style={{ color: '#666', fontSize: '0.7rem' }}>AI ↓ NP →</span>
                  </div>
                  {sensitivityGrid.npRange.map(np => (
                    <div key={np} style={{ width: '52px', padding: '4px', textAlign: 'center' }}>
                      <span style={{ color: '#f5a623', fontSize: '0.75rem', fontWeight: 600 }}>{np}</span>
                    </div>
                  ))}
                </div>
                
                {/* Grid Rows */}
                {sensitivityGrid.grid.map((row, aiIndex) => (
                  <div key={aiIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                    {/* Row Header - AI Clients */}
                    <div style={{ width: '70px', padding: '8px', textAlign: 'center' }}>
                      <span style={{ color: '#3d8b5a', fontSize: '0.75rem', fontWeight: 600 }}>{sensitivityGrid.aiRange[aiIndex]} AI</span>
                    </div>
                    
                    {/* Cells */}
                    {row.map((cell, npIndex) => {
                      const isCurrent = cell.ai === aiClients && cell.np === (foundationClients + growthClients + partnershipClients);
                      const bgColor = cell.status === 'green' 
                        ? 'linear-gradient(135deg, #1a472a 0%, #22c55e 100%)'
                        : cell.status === 'over-hours'
                        ? 'linear-gradient(135deg, #4a3a0a 0%, #b45309 100%)'
                        : '#1a1a1a';
                      
                      return (
                        <div
                          key={npIndex}
                          onClick={() => {
                            setAiClients(cell.ai);
                            const perTier = Math.floor(cell.np / 3);
                            const remainder = cell.np % 3;
                            setFoundationClients(perTier + (remainder > 0 ? 1 : 0));
                            setGrowthClients(perTier + (remainder > 1 ? 1 : 0));
                            setPartnershipClients(perTier);
                          }}
                          style={{
                            width: '52px',
                            height: '44px',
                            background: bgColor,
                            borderRadius: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: isCurrent ? '2px solid #7fd4a0' : '1px solid #333',
                            margin: '1px',
                            transition: 'all 0.15s'
                          }}
                          onMouseOver={(e) => {
                            if (!isCurrent) e.currentTarget.style.border = '1px solid #666';
                          }}
                          onMouseOut={(e) => {
                            if (!isCurrent) e.currentTarget.style.border = '1px solid #333';
                          }}
                          title={`${cell.ai} AI + ${cell.np} NP\nRevenue: ${formatCurrency(Math.round(cell.revenue))}\nProfit: ${formatCurrency(Math.round(cell.margin))}\nHours: ${Math.round(cell.hours)}\nRate: €${Math.round(cell.effectiveRate)}/hr`}
                        >
                          <span style={{ 
                            color: cell.status === 'green' ? '#fff' : cell.status === 'over-hours' ? '#fcd34d' : '#666',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            lineHeight: 1
                          }}>
                            {cell.margin >= 1000 ? `${Math.round(cell.margin / 1000)}k` : Math.round(cell.margin)}
                          </span>
                          <span style={{
                            color: cell.hours > effectiveMaxHours ? '#ef4444' : '#666',
                            fontSize: '0.6rem',
                            lineHeight: 1,
                            marginTop: '2px'
                          }}>
                            {Math.round(cell.hours)}h
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Current Selection Details */}
            <div style={{ background: '#1a1a1a', borderRadius: '10px', padding: '20px', border: '1px solid #333', marginBottom: '24px' }}>
              <h4 style={{ color: '#7fd4a0', marginTop: 0, marginBottom: '16px', fontSize: '0.9rem' }}>
                Current Selection: {aiClients} AI + {foundationClients + growthClients + partnershipClients} NP Clients
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '4px' }}>Annual Revenue</div>
                  <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{formatCurrency(Math.round(portfolioMetrics.revenue))}</div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '4px' }}>Annual Profit</div>
                  <div style={{ color: portfolioMetrics.hitsProfit ? '#22c55e' : '#f59e0b', fontSize: '1.1rem', fontWeight: 600 }}>{formatCurrency(Math.round(portfolioMetrics.margin))}</div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '4px' }}>Total Hours</div>
                  <div style={{ color: portfolioMetrics.hitsHours ? '#22c55e' : '#ef4444', fontSize: '1.1rem', fontWeight: 600 }}>{Math.round(portfolioMetrics.hours).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '4px' }}>Effective Rate</div>
                  <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>€{Math.round(portfolioMetrics.effectiveRate)}/hr</div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '4px' }}>Margin %</div>
                  <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{formatPercent(portfolioMetrics.marginPct)}</div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '4px' }}>Utilization</div>
                  <div style={{ color: portfolioMetrics.utilizationPct > 1 ? '#ef4444' : '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{formatPercent(portfolioMetrics.utilizationPct)}</div>
                </div>
              </div>
            </div>
            
            {/* Insights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#111', padding: '16px', borderRadius: '8px', border: '1px solid #333' }}>
                <h5 style={{ color: '#7fd4a0', margin: '0 0 8px 0', fontSize: '0.85rem' }}>Reading the Grid</h5>
                <p style={{ color: '#999', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
                  Each cell shows profit (top) and hours (bottom) for that AI + NP combination. 
                  <strong style={{ color: '#22c55e' }}> Green cells</strong> hit your €{(targetProfit/1000)}k profit target within {effectiveMaxHours.toLocaleString()} hours capacity.
                  <strong style={{ color: '#f59e0b' }}> Amber cells</strong> hit profit but exceed hours — viable with {teamMode ? 'more team' : 'team mode'}.
                </p>
              </div>
              
              <div style={{ background: '#111', padding: '16px', borderRadius: '8px', border: '1px solid #333' }}>
                <h5 style={{ color: '#f5a623', margin: '0 0 8px 0', fontSize: '0.85rem' }}>NP Client Distribution</h5>
                <p style={{ color: '#999', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
                  Grid uses average NP price (€{Math.round(sensitivityGrid.avgNPPrice).toLocaleString()}) for simplicity.
                  When you click a cell, NP clients distribute evenly across tiers.
                  Fine-tune the tier mix using the Portfolio Mix sliders above.
                </p>
              </div>
            </div>
            
            {/* Demand-side section */}
            <div style={{ marginTop: '24px', padding: '20px', background: 'linear-gradient(135deg, #1a2a1f 0%, #1a1a1a 100%)', borderRadius: '8px', border: '1px solid #2d5a3d' }}>
              <h4 style={{ color: '#f5a623', marginTop: 0, fontSize: '0.9rem', marginBottom: '16px' }}>📊 From Supply-Side Model to Demand-Side Reality</h4>
              <p style={{ color: '#ccc', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.6 }}>
                This grid shows your <strong>capacity and economics</strong> — but real pricing emerges from client conversations. 
                Use the <strong style={{ color: '#7fd4a0' }}>Assumptions Calculator</strong> tab to refine pricing as you learn from proposals.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: '#111', padding: '16px', borderRadius: '6px', border: '1px solid #333' }}>
                  <h5 style={{ color: '#f5a623', margin: '0 0 12px 0', fontSize: '0.8rem' }}>Nonprofit Client Lens</h5>
                  <ul style={{ color: '#999', fontSize: '0.8rem', margin: 0, paddingLeft: '16px', lineHeight: 1.7 }}>
                    <li><strong style={{ color: '#ccc' }}>Budget-constrained buyers</strong> — Need predictable annual costs for funding applications</li>
                    <li><strong style={{ color: '#ccc' }}>Value certainty over flexibility</strong> — Fixed tiers match how they budget</li>
                    <li><strong style={{ color: '#ccc' }}>Long decision cycles</strong> — 3-6 months tied to funding; high renewal once committed</li>
                    <li><strong style={{ color: '#ccc' }}>Track:</strong> Win rate by tier, lost deal reasons, upsell success</li>
                  </ul>
                </div>
                
                <div style={{ background: '#111', padding: '16px', borderRadius: '6px', border: '1px solid #333' }}>
                  <h5 style={{ color: '#3d8b5a', margin: '0 0 12px 0', fontSize: '0.8rem' }}>AI Client Lens</h5>
                  <ul style={{ color: '#999', fontSize: '0.8rem', margin: 0, paddingLeft: '16px', lineHeight: 1.7 }}>
                    <li><strong style={{ color: '#ccc' }}>ROI-driven buyers</strong> — Calculating payback on automation investment</li>
                    <li><strong style={{ color: '#ccc' }}>Value speed & outcomes</strong> — Build + retainer anchors on delivered workflows</li>
                    <li><strong style={{ color: '#ccc' }}>Shorter decision cycles</strong> — 2-4 weeks, but higher churn if value unclear</li>
                    <li><strong style={{ color: '#ccc' }}>Track:</strong> Build price acceptance, workflow expansion, 12-month renewal</li>
                  </ul>
                </div>
              </div>
              
              <div style={{ padding: '14px', background: '#111', borderRadius: '6px', border: '1px dashed #333' }}>
                <h5 style={{ color: '#7fd4a0', margin: '0 0 8px 0', fontSize: '0.8rem' }}>🔄 How to Use This Model as You Learn</h5>
                <p style={{ color: '#999', fontSize: '0.8rem', margin: 0, lineHeight: 1.7 }}>
                  After each proposal — won or lost — go to the <strong style={{ color: '#7fd4a0' }}>Assumptions Calculator</strong> tab and adjust. 
                  Did a nonprofit balk at €15k Growth tier? Try €13k and watch the grid reshape. 
                  Did an AI prospect want 2 workflows but couldn't justify €5k/mo? Adjust the tier structure. 
                  <strong style={{ color: '#ccc' }}> By year-end, your assumptions should reflect actual market willingness-to-pay</strong>, not starting hypotheses.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '32px', padding: '16px', textAlign: 'center', color: '#666', fontSize: '0.75rem' }}>
        <p style={{ margin: 0 }}>
          Portfolio Explorer • Based on Mount Arbor Business Model Analysis • 
          {teamMode 
            ? `Team Mode: ${teamMembers} member${teamMembers > 1 ? 's' : ''} • Blended cost: €${Math.round(effectiveCostRate)}/hr • Capacity: ${effectiveMaxHours.toLocaleString()} hrs`
            : `Solo Mode • Working weeks: ${workingWeeksPerYear} • Hours/week: ${workingHoursPerWeek} • Cost: €${costPerHour}/hr`
          }
        </p>
      </div>
    </div>
  );
}
