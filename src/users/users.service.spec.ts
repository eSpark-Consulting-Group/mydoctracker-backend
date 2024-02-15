import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { UserRoles, UserStatus, Users } from 'src/entities/User.entity';
import { SigninDTO, SignupDTO, UpdateProfileDTO } from './dto/users-dto';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { EmailService } from 'src/utils/helpers/email';
import { S3_ENUMS } from 'enum';

jest.mock('@sendgrid/mail');

class MockEmailService {
  async sendForgotPasswordEmail(
    email: string,
    username: string,
    reset_link: string,
  ): Promise<void> {
    console.log(
      `Sending forgot password email to ${email} for user ${username}. Reset link: ${reset_link}`,
    );
    return Promise.resolve();
  }
}

class MockCloudStorageService {
  async uploadFileInS3(
    file: Express.Multer.File,
    user: Users,
    folderName: string,
  ): Promise<{ fileId: string; fileName: string }> {
    return { fileId: 'mockedFileId', fileName: 'mockedFileName' };
  }
}
// Mock user repository
const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

// Mock JWT service
const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
};

// Mock bcrypt for password hashing
jest.mock('bcrypt', () => ({
  genSaltSync: jest.fn(() => 'mockedSalt'),
  hashSync: jest.fn((password, salt) => `hashed_${password}_${salt}`),
  compare: jest.fn((password, hashedPassword) =>
    hashedPassword.startsWith(`hashed_${password}`),
  ),
}));

