import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { Document } from 'src/entities/Document.entity';
import { Users } from 'src/entities/User.entity';
import { NotFoundException } from '@nestjs/common';
import { DeviceInventory } from 'src/entities/DeviceInventory.entity';
import { MongoDBService } from 'src/mongodb/mongodb.service';
import { Admin } from 'src/entities/Admin.entity';
import { FirmwareService } from 'src/firmware/firmware.service';
import { Model } from 'mongoose';
import { DeviceTelemtry } from 'src/mongodb/schemas/device_telemetry.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Firmware } from 'src/entities/Firmware.entity';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { AddGeofenceDTO } from './dto/device-dto';

// Mock data and services
const mockAssignee = new Users();

mockAssignee.id = 'user_id';
mockAssignee.username = 'testuser';
mockAssignee.email = 'test@example.com';

const mockDocumentId = 'document_id';
const mockGeofenceId = 'geofence_id';

const mockDocumentWithGeofence = {
  id: mockDocumentId,
  assignee: mockAssignee,
  meta: {
    geofences: [
      {
        id: mockGeofenceId,
        name: 'Geofence 1',
        geofence: [{ lat: 90, lng: 180 }],
      },
    ],
  },
};

const mockDocumentWithoutGeofence = {
  id: mockDocumentId,
  assignee: mockAssignee,
  meta: {},
};

const mockDocumentRepository = {
  findOne: jest.fn().mockResolvedValue(mockDocumentWithGeofence),
  save: jest.fn(),
};
const mockDocument = {
  id: mockDocumentId,
  assignee: mockAssignee,
  meta: {
    geofences: [
      {
        id: 'geofence_id_1',
        name: 'Geofence 1',
        geofence: 'Mock geofence coordinates 1',
      },
    ],
  },
};
const mockDocumentWithoutGeofences = {
  id: mockDocumentId,
  assignee: mockAssignee,
  meta: {},
};
const mockDeviceRepository = {};
const mockFirmwareRepository = {};
const mockAdminRepository = {};
const mockMongoDBSerice = {};
describe('DeviceService', () => {
  let service: DeviceService;
  let model: Model<DeviceTelemtry>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
        {
          provide: getRepositoryToken(DeviceInventory),
          useValue: mockDeviceRepository,
        },
        {
          provide: getRepositoryToken(Firmware),
          useValue: mockFirmwareRepository,
        },
        {
          provide: getRepositoryToken(Admin),
          useValue: mockAdminRepository,
        },
        {
          provide: getModelToken(DeviceTelemtry.name),
          useValue: mockMongoDBSerice,
        },
        MongoDBService,
        FirmwareService,
        CloudStorageService,
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
  });

  describe('deleteGeofence', () => {
    it('should delete the geofence successfully', async () => {
      await service.deleteGeofence(mockAssignee, {
        documentId: mockDocumentId,
        geofenceId: mockGeofenceId,
      });

      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockDocumentId, assignee: mockAssignee },
      });
      expect(mockDocumentRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when the geofence is not found', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(
        mockDocumentWithoutGeofence,
      );

      await expect(
        service.deleteGeofence(mockAssignee, {
          documentId: mockDocumentId,
          geofenceId: 'non_existent_geofence_id',
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('createGeofence', () => {
    it('should create a new geofence successfully', async () => {
      const geofenceData: AddGeofenceDTO = {
        name: 'New Geofence',
        geofence: [{ lat: 90, lng: 180 }],
      };

      await service.createGeofence(mockAssignee, mockDocumentId, geofenceData);

      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockDocumentId, assignee: mockAssignee },
      });
      expect(mockDocumentRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when the document is not found', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(undefined);

      const geofenceData: AddGeofenceDTO = {
        name: 'New Geofence',
        geofence: [{ lat: 90, lng: 180 }],
      };

      await expect(
        service.createGeofence(
          mockAssignee,
          'non_existent_document_id',
          geofenceData,
        ),
      ).rejects.toThrowError(NotFoundException);

      // Additional assertions based on the expected behavior
    });
  });

  describe('getAllGeofences', () => {
    it('should get all geofences successfully', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(true);
      const geofences = await service.getAllGeofences(
        mockAssignee,
        mockDocumentId,
      );

      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockDocumentId, assignee: mockAssignee },
      });

      expect(geofences).toEqual(mockDocumentWithGeofence.meta?.geofences);
    });

    it('should return an empty array when there are no geofences', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(
        mockDocumentWithoutGeofences,
      );

      const geofences = await service.getAllGeofences(
        mockAssignee,
        mockDocumentId,
      );

      expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockDocumentId, assignee: mockAssignee },
      });

      expect(geofences).toEqual([]);
    });

    it('should throw NotFoundException when the document is not found', async () => {
      mockDocumentRepository.findOne.mockResolvedValue(undefined);

      await expect(
        service.getAllGeofences(mockAssignee, 'non_existent_document_id'),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
