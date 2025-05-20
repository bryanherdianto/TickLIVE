const eventRepository = require('../repositories/event.repository');
const baseResponse = require('../utils/baseResponse.util');

exports.getAllEvents = async (req, res) => {
    try {
        const events = await eventRepository.getAllEvents();
        baseResponse(res, true, 200, 'Events fetched successfully', events);
    } catch (error) {
        console.error('Error fetching events:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await eventRepository.getEventById(id);
        if (!event) {
            return baseResponse(res, false, 404, 'Event not found');
        }
        baseResponse(res, true, 200, 'Event fetched successfully', event);
    } catch (error) {
        console.error('Error fetching event by ID:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.createEvent = async (req, res) => {
    const { name, id_host, date, location_id } = req.body;
    try {
        const newEvent = await eventRepository.createEvent({ name, id_host, date, location_id });
        baseResponse(res, true, 201, 'Event created successfully', newEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { name, id_host, date, location_id } = req.body;
    try {
        const updatedEvent = await eventRepository.updateEvent(id, { name, id_host, date, location_id });
        if (!updatedEvent) {
            return baseResponse(res, false, 404, 'Event not found');
        }
        baseResponse(res, true, 200, 'Event updated successfully', updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEvent = await eventRepository.deleteEvent(id);
        if (!deletedEvent) {
            return baseResponse(res, false, 404, 'Event not found');
        }
        baseResponse(res, true, 200, 'Event deleted successfully', deletedEvent);
    } catch (error) {
        console.error('Error deleting event:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}