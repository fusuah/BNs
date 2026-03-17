"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

export default function MalnutritionAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/superAdmin/analytics/malnutrition-stats")
      .then((res) => res.json())
      .then((apiData) => {
        // Handle if API returns { success: true, data: [...] } or just [...]
        const rawData = Array.isArray(apiData) ? apiData : (apiData.data || []);
        
        // Transform for chart
        const formatted = rawData.map(d => ({
            name: d.name || "Unknown",
            Normal: d.normalCount || 0,
            // Sum all malnutrition types for the "Malnourished" bar
            Malnourished: (d.underweightCount || 0) + (d.overweightCount || 0) + (d.stuntedCount || 0) + (d.wastedCount || 0),
            details: d.malnourishedList || []
        }));
        
        setData(formatted);
        setLoading(false);
      })
      .catch(err => {
          console.error("Failed to load malnutrition analytics", err);
          setLoading(false);
      });
  }, []);

  if (loading) {
      return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center h-full min-h-[400px]">
            <span className="loading loading-spinner loading-md text-[#4CAF50]"></span>
            <p className="text-gray-500 mt-2 text-sm">Loading analytics...</p>
        </div>
      );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="font-bold text-lg text-gray-800">Malnutrition Cases per Barangay</h3>
        <p className="text-sm text-gray-500">Overview of nutritional status distribution across barangays</p>
      </div>
      
      {/* Chart Section */}
      <div className="h-[300px] w-full mb-6 shrink-0">
        {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                    dataKey="name" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={40}
                />
                <YAxis 
                    allowDecimals={false} 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    cursor={{ fill: '#f9fafb' }}
                />
                <Legend verticalAlign="top" height={36} iconSize={8} fontSize={12}/>
                <Bar dataKey="Normal" name="Normal Status" stackId="a" fill="#4ade80" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Malnourished" name="Malnourished" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-sm">No malnutrition data available</p>
            </div>
        )}
      </div>

      {/* Feeding Program Candidate List */}
      <div className="flex-grow flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                Candidates for Feeding Program
            </h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                {data.reduce((acc, curr) => acc + (curr.details?.length || 0), 0)} Candidates
            </span>
        </div>
        
        <div className="flex-grow overflow-y-auto border border-gray-200 rounded-lg bg-white relative">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10 text-xs uppercase text-gray-500 font-medium">
              <tr>
                <th className="p-3 border-b border-gray-200 w-1/3">Barangay</th>
                <th className="p-3 border-b border-gray-200 w-1/3">Child Name</th>
                <th className="p-3 border-b border-gray-200 w-1/3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((brgy) => (
                 (brgy.details && brgy.details.length > 0) ? (
                     brgy.details.map((child, idx) => (
                        <tr key={`${brgy.name}-${idx}`} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 text-gray-600 font-medium text-xs">{brgy.name}</td>
                          <td className="p-3 font-medium text-gray-900 text-xs">{child.name}</td>
                          <td className="p-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold capitalize leading-tight
                                ${child.status.includes('severely') ? 'bg-red-50 text-red-700 border border-red-100' : 
                                  child.status.includes('overweight') ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : 
                                  'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                                {child.status}
                              </span>
                          </td>
                        </tr>
                      ))
                 ) : null
              ))}
              {data.every(d => !d.details || d.details.length === 0) && (
                  <tr>
                      <td colSpan="3" className="p-8 text-center text-gray-400 text-xs">
                          No malnourished candidates found. Great job!
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}