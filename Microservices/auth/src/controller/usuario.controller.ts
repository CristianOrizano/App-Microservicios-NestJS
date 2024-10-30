import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Inject,
	OnModuleInit,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsuarioService } from '../application/usuario.service';
import { UsuarioDto } from '../application/dtos/Usuario/usuario.dto';
import { UsuariosaveDto } from '../application/dtos/Usuario/usuario.save.dto';
import { ClientKafka, EventPattern, MessagePattern, Payload, CONTEXT } from '@nestjs/microservices';
import { Public } from 'src/guard/decorator/auth.decorator';

@ApiTags('Usuario')
@Controller('api/usuario')
export class UsuarioController {
	constructor(private readonly usuarioService: UsuarioService) {}

	@Get()
	@ApiResponse({ status: 200, type: [UsuarioDto] })
	@ApiResponse({ status: 404, description: 'No se encontraron usuarios.' })
	async findAll(): Promise<UsuarioDto[]> {
		return await this.usuarioService.findAllAsycn();
	}

	@Get(':id')
	@ApiResponse({ status: 200, type: UsuarioDto })
	@ApiResponse({ status: 404, description: 'No se encontro usuario.' })
	async findOne(@Param('id') id: number): Promise<UsuarioDto> {
		return await this.usuarioService.findByIdAsycn(id);
	}

	@Post()
	@HttpCode(201)
	@ApiResponse({ status: 201, type: UsuarioDto, description: 'Creado' })
	@ApiResponse({ status: 400, description: 'Error en la creación de usuario.' })
	async create(@Body() saveDto: UsuariosaveDto) {
		return await this.usuarioService.createAsycn(saveDto);
	}

	@Put(':id')
	@HttpCode(200)
	@ApiResponse({ status: 200, type: UsuarioDto })
	@ApiResponse({ status: 400, description: 'Error en la actualizado de usuario.' })
	async update(@Body() saveDto: UsuariosaveDto, @Param('id') id: number) {
		return await this.usuarioService.updateAsycn(id, saveDto);
	}

	@Delete(':id')
	@HttpCode(200)
	@ApiResponse({ status: 200, type: UsuarioDto })
	@ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
	async delete(@Param('id') id: number): Promise<UsuarioDto> {
		return await this.usuarioService.deleteAsycn(id);
	}
	// Consumidor
	@EventPattern('topic.categoria') // Escuchar eventos del topic 'topic.categoria'
	async handleCategoriaCreada(@Payload() message: any) {
		console.log('Evento recibido en el topic "topic.categoria":', message);
	}
	// Consumidor
	@MessagePattern('topic.auth') // Escuchar mensajes del topic 'topic.auth'
	async handleAuthMessage(@Payload() message: any) {
		console.log('Mensaje recibido en el topic "topic.auth":', message);

		// Procesar el mensaje y devolver una respuesta
		return { confirmation: 'Mensaje recibido correctamente' };
	}
}
