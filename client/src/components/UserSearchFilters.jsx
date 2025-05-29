import React from "react";
import { Input, Select } from "antd";

const UserSearchFilters = ({
  filterDesignation,
  setFilterDesignation,
  filterWorkplace,
  setFilterWorkplace,
  workplaces,
  adminRole,
}) => (
  <div className="flex gap-4 mb-4 border-b pb-4">
    <Input
      placeholder="Filter by Designation..."
      value={filterDesignation}
      onChange={(e) => setFilterDesignation(e.target.value)}
      className="w-full md:w-1/3"
    />
    {workplaces?.length > 0 && adminRole === "superAdmin" && (
      <Select
        placeholder="Filter by Workplace..."
        value={filterWorkplace}
        onChange={setFilterWorkplace}
        allowClear
        className="w-full md:w-1/3"
      >
        {workplaces.map((wp) => (
          <Select.Option key={wp._id} value={wp._id}>
            {wp.workplace}
          </Select.Option>
        ))}
      </Select>
    )}
  </div>
);

export default UserSearchFilters;
