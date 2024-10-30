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

@Module({
	imports: [
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
		TypeOrmModule.forRoot({
			type: 'mysql', // Especifica que usarás MySQL
			host: 'localhost', // Host de tu servidor MySQL
			port: 3306, // Puerto por defecto de MySQL
			username: 'root', // Usuario de la base de datos
			password: 'mysql', // Contraseña de la base de datos
			database: 'node_back', // Nombre de la base de datos
			entities: [Empleado, Categoria, Producto],
			synchronize: false, // Sincroniza las entidades con la base de datos (solo para desarrollo)
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
