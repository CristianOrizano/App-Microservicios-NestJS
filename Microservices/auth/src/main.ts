import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const kafkaMicroservice = app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.KAFKA,
		options: {
			client: {
				brokers: ['localhost:9092'], // Ajusta según tu configuración
			},
			consumer: {
				groupId: 'auth-consumer', // El grupo de consumidores que utilizará este microservicio
			},
		},
	});

	// Inicia todos los microservicios
	await app.startAllMicroservices();
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);
	//Swager
	const config = new DocumentBuilder()
		.setTitle('Shop Management')
		.setDescription('The Shop API description')
		.setVersion('1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
			'jwt', // Este es el nombre que usaremos para referenciar el esquema de seguridad
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	// Configuración para que el esquema de autenticación se aplique a todas las rutas automáticamente.
	document.paths = Object.keys(document.paths).reduce((paths, path) => {
		const pathItem = document.paths[path];
		const methods = Object.keys(pathItem);

		methods.forEach(method => {
			pathItem[method] = {
				...pathItem[method],
				security: [{ jwt: [] }],
			};
		});

		paths[path] = pathItem;
		return paths;
	}, {});
	SwaggerModule.setup('api', app, document);
	await app.listen(3001);
}
bootstrap();
