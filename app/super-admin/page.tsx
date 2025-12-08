"use client";

import { useEffect, useState } from "react";
import { getAnalytics, getAppointmentsByStatus } from "./actions";
import { AdminLogin } from "@/components/AdminLogin";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart3, Users, UserCheck, UserX, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function SuperAdminPage() {
    const [stats, setStats] = useState({ totalBooked: 0, pending: 0, confirmed: 0, visited: 0, cancelled: 0 });
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState("");

    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [detailedRecords, setDetailedRecords] = useState<any[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Check auth
    useEffect(() => {
        const authStatus = localStorage.getItem("superAdminAuthenticated");
        if (authStatus === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    // Fetch data
    useEffect(() => {
        if (isAuthenticated) {
            fetchStats();
        }
    }, [isAuthenticated]);

    async function fetchStats() {
        const data = await getAnalytics();
        setStats(data);
        setLoading(false);
    }

    const handleLogin = (username: string, password: string) => {
        if (username === "superadmin" && password === "superadmin123") {
            setIsAuthenticated(true);
            localStorage.setItem("superAdminAuthenticated", "true");
            setError("");
        } else {
            setError("Invalid super admin credentials");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("superAdminAuthenticated");
        setStats({ totalBooked: 0, pending: 0, confirmed: 0, visited: 0, cancelled: 0 });
        setLoading(true);
    };

    const handleCardClick = async (status: string) => {
        if (selectedStatus === status) {
            // Toggle off if already selected
            setSelectedStatus(null);
            setDetailedRecords([]);
            return;
        }

        setSelectedStatus(status);
        setLoadingDetails(true);
        try {
            const records = await getAppointmentsByStatus(status);
            setDetailedRecords(records);
        } catch (error) {
            console.error("Failed to fetch records", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} error={error} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-6">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <BarChart3 className="w-8 h-8 text-indigo-600" />
                            Super Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground">Analytics and Overview</p>
                    </div>

                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-muted-foreground">Loading analytics...</div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Pending Card */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleCardClick('pending')}
                                className={`p-6 rounded-3xl shadow-sm border cursor-pointer transition-all ${selectedStatus === 'pending' ? 'bg-yellow-50 border-yellow-200 ring-2 ring-yellow-400' : 'bg-white border-slate-200 hover:shadow-md'}`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">Pending</p>
                                        <h2 className="text-3xl font-bold text-yellow-700">{stats.pending}</h2>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
                            </motion.div>

                            {/* Confirmed Card */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleCardClick('confirmed')}
                                className={`p-6 rounded-3xl shadow-sm border cursor-pointer transition-all ${selectedStatus === 'confirmed' ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-400' : 'bg-white border-slate-200 hover:shadow-md'}`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">Confirmed</p>
                                        <h2 className="text-3xl font-bold text-blue-700">{stats.confirmed}</h2>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Scheduled visits</p>
                            </motion.div>

                            {/* Visited Card */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleCardClick('visited')}
                                className={`p-6 rounded-3xl shadow-sm border cursor-pointer transition-all ${selectedStatus === 'visited' ? 'bg-green-50 border-green-200 ring-2 ring-green-400' : 'bg-white border-slate-200 hover:shadow-md'}`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                                        <UserCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">Visited</p>
                                        <h2 className="text-3xl font-bold text-green-700">{stats.visited}</h2>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Treatments completed</p>
                            </motion.div>

                            {/* All/Total Card (Non-clickable for filtering usually calls for all, but let's keep it simple stat) */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">Total</p>
                                        <h2 className="text-3xl font-bold text-slate-700">{stats.totalBooked}</h2>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Lifetime bookings</p>
                            </div>
                        </div>

                        {/* Detailed Records Section */}
                        <AnimatePresence>
                            {selectedStatus && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                            <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
                                                {selectedStatus} Appointments
                                                <span className="text-sm font-normal text-muted-foreground bg-white px-2 py-0.5 rounded-full border border-slate-200">
                                                    {detailedRecords.length}
                                                </span>
                                            </h3>
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedStatus(null)}>Close</Button>
                                        </div>

                                        {loadingDetails ? (
                                            <div className="p-12 text-center text-muted-foreground">Loading records...</div>
                                        ) : detailedRecords.length === 0 ? (
                                            <div className="p-12 text-center text-muted-foreground">No records found for this status.</div>
                                        ) : (
                                            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                                                        <tr>
                                                            <th className="px-6 py-3">Date</th>
                                                            <th className="px-6 py-3">Time</th>
                                                            <th className="px-6 py-3">Patient Name</th>
                                                            <th className="px-6 py-3">Mobile</th>
                                                            <th className="px-6 py-3">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {detailedRecords.map((record) => (
                                                            <tr key={record.id} className="bg-white border-b hover:bg-slate-50">
                                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                                    {format(new Date(record.date), "MMM d, yyyy")}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {/* Simple 12h formatter since we don't have the helper here, but most times are stored well or we can rely on string */}
                                                                    {record.time}
                                                                </td>
                                                                <td className="px-6 py-4">{record.patientName}</td>
                                                                <td className="px-6 py-4 text-slate-500">{record.patientMobile}</td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                                        ${record.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                                            record.status === 'visited' ? 'bg-green-100 text-green-800' :
                                                                                record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                                    'bg-gray-100 text-gray-800'}`}>
                                                                        {record.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
