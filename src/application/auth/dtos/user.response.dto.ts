interface UserResponseDto {
  id: string;
  email: string;
  username: string;
  role: "user" | "admin";
}

export default UserResponseDto;
