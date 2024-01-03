import { Injectable } from '@nestjs/common';
import { B2 } from 'backblaze-b2';

@Injectable()
export class CloudStorageService {
  private b2: B2;

  constructor() {
    this.b2 = new B2({
      applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
      applicationKey: process.env.B2_APPLICATION_KEY,
    });
  }

  async uploadFile(file): Promise<string> {
    const bucketName = 'your-bucket-name';
    const fileBuffer = file.buffer;
    const fileName = file.originalname;

    try {
      await this.b2.authorize();
      const response = await this.b2.uploadFile({
        bucket: bucketName,
        fileName,
        data: fileBuffer,
      });

      return response.data.fileId;
    } catch (error) {
      console.error('Error uploading file to Backblaze:', error);
      throw new Error('Failed to upload file');
    }
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
