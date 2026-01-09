import Joi from "joi"



export const registerSchema = Joi.object({
    firstName: Joi.string().min(3).required().messages({
        "string.empty": "First Name is required",
        "any.required": "First Name is required",
        "string.min": "First Name must be at least 3 characters long"
    }),
    lastName: Joi.string().min(3).required().messages({
        "string.empty": "Last Name is required",
        "any.required": "Last Name is required",
        "string.min": "Last Name must be at least 3 characters long"
    }),
    password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
    email: Joi.string().required().email().messages({
        "string.email": "Invalid email format",
        "string.empty": "Email is required",
        "any.required": "Email is required"
    }),
     phoneNumber: Joi.string()
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "any.required": "Phone number is required",
      "string.pattern.base": "Phone must be a valid Kenyan number (e.g., +254712345678, 0712345678)"
    }),
    farmSize: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'Farm size must be a number',
      'number.positive': 'Farm size must be greater than zero',
      'any.required': 'Farm size is required'
    }),

  cropType: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Crop type is required',
      'string.min': 'Crop type must be at least 2 characters',
      'string.max': 'Crop type cannot exceed 50 characters'
    })
});