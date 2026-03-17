import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { PerdidasModule } from './perdidas/perdidas.module';

@Module({
  imports: [EmailModule, PerdidasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
