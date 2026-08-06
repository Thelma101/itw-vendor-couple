import React, { useState } from 'react';

const initialEvents: Record<string, { time: number; title: string }[]> = {
    '2025-06-18': [
        { time: 9, title: 'Sermon' },
        { time: 10, title: 'Blessing of Marriage' },
        { time: 11, title: 'Ceremony' },
    ],
    '2025-06-17': [
        { time: 9, title: 'Sermon' },
        { time: 10, title: 'Cutting of Cake Ceremony' },
        { time: 11, title: 'Dance, Dance' }
    ],
    '2025-06-19': [
        { time: 9, title: 'Welcoming' },
        { time: 10, title: 'Throwing bouquet' }
    ],
};

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfWeek = (year: number, month: number) => new Date(year, month, 1).getDay();

const today = new Date();

const CalendarSection: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [eventsByDate, setEventsByDate] = useState(initialEvents);

    const days = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfWeek(currentYear, currentMonth);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleSelectedDate = (day: number) => {
        setSelectedDate(new Date(currentYear, currentMonth, day));
    };

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const selectedDateKey = `${year}-${month}-${day}`;
    const events = eventsByDate[selectedDateKey] || [];
    const maxEvents = 10;

    const handleEventChange = (idx: number, field: 'time' | 'title', value: string) => {
        setEventsByDate(prev => {
            const updated = [...(prev[selectedDateKey] || [])];
            if (field === 'time') {
                const num = value === '' ? 0 : Number(value);
                updated[idx] = { ...updated[idx], time: num };
            } else {
                updated[idx] = { ...updated[idx], title: value };
            }
            return { ...prev, [selectedDateKey]: updated };
        });
    };

    const handleEventInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
    };

    const handleAddEvent = () => {
        if (events.length >= maxEvents) return;
        setEventsByDate(prev => {
            const updated = [...(prev[selectedDateKey] || []), { time: 0, title: '' }];
            return { ...prev, [selectedDateKey]: updated };
        });
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    return (
        <section className="relative flex flex-col md:flex-row bg-[#DBFCFF] text-primary-dark px-4 md:px-24 pt-8 pb-0 md:pt-24 md:pb-40 overflow-visible mb-32 md:mb-72">
            <div className="flex flex-col items-start justify-center gap-4 md:gap-5 md:px-9 mb-8 md:mb-0 z-10">
                <div className="flex flex-col gap-3 md:gap-5">
                    <p className="font-bold text-2xl md:text-3xl">Enjoy the flexibility</p>
                    <p className="text-sm md:text-base">of planning a wedding from the comfort of your home within a single App.</p>
                    </div>
                    <div className="flex w-full border-[0.5px] border-primary-gray"></div>
                    <div>
                    <p className="text-base md:text-xl font-semibold leading-loose">Set your editable dates</p>
                    </div>
                    <div className="flex w-full border-[0.5px] border-primary-gray"></div>
                    <div>
                    <p className="text-base md:text-xl font-semibold leading-loose">Track your events in real time</p>
                    </div>
                    <div className="flex w-full border-[0.5px] border-primary-gray"></div>
                    <div>
                    <p className="text-base md:text-xl font-semibold leading-loose">Set a push Notification across all platform</p>
                </div>
            </div>
            <div className="flex items-start justify-center relative w-full md:w-[500px] mx-auto">
                <div className="flex flex-col bg-white rounded-xl border-[0.5px] border-primary md:h-auto md:min-h-[608px] md:max-h-[800px] md:border-[0.5px] 
                md:border-primary-gray md:gap-5 p-8 md:px-10 md:py-[72px] md:rounded-5 w-full md:w-[400px] shadow-lg
                    md:absolute md:right-0 md:mb-[-80px] md:z-20 h-full justify-between">
                    <div className="w-full h-full flex flex-col justify-between text-xs md:text-base">
                        <div>
                            <div className="flex items-center justify-between mb-2 md:mb-3 gap-5">
                                <div className="flex items-start justify-start font-semibold">
                                    <span className="font-semibold">{monthNames[currentMonth]} {currentYear}</span>
                                </div>
                                <div className="flex items-end justify-end mb-2 md:mb-3 gap-3 font-semibold">
                                    <button onClick={handlePrevMonth} className="text-gray-500 hover:text-gray-700">&lt;</button>
                                    <button onClick={handleNextMonth} className="text-gray-500 hover:text-gray-700">&gt;</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-5 text-center text-gray-500 mb-1 font-semibold">
                                {weekDays.map((d) => (<div key={d} className="font-medium">{d}</div>))}
                            </div>
                            <div className="grid grid-cols-7 gap-5 mb-2 md:mb-3">
                                {Array(firstDay === 0 ? 6 : firstDay - 1).fill(null).map((_, i) => (<div key={i}></div>))}
                                {Array.from({ length: days }, (_, i) => {
                                    const dayNum = i + 1;
                                    const isSelected = selectedDate.getDate() === dayNum && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
                                    return (
                                        <button
                                            key={dayNum}
                                            onClick={() => handleSelectedDate(dayNum)}
                                            className={`flex items-center justify-center w-full h-full text-center text-gray-500 hover:text-gray-700 rounded-full transition-colors text-xs md:text-base ${isSelected ? 'bg-primary text-white' : ''}`}
                                        >
                                            {dayNum}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="mt-4 flex-1 flex flex-col justify-between">
                            {events.length > 0 ? (
                                <ul className="flex-1 overflow-y-auto max-h-[260px] md:max-h-[340px] pr-1">
                                    {events.map((event, idx) => (
                                        <li key={idx} className="mb-1 flex gap-2 items-center">
                                            <input
                                                type="number"
                                                step="0.5"
                                                value={event.time === 0 ? '' : event.time}
                                                onChange={e => handleEventChange(idx, 'time', e.target.value)}
                                                onBlur={e => handleEventChange(idx, 'time', e.target.value)}
                                                onKeyDown={handleEventInputKeyDown}
                                                className="w-12 md:w-14 px-1 py-0.5 text-xs md:text-sm text-gray-600 border-b border-gray-200 focus:outline-none focus:border-cyan-600 bg-transparent"
                                                aria-label="Event time"
                                                placeholder="Time"
                                            />
                                            <input
                                                type="text"
                                                value={event.title}
                                                onChange={e => handleEventChange(idx, 'title', e.target.value)}
                                                onBlur={e => handleEventChange(idx, 'title', e.target.value)}
                                                onKeyDown={handleEventInputKeyDown}
                                                className="flex-1 px-1 py-0.5 text-gray-800 font-medium border-b border-gray-200 focus:outline-none focus:border-cyan-600 bg-transparent text-xs md:text-sm"
                                                aria-label="Event title"
                                                placeholder="Event"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 text-xs text-center mb-2">No events for this day.</p>
                            )}
                            <button
                                onClick={handleAddEvent}
                                disabled={events.length >= maxEvents}
                                className={`mt-10 w-full bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-100 rounded py-1 text-xs md:text-sm font-medium transition-colors ${events.length >= maxEvents ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                + Add Event
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CalendarSection;