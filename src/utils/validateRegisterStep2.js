export const validateSexualIdentities = (sexualIdentity) => {
  if (!sexualIdentity) {
    return "Please select sexual identities";
  }
  return ""; // ไม่มีข้อผิดพลาด
};

export const validateSexualpreferences = (sexualPreferences) => {
  if (!sexualPreferences) {
    return "Please select sexual preferences";
  }
  return ""; // ไม่มีข้อผิดพลาด
};

export const validateRacialIdentities = (racialIdentities) => {
  if (!racialIdentities) {
    return "Please select racial identities";
  }
  return "";
};

export const validateRacialPreferences = (racialPreferences) => {
  if (!racialPreferences) {
    return "Please select racial preferences";
  }
  return "";
};

export const validateMeetingInterests = (meetingInterests) => {
  if (!meetingInterests) {
    return "Please select meeting interests";
  }
  return "";
};

export const validatehobbies = (hobbies) => {
  if (!hobbies || hobbies.length === 0) {
    return "Please select hobbies / interests.";
  }
  if (hobbies.length > 10) {
    return "You can only select up to 10 hobbies / interests.";
  }
  return ""; // ถ้าผ่านเงื่อนไขทั้งหมด จะไม่มีข้อความเตือน
};

export const validateAboutme = (value) => {
  if (!value) {
    return "Please fill in aboutme";
  }
  if (value.length > 150) {
    return "The information exceeds 150 characters";
  }
  return "";
};

export const validateRequiredFieldsStep2 = ({
  sexualIdentity,
  sexualPreferences,
  racialIdentities,
  racialPreferences,
  meetingInterests,
  hobbies,
  value,
}) => {
  if (
    !sexualIdentity ||
    !sexualPreferences ||
    !racialIdentities ||
    !racialPreferences ||
    !meetingInterests ||
    (Array.isArray(hobbies) && hobbies.length === 0) ||
    !value ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return "Please fill in all the required information";
  }
  return "";
};
