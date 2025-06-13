import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tooltip,
  message,
  Alert,
  notification,
  Typography,
  Select,
  Modal,
} from "antd";
import axios from "axios";
import useCheckAdminAuth from "../../../utils/checkAdminAuth";
import {
  CheckCircleOutlined,
  UserSwitchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ScoreDetailsModal from "../../../components/admin/ScoreDetailsModal";
import dayjs from "dayjs";

const renderStatus = (application) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
      <Tooltip title="Checked">
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            backgroundColor: application?.isChecked ? "orange" : "#d3d3d3",
            border: "1px solid #ccc",
          }}
        />
      </Tooltip>
      <Tooltip title="Recommended">
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            backgroundColor: application?.isRecommended ? "blue" : "#d3d3d3",
            border: "1px solid #ccc",
          }}
        />
      </Tooltip>
      <Tooltip title="Approved">
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            backgroundColor: application?.isApproved
              ? "green"
              : application?.isRejected
              ? "red"
              : "#d3d3d3",
            border: "1px solid #ccc",
          }}
        />
      </Tooltip>
    </div>
  );
};

const TransferApplications = ({ record }) => {
  const navigate = useNavigate();
  const { adminData } = useCheckAdminAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workplaceData, setWorkplaceData] = useState([]);
  const adminRole = adminData.adminRole || null;

  const [transferWindows, setTransferWindows] = useState([]);
  const [cadres, setCadres] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedScore, setSelectedScore] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const showScoreModal = (score, id) => {
    setSelectedScore(score);
    setSelectedId(id);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedScore(null);
    setSelectedId(null);
  };

  const fetch = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token || token.split(".").length !== 3) {
      localStorage.removeItem("adminToken");
      navigate("/admin_login");
      return;
    }

    setLoading(true);
    try {
      const [windows, cadres, workplaces, applications] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/transfer-window`),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/cadre`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/workplace`),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/total-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setTransferWindows(windows.data);
      setCadres(cadres.data);
      setWorkplaceData(workplaces.data);
      if (applications.data?.length) {
        setApplications(applications.data);
      } else {
        message.info("No transfer applications found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      message.error(error.response?.data?.error || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = () => {
    fetch();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const calculateEligibility = (DOB) => {
    if (!DOB) return { years: 0, replacementStatus: "No" };

    const today = dayjs();
    const birthDate = dayjs(DOB);

    const years = today.diff(birthDate, "year");
    const replacementStatus = years <= 58 ? "Yes" : "No";

    return { years, replacementStatus };
  };

  const getCadreDetails = (workplaceId, designation) => {
    const match = cadres.find(
      (item) =>
        item.workplace_id === workplaceId && item.designation === designation
    );

    if (match) {
      const { approvedCadre, existingCadre } = match;
      return { approvedCadre, existingCadre };
    }

    message.warning("Cadre not found! add cadre for the designation");
    return null;
  };

  const update = async (id, userId, actionType, workplaceId, designation) => {
    let cadre;
    if (actionType === "publish") {
      cadre = getCadreDetails(workplaceId, designation);
      if (!cadre) return;
    }

    Modal.confirm({
      title: actionType === "publish" ? "Confirm Publish" : "Confirm Action",
      content:
        actionType === "publish"
          ? `Approved Cadre: ${cadre.approvedCadre}, Existing Cadre: ${cadre.existingCadre}`
          : "Are you sure you want to proceed?",
      onOk: async () => {
        setLoading(true);
        try {
          await axios.put(
            `${process.env.REACT_APP_API_URL}/admin/transfer-application/${actionType}/${userId}`,
            { id }
          );
          const msg =
            {
              process: "Processed successfully",
              find: "Replacement officer found successfully",
              publish: "Transfer application published successfully",
            }[actionType] || "Action completed";
          notification.success({ description: msg, placement: "topRight" });
          fetchAllData();
        } catch (error) {
          notification.warning({
            description: error.response?.data?.error || "Action failed",
            placement: "topRight",
          });
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => message.info("Action cancelled"),
    });
  };

  const updateTransferredWorkplace = (id, newWorkplaceId) => {
    Modal.confirm({
      title: "Are you sure you want to update the transfer workplace?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/transfer-application/${id}`,
            {
              transfered_workplace_id: newWorkplaceId,
            }
          );
          message.success(response.data.message || "Updated successfully");
          fetchAllData();
        } catch (error) {
          console.error(error.response?.data?.error || "Failed to update");
          message.error(error.response?.data?.error || "Failed to update");
        }
      },
    });
  };

  const columns = [
    {
      title: "Name with Initials",
      dataIndex: ["userId", "nameWithInitial"],
      key: ["userId", "nameWithInitial"],
    },
    {
      title: "Designation",
      dataIndex: ["userId", "designation"],
      key: "designation",
    },

    ...(adminRole === "superAdmin"
      ? [
          {
            title: "Workplace",
            dataIndex: "workplace_id",
            key: "workplace_id",
            render: (workplace_id) => {
              const workplace = workplaceData.find(
                (wp) => wp._id === workplace_id
              );
              return workplace ? workplace.workplace : "Unknown";
            },
          },
        ]
      : []),

    {
      title: "Transfer Window",
      dataIndex: "transferWindowId",
      key: "transferWindowId",
      render: (transferWindowId) => {
        const window = transferWindows.find(
          (win) => win._id === transferWindowId
        );
        return window ? window.name : "Unknown";
      },
    },

    {
      title: "Preferred Workplaces",
      dataIndex: "preferWorkplace_1",
      key: "preferWorkplace_1",
      render: (preferWorkplace_1, record) => {
        const workplace1 =
          workplaceData.find((wp) => wp._id === preferWorkplace_1)?.workplace ||
          "Unknown";
        const workplace2 =
          workplaceData.find((wp) => wp._id === record.preferWorkplace_2)
            ?.workplace || "Unknown";
        const workplace3 =
          workplaceData.find((wp) => wp._id === record.preferWorkplace_3)
            ?.workplace || "Unknown";

        return (
          <div style={{ whiteSpace: "nowrap" }}>
            {workplace1 && <div>{workplace1},</div>}
            {workplace2 && <div>{workplace2},</div>}
            {workplace3 && <div>{workplace3}</div>}
          </div>
        );
      },
    },

    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },

    {
      title: "Age over 58 years",
      key: "eligibilityAge",
      render: (text, record) => {
        const DOB = record.userId?.dateOfBirth;
        const { replacementStatus } = calculateEligibility(DOB);
        return <span>{replacementStatus}</span>;
      },
    },
    {
      title: "Replacement",
      dataIndex: "Replacement",
      key: "Replacement",
      render: (text, record) => (
        <span>{record.Replacement ? "Yes" : "No"}</span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => renderStatus(record),
    },
    ...(adminRole === "superAdmin"
      ? [
          {
            title: "Score",
            dataIndex: "score",
            key: "score",
            render: (text, record) => {
              if (!text || !text.totalScore) return "N/A";
              return (
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#1890ff",
                    cursor: "pointer",
                    padding: 0,
                    textDecoration: "underline",
                  }}
                  onClick={() => showScoreModal(text, record._id)}
                >
                  {text.totalScore}
                </button>
              );
            },
          },
        ]
      : []),
    {
      title: "Transfer Decision",
      dataIndex: "transferDecision",
      key: "transferDecision",
      render: (text) => {
        return text && text.trim() !== "" ? text : "N/A";
      },
    },

    {
      title: "Transfer Decision Type",
      dataIndex: "transferDecisionType",
      key: "transferDecisionType",
      render: (text) => {
        return text && text.trim() !== "" ? text : "N/A";
      },
    },
    {
      title: "Transfer Workplace",
      dataIndex: "transfered_workplace_id",
      width: 300,
      key: "transfered_workplace_id",
      render: (workplace_id, record) => {
        const workplace = workplaceData.find((wp) => wp._id === workplace_id);
        const showDropdown = adminRole === "superAdmin";

        if (!showDropdown) {
          return workplace ? workplace.workplace : "N/A";
        }

        return (
          <Select
            value={workplace_id}
            onChange={(value) => updateTransferredWorkplace(record._id, value)}
            style={{ width: 260 }}
            dropdownStyle={{ width: 400 }}
            disabled={record?.isPublished}
          >
            {workplaceData.map((wp) => (
              <Select.Option key={wp._id} value={wp._id}>
                {wp.workplace}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Replacement Officer",
      dataIndex: ["Replacement_userId", "NIC"],
      render: (text, record) => {
        const replacementUser = record.Replacement_userId;
        if (replacementUser) {
          return `${replacementUser.nameWithInitial} (${replacementUser.designation}, ${replacementUser.NIC})`;
        }
        return `${
          record.Replacement ? "Not assined" : "No replecement needed"
        }`;
      },
    },

    ...(adminRole === "superAdmin"
      ? [
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {record.isChecked &&
                record.isRecommended &&
                record.isApproved &&
                !record.isProcessed ? (
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() =>
                      update(record._id, record.userId._id, "process")
                    }
                  >
                    Process
                  </Button>
                ) : !record.isApproved || record.isRejected ? (
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    disabled
                  >
                    Approval Pending
                  </Button>
                ) : null}

                {record.Replacement &&
                  record.isProcessed &&
                  !record.isPublished &&
                  record.Replacement_userId === null && (
                    <Button
                      type="dashed"
                      icon={<UserSwitchOutlined />}
                      onClick={() =>
                        update(record._id, record.userId._id, "find")
                      }
                    >
                      Find Replacement
                    </Button>
                  )}

                {record.isProcessed && (
                  <Button
                    type="default"
                    icon={<UploadOutlined />}
                    onClick={() => {
                      update(
                        record._id,
                        record.userId._id,
                        "publish",
                        record.workplace_id,
                        record.userId.designation
                      );
                    }}
                    disabled={record.isPublished}
                  >
                    {record.isPublished ? "Published" : "Publish"}
                  </Button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];
  return (
    <div className="mt-10 mx-6 sm:mx-12">
      <Typography.Title level={3} className="mb-8 pb-3">
        Transfer Applications
      </Typography.Title>
      <Alert
        message="Status Colors Information"
        description={
          <div className="space-y-2">
            {["orange", "blue", "green", "red"].map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                ></div>
                <span>
                  {index === 0
                    ? "Checked (Yellow)"
                    : index === 1
                    ? "Recommended (Blue)"
                    : index === 2
                    ? "Approved (Green)"
                    : "Not approved (Red)"}
                </span>
              </div>
            ))}
          </div>
        }
        type="info"
        showIcon
        className="mb-4"
      />
      <Table
        columns={columns}
        dataSource={applications}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
      <ScoreDetailsModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        scoreData={selectedScore}
      />
    </div>
  );
};

export default TransferApplications;
