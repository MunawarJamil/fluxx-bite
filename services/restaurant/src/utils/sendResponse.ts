import { Response } from 'express';

/**
 * Standard API Response structure
 */
interface ApiResponse {
  success: true;
  message: string;
  data?: any;
}

/**
 * Send a standardized success response
 */
export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  const response: ApiResponse = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};
