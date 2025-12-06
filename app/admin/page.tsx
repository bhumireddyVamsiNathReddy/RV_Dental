"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllAppointments, getDoctorAvailability, updateDoctorAvailability } from "./actions";
import { motion } from "framer-motion";
import { format, isSameDay, isSameMonth, parseISO } from "date-fns";
import { AdminLogin } from "@/components/AdminLogin";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar, Clock, Save, Plus, Trash, MessageCircle, ArrowUpDown } from "lucide-react";

export default function AdminPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState("");
    const [filterMode, setFilterMode] = useState<"all" | "date" | "month">("all");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
    const [availability, setAvailability] = useState<{ day: string; slots: string[] }[]>([]);
    const [isEditingAvailability, setIsEditingAvailability] = useState(false);
    const [savingAvailability, setSavingAvailability] = useState(false);

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
                const [appointmentsData, availabilityData] = await Promise.all([
                    getAllAppointments(),
                    getDoctorAvailability()
                ]);
                setAppointments(appointmentsData);
                setAvailability(availabilityData);
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
        }).sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });
    }, [appointments, filterMode, selectedDate, selectedMonth, sortOrder]);

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

    const handleSaveAvailability = async () => {
        setSavingAvailability(true);
        try {
            await updateDoctorAvailability(availability);
            setIsEditingAvailability(false);
        } catch (error) {
            console.error("Failed to save availability:", error);
            alert("Failed to save availability settings");
        } finally {
            setSavingAvailability(false);
        }
    };

    const updateDaySlots = (dayIndex: number, newSlots: string[]) => {
        const newAvailability = [...availability];
        newAvailability[dayIndex].slots = newSlots;
        setAvailability(newAvailability);
    };

    const generateTimeSlots = (start: string, end: string) => {
        const slots = [];
        let current = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);

        while (current <= endHour) {
            slots.push(`${current.toString().padStart(2, '0')}:00`);
            current++;
        }
        return slots;
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

                        {/* Sort Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white border-border gap-2"
                            onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
                        >
                            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                            <span className="hidden sm:inline">
                                {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                            </span>
                        </Button>

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
                                        <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
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
                                            <td className="py-4 px-6">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 gap-2 bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                                    onClick={() => {
                                                        const message = `*Appointment Confirmed - RV Dental* ✅

Hello *${apt.patientName}*! 👋

Your dental appointment has been successfully booked.

📅 *Date:* ${format(new Date(apt.date), "EEEE, MMMM d, yyyy")}
🕒 *Time:* ${apt.time}
📍 *Location:* RV Dental Clinic
https://maps.app.goo.gl/27wKYbcREX7UPaLs6

📞 For changes or queries, call: +91 9493195941

We look forward to seeing you!

*RV Dental - Your Smile, Our Priority* 🦷`;
                                                        window.open(`https://wa.me/${apt.patientMobile}?text=${encodeURIComponent(message)}`, '_blank');
                                                    }}
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span className="sr-only sm:not-sr-only sm:inline-block">WhatsApp</span>
                                                </Button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Availability Settings Section */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 overflow-hidden">
                    <div className="p-6 border-b border-border/50 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Availability Settings</h2>
                        {!isEditingAvailability ? (
                            <Button onClick={() => setIsEditingAvailability(true)} variant="outline" size="sm">
                                Edit Availability
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button onClick={() => setIsEditingAvailability(false)} variant="ghost" size="sm">
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveAvailability} disabled={savingAvailability} size="sm">
                                    {savingAvailability ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availability.map((daySchedule, index) => (
                                <div key={daySchedule.day} className={`p-4 rounded-xl border ${daySchedule.slots.length > 0 ? 'bg-white border-border' : 'bg-gray-50 border-transparent'}`}>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-medium">{daySchedule.day}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${daySchedule.slots.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                            {daySchedule.slots.length > 0 ? 'Open' : 'Closed'}
                                        </span>
                                    </div>

                                    {isEditingAvailability ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-muted-foreground">Status:</label>
                                                <select
                                                    className="text-sm border rounded p-1"
                                                    value={daySchedule.slots.length > 0 ? "open" : "closed"}
                                                    onChange={(e) => {
                                                        if (e.target.value === "closed") {
                                                            updateDaySlots(index, []);
                                                        } else {
                                                            // Default to 10am - 8pm
                                                            updateDaySlots(index, generateTimeSlots("10:00", "20:00"));
                                                        }
                                                    }}
                                                >
                                                    <option value="open">Open</option>
                                                    <option value="closed">Closed</option>
                                                </select>
                                            </div>

                                            {daySchedule.slots.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-xs text-muted-foreground w-8">Start:</label>
                                                        <select
                                                            className="text-sm border rounded p-1 w-full"
                                                            value={daySchedule.slots[0]}
                                                            onChange={(e) => {
                                                                const start = e.target.value;
                                                                const end = daySchedule.slots[daySchedule.slots.length - 1];
                                                                updateDaySlots(index, generateTimeSlots(start, end));
                                                            }}
                                                        >
                                                            {Array.from({ length: 24 }).map((_, i) => (
                                                                <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                                                    {`${i.toString().padStart(2, '0')}:00`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-xs text-muted-foreground w-8">End:</label>
                                                        <select
                                                            className="text-sm border rounded p-1 w-full"
                                                            value={daySchedule.slots[daySchedule.slots.length - 1]}
                                                            onChange={(e) => {
                                                                const start = daySchedule.slots[0];
                                                                const end = e.target.value;
                                                                updateDaySlots(index, generateTimeSlots(start, end));
                                                            }}
                                                        >
                                                            {Array.from({ length: 24 }).map((_, i) => (
                                                                <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                                                    {`${i.toString().padStart(2, '0')}:00`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">
                                            {daySchedule.slots.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {daySchedule.slots.length > 4 ? (
                                                        <>
                                                            <span className="bg-secondary px-1.5 py-0.5 rounded text-xs">{daySchedule.slots[0]}</span>
                                                            <span>-</span>
                                                            <span className="bg-secondary px-1.5 py-0.5 rounded text-xs">{daySchedule.slots[daySchedule.slots.length - 1]}</span>
                                                        </>
                                                    ) : (
                                                        daySchedule.slots.map(slot => (
                                                            <span key={slot} className="bg-secondary px-1.5 py-0.5 rounded text-xs">{slot}</span>
                                                        ))
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="italic">No slots available</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
