import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FamilyService } from './family.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateFamilyDto, JoinFamilyDto } from './dto/family.dto';
import { UserDocument } from '../auth/schemas/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('family')
export class FamilyController {
  constructor(private familyService: FamilyService) {}

  @Get()
  getGroup(@CurrentUser() user: UserDocument) {
    return this.familyService.getGroup(user._id.toString());
  }

  @Post()
  create(@Body() dto: CreateFamilyDto, @CurrentUser() user: UserDocument) {
    return this.familyService.create(dto.name, user._id.toString());
  }

  @Post('join')
  join(@Body() dto: JoinFamilyDto, @CurrentUser() user: UserDocument) {
    return this.familyService.joinByCode(dto.code, user._id.toString());
  }

  @Get('invite-qr')
  getInviteQr(@CurrentUser() user: UserDocument) {
    return this.familyService.getInviteQr(user._id.toString());
  }

  @Delete('members/:id')
  removeMember(
    @Param('id') memberId: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.familyService.removeMember(memberId, user._id.toString());
  }

  @Patch('members/:id')
  updateMemberRole(
    @Param('id') memberId: string,
    @Body('role') role: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.familyService.updateMemberRole(
      memberId,
      role,
      user._id.toString(),
    );
  }
}
