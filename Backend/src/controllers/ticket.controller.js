const ticketRepository = require('../repositories/ticket.repository');
const baseResponse = require('../utils/baseResponse.util');

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketRepository.getAllTickets();
        baseResponse(res, true, 200, 'Tickets fetched successfully', tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.getTicketById = async (req, res) => {
    const ticketId = req.params.id;
    try {
        const ticket = await ticketRepository.getTicketById(ticketId);
        if (!ticket) {
            return baseResponse(res, false, 404, 'Ticket not found');
        }
        baseResponse(res, true, 200, 'Ticket fetched successfully', ticket);
    }
    catch (error) {
        console.error('Error fetching ticket by ID:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.createTicket = async (req, res) => {
    const { seat_id, user_id } = req.body;
    try {
        const newTicket = await ticketRepository.createTicket({ seat_id, user_id });
        baseResponse(res, true, 201, 'Ticket created successfully', newTicket);
    } catch (error) {
        console.error('Error creating ticket:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.updateTicket = async (req, res) => {
    const ticketId = req.params.id;
    const { user_id, seat_id, status } = req.body;
    try {
        const updatedTicket = await ticketRepository.updateTicket(ticketId, { user_id, seat_id, status });
        if (!updatedTicket) {
            return baseResponse(res, false, 404, 'Ticket not found');
        }
        baseResponse(res, true, 200, 'Ticket updated successfully', updatedTicket);
    } catch (error) {
        console.error('Error updating ticket:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.deleteTicket = async (req, res) => {
    const ticketId = req.params.id;
    try {
        const deletedTicket = await ticketRepository.deleteTicket(ticketId);
        if (!deletedTicket) {
            return baseResponse(res, false, 404, 'Ticket not found');
        }
        baseResponse(res, true, 200, 'Ticket deleted successfully', deletedTicket);
    } catch (error) {
        console.error('Error deleting ticket:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}