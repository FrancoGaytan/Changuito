import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FamilyController } from './family.controller';
import { FamilyService } from './family.service';
import { Family, FamilySchema } from './schemas/family.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Family.name, schema: FamilySchema }]),
    AuthModule,
  ],
  controllers: [FamilyController],
  providers: [FamilyService],
  exports: [MongooseModule],
})
export class FamilyModule {}
