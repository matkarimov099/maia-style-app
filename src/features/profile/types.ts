export interface ProfileData {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface UpdateProfileDto {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
