import { PageRequest } from "src/shared/page/pageRequest";


export class CategoriaFilter extends PageRequest {
	nombre: string;
	descripcion: string;
	estado: boolean;
}
