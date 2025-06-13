const geolib = require("geolib");

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  return (
    geolib.getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    ) / 1000
  ).toFixed(2);
};

exports.getWorkplaceDistance = async (user, workplace) => {
  if (!user?.GPS_latitude || !user?.GPS_longitude || !user?.workplace_id) {
    return 0;
  }

  if (!workplace || !workplace.GPS_latitude || !workplace.GPS_longitude) {
    return 0;
  }

  const distance = parseFloat(
    calculateDistance(
      user.GPS_latitude,
      user.GPS_longitude,
      workplace.GPS_latitude,
      workplace.GPS_longitude
    )
  );
  
  return distance;

};
