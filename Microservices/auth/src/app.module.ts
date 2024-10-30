import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './domain/usuario.entity';
import { Role } from './domain/role.entity';
import { UsuarioService } from './application/usuario.service';
import { UsuarioRepository } from './infraestructure/usuario.repository';
import { UsuarioProfile } from './application/dtos/Usuario/profile/usuario.profile';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './controller/auth.controller';
import { UsuarioController } from './controller/usuario.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthJWTGuard } from './guard/auth.guard';
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
						groupId: 'auth-consumer', // Grupo de consumidores
					},
				},
			},
		]),
		TypeOrmModule.forFeature([Usuario, Role]),
		AutomapperModule.forRoot({
			strategyInitializer: classes(),
		}),
		PassportModule,
		JwtModule.register({
			global: true,
			secret: 'clave-secreta',
			signOptions: { expiresIn: '1h' }, // Expiración del token
		}),
		TypeOrmModule.forRoot({
			type: 'mysql', // Especifica que usarás MySQL
			host: 'localhost', // Host de tu servidor MySQL
			port: 3306, // Puerto por defecto de MySQL
			username: 'root', // Usuario de la base de datos
			password: 'mysql', // Contraseña de la base de datos
			database: 'node_back', // Nombre de la base de datos
			entities: [Usuario, Role],
			synchronize: false, // Sincroniza las entidades con la base de datos (solo para desarrollo)
		}),
	],
	providers: [
		UsuarioService,
		UsuarioRepository,
		UsuarioProfile,
		JwtStrategy,
		{
			provide: APP_GUARD,
			useClass: AuthJWTGuard,
		},
	],
	controllers: [AuthController, UsuarioController],
})
export class AppModule {}
