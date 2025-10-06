export const MAX_SIZE_FILE_UPLOAD = 4000000; // 4mb
export const MESSAGE_FILE_MAXIMUM_SIZE = {
  title: "Error: File Size Exceeds Limit",
  message: (sizeMb: string) =>
    `The file you are trying to upload exceeds the maximum allowed file size (${sizeMb}mb). Please reduce the file size and try again.`,
};

export const MESSAGE_FILE_INVALID_FORMAT = {
  title: "Error: Invalid File Format",
  message:
    "The file you are trying to open has an unsupported or invalid format. Please make sure you are using the correct file type and try again. If you believe this is an error, contact our support team for assistance.",
};

export const FORMAT_INPUT_IMAGE_FILE = {
  "image/png": [],
  "image/jpeg": [],
  "image/jpg": [],
};

export const MAX_FILE_BULK_UPLOAD = 20;

export const USERS_ROLES = [
  "Manager",
  "UI UXDesigner",
  "Graphic Designer",
  "Marketing",
  "Developer",
  "Analyst",
  "Founder",
  "Other",
];
