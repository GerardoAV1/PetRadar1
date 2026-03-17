import { Module } from '@nestjs/common';
import { PerdidasController } from './perdidas.controller';
import { PerdidasService } from './perdidas.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [PerdidasController],
  providers: [PerdidasService]
})
export class PerdidasModule {}
