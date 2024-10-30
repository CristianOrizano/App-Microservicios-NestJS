import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);
	// Configuración del microservicio Kafka
	const kafkaMicroservice = app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.KAFKA,
		options: {
			client: {
				brokers: ['localhost:9092'], // Ajusta según tu configuración de Kafka
			},
			consumer: {
				groupId: 'shop-consumer', // ID del grupo de consumidores para recibir las respuestas
			},
		},
	});

	// Inicia el microservicio Kafka
	await app.startAllMicroservices();
	//Swager
	const config = new DocumentBuilder()
		.setTitle('Shop Management')
		.setDescription('The Shop API description')
		.setVersion('1.0')

		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('api', app, document);

	await app.listen(3000);
}
bootstrap();
