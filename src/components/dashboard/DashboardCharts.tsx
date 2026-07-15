"use client";
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from "recharts";
import { DashboardStats } from "@/types";
import { formatCurrency } from "@/utils/helpers";

const COLORS  = ["#1B3A5C","#F0A500","#0C9070","#6366f1","#ec4899","#f97316","#84cc16","#06b6d4"];
const TIP_STYLE = {
  contentStyle: { background:"#fff", border:"1px solid #e2e8f0", borderRadius:"12px", fontSize:"13px", fontFamily:"Inter,sans-serif", boxShadow:"0 4px 24px rgba(27,58,92,0.10)" },
  cursor:        { fill:"rgba(27,58,92,.04)" },
};

export default function DashboardCharts({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Bar: Packages by Country */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-1">Packages by Country</h3>
        <p className="text-xs text-slate-400 mb-5">Distribution of tour packages by destination</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={stats.packagesByCountry} barSize={28} margin={{left:-10}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,58,92,.08)" vertical={false}/>
            <XAxis dataKey="country" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} allowDecimals={false}/>
            <Tooltip {...TIP_STYLE} formatter={(v:number)=>[v,"Packages"]}/>
            <Bar dataKey="count" radius={[6,6,0,0]}>
              {stats.packagesByCountry.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie: Bookings by Category */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-1">Bookings by Category</h3>
        <p className="text-xs text-slate-400 mb-5">Which tour types are most popular</p>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={stats.bookingsByCategory} dataKey="count" nameKey="category"
              cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}
              label={({name,percent}) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
              {stats.bookingsByCategory.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
            </Pie>
            <Tooltip contentStyle={TIP_STYLE.contentStyle} formatter={(v:number)=>[v,"Bookings"]}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line: Monthly Bookings */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-1">Monthly Bookings</h3>
        <p className="text-xs text-slate-400 mb-5">Confirmed booking volume over time</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={stats.monthlyBookings} margin={{left:-10}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,58,92,.08)" vertical={false}/>
            <XAxis dataKey="month" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} allowDecimals={false}/>
            <Tooltip {...TIP_STYLE} formatter={(v:number)=>[v,"Bookings"]}/>
            <Line type="monotone" dataKey="bookings" stroke="#1B3A5C" strokeWidth={2.5}
              dot={{fill:"#1B3A5C",r:4}} activeDot={{r:6,fill:"#F0A500"}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Area: Monthly Revenue */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-1">Monthly Revenue</h3>
        <p className="text-xs text-slate-400 mb-5">Revenue trend over the past 6 months</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={stats.monthlyBookings} margin={{left:-10}}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#0C9070" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#0C9070" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,58,92,.08)" vertical={false}/>
            <XAxis dataKey="month" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}
              tickFormatter={(v)=>`$${(v/1000).toFixed(0)}k`}/>
            <Tooltip {...TIP_STYLE} formatter={(v:number)=>[formatCurrency(v),"Revenue"]}/>
            <Area type="monotone" dataKey="revenue" stroke="#0C9070" strokeWidth={2.5}
              fill="url(#revGrad)" dot={{fill:"#0C9070",r:4}} activeDot={{r:6,fill:"#F0A500"}}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
