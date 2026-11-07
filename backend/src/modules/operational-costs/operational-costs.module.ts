import { Module } from '@nestjs/common';
import { OperationalCostsController } from './operational-costs.controller';
import { OperationalCostsService } from './operational-costs.service';

@Module({
  controllers: [OperationalCostsController],
  providers: [OperationalCostsService],
})
export class OperationalCostsModule {}
