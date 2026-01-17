import { useState } from "react";
import api from "../lib/axios";


export const useInvitation = () => {
  const [loading, setLoading] = useState(false);

  const getPendingInvites = async () => {
    setLoading(true);
    try {
      const response = await api.get("users/invites/pending");
      return response.data;
    }catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const respondEmpresaInvite = async (params: {
    empresaId: string;
    accept: boolean;
  }) => {
    setLoading(true);
    try {
      const response = await api.post("users/invites/empresa/respond", params);
      return response.data;
    }catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const respondFactoringInvite = async (params: {
    factoringId: string;
    accept: boolean;
  }) => {
    setLoading(true);
    try {
      const response = await api.post("users/invites/factoring/respond", params);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getPendingInvites,
    respondEmpresaInvite,
    respondFactoringInvite,
  };
};

