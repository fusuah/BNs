// utils/taskRules.js
export const dailyTaskRules = {
  // BARANGAY HALL DUTY
  mothersProcession: ["monday", "tuesday", "wednesday", "thursday", "friday"], // daily
  reporting: ["monday", "tuesday", "wednesday", "thursday", "friday"], // daily
  foodSupplementDistribution: [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ], // daily
  documentation: ["monday", "tuesday", "wednesday", "thursday", "friday"], // continuous

  // FIELD WORK
  pagtimbang: ["tuesday", "thursday"], // check-up ng mga bata
  immunization: ["wednesday"], // if meron
  feedingProgram: ["monday", "wednesday", "friday"], // MWF feeding program
  homeVisits: ["monday", "tuesday", "wednesday", "thursday", "friday"], // as needed, we include all days
  survey: ["monday", "tuesday", "wednesday", "thursday", "friday"], // daily
  operationTimbang: ["monday", "tuesday", "wednesday", "thursday", "friday"], // daily
  monitoringBuntis: ["monday", "tuesday", "wednesday", "thursday", "friday"], // daily
};

export function generateTasksForDay(dayName) {
  const tasks = {};

  for (const [taskName, allowedDays] of Object.entries(dailyTaskRules)) {
    if (allowedDays.includes(dayName)) {
      tasks[taskName] = {
        title: taskName, // or format later
        diary: {
          content: "",
          imageUrl: "",
        },
      };
    }
  }

  return tasks;
}
