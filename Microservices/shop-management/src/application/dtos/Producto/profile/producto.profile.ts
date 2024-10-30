import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { ProductoDto } from '../producto.dto';

import { ProductoSaveDto } from '../producto.save.dto';
import { ProductoCategoriaSaveDto } from '../producto.categ.dto';
import { Producto } from 'src/domain/producto.entity';

@Injectable()
export class ProductoProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}
	get profile(): MappingProfile {
		return mapper => {
			createMap(mapper, ProductoDto, Producto);
			createMap(mapper, Producto, ProductoDto);
			createMap(mapper, ProductoCategoriaSaveDto, Producto);
			createMap(mapper, ProductoSaveDto, Producto);
		};
	}
}
