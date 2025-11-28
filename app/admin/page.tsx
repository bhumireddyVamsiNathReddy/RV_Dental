"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllAppointments } from "./actions";
import { motion } from "framer-motion";
import { format, isSameDay, isSameMonth, parseISO } from "date-fns";
import { AdminLogin } from "@/components/AdminLogin";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar } from "lucide-react";

export default function AdminPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState("");
    const [filterMode, setFilterMode] = useState<"all" | "date" | "month">("all");
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));

    // Check if user is already logged in
    useEffect(() => {
        const authStatus = localStorage.getItem("adminAuthenticated");
        if (authStatus === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    // Fetch appointments when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            async function fetchData() {
                const data = await getAllAppointments();
                setAppointments(data);
                setLoading(false);
            }
            fetchData();
        }
    }, [isAuthenticated]);

    // Filter appointments based on date filter
    const filteredAppointments = useMemo(() => {
        if (filterMode === "all") return appointments;

        return appointments.filter(apt => {
            const aptDate = parseISO(apt.date);

            if (filterMode === "date") {
                return isSameDay(aptDate, parseISO(selectedDate));
            }

            if (filterMode === "month") {
                return isSameMonth(aptDate, parseISO(selectedMonth));
            }

            return true;
        });
    }, [appointments, filterMode, selectedDate, selectedMonth]);

    const handleLogin = (username: string, password: string) => {
        // Simple credential check (credentials: admin / admin123)
        if (username === "admin" && password === "admin123") {
            setIsAuthenticated(true);
            localStorage.setItem("adminAuthenticated", "true");
            setError("");
        } else {
            setError("Invalid username or password");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("adminAuthenticated");
        setAppointments([]);
        setLoading(true);
    };

    // Show login page if not authenticated
    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} error={error} />;
    }

    return (
        <div className="min-h-screen bg-secondary/30 pt-24 pb-12 px-4 md:px-6">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage all appointments and bookings.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Date Filter */}
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-border">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <select
                                value={filterMode}
                                onChange={(e) => setFilterMode(e.target.value as any)}
                                className="text-sm font-medium bg-transparent border-none outline-none cursor-pointer"
                            >
                                <option value="all">All Dates</option>
                                <option value="date">Select Date</option>
                                <option value="month">Select Month</option>
                            </select>

                            {filterMode === "date" && (
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="text-sm border rounded px-2 py-1 ml-2"
                                />
                            )}

                            {filterMode === "month" && (
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="text-sm border rounded px-2 py-1 ml-2"
                                />
                            )}
                        </div>

                        {/* Stats */}
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-border">
                            <span className="text-sm font-medium text-muted-foreground">Showing: </span>
                            <span className="text-lg font-bold text-primary">{filteredAppointments.length}</span>
                            <span className="text-sm text-muted-foreground"> / {appointments.length}</span>
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
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 overflow-hidden">
                    <div className="p-6 border-b border-border/50">
                        <h2 className="text-xl font-semibold">All Appointments</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-muted-foreground">Loading appointments...</div>
                    ) : filteredAppointments.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">No appointments found for the selected filter.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary/50">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Date</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Time</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Patient</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Mobile</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Email</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Reason</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAppointments.map((apt, index) => (
                                        <motion.tr
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-border/50 last:border-0 hover:bg-white/50 transition-colors"
                                        >
                                            <td className="py-4 px-6 font-medium">{format(new Date(apt.date), "MMM d, yyyy")}</td>
                                            <td className="py-4 px-6">{apt.time}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {apt.patientName.charAt(0)}
                                                    </div>
                                                    <span className="font-medium">{apt.patientName}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-muted-foreground">{apt.patientMobile}</td>
                                            <td className="py-4 px-6 text-sm text-muted-foreground">{apt.patientEmail || "-"}</td>
                                            <td className="py-4 px-6 text-sm text-muted-foreground max-w-xs truncate" title={apt.reasonForVisit}>{apt.reasonForVisit || "-"}</td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {apt.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
