import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { UsuarioDto } from '../usuario.dto';

import { UsuariosaveDto } from '../usuario.save.dto';
import { Usuario } from 'src/domain/usuario.entity';

@Injectable()
export class UsuarioProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}
	get profile(): MappingProfile {
		return mapper => {
			createMap(mapper, UsuarioDto, Usuario);
			createMap(mapper, Usuario, UsuarioDto);
			createMap(mapper, UsuariosaveDto, Usuario);
		};
	}
}
