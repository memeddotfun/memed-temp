import axios from 'axios';

/**
 * Verifies a Google reCAPTCHA token by making a request to the reCAPTCHA API
 * @param token The reCAPTCHA token to verify
 * @returns A promise that resolves to a boolean indicating whether the token is valid
 */
export const verifyRecaptcha = async (token: string): Promise<boolean> => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    // If no secret key is provided, use a test key that always returns true
    if (!secretKey) {
      console.warn('No reCAPTCHA secret key provided. Using test mode.');
      return true;
    }
    
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token
        }
      }
    );
    
    return response.data.success;
  } catch (error) {
    console.error('Error verifying reCAPTCHA token:', error);
    return false;
  }
};
