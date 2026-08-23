interface PendingAdminData {
  email: string;
  username: string;
  passwordHash: string;
  role: "admin";
  code: string;
  createdAt: number;
}

export default PendingAdminData;
