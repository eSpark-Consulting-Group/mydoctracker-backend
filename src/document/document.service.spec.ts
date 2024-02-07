import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/entities/User.entity';
import { Document } from 'src/entities/Document.entity';
import { DocumentHistory } from 'src/entities/DocumentHistory.entity';
import { EmailService } from 'src/utils/helpers/email';
import { OTPService } from 'src/otp/otp.service';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { DeviceService } from 'src/device/device.service';
import { DocumentType } from 'enum';
import { OtpPurpose } from 'src/entities/otp.entity';
import { NotFoundException } from '@nestjs/common';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

const mockDocumentRepository = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockDocumentId = 'document_id';
const mockOptions: IPaginationOptions = { page: 1, limit: 10 };
const mockDocumentHistory = [
  /* Mock DocumentHistory entities here */
];

const mockDocumentHistoryRepository = {
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  })),
  findAndCount: jest
    .fn()
    .mockResolvedValue([mockDocumentHistory, mockDocumentHistory.length]),
  save: jest.fn(),
  create: jest.fn(),
};

const mockPagination: Pagination<DocumentHistory> = {
  items: mockDocumentHistory,
  links: { first: 'first', previous: 'previous', next: 'next', last: 'last' },
  meta: {
    currentPage: 1,
    itemCount: mockDocumentHistory.length,
    itemsPerPage: 10,
    totalItems: mockDocumentHistory.length,
    totalPages: 1,
  },
};

const mockDeviceService = {
  getDeviceById: jest.fn(),
  isDeviceActive: jest.fn(),
};

const mockFileUploadService = {
  uploadDocumentFile: jest.fn(),
};

const mockOtpService = {
  verifyOTP: jest.fn(),
  deleteOtp: jest.fn(),
  generatOTP: jest.fn(),
};

const mockEmailService = {
  sendOtpEmail: jest.fn(),
};
jest.mock('nestjs-typeorm-paginate', () => ({
  ...jest.requireActual('nestjs-typeorm-paginate'),
  paginate: jest.fn(),
}));

