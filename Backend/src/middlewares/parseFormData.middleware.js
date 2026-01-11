/**
 * Middleware to parse JSON fields from FormData
 * This runs before validation to convert JSON strings to proper arrays
 */
export const parseFormDataJSON = (req, res, next) => {
    // Parse colors if it's a string
    if (req.body.colors && typeof req.body.colors === 'string') {
        try {
            req.body.colors = JSON.parse(req.body.colors);
        } catch (e) {
            req.body.colors = [];
        }
    }

    // Parse materials if it's a string
    if (req.body.materials && typeof req.body.materials === 'string') {
        try {
            req.body.materials = JSON.parse(req.body.materials);
        } catch (e) {
            req.body.materials = [];
        }
    }

    // Parse existingImages if it's a string
    if (req.body.existingImages && typeof req.body.existingImages === 'string') {
        try {
            req.body.existingImages = JSON.parse(req.body.existingImages);
        } catch (e) {
            req.body.existingImages = [];
        }
    }

    next();
};
