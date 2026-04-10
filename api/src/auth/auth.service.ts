import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const exists = await this.userModel.findOne({ email: email.toLowerCase() });
    if (exists) throw new ConflictException('El email ya está registrado');

    const hashed = await bcrypt.hash(password, 12);
    const user = await this.userModel.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
    });

    const tokens = this.generateTokens(user._id.toString());
    return { user: this.sanitizeUser(user), tokens };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    const tokens = this.generateTokens(user._id.toString());
    return { user: this.sanitizeUser(user), tokens };
  }

  async me(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new UnauthorizedException();
    return this.sanitizeUser(user);
  }

  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });

    // Always return same shape to avoid user enumeration
    if (!user) return { message: 'ok', code: null };

    // Generate 6-digit numeric code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await this.userModel.updateOne(
      { _id: user._id },
      { resetCode: hashed, resetCodeExpiresAt: expiresAt },
    );

    // Temporary: return code directly (replace with email sending later)
    return { message: 'ok', code };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user || !user.resetCode || !user.resetCodeExpiresAt) {
      throw new BadRequestException('Código inválido o expirado');
    }

    if (user.resetCodeExpiresAt < new Date()) {
      throw new BadRequestException('El código expiró. Solicitá uno nuevo.');
    }

    const valid = await bcrypt.compare(code, user.resetCode);
    if (!valid) throw new BadRequestException('Código incorrecto');

    const hashed = await bcrypt.hash(newPassword, 12);
    await this.userModel.updateOne(
      { _id: user._id },
      { password: hashed, resetCode: undefined, resetCodeExpiresAt: undefined },
    );

    return { message: 'Contraseña actualizada correctamente' };
  }

  private generateTokens(userId: string) {
    const accessToken = this.jwtService.sign({ sub: userId });
    const refreshToken = this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      { expiresIn: '30d' },
    );
    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: UserDocument) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      familyId: user.familyId?.toString(),
    };
  }
}