describe('DocumentService', () => {
  let documentService: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
        {
          provide: getRepositoryToken(DocumentHistory),
          useValue: mockDocumentHistoryRepository,
        },
        { provide: DeviceService, useValue: mockDeviceService },
        { provide: CloudStorageService, useValue: mockFileUploadService },
        { provide: OTPService, useValue: mockOtpService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    documentService = module.get<DocumentService>(DocumentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all documents for an assignee', async () => {
    const mockAssignee = new Users();
    mockAssignee.id = 'mockUserId';

    const mockDocuments = [
      { title: 'Document 1', tracker: { id: '1' } },
      { title: 'Document 2', tracker: { id: '2' } },
    ];
    mockDocumentRepository.createQueryBuilder = jest.fn().mockReturnValue({
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValueOnce(mockDocuments),
    });
    mockDeviceService.isDeviceActive.mockResolvedValue({ status: true });
    const result = await documentService.geAllDocuments(mockAssignee);
    expect(result).toEqual(mockDocuments);
  });
  it('should throw BadRequestException when the device is offline', async () => {
    const mockUser = new Users();
    const mockDocumentData: any = {
      creationDate: new Date(),
      title: 'New Document',
      deviceId: 'mockDeviceId',
      fields: '{"field1": "value1", "field2": "value2"}',
      otp: 123456,
      file: { buffer: Buffer.from('file-content') },
      type: DocumentType.SINGLE,
    };
    const mockFile: any = { buffer: Buffer.from('file-content') };

    mockDeviceService.getDeviceById.mockResolvedValueOnce({
      id: 'mockDeviceId',
    });
    mockDeviceService.isDeviceActive.mockResolvedValueOnce(false);

    await expect(
      documentService.addDocument(mockUser, mockDocumentData, mockFile),
    ).rejects.toThrowError('Device is offline');

    expect(mockDocumentRepository.create).not.toHaveBeenCalled();
    expect(mockOtpService.verifyOTP).toHaveBeenCalled();
    expect(mockFileUploadService.uploadDocumentFile).not.toHaveBeenCalled();
    expect(mockDocumentRepository.save).not.toHaveBeenCalled();
    expect(mockDocumentHistoryRepository.create).not.toHaveBeenCalled();
    expect(mockDocumentHistoryRepository.save).not.toHaveBeenCalled();
    expect(mockOtpService.deleteOtp).not.toHaveBeenCalled();
  });
  it('should add a document successfully with file and valid OTP', async () => {
    const mockUser = new Users();
    mockUser.id = 'mockUserId';

    const mockDocumentData: any = {
      creationDate: new Date(),
      title: 'New Document',
      deviceId: 'mockDeviceId',
      otp: '123456',
      file: '',
    };

    const mockFile: any = { buffer: Buffer.from('file-content') };

    const mockDevice = { id: 'mockDeviceId' };
    mockDeviceService.getDeviceById.mockResolvedValueOnce(mockDevice);
    mockDeviceService.isDeviceActive.mockResolvedValueOnce({ status: true });
    mockDocumentRepository.create.mockReturnValueOnce(mockDocumentData);
    mockDocumentRepository.save.mockResolvedValue({
      ...mockDocumentData,
      id: '123',
    });

    const mockOtp = { otp: '123456' };
    mockOtpService.generatOTP.mockResolvedValueOnce(mockOtp);
    mockOtpService.verifyOTP.mockResolvedValueOnce('mockOtpId');

    const mockFileUploadResponse = {
      fileId: 'mockFileId',
      fileName: 'mockFileName',
    };
    mockFileUploadService.uploadDocumentFile.mockResolvedValueOnce(
      mockFileUploadResponse,
    );

    const mockDocumentHistory = new DocumentHistory();
    mockDocumentHistoryRepository.create.mockReturnValueOnce(
      mockDocumentHistory,
    );

    const result = await documentService.addDocument(
      mockUser,
      mockDocumentData,
      mockFile,
    );

    // // Check if create and save methods are called with the correct arguments
    // expect(mockDocumentRepository.create).toHaveBeenCalledWith({
    //   assignee: mockUser,
    //   creationDate: mockDocumentData.creationDate,
    //   file: '',
    //   title: mockDocumentData.title,
    //   tracker: mockDevice,
    // });

    // expect(mockFileUploadService.uploadDocumentFile).toHaveBeenCalledWith(
    //   mockFile,
    //   mockUser,
    //   S3_ENUMS.docs,
    // );
    // expect(mockDocumentRepository.save).toHaveBeenCalledWith({
    //   ...mockDocument,
    //   file: `mockFileUrl/mockFileName`,
    // });

    // expect(mockDocumentHistoryRepository.create).toHaveBeenCalledWith({
    //   type: mockDocument.type,
    //   title: mockDocument.title,
    //   creationDate: mockDocument.creationDate,
    //   documentId: mockDocument.id,
    //   file: `mockFileUrl/mockFileName`,
    //   document: mockDocument,
    // });

    // expect(mockDocumentHistoryRepository.save).toHaveBeenCalledWith(
    //   mockDocumentHistory,
    // );
    expect(mockOtpService.deleteOtp).toHaveBeenCalledWith('mockOtpId');

    // Check the final result
    expect(result).toEqual({
      ...mockDocumentData,
      file: 'https://mydoctracker-dev.s3.us-west-004.backblazeb2.com/mockFileName',
      id: '123',
    });
  });
  it('should generate OTP and send email for adding a document', async () => {
    // Arrange
    const mockAssignee = new Users();
    mockAssignee.email = 'test@example.com';

    const mockGeneratedOTP = { otp: '123456' };
    mockOtpService.generatOTP.mockResolvedValueOnce(mockGeneratedOTP);

    // Act
    const result = await documentService.generateOTPForAddDoc(mockAssignee);

    // Assert
    expect(mockOtpService.generatOTP).toHaveBeenCalledWith(
      mockAssignee,
      OtpPurpose.add_document,
      expect.any(Date),
    );
    expect(mockEmailService.sendOtpEmail).toHaveBeenCalledWith(
      mockAssignee.email,
      mockGeneratedOTP.otp,
    );
    expect(result).toEqual(mockGeneratedOTP);
  });
  it('should throw NotFoundException for an invalid document', async () => {
    const mockAssignee = new Users();
    mockAssignee.id = 'mockUserId';
    mockDocumentRepository.findOne.mockResolvedValue(false); // Simulate document not found
    await expect(
      documentService.getDocumentHistory(
        mockAssignee,
        'invalid_document_id',
        mockOptions,
      ),
    ).rejects.toThrowError(NotFoundException);
  });
  it('should retrieve document history for a valid document and assignee', async () => {
    const mockAssignee = new Users();
    mockAssignee.id = 'mockUserId';
    mockDocumentRepository.findOne.mockResolvedValue(true);
    (paginate as jest.Mock).mockResolvedValue(mockPagination);
    const result = await documentService.getDocumentHistory(
      mockAssignee,
      mockDocumentId,
      mockOptions,
    );
    expect(result).toEqual(mockPagination);
  });
  it('should mark the document as deleted', async () => {
    const mockAssignee = new Users();
    mockAssignee.id = 'mockUserId';
    const mockDocument = {
      id: mockDocumentId,
      isDeleted: false,
    };
    mockDocumentRepository.findOne.mockResolvedValue(mockDocument);
    await documentService.deleteDocument(mockAssignee, mockDocumentId);
    expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockDocumentId, assignee: mockAssignee, isDeleted: false },
    });
    expect(mockDocumentRepository.save).toHaveBeenCalledWith({
      ...mockDocument,
      isDeleted: true,
    });
  });
  it('should throw NotFoundException for an invalid document', async () => {
    mockDocumentRepository.findOne.mockResolvedValue(undefined); // Simulate document not found
    const mockAssignee = new Users();
    mockAssignee.id = 'mockUserId';
    await expect(
      documentService.deleteDocument(mockAssignee, 'invalid_document_id'),
    ).rejects.toThrowError(NotFoundException);
  });
});
