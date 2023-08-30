import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', start: new Date(), end: new Date() });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddEvent = async () => {
    try {
      const response = await axios.post('/api/events', newEvent);
      setEvents([...events, response.data]);
      setNewEvent({ title: '', start: new Date(), end: new Date() });
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/api/events/${eventId}`);
      const updatedEvents = events.filter(event => event._id !== eventId);
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Event title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <button onClick={handleAddEvent}>Add Event</button>
      </div>
      <BigCalendar
        events={events}
        selectable
        defaultDate={new Date()}
        onSelectEvent={event => handleDeleteEvent(event._id)}
      />
    </div>
  );
};

export default Calendar;