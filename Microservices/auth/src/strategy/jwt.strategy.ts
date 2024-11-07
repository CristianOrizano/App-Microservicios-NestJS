import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioService } from '../application/usuario.service';
import { ConfigService } from '@nestjs/config';

//actua como el filtro de autenticacion
// ya q intercepta el token para su validacion
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userService: UsuarioService,
		private readonly configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET'),
		});
	}
	async validate(payload: any) {
		// Buscar el usuario en la base de datos usando el ID del payload
		const user = await this.userService.findByIdAsycn(payload.sub);

		// Verificar si el usuario existe y si está activo
		if (!user || user.estado !== true) {
			throw new UnauthorizedException('User is not active or does not exist');
		}
		return user;
	}
}
