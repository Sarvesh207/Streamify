export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  description: string;
  timezone: string;
}

export interface UpdatePasswordData {
  current: string;
  new: string;
  confirm: string;
}

/**
 * Updates the user's personal details and profile info
 * @param data Profile data
 */
export const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
  console.log("Updating profile:", data);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  return true;
};

/**
 * Updates the user's password
 * @param data Password data
 */
export const updatePassword = async (data: UpdatePasswordData): Promise<boolean> => {
  console.log("Updating password:", data);
  if (data.new !== data.confirm) {
    throw new Error("Passwords do not match");
  }
  await new Promise(resolve => setTimeout(resolve, 1500));
  return true;
};

/**
 * Uploads a profile or header image
 * @param file Image file
 * @param type 'avatar' | 'cover'
 */
export const uploadImage = async (file: File, type: 'avatar' | 'cover'): Promise<string> => {
   console.log(`Uploading ${type} image:`, file.name);
   await new Promise(resolve => setTimeout(resolve, 2000));
   return URL.createObjectURL(file);
};
