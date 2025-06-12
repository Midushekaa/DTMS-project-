import React, { useState } from "react";
import { Drawer, Form, Input, Button, message } from "antd";
import UserPettions from "../user/Petitions";

const PetitionDrawer = ({ visible, onClose, userId }) => {
  return (
    <Drawer
      title="Add Petition"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      <UserPettions userId={userId}/>
    </Drawer>
  );
};

export default PetitionDrawer;
