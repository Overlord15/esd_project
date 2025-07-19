import React, { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

interface CalendarReminder {
    id: string;
    userId: string;
    date: string; // "DD/MM/YYYY"
    title: string;
    description: string;
    createdAt: number;
}

// Convert JS Date ("Date" object) to "DD/MM/YYYY"
const toIndian = (date: Date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
};

// Convert "YYYY-MM-DD" to "DD/MM/YYYY"
const ymdToIndian = (ymd: string) => {
    if (!ymd) return "";
    const [y, m, d] = ymd.split("-");
    return `${d}/${m}/${y}`;
};

// Convert "DD/MM/YYYY" to "YYYY-MM-DD"
const indianToYMD = (indian: string) => {
    if (!indian) return "";
    const [d, m, y] = indian.split("/");
    return `${y}-${m}-${d}`;
};

// Calendar grid helper
const getMonthDays = (year: number, month: number) => {
    const firstDate = new Date(year, month, 1);
    const firstDay = firstDate.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = (firstDay + 6) % 7;
    const days: (Date | null)[] = [];
    for (let i = 0; i < prevDays; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    while (days.length % 7 !== 0) days.push(null);
    return days;
};

const Calendar: React.FC = () => {
    const userSession = JSON.parse(localStorage.getItem("userSession") || "{}");
    const userId = userSession.uid;
    const [current, setCurrent] = useState(() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });
    const [reminders, setReminders] = useState<Record<string, CalendarReminder[]>>({});
    // Internal state: "YYYY-MM-DD"
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const now = new Date();
        return now.toISOString().slice(0, 10);
    });
    const [showModal, setShowModal] = useState(false);
    const [modalTask, setModalTask] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(false);

    const daysArr = getMonthDays(current.year, current.month);
    const todayKey = toIndian(new Date()); // For grid/badge display
    const monthStr = new Date(current.year, current.month).toLocaleString("default", { month: "long", year: "numeric" });
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Fetch reminders for month
    const fetchReminders = useCallback(async () => {
        setLoading(true);
        console.log("Fetching reminders, userId:", userId);
        const ref = collection(db, "calendar_reminders");
        const snap = await getDocs(ref);
        if (snap.empty) {
            console.log("No reminders found in collection.");
            setReminders({});
        } else {
            console.log("Reminders found in collection:", snap.size);
            const all: Record<string, CalendarReminder[]> = {};
            snap.forEach(doc => {
                const data = doc.data() as CalendarReminder;
                console.log("Fetched doc:", data);
                if (!all[data.date]) all[data.date] = [];
                all[data.date].push({ ...data, id: doc.id });
            });
            setReminders(all);
        }
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        fetchReminders();
    }, [fetchReminders]);

    // Add and refresh reminders after
    const addReminder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modalTask.title || !selectedDate) return;
        const indianDate = ymdToIndian(selectedDate);
        const ref = collection(db, "calendar_reminders");
        await addDoc(ref, {
            userId,
            date: indianDate,
            title: modalTask.title,
            description: modalTask.description,
            createdAt: Date.now()
        });
        setModalTask({ title: "", description: "" });
        setShowModal(false);
        console.log("Task is added:", { userId, date: indianDate, ...modalTask });
        await fetchReminders();
    };

    return (
        <div className="container py-4">
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <button className="btn btn-outline-primary" onClick={() => setCurrent(c => ({
                                    year: c.month - 1 >= 0 ? c.year : c.year - 1,
                                    month: c.month - 1 >= 0 ? c.month - 1 : 11,
                                }))}><i className="bi bi-chevron-left"></i></button>
                                <h4 className="mb-0">{monthStr}</h4>
                                <button className="btn btn-outline-primary" onClick={() => setCurrent(c => ({
                                    year: c.month + 1 <= 11 ? c.year : c.year + 1,
                                    month: c.month + 1 <= 11 ? c.month + 1 : 0,
                                }))}><i className="bi bi-chevron-right"></i></button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered calendar-table m-0" style={{ tableLayout: "fixed" }}>
                                    <thead>
                                        <tr>
                                            {weekDays.map(wd => <th key={wd} className="text-center text-secondary small">{wd}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[0, 1, 2, 3, 4, 5].map((weekIdx) => (
                                            <tr key={weekIdx}>
                                                {daysArr.slice(weekIdx * 7, weekIdx * 7 + 7).map((day, i2) => {
                                                    if (!day) {
                                                        return <td key={i2} style={{ background: "#f8f9fa" }} />;
                                                    }
                                                    const key = toIndian(day); // Grid key is "DD/MM/YYYY"
                                                    const hasEvent = reminders[key]?.length > 0;
                                                    const isToday = key === todayKey;
                                                    return (
                                                        <td
                                                            key={key}
                                                            className={`p-0 align-top ${isToday ? 'bg-primary bg-opacity-10 border-primary' : ''}`}
                                                            style={{ height: "85px", cursor: "pointer", verticalAlign: "top", position: 'relative' }}
                                                            onClick={() => {
                                                                setSelectedDate(indianToYMD(key)); // When clicking day, store "YYYY-MM-DD" for the input
                                                                setShowModal(true);
                                                            }}
                                                        >
                                                            <div className="ps-1 pt-1 fw-bold" style={{ color: isToday ? "#0d6efd" : undefined }}>
                                                                {day.getDate()}
                                                                {hasEvent && (
                                                                    <span style={{
                                                                        display: "inline-block",
                                                                        marginLeft: "0.4em",
                                                                        background: "#0d6efd",
                                                                        borderRadius: "50%",
                                                                        width: "10px",
                                                                        height: "10px",
                                                                        boxShadow: "0 0 4px #0d6efd",
                                                                    }} title="Has reminders"></span>
                                                                )}
                                                            </div>
                                                            {hasEvent && <div className="ps-1 small text-truncate text-secondary">{reminders[key][0].title}{reminders[key].length > 1 ? ` (+${reminders[key].length - 1} more)` : ''}</div>}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span className="fw-semibold"><i className="bi bi-bell"></i> Reminders</span>
                            <button className="btn btn-sm btn-success" onClick={() => { setSelectedDate(new Date().toISOString().slice(0,10)); setShowModal(true); }}>+ Add Task</button>
                        </div>
                        <div className="card-body" style={{ overflowY: 'auto', maxHeight: 400 }}>
                            {(() => {
                                const key = ymdToIndian(selectedDate);
                                return reminders[key]?.length > 0 ? (
                                    reminders[key].map(item => (
                                        <div className="mb-3" key={item.id}>
                                            <div className="d-flex align-items-center mb-1">
                                                <span className="badge bg-primary me-2">{key.slice(0,2)}/{key.slice(3,5)}</span>
                                                <span className="fw-bold">{item.title}</span>
                                            </div>
                                            <div className="text-muted small mb-1">{item.description}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted py-3 text-center">No reminders or tasks for this date.<br /><br />Click any day in calendar to view/add.</div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal fade${showModal ? " show d-block" : ""}`} tabIndex={-1} style={showModal ? { background: "rgba(0,0,0,0.3)" } : {}} role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Task / Reminder</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <form onSubmit={addReminder}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input className="form-control"
                                        value={modalTask.title}
                                        onChange={e => setModalTask({ ...modalTask, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Date</label>
                                    <input className="form-control"
                                        type="date"
                                        value={selectedDate || ""}
                                        onChange={e => setSelectedDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-control"
                                        value={modalTask.description}
                                        onChange={e => setModalTask({ ...modalTask, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