describe('UserService', () => {
  let userService: UsersService;
  let cloudStorageService: CloudStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: CloudStorageService, useClass: MockCloudStorageService },
        { provide: getRepositoryToken(Users), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: EmailService, useClass: MockEmailService },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    cloudStorageService = module.get<CloudStorageService>(CloudStorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should sign up a single user successfully', async () => {
    const newUser: SignupDTO = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      contact: '1234567890',
      rememberMe: true,
    };
    mockUserRepository.create.mockReturnValue({
      ...newUser,
      id: '123',
    });
    mockUserRepository.save.mockResolvedValue({
      ...newUser,
      id: '123',
    });
    mockJwtService.signAsync.mockResolvedValue('mockedToken');
    const result = await userService.signupSingleUser(newUser);
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      contact: newUser.contact,
      username: newUser.username,
      email: newUser.email,
      hashedPassword: expect.any(String),
      role: UserRoles.SU,
    });
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining(newUser),
    );
    expect(mockJwtService.signAsync).toHaveBeenCalledWith({
      id: '123',
      email: newUser.email,
    });
    expect(bcrypt.genSaltSync).toHaveBeenCalledWith(5);
    expect(bcrypt.hashSync).toHaveBeenCalledWith(
      newUser.password,
      'mockedSalt',
    );
  });
  it('should throw ConflictException for duplicate username', async () => {
    const newUser: SignupDTO = {
      contact: '123',
      email: 'abc@abc.com',
      firstName: 'abc',
      lastName: 'abc',
      password: '123',
      rememberMe: true,
      username: 'abc',
      // Provide your test data here
    };

    // Mock the repository methods to throw a duplicate entry error
    mockUserRepository.create.mockReturnValue(newUser);
    mockUserRepository.save.mockRejectedValue({
      errno: 1062,
      sqlMessage:
        "Duplicate entry for key 'users.IDX_fe0bb3f6520ee0469504521e71'",
    });

    // Call the signupSingleUser method and expect it to throw a ConflictException
    await expect(userService.signupSingleUser(newUser)).rejects.toThrowError(
      ConflictException,
    );
  });

  it('should throw UnauthorizedException for invalid username', async () => {
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

    const userCreds: SigninDTO = {
      username: 'invalidUsername',
      password: 'password',
      rememberMe: false,
    };

    await expect(userService.signin(userCreds)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException for deactivated account', async () => {
    const deactivatedUser = {
      id: 1,
      username: 'existingUser',
      status: UserStatus.DEACTIVE,
    };
    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockResolvedValueOnce(deactivatedUser);

    const userCreds: SigninDTO = {
      username: 'existingUser',
      password: 'password',
      rememberMe: false,
    };

    await expect(userService.signin(userCreds)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException for invalid password', async () => {
    const existingUser = {
      id: 1,
      username: 'existingUser',
      status: UserStatus.ACTIVE,
      hashedPassword: 'hashedPassword',
    };
    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockResolvedValueOnce(existingUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

    const userCreds: SigninDTO = {
      username: 'existingUser',
      password: 'invalidPassword',
      rememberMe: false,
    };

    await expect(userService.signin(userCreds)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should return user and token for valid credentials', async () => {
    const existingUser = {
      id: 1,
      username: 'existingUser',
      status: UserStatus.ACTIVE,
      hashedPassword: 'hashedPassword',
    };
    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockResolvedValueOnce(existingUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
    jest
      .spyOn(mockJwtService, 'signAsync')
      .mockResolvedValueOnce('mockedToken');

    const userCreds: SigninDTO = {
      username: 'existingUser',
      password: 'validPassword',
      rememberMe: false,
    };

    const result = await userService.signin(userCreds);

    expect(result.user).toEqual(existingUser);
    expect(result.token).toEqual('mockedToken');
  });

  it('should change password with reset token', async () => {
    const resetToken = 'mockedResetToken';
    const newPassword = 'newPassword123';

    // Mock the token payload
    const tokenPayload = {
      email: 'user@example.com',
      oldPasswordHash: 'hashedOldPassword',
      ip: '127.0.0.1',
      iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      device: 'desktop',
    };
    jest
      .spyOn(mockJwtService, 'verifyAsync')
      .mockResolvedValueOnce(tokenPayload);

    // Mock the user returned from the repository
    const user = new Users();
    user.id = '1';
    user.email = 'user@example.com';
    user.status = UserStatus.ACTIVE;
    user.hashedPassword = 'hashedOldPassword';
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(user);

    // Mock the user save method
    jest.spyOn(mockUserRepository, 'save').mockResolvedValueOnce(user);

    await userService.changePassword({ newPassword, token: resetToken }, user);

    // Assert that the password was updated
    expect(user.hashedPassword).not.toBe('hashedOldPassword');
  });

  it('should throw UnauthorizedException for invalid reset token', async () => {
    const resetToken = 'invalidToken';
    const newPassword = 'newPassword123';

    jest
      .spyOn(mockJwtService, 'verifyAsync')
      .mockRejectedValueOnce(new Error('Invalid token'));

    await expect(
      userService.changePassword(
        { newPassword, token: resetToken },
        new Users(),
      ),
    ).rejects.toThrowError(UnauthorizedException);
  });

  it('should throw NotFoundException for user not found with reset token', async () => {
    const resetToken = 'mockedResetToken';
    const newPassword = 'newPassword123';

    jest
      .spyOn(mockJwtService, 'verifyAsync')
      .mockResolvedValueOnce({ email: 'user@example.com' });
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(
      userService.changePassword(
        { newPassword, token: resetToken },
        new Users(),
      ),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should change password with old password', async () => {
    const oldPassword = 'oldPassword';
    const newPassword = 'newPassword123';
    const currentUser = new Users();
    currentUser.id = '1';

    // Mock the user returned from the repository
    const user = new Users();
    user.id = '1';
    user.email = 'user@example.com';
    user.status = UserStatus.ACTIVE;
    user.hashedPassword = bcrypt.hashSync('oldPassword', 10);
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(user);

    // Mock the user save method
    jest.spyOn(mockUserRepository, 'save').mockResolvedValueOnce(user);

    await userService.changePassword({ oldPassword, newPassword }, currentUser);

    // Assert that the password was updated
    expect(user.hashedPassword).not.toBe(bcrypt.hashSync('oldPassword', 10));
  });

  it('should throw ForbiddenException for incorrect old password', async () => {
    const oldPassword = 'invalidOldPassword';
    const newPassword = 'newPassword123';
    const currentUser = new Users();
    currentUser.id = '1';

    // Mock the user returned from the repository
    const user = new Users();
    user.id = '1';
    user.email = 'user@example.com';
    user.status = UserStatus.ACTIVE;
    user.hashedPassword = bcrypt.hashSync('correctOldPassword', 10);
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(user);

    await expect(
      userService.changePassword({ oldPassword, newPassword }, currentUser),
    ).rejects.toThrowError(ForbiddenException);
  });

  it('should throw NotFoundException for user not found with old password', async () => {
    const oldPassword = 'oldPassword';
    const newPassword = 'newPassword123';
    const currentUser = new Users();
    currentUser.id = '1';

    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

    await expect(
      userService.changePassword({ oldPassword, newPassword }, currentUser),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should throw BadRequestException for missing old password', async () => {
    const newPassword = 'newPassword123';
    const currentUser = new Users();
    currentUser.id = '1';

    await expect(
      userService.changePassword({ newPassword }, currentUser),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should send forgot password email and save the user with a reset token', async () => {
    // Mock the user returned from the repository
    const user = new Users();
    user.email = 'user@example.com';
    user.username = 'example_user';
    user.status = UserStatus.ACTIVE;
    user.hashedPassword = 'hashedPassword';

    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(mockJwtService, 'signAsync')
      .mockResolvedValueOnce('mockedToken');
    jest
      .spyOn(userService['sendGridClient'], 'sendForgotPasswordEmail')
      .mockResolvedValueOnce(undefined);
    jest.spyOn(mockUserRepository, 'save').mockResolvedValueOnce(user);

    const email = 'user@example.com';
    const ip = '127.0.0.1';
    const device = {
      type: 'desktop',
      parser: { useragent: { os: { family: 'Windows' } } },
    };
    const host = 'http://example.com';

    await userService.forgotPassword(email, ip, device, host);

    // Assert that the user's reset_token has been updated
    expect(user.reset_token).toBe('mockedToken');

    // Assert that the sendForgotPasswordEmail method was called with the correct arguments
    expect(
      userService['sendGridClient'].sendForgotPasswordEmail,
    ).toHaveBeenCalledWith(
      'user@example.com',
      'example_user',
      'http://example.com?token=mockedToken',
    );
  });

  it('should throw NotFoundException for user not found', async () => {
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

    const email = 'nonexistent@example.com';
    const ip = '127.0.0.1';
    const device = {
      type: 'desktop',
      parser: { useragent: { os: { family: 'Windows' } } },
    };
    const host = 'http://example.com';

    await expect(
      userService.forgotPassword(email, ip, device, host),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should throw UnauthorizedException for deactivated user', async () => {
    const user = new Users();
    user.email = 'deactivated@example.com';
    user.status = UserStatus.DEACTIVE;

    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(user);

    const email = 'deactivated@example.com';
    const ip = '127.0.0.1';
    const device = {
      type: 'desktop',
      parser: { useragent: { os: { family: 'Windows' } } },
    };
    const host = 'http://example.com';

    await expect(
      userService.forgotPassword(email, ip, device, host),
    ).rejects.toThrowError(UnauthorizedException);
  });

  it('should update user profile with file', async () => {
    // Mock user data and file
    const userData: UpdateProfileDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      contact: '1234567890',
    };
    const file: any = {
      buffer: Buffer.from('file-content'), // Mock file content
    };
    const currentUser = new Users(); // Mock the current user
    currentUser.status = UserStatus.ACTIVE;
    // Mock the findOne method of the userRepository
    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockResolvedValueOnce(currentUser);

    // Mock the uploadFileInS3 method of the cloudStorageService
    jest.spyOn(cloudStorageService, 'uploadFileInS3').mockResolvedValueOnce({
      fileId: 'mockedFileId',
      fileName: 'mockedFileName',
    });

    // Mock the save method of the userRepository
    jest.spyOn(mockUserRepository, 'save').mockResolvedValueOnce(currentUser);

    // Call the updateProfile method
    const result = await userService.updateProfile(userData, file, currentUser);

    // Assert the result or add other assertions as needed
    expect(result).toEqual(currentUser);
    expect(currentUser.fileId).toBe('mockedFileId');
    expect(currentUser.profilePicture).toBe(`${S3_ENUMS.URL}/mockedFileName`);
  });
  it('should handle conflict for duplicate email', async () => {
    const userData: UpdateProfileDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      contact: '1234567890',
    };
    const file: any = {
      buffer: Buffer.from('file-content'),
    };
    const currentUser = new Users();
    currentUser.status = UserStatus.ACTIVE;
    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockResolvedValueOnce(currentUser);
    jest.spyOn(mockUserRepository, 'save').mockRejectedValueOnce({
      errno: 1062,
      sqlMessage: "Duplicate entry 'john.doe@example.com'",
    });

    await expect(
      userService.updateProfile(userData, file, currentUser),
    ).rejects.toThrowError(ConflictException);
  });
  it('should throw UnauthorizedException when user is inactive', async () => {
    const userData: UpdateProfileDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      contact: '1234567890',
    };
    const file: any = {
      buffer: Buffer.from('file-content'),
    };
    const currentUser = new Users();
    currentUser.status = UserStatus.DEACTIVE;

    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockResolvedValueOnce(currentUser);

    await expect(
      userService.updateProfile(userData, file, currentUser),
    ).rejects.toThrowError(UnauthorizedException);
  });
});
