import { Button, message, notification, Modal, Input } from "antd";
import axios from "axios";
import { useState } from "react";

const RemoveButton = ({ record }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reason, setReason] = useState("");

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    if (!reason.trim()) {
      message.warning("Please provide a reason.");
      return;
    }

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
        { reason },
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
      notification.error({
        description:
          error?.response?.data?.error ||
          "Something went wrong. Please try again.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
      setVisible(false);
      setReason("");
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setReason("");
  };

  return (
    <>
      <Button type="primary" danger onClick={showModal} loading={loading}>
        Remove
      </Button>

      <Modal
        title="Reason for Rejection"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
        confirmLoading={loading}
      >
        <Input.TextArea
          rows={4}
          placeholder="Enter rejection reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default RemoveButton;
