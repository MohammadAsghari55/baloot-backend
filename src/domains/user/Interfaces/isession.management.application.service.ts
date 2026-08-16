interface ISessionManagementApplicationService {
  inactiveSession(userId: string, deviceId: string): Promise<void>;
}

export default ISessionManagementApplicationService;
