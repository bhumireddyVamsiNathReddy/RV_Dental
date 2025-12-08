"use client";
"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getAvailableSlots, bookSlot } from "@/app/actions";
import { Loader2, CheckCircle, AlertCircle, Calendar, Clock, User, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookingPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [slots, setSlots] = useState<any[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    // Form State
    const [patientName, setPatientName] = useState("");
    const [patientMobile, setPatientMobile] = useState("");
    const [patientEmail, setPatientEmail] = useState("");
    const [reasonForVisit, setReasonForVisit] = useState("");

    // Generate next 14 days
    const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

    useEffect(() => {
        async function fetchSlots() {
            setLoadingSlots(true);
            const dateStr = selectedDate.toISOString().split('T')[0];
            try {
                const fetchedSlots = await getAvailableSlots(dateStr);
                setSlots(fetchedSlots || []);
            } catch (error) {
                console.error("Failed to fetch slots", error);
            } finally {
                setLoadingSlots(false);
            }
        }
        fetchSlots();
    }, [selectedDate]);

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot || !patientName || !patientMobile) return;

        setBookingStatus('loading');
        const dateStr = selectedDate.toISOString().split('T')[0];

        const result = await bookSlot(dateStr, selectedSlot, {
            name: patientName,
            mobile: patientMobile,
            email: patientEmail,
            reasonForVisit: reasonForVisit
        });

        if (result.success) {
            setBookingStatus('success');
            // Refresh slots
            const fetchedSlots = await getAvailableSlots(dateStr);
            setSlots(fetchedSlots || []);
            // Clear form but keep success state
        } else {
            setBookingStatus('error');
            setErrorMessage(result.error || "Booking failed");
        }
    };

    const resetSelection = () => {
        setSelectedSlot(null);
        setBookingStatus('idle');
        setErrorMessage("");
    };

    const formatTime = (time: string) => {
        // If already has AM/PM, return as is (normalized)
        if (time.toLowerCase().includes('m')) return time;

        const [hours, minutes] = time.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    return (
        <div className="min-h-screen bg-secondary/30 pt-24 pb-12 px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold">Book Your Visit</h1>
                    <p className="text-muted-foreground">Select a date and time for your appointment.</p>
                </div>

                {/* Date Selection */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/20 overflow-x-auto">
                    <div className="flex gap-4 min-w-max pb-2">
                        {dates.map((date) => {
                            const isSelected = date.toDateString() === selectedDate.toDateString();
                            return (
                                <button
                                    key={date.toISOString()}
                                    onClick={() => {
                                        setSelectedDate(date);
                                        resetSelection();
                                    }}
                                    className={cn(
                                        "flex flex-col items-center justify-center w-20 h-24 rounded-2xl transition-all duration-300 border",
                                        isSelected
                                            ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                                            : "bg-white hover:bg-secondary border-transparent hover:border-border"
                                    )}
                                >
                                    <span className="text-xs font-medium uppercase opacity-80">{format(date, "EEE")}</span>
                                    <span className="text-2xl font-bold">{format(date, "d")}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Slots Selection */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-white/20 min-h-[400px]">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Available Slots
                        </h2>

                        {loadingSlots ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : slots.length === 0 ? (
                            <div className="text-center text-muted-foreground py-12">
                                No slots available for this date.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {slots.map((slot) => (
                                    <button
                                        key={slot.time}
                                        disabled={slot.isBooked}
                                        onClick={() => {
                                            setSelectedSlot(slot.time);
                                            setBookingStatus('idle');
                                        }}
                                        className={cn(
                                            "py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 border",
                                            slot.isBooked
                                                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50 border-transparent"
                                                : selectedSlot === slot.time
                                                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                                                    : "bg-white hover:border-primary/50 border-border"
                                        )}
                                    >
                                        {formatTime(slot.time)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Booking Form */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-white/20 min-h-[400px] flex flex-col">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Your Details
                        </h2>

                        <AnimatePresence mode="wait">
                            {!selectedSlot ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-8"
                                >
                                    <Calendar className="h-12 w-12 mb-4 opacity-20" />
                                    <p>Please select a time slot to proceed with booking.</p>
                                </motion.div>
                            ) : bookingStatus === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
                                >
                                    <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                        <CheckCircle className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-green-800">Booking Confirmed!</h3>
                                    <p className="text-muted-foreground">
                                        Your appointment is set for <br />
                                        <span className="font-semibold text-foreground">
                                            {format(selectedDate, "MMMM d, yyyy")} at {formatTime(selectedSlot)}
                                        </span>
                                    </p>
                                    <Button onClick={() => {
                                        resetSelection();
                                        setPatientName("");
                                        setPatientMobile("");
                                        setPatientEmail("");
                                        setReasonForVisit("");
                                    }} variant="outline" className="mt-4">
                                        Book Another
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleBook}
                                    className="space-y-4 flex-1 flex flex-col"
                                >
                                    <div className="p-4 bg-primary/5 rounded-xl mb-2 border border-primary/10">
                                        <p className="text-sm font-medium text-primary">
                                            Selected: {format(selectedDate, "MMM d")} at {formatTime(selectedSlot)}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="John Doe"
                                                value={patientName}
                                                onChange={(e) => setPatientName(e.target.value)}
                                                className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Mobile Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <input
                                                required
                                                type="tel"
                                                placeholder="1234567890"
                                                value={patientMobile}
                                                onChange={(e) => setPatientMobile(e.target.value)}
                                                className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Email (Optional)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                value={patientEmail}
                                                onChange={(e) => setPatientEmail(e.target.value)}
                                                className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Reason for Visit (Optional)</label>
                                        <textarea
                                            placeholder="E.g., Regular checkup, Tooth pain, Cleaning, etc."
                                            value={reasonForVisit}
                                            onChange={(e) => setReasonForVisit(e.target.value)}
                                            className="w-full h-20 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                                        />
                                    </div>

                                    {bookingStatus === 'error' && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}

                                    <div className="flex-1" />

                                    <Button
                                        type="submit"
                                        disabled={bookingStatus === 'loading'}
                                        className="w-full h-12 text-lg rounded-xl mt-4"
                                    >
                                        {bookingStatus === 'loading' ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Confirming...
                                            </>
                                        ) : (
                                            'Confirm Booking'
                                        )}
                                    </Button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
