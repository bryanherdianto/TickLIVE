const { use } = require('react');
const locationRepository = require('../repositories/location.repository');
const baseResponse = require('../utils/baseResponse.util');
const cloudinary = require('../utils/cloudinary.config');

exports.getAllLocations = async (req, res) => {
    try {
        const locations = await locationRepository.getAllLocations();
        baseResponse(res, true, 200, 'Locations fetched successfully', locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.getLocationById = async (req, res) => {
    const { id } = req.params;
    try {
        const location = await locationRepository.getLocationById(id);
        if (!location) {
            return baseResponse(res, false, 404, 'Location not found');
        }
        baseResponse(res, true, 200, 'Location fetched successfully', location);
    } catch (error) {
        console.error('Error fetching location by ID:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.createLocation = async (req, res) => {
    const { name, address, description } = req.body;
    try {
        let imageUrl = null;

        if (req.file) {
            // Gunakan Promise untuk menangani upload_stream dengan benar
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: 'locations',
                    use_filename: true
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
                uploadStream.end(req.file.buffer);
            });
            
            imageUrl = result.secure_url;
        }
        
        const newLocation = await locationRepository.createLocation({ 
            name, 
            address, 
            image: imageUrl, // Pastikan nama field sesuai dengan model database
            description 
        });
        
        baseResponse(res, true, 201, 'Location created successfully', newLocation);
    } catch (error) {
        console.error('Error creating location:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}
exports.updateLocation = async (req, res) => {
    const { id } = req.params;
    const { name, address, description } = req.body;
    let updateData = { name, address, description };
    try {
        if (req.file) {
            // Upload dari buffer, bukan path
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: 'locations',
                    use_filename: true
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
                uploadStream.end(req.file.buffer);
            });
            updateData.imageUrl = result.secure_url;
        }
        const updatedLocation = await locationRepository.updateLocation(id, updateData);
        if (!updatedLocation) {
            return baseResponse(res, false, 404, 'Location not found');
        }
        baseResponse(res, true, 200, 'Location updated successfully', updatedLocation);
    } catch (error) {
        console.error('Error updating location:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.deleteLocation = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLocation = await locationRepository.deleteLocation(id);
        if (!deletedLocation) {
            return baseResponse(res, false, 404, 'Location not found');
        }
        baseResponse(res, true, 200, 'Location deleted successfully', deletedLocation);
    } catch (error) {
        console.error('Error deleting location:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}