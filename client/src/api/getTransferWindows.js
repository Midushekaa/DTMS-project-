import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { message } from "antd";

const TransferWindows = () => {
  const [transferWindows, seTransferWindows] = useState([]);

  const fetchTransferWindows = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/transfer-window`
      );
      seTransferWindows(response.data || []);
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to fetch transfer windows"
      );
    }
  }, []);

  useEffect(() => {
    fetchTransferWindows();
  }, [fetchTransferWindows]);

  return { transferWindows, fetchTransferWindows };
};

export default TransferWindows;
