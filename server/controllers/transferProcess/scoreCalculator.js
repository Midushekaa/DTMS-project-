function generateScore(
  user,
  dependence,
  disease,
  disability,
  medicalCondition,
  pettision,
  workhistory
) {
  let score = 0;

  try {

    //  User Distance Info
    // const distanceScore = getWorkplaceDistanceScore(user, Workplace);
    // score += distanceScore;

    // User Info
    const currentDate = new Date();
    const dutyDateObj = new Date(user?.duty_assumed_date);

    let yearsDifference = currentDate.getFullYear() - dutyDateObj.getFullYear();
    if (yearsDifference >= 3) score += 50;

    const birthDate = new Date(user?.dateOfBirth);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (age < 58) score += 20;

    // Work History
    if (workhistory?.outer_district !== "Ampara") score += 30;
    if (workhistory?.resident_distance > 15) score += 15;

    // Dependence
    const dependentDOB = dependence?.dependent_DOB;
    const dependentAge = dependentDOB
      ? Math.floor(
          (new Date() - new Date(dependentDOB)) / (1000 * 60 * 60 * 24 * 365.25)
        )
      : null;

    if (user?.civil_status === "Married") {
      if (dependentAge < 5) score += 20;
      if (dependentAge >= 5 && dependentAge <= 17) score += 10;
    }

    if (user?.gender === "Female") score += 10;

    if (!pettision) score += 25;

    const depType = dependence?.natureOfDependency;
    const liveWith = dependence?.live_with_dependant;

    if (depType === "Infant") score += 5;
    if (depType === "School Going" || depType === "Non-School Going Child")
      score += 10;
    if (dependence?.breastfeeding_required === true) score += 5;
    if (depType === "Disabled Dependant" && liveWith === true) score += 20;

    if (depType === "Elderly Dependent" && dependentAge > 70 && liveWith === true)
      score += 15;

    if (
      depType === "Special Need" ||
      (depType === "Affected by Chronic Disease" &&
        dependentAge > 70 &&
        liveWith === true)
    )
      score += 15;

    const userAppointmenDate = user?.first_appointment_date;
    const years = userAppointmenDate
      ? Math.floor(
          (new Date() - new Date(userAppointmenDate)) /
            (1000 * 60 * 60 * 24 * 365.25)
        )
      : null;

    if (years <= 8) {
      if (years >= 5) score += 5;
      else if (years > 3) score += 10;
    }

    if (disease) score += 20;
    if (disease?.soft_work_recommendation === true) score += 5;

    if (medicalCondition) score += 10;
    if (medicalCondition?.type === "Surgery") score += 20;

    if (disability) score += 15;
    if (disability?.level === "Severe") score += 15;
  } catch (err) {
    console.error("Score generation error:", err.message);
  }

  return score;
}

module.exports = { generateScore };
