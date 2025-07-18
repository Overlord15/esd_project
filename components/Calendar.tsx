import React, { useState } from 'react';
import type { JSX } from 'react';

interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    color: string;
    type: 'meeting' | 'conference' | 'call' | 'other';
}

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([
        {
            id: '1',
            title: 'Angular Meetup',
            date: new Date(2025, 6, 15), // July 15, 2025
            color: 'success',
            type: 'meeting'
        },
        {
            id: '2',
            title: 'JS Conference',
            date: new Date(2025, 6, 18), // July 18, 2025
            color: 'info',
            type: 'conference'
        },
        {
            id: '3',
            title: 'Vue Meetup',
            date: new Date(2025, 6, 18), // July 18, 2025
            color: 'warning',
            type: 'meeting'
        },
        {
            id: '4',
            title: 'Meeting',
            date: new Date(2025, 6, 18), // July 18, 2025
            color: 'secondary',
            type: 'meeting'
        },
        {
            id: '5',
            title: 'Angular Meetup',
            date: new Date(2025, 6, 20), // July 20, 2025
            color: 'success',
            type: 'meeting'
        },
        {
            id: '6',
            title: 'Vue Meetup',
            date: new Date(2025, 6, 22), // July 22, 2025
            color: 'warning',
            type: 'meeting'
        },
        {
            id: '7',
            title: 'Call',
            date: new Date(2025, 6, 23), // July 23, 2025
            color: 'primary',
            type: 'call'
        },
        {
            id: '8',
            title: 'React Meetup',
            date: new Date(2025, 6, 29), // July 29, 2025
            color: 'danger',
            type: 'meeting'
        }
    ]);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getEventsForDate = (date: Date): CalendarEvent[] => {
        return events.filter(event =>
            event.date.getDate() === date.getDate() &&
            event.date.getMonth() === date.getMonth() &&
            event.date.getFullYear() === date.getFullYear()
        );
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const renderCalendarDays = (): JSX.Element[] => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const today = new Date();
        const days: JSX.Element[] = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
            const prevDay = prevMonth.getDate() - (firstDay - 1 - i);
            days.push(
                <div key={`prev-${i}`} className="col p-1 border border-secondary" style={{ minHeight: '100px' }}>
                    <div className="text-muted small">{prevDay}</div>
                </div>
            );
        }

        // Add days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = getEventsForDate(date);
            const isToday = date.toDateString() === today.toDateString();

            days.push(
                <div key={day} className="col p-1 border border-secondary" style={{ minHeight: '100px' }}>
                    <div className={`small fw-bold ${isToday ? 'text-primary bg-primary bg-opacity-25 rounded-circle text-center' : ''}`}
                        style={{ width: '25px', height: '25px', lineHeight: '25px' }}>
                        {day}
                    </div>
                    <div className="mt-1">
                        {dayEvents.map((event) => (
                            <div key={event.id} className={`badge bg-${event.color} text-white mb-1 d-block text-truncate`}
                                style={{ fontSize: '0.65rem', maxWidth: '100%' }}>
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Add empty cells for days after the last day of the month
        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
        for (let i = firstDay + daysInMonth; i < totalCells; i++) {
            const nextDay = i - firstDay - daysInMonth + 1;
            days.push(
                <div key={`next-${i}`} className="col p-1 border border-secondary" style={{ minHeight: '100px' }}>
                    <div className="text-muted small">{nextDay}</div>
                </div>
            );
        }

        return days;
    };

    const renderCalendarGrid = (): JSX.Element[] => {
        const days = renderCalendarDays();
        const weeks: JSX.Element[] = [];

        for (let i = 0; i < days.length; i += 7) {
            weeks.push(
                <div key={i} className="row g-0">
                    {days.slice(i, i + 7)}
                </div>
            );
        }

        return weeks;
    };

    return (
        <div className="container-fluid vh-100 bg-dark text-white p-0">
            <div className="d-flex flex-column h-100">
                {/* Header */}
                <div className="bg-secondary p-3">
                    <div className="row align-items-center">
                        <div className="col-auto">
                            <button
                                className="btn btn-outline-light btn-sm me-2"
                                onClick={goToToday}
                            >
                                TODAY
                            </button>
                        </div>
                        <div className="col-auto">
                            <button
                                className="btn btn-outline-light btn-sm me-2"
                                onClick={() => navigateMonth('prev')}
                            >
                                <i className="bi bi-chevron-left"></i>
                                ‹
                            </button>
                            <button
                                className="btn btn-outline-light btn-sm"
                                onClick={() => navigateMonth('next')}
                            >
                                <i className="bi bi-chevron-right"></i>
                                ›
                            </button>
                        </div>
                        <div className="col">
                            <h2 className="mb-0 text-white">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                        </div>
                        <div className="col-auto d-none d-md-block">
                            <div className="dropdown">
                                <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    Month
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Month</a></li>
                                    <li><a className="dropdown-item" href="#">Week</a></li>
                                    <li><a className="dropdown-item" href="#">Day</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-primary">
                                ADD EVENT
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-grow-1 overflow-auto">
                    <div className="container-fluid h-100">
                        {/* Days of week header */}
                        <div className="row g-0 bg-secondary sticky-top">
                            {dayNames.map(day => (
                                <div key={day} className="col text-center p-2 border border-secondary">
                                    <span className="fw-bold d-none d-md-inline">{day}</span>
                                    <span className="fw-bold d-md-none">{day.slice(0, 3)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Calendar days */}
                        <div className="h-100">
                            {renderCalendarGrid()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile responsive adjustments */}
            <style>{`
        @media (max-width: 768px) {
          .container-fluid {
            padding: 0;
          }
          
          .col {
            min-height: 80px !important;
          }
          
          .badge {
            font-size: 0.5rem !important;
            padding: 0.15rem 0.3rem !important;
          }
          
          h2 {
            font-size: 1.2rem !important;
          }
          
          .btn {
            font-size: 0.8rem !important;
            padding: 0.25rem 0.5rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .col {
            min-height: 60px !important;
          }
          
          .p-1 {
            padding: 0.25rem !important;
          }
          
          .badge {
            font-size: 0.4rem !important;
            padding: 0.1rem 0.2rem !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Calendar;