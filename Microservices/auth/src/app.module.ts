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
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: configService.get<string>('JWT_EXPIRATION_TIME', '1h'),
				},
			}),
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
				//entities: [Empleado, Categoria, Producto, Usuario, Role],
				synchronize: false, // Sincroniza las entidades con la base de datos (solo para desarrollo)
			}),
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
