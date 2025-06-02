import { Button, message, notification } from "antd";
import axios from "axios";
import { useState } from "react";

const RemoveButton = ({ record,fetchPendingApplications,setPendingApplications,setErrorMessage }) => {
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        message.error("Unauthorized! Please log in again.");
        return;
      }

      const url = `${process.env.REACT_APP_API_URL}/admin/remove-application/${record._id}`;

      const response = await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success || response.data.message) {
        notification.success({
          description: response.data.message || "Application rejected",
          placement: "topRight",
        });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      } else {
        message.error("Unexpected server response");
      }
    } catch (error) {
      console.error(error.response?.data?.error || "Something went wrong");
      notification.error({
        description:
          error?.response?.data?.error ||
          "Something went wrong. Please try again.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="primary" danger loading={loading} onClick={handleReject}>
      Remove
    </Button>
  );
};

export default RemoveButton;
