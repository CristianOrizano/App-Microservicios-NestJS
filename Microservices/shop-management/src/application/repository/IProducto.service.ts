
import { ProductoDto } from '../dtos/Producto/producto.dto';
import { ProductoSaveDto } from '../dtos/Producto/producto.save.dto';
import { ProductoCategoriaSaveDto } from '../dtos/Producto/producto.categ.dto';

export interface IProductoService {
	findAllAsycn(): Promise<ProductoDto[]>;
	findByIdAsycn(id: number): Promise<ProductoDto>;
	createAsycn(savedto: ProductoSaveDto): Promise<ProductoDto>;
	createProductoCategoriaAsycn(savedto: ProductoCategoriaSaveDto): Promise<ProductoDto>;
	updateAsycn(id: number, savedto: ProductoSaveDto): Promise<ProductoDto>;
	deleteAsycn(id: number): Promise<ProductoDto>;
	//paginated(filters: CategoriaFilter): Promise<PageResponse<ProductoDto>>;
}
