import { PartialType } from '@nestjs/mapped-types';
import { CreateOperationalCostDto } from './create-operational-cost.dto';

export class UpdateOperationalCostDto extends PartialType(CreateOperationalCostDto) {}
