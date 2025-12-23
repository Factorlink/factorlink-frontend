import axios from "axios";
import type { RegisterFormData } from "../types/outgoing/register-form-data";

export const useAuth = () => {
  const register = async (formData: RegisterFormData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}auth/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  };

  return {
    register,
  };
};
