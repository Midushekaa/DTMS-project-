
const { getWorkplaceDistance } = require("./getWorkplaceDistance");

function generateScore(
  user,
  dependence,
  disease,
  disability,
  medicalCondition,
  pettision,
  workhistory,
  workplace
) {
  let score = 0;
  const scoreBreakdown = {};

  try {
    const currentDate = new Date();

    // Distance
    const distance = getWorkplaceDistance(user, workplace);
  
  if (distance <= 10) {
    score += 5;
  } else if (distance <= 25) {
    score += 15;
  } else {
    score += 20;
  }
    scoreBreakdown.distance = `Home to Work station distance: ${score} points`;

    // District
    if (workhistory?.outer_district !== "Ampara" && workhistory?.resident_distance > 15) {
      score += 30;
      scoreBreakdown.workedOuterDistrict = "Worked out of district: 30 points";
    }
    else if (workhistory?.outer_district !== "Ampara" && workhistory?.resident_distance < 15) {
      score += 20;
      scoreBreakdown.favourableStationOuterDistrict = "Worked in favourable station at Out of district: 20 points";
    }

    // Civil status
    const dependentDOB = dependence?.dependent_DOB;
    const dependentAge = dependentDOB
      ? Math.floor((new Date() - new Date(dependentDOB)) / (1000 * 60 * 60 * 24 * 365.25))
      : null;

    if (user?.civil_status === "Married") {
      if (dependentAge < 5) {
        score += 20;
        scoreBreakdown.marriedWithYoungChild = "Married with children below 5 years: 20 points";
      }
      if (dependentAge >= 5 && dependentAge <= 17) {
        score += 10;
        scoreBreakdown.marriedWithOlderChild = "Married with children between 5 to 17 years: 10 points";
      }
    }

    // Gender
    if (user?.gender === "Female") {
      score += 10;
      scoreBreakdown.gender = "Female: 10 points";
    }

    // Health
    if (disease) {
      score += 20;
      scoreBreakdown.disease = "Having any Chronic disease: 20 points";
    }

    if (medicalCondition && medicalCondition?.type === "Surgery") {
      score += 20;
      scoreBreakdown.majorSurgery = "Have major surgeries : 20 points";
    }

    // Dependency
    const depType = dependence?.categoryOfDependency;
    const liveWith = dependence?.live_with_dependant;
    const relationship = dependence?.dependentRelationship;

    const validRelations = ["Son", "Daughter", "Brother", "Sister"];

    if (depType === "Disabled Dependant" && validRelations.includes(relationship) && liveWith) {
      score += 20;
      scoreBreakdown.disabledDependent = "Disabled Children/siblings and living with the officer : 20 points";
    }

    if (depType === "Elderly Dependent" && dependentAge > 70 && liveWith === true) {
      score += 15;
      scoreBreakdown.elderlyDependent = "Elderly parents over 70 years and living with officer: 15 points";
    }

      if (depType === "Elderly Dependent" && depType === "Special Need" || depType === "Affected by Chronic Disease" && liveWith === true) {
      score += 15;
      scoreBreakdown.elderlyDependent = "Elderly parents with special need/Chronic disease and living with officer : 15 points";
    }

    // Period Of Work
    const dutyDateObj = new Date(user?.duty_assumed_date);

      let yearsDifference = currentDate.getFullYear() - dutyDateObj.getFullYear();
      const isBeforeAnniversary =
        currentDate.getMonth() < dutyDateObj.getMonth() ||
        (currentDate.getMonth() === dutyDateObj.getMonth() &&
        currentDate.getDate() < dutyDateObj.getDate());

      if (isBeforeAnniversary) yearsDifference--;

      if (yearsDifference >= 5) {
        score += 5;
        scoreBreakdown.dutyDuration = "Period over 5 years: 5 points";
      } else if (yearsDifference >= 3) {
        score += 10;
        scoreBreakdown.dutyDuration = "Period over 3 years: 10 points";
      }

    // Complaints
    if (!pettision) {
      if(pettision?.type === "Peoples Representatives"){
      score += 20;
      scoreBreakdown.pettisionFromPeoplesRepresentatives = "Pettision From Peoples Representatives: 20 points";
      }
      if(pettision?.type === "Public"){
      score += 20;
      scoreBreakdown.pettisionFromPublic = "Pettision From Public: 20 points";
      }
      if(pettision?.type === "From District Secretariat" || pettision?.type === "From Divitional Secretariat"){
      score += 20;
      scoreBreakdown.pettisionFromSuperiorOfficials = "Pettision From Superior Officials: 20 points";
      }
    }

    // Ad hoc Needs
    if(user?.gender === "Female"){
      if (medicalCondition?.type === "Pregnancy" && disease) {
      score += 20;
      scoreBreakdown.pregnancyWithDisease = "Pregnancy with crucial health issues : 20 points";
      }
      if (medicalCondition?.type === "Pregnancy" && medicalCondition?.validation_period > 6) {
      score += 20;
      scoreBreakdown.higherPregnancyPeriod = "Pregnancy over 06 months : 20 points";
      }
     if (
    dependence?.categoryOfDependency === "Infant" &&
    dependence?.breastfeeding_required &&
    dependentDOB
    ) {
    const birthDate = new Date(dependentDOB);
    const today = new Date();

    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth() + years * 12;

    if (months <= 6) {
      score += 20;
      scoreBreakdown.lactatingMother = "Lactating Mother below six months: 20 points";
    }
    }
    }

    if (disability && disability?.since_birth) {
      score += 20;
      scoreBreakdown.metOnAccident = "Met on accident: 20 points";
    }

    if (medicalCondition && medicalCondition?.type === "Fertility Treatment") {
      score += 20;
      scoreBreakdown.fertilityTreatment = "Need of fertility treatment : 20 points";
    }
      console.log(score);

    
  } catch (err) {
    console.error("Score generation error:", err.message);
    scoreBreakdown.error = `Error: ${err.message}`;
  }
  return {
    totalScore: score,
    scoreBreakdown
  };
}

module.exports = { generateScore };