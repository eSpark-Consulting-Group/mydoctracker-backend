import {
  GoneException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTP, OtpPurpose } from 'src/entities/otp.entity';
import { Users } from 'src/entities/User.entity';

@Injectable()
export class OTPService {
  constructor(
    @InjectRepository(OTP)
    private otpRepositry: Repository<OTP>,
  ) {}

  async generatOTP(user: Users, purpose: OtpPurpose, expiresAt: Date) {
    const otp = await this.otpRepositry.findOne({
      where: { user: user.id, purpose },
    });
    if (otp) {
      otp.otp = Math.floor(1000 + Math.random() * 9000);
      otp.expiresAt = expiresAt;
      return this.otpRepositry.save(otp);
    }
    const newOtp = this.otpRepositry.create({
      otp: Math.floor(1000 + Math.random() * 9000),
      purpose,
      user: user.id,
      expiresAt,
    });
    return this.otpRepositry.save(newOtp);
  }

  async verifyOTP(user: Users, purpose: OtpPurpose, otp: number) {
    const otpFound = await this.otpRepositry.findOne({
      where: { user: user.id, purpose, otp },
    });
    if (!otpFound) {
      throw new UnauthorizedException('Invalid OTP');
    }
    const expires_at = otpFound.expiresAt;
    if (expires_at.getTime() < Date.now()) {
      await this.otpRepositry.delete(otpFound);
      throw new GoneException('OTP has been expired');
    }
    return otpFound.id;
  }

  async deleteOtp(id: string) {
    return this.otpRepositry.delete({ id });
  }
}
