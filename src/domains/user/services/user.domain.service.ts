import User from "../entities/user.entity.js";
import AppError from "../../../shared/errors/app.error.js";

class UserDomainService {
  checkUniqueness(
    existingEmail: User | null,
    existingUsername: User | null,
  ): void {
    if (existingEmail) throw AppError.conflict("EMAIL_EXISTS");
    if (existingUsername) throw AppError.conflict("USERNAME_EXISTS");
  }

  createUser(
    email: string,
    username: string,
    hashedPassword: string,
    role: "user" | "admin" | "super_admin" = "user",
  ): User {
    return User.createNew(email, username, hashedPassword, role);
  }
}

export default UserDomainService;
