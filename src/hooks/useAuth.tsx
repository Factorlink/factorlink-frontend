import { useState } from "react";
import axios from "axios";
import type { RegisterFormData } from "../types/outgoing/register-form-data";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const register = async (formData: RegisterFormData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
  };
};
