import { Modal, message } from "antd";
import ReactDOM from "react-dom";
import React from "react";
import GPSModal from "../components/user/GPSModal";

export const getLocation = async (
  isMobile,
  form,
  setLoading,
  setDisabled,
  setLocationError
) => {
  if (!isMobile) {
    message.warning("You're on a desktop. Please select your location manually.");
    
    const container = document.createElement("div");
    document.body.appendChild(container);

    const close = () => {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    };

    ReactDOM.render(<GPSModal visible={true} onClose={close} />, container);
    return;
  }

  setLoading(true);
  setLocationError(null);

  try {
    const perm = await navigator.permissions.query({ name: "geolocation" });

    if (perm.state === "denied") {
      Modal.warning({
        title: "Location Blocked",
        content: "Enable location access in your browser settings to continue.",
      });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        form.setFieldsValue({
          GPS_latitude: latitude.toFixed(6),
          GPS_longitude: longitude.toFixed(6),
        });
        setDisabled(true);
        setLoading(false);
        message.success("Location access granted and values filled");
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          Modal.info({
            title: "Allow Location Access",
            content:
              "Google requires your permission to access your location. Please allow it and try again.",
          });
        } else {
          message.error("Error: " + err.message);
        }
      }
    );
  } catch (e) {
    setLoading(false);
    message.error("Browser does not support location permission check");
  }
};
