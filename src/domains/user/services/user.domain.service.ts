import User from "../entities/user.entity.js";
import ConflictError from "../../../shared/errors/conflict.error.js";
import ForbiddenError from "../../../shared/errors/forbidden.error.js";

class UserDomainService {
  checkUniqueness(
    existingEmail: User | null,
    existingUsername: User | null,
  ): void {
    if (existingEmail) throw new ConflictError("EMAIL_EXISTS");
    if (existingUsername) throw new ConflictError("USERNAME_EXISTS");
  }

  checkAdminExistence(existingAdmin: User | null): void {
    if (existingAdmin) throw new ForbiddenError("ADMIN_EXISTS");
  }

  checkAdminLimit(currentAdminCount: number, maxAdmins: number): void {
    if (currentAdminCount >= maxAdmins) {
      throw new ForbiddenError("MAX_ADMINS_EXCEEDED");
    }
  }

  createUser(
    email: string,
    username: string,
    hashedPassword: string,
    role: "user" | "admin" = "user",
  ): User {
    return User.createNew(email, username, hashedPassword, role);
  }
}

export default UserDomainService;
