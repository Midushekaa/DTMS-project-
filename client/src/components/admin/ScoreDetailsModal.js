import { Drawer } from "antd";

const ScoreDetailsModal = ({ isVisible, onClose, scoreData }) => {
  const scoreFields = [
    { label: "Total Score", key: "totalScore" },
    { label: "Distance to Workplace", key: "distance" },
    { label: "Worked in Outer District", key: "workedOuterDistrict" },
    {
      label: "Favourable Station in Outer District",
      key: "favourableStationOuterDistrict",
    },
    { label: "Married With Young Child", key: "marriedWithYoungChild" },
    { label: "Married With Older Child", key: "marriedWithOlderChild" },
    { label: "Gender", key: "gender" },
    { label: "Disease", key: "disease" },
    { label: "Major Surgery", key: "majorSurgery" },
    { label: "Disabled Dependent", key: "disabledDependent" },
    { label: "Elderly Dependent", key: "elderlyDependent" },
    { label: "Duty Duration", key: "dutyDuration" },
    {
      label: "Petition from People's Representatives",
      key: "pettisionFromPeoplesRepresentatives",
    },
    { label: "Petition from Public", key: "pettisionFromPublic" },
    {
      label: "Petition from Superior Officials",
      key: "pettisionFromSuperiorOfficials",
    },
    { label: "Pregnancy With Disease", key: "pregnancyWithDisease" },
    { label: "Pregnancy Over 6 Months", key: "higherPregnancyPeriod" },
    { label: "Lactating Mother (Below 6 Months)", key: "lactatingMother" },
    { label: "Met on Accident", key: "metOnAccident" },
    { label: "Fertility Treatment", key: "fertilityTreatment" },
    { label: "Error", key: "error" },
  ];

  return (
    <Drawer
      title={<span className="text-lg font-semibold">Score Details</span>}
      open={isVisible}
      onClose={onClose}
      width={"60%"}
      className="[&_.ant-drawer-body]:p-6"
    >
      <div className="overflow-auto">
        <table className="w-full text-left">
          <tbody className="divide-y divide-gray-200">
            {scoreFields.map(
              (field) =>
                scoreData?.[field.key] && (
                  <tr key={field.key}>
                    <td className="py-3 px-4 font-medium text-gray-700 w-1/3">
                      {field.label}
                    </td>
                    <td className="py-3 px-4">{scoreData[field.key]}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </Drawer>
  );
};

export default ScoreDetailsModal;
