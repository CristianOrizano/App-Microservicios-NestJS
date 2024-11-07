import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GatewayController } from './controller/gateway.controller';

@Module({
  imports: [HttpModule],
  controllers: [GatewayController],
  providers: [],
})
export class AppModule {}
