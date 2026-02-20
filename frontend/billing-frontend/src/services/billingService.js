import axios from "axios";

const API = "http://localhost:5000/api/billing";

export const createBill = async (data) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getBills = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getBill = async (id) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteBill = async (id) => {
  const token = localStorage.getItem("token");

  const res = await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateBill = async (id, data) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(`${API}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
