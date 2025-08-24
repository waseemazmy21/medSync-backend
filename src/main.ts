import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions, ApiExtraModels } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // Import DTOs for extra models
  const { UpdateAppointmentByDoctorDto } = await import('./appointment/dto/update-appointment.dto');
  const { UpdateAppointmentByPatientDto } = await import('./appointment/dto/update-appointment.dto');
  const { CreatePrescriptionDto } = await import('./appointment/dto/create-appointment.dto');

  // Register extra models for OpenAPI
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, new DocumentBuilder()
    .setTitle('Medsync')
    .setDescription('Medsync API description')
    .setVersion('1.0')
    .addTag('medsync')
    .build(), {
      extraModels: [UpdateAppointmentByDoctorDto, UpdateAppointmentByPatientDto, CreatePrescriptionDto],
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey
    }
  ));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
