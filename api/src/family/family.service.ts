import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomBytes } from 'crypto';
import * as QRCode from 'qrcode';
import { Family, FamilyDocument } from './schemas/family.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';

@Injectable()
export class FamilyService {
  constructor(
    @InjectModel(Family.name) private familyModel: Model<FamilyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async create(name: string, userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (user.familyId)
      throw new ConflictException('Ya pertenecés a un grupo familiar');

    const inviteCode = randomBytes(4).toString('hex').toUpperCase();

    const family = await this.familyModel.create({
      name,
      inviteCode,
      createdBy: new Types.ObjectId(userId),
      members: [
        { userId: new Types.ObjectId(userId), role: 'admin', status: 'active' },
      ],
    });

    await this.userModel.findByIdAndUpdate(userId, { familyId: family._id });

    const users = [user];
    return this.formatFamily(family, users);
  }

  async getGroup(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId) return null;

    const family = await this.familyModel.findById(user.familyId);
    if (!family) return null;

    const memberUserIds = family.members.map((m) => m.userId);
    const users = await this.userModel
      .find({ _id: { $in: memberUserIds } })
      .select('-password');

    return this.formatFamily(family, users);
  }

  async joinByCode(code: string, userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (user.familyId)
      throw new ConflictException('Ya pertenecés a un grupo familiar');

    const family = await this.familyModel.findOne({
      inviteCode: code.toUpperCase(),
    });
    if (!family) throw new NotFoundException('Código de invitación inválido');

    const alreadyMember = family.members.some(
      (m) => m.userId.toString() === userId,
    );
    if (alreadyMember)
      throw new ConflictException('Ya sos miembro de este grupo');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    family.members.push({
      userId: new Types.ObjectId(userId),
      role: 'editor',
      joinedAt: new Date(),
      status: 'active',
    } as any);
    await family.save();

    await this.userModel.findByIdAndUpdate(userId, { familyId: family._id });

    const memberUserIds = family.members.map((m) => m.userId);
    const users = await this.userModel
      .find({ _id: { $in: memberUserIds } })
      .select('-password');

    return this.formatFamily(family, users);
  }

  async getInviteQr(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new NotFoundException('No pertenecés a ningún grupo');

    const family = await this.familyModel.findById(user.familyId);
    if (!family) throw new NotFoundException('Grupo no encontrado');

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const joinUrl = `${frontendUrl}/join/${family.inviteCode}`;

    const qrDataUrl = await QRCode.toDataURL(joinUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#1b4332', light: '#ffffff' },
    });

    return { qrDataUrl, code: family.inviteCode };
  }

  async removeMember(memberId: string, userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new NotFoundException('No pertenecés a ningún grupo');

    const family = await this.familyModel.findById(user.familyId);
    if (!family) throw new NotFoundException('Grupo no encontrado');

    const callerMember = family.members.find(
      (m) => m.userId.toString() === userId,
    );
    if (!callerMember || callerMember.role !== 'admin')
      throw new ForbiddenException(
        'Solo administradores pueden eliminar miembros',
      );

    if (memberId === userId)
      throw new ConflictException('No podés eliminarte a vos mismo');

    family.members = family.members.filter(
      (m) => m.userId.toString() !== memberId,
    );
    await family.save();

    await this.userModel.findByIdAndUpdate(memberId, {
      $unset: { familyId: 1 },
    });
  }

  async updateMemberRole(memberId: string, role: string, userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user?.familyId)
      throw new NotFoundException('No pertenecés a ningún grupo');

    const family = await this.familyModel.findById(user.familyId);
    if (!family) throw new NotFoundException('Grupo no encontrado');

    const callerMember = family.members.find(
      (m) => m.userId.toString() === userId,
    );
    if (!callerMember || callerMember.role !== 'admin')
      throw new ForbiddenException('Solo administradores pueden cambiar roles');

    const member = family.members.find((m) => m.userId.toString() === memberId);
    if (!member) throw new NotFoundException('Miembro no encontrado');

    member.role = role;
    await family.save();

    const memberUser = await this.userModel
      .findById(memberId)
      .select('-password');
    return {
      id: memberId,
      name: memberUser?.name ?? '',
      email: memberUser?.email ?? '',
      avatarUrl: memberUser?.avatarUrl,
      role: member.role,
      joinedAt: member.joinedAt.toISOString(),
      status: member.status,
    };
  }

  private formatFamily(family: FamilyDocument, users: UserDocument[]) {
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    return {
      id: family._id.toString(),
      name: family.name,
      inviteCode: family.inviteCode,
      members: family.members.map((m) => {
        const u = userMap.get(m.userId.toString());
        return {
          id: m.userId.toString(),
          name: u?.name ?? 'Desconocido',
          email: u?.email ?? '',
          avatarUrl: u?.avatarUrl,
          role: m.role,
          joinedAt: m.joinedAt.toISOString(),
          status: m.status,
        };
      }),
    };
  }
}
