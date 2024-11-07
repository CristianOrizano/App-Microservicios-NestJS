import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './domain/empleado.entity';
import { Categoria } from './domain/categoria.entity';
import { Producto } from './domain/producto.entity';
import { EmpleadoService } from './application/empleado.service';
import { EmpleadoRepository } from './infraestructure/empleado.repository';
import { EmpleadoProfile } from './application/dtos/Empleado/profile/empleado.profile';
import { CategoriaService } from './application/categoria.service';
import { CategoriaRepository } from './infraestructure/categoria.repository';
import { CategoriaProfile } from './application/dtos/Categoria/profile/categoria.profile';
import { ProductoService } from './application/producto.service';
import { ProductoRepository } from './infraestructure/producto.repository';
import { ProductoProfile } from './application/dtos/Producto/profile/producto.profile';
import { EmpleadoController } from './controller/empleado.controller';
import { CategoriaController } from './controller/categoria.controller';
import { ProductoController } from './controller/producto.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true, // Hace que el módulo Config sea accesible globalmente
		}),
		ClientsModule.register([
			{
				name: 'KAFKA_SERVICE', // Identificador del cliente Kafka
				transport: Transport.KAFKA,
				options: {
					client: {
						brokers: ['localhost:9092'], // Dirección de tu broker Kafka
					},
					consumer: {
						groupId: 'shop-consumer', // Grupo de consumidores
					},
				},
			},
		]),
		TypeOrmModule.forFeature([Empleado, Categoria, Producto]),
		AutomapperModule.forRoot({
			strategyInitializer: classes(),
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'mysql',
				host: configService.get<string>('DB_HOST', 'localhost'),
				port: configService.get<number>('DB_PORT'),
				username: configService.get<string>('DB_USERNAME'),
				password: configService.get<string>('DB_PASSWORD'),
				database: configService.get<string>('DB_NAME'),
				entities: [__dirname + '/**/*.entity{.ts,.js}'],
				synchronize: false, // Sincroniza las entidades con la base de datos (solo para desarrollo)
			}),
		}),
	],
	controllers: [EmpleadoController, CategoriaController, ProductoController],
	providers: [
		EmpleadoService,
		EmpleadoRepository,
		EmpleadoProfile,
		CategoriaService,
		CategoriaRepository,
		CategoriaProfile,
		ProductoService,
		ProductoRepository,
		ProductoProfile,
	],
})
export class AppModule {}
