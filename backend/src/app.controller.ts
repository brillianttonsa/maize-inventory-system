import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { openApiDocument } from './openapi-document';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('openapi.json')
  getOpenApiDocument() {
    return openApiDocument;
  }
}
