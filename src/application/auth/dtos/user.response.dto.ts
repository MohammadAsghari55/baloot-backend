interface UserResponseDto {
  id: string;
  email: string;
  username: string;
  role: "user" | "admin" | "super_admin";
}

export default UserResponseDto;
