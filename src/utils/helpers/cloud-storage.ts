import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { Users } from 'src/entities/User.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const B2 = require('backblaze-b2');
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CloudStorageService {
  private b2: any;

  constructor() {
    this.b2 = new B2({
      applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
      applicationKey: process.env.B2_APPLICATION_KEY,
    });
  }

  async uploadFileInS3(
    file: Express.Multer.File,
    user: Users,
    folderName: string,
  ): Promise<{ fileId: string; fileName: string }> {
    await this.b2.authorize(); // must authorize first (authorization lasts 24 hrs)
    const data = await this.b2.getUploadUrl({
      bucketId: process.env.BUCKET_ID,
    });
    const response = await this.b2.uploadFile({
      uploadUrl: data.data.uploadUrl,
      uploadAuthToken: data.data.authorizationToken,
      fileName: `${folderName}/${user.id}.jpg`,
      data: file.buffer,
    });
    if (response) {
      return { fileId: response.data.fileId, fileName: response.data.fileName };
    }
    return undefined;
  }

  async uploadReportFile(
    file: Express.Multer.File,
    user: Users,
    folderName: string,
  ): Promise<{ fileId: string; fileName: string }> {
    await this.b2.authorize(); // must authorize first (authorization lasts 24 hrs)
    const data = await this.b2.getUploadUrl({
      bucketId: process.env.BUCKET_ID,
    });

    const reportUuid = uuidv4();

    const response = await this.b2.uploadFile({
      uploadUrl: data.data.uploadUrl,
      uploadAuthToken: data.data.authorizationToken,
      fileName: `${folderName}/${user.id}/${reportUuid}.jpg`,
      data: file.buffer,
    });
    if (response) {
      return { fileId: response.data.fileId, fileName: response.data.fileName };
    }
    return undefined;
  }

  async uploadDocumentFile(
    file: Express.Multer.File,
    user: Users,
    folderName: string,
  ): Promise<{ fileId: string; fileName: string }> {
    await this.b2.authorize(); // must authorize first (authorization lasts 24 hrs)
    const data = await this.b2.getUploadUrl({
      bucketId: process.env.BUCKET_ID,
    });
    const fileExtension = extname(file.originalname);
    const response = await this.b2.uploadFile({
      uploadUrl: data.data.uploadUrl,
      uploadAuthToken: data.data.authorizationToken,
      fileName: `${folderName}/${user.id}/${uuidv4()}${fileExtension}`,
      data: file.buffer,
    });
    if (response) {
      return { fileId: response.data.fileId, fileName: response.data.fileName };
    }
    return undefined;
  }
  async uploadBuildFile(
    file: Express.Multer.File,
    folderName: string,
    fileName: string,
  ): Promise<{ fileId: string; fileName: string }> {
    await this.b2.authorize(); // must authorize first (authorization lasts 24 hrs)
    const data = await this.b2.getUploadUrl({
      bucketId: process.env.BUCKET_ID,
    });
    const fileExtension = extname(file.originalname);
    const response = await this.b2.uploadFile({
      uploadUrl: data.data.uploadUrl,
      uploadAuthToken: data.data.authorizationToken,
      fileName: `${folderName}/${fileName}${fileExtension}`,
      data: file.buffer,
    });
    if (response) {
      return { fileId: response.data.fileId, fileName: response.data.fileName };
    }
    return undefined;
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.b2.authorize();
      await this.b2.deleteFileVersion({ fileId });
    } catch (error) {
      console.error('Error deleting file from Backblaze:', error);
      throw new Error('Failed to delete file');
    }
  }
}
