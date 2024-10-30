import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Producto } from "src/domain/producto.entity";
import { IProductoRepository } from "src/domain/repository/IProducto.repository";
import { PageResponse } from "src/shared/page/pageResponse";
import { Repository } from "typeorm";

@Injectable()
export class ProductoRepository implements IProductoRepository {
	constructor(
		@InjectRepository(Producto)
		private productoRepository: Repository<Producto>,
	) {}
	async findAllAsycn(): Promise<Producto[]> {
		return await this.productoRepository.find({ relations: { categoria: true } });
	}
	async findByIdAsycn(id: number): Promise<Producto> {
		return await this.productoRepository.findOne({ where: { id } });
	}

	async deleteAsycn(id: number): Promise<void> {
		await this.productoRepository.delete(id);
	}
	paginated(producto: Producto, page: number, rows: number): Promise<PageResponse<Producto>> {
		throw new Error('Method not implemented.');
	}

	async saveAsycn(producto: Producto): Promise<Producto> {
		return await this.productoRepository.save(producto);
	}
}
