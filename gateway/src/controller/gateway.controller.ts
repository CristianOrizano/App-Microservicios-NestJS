import { HttpService } from '@nestjs/axios';
import { Controller, Get, Param } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Controller('api')
export class GatewayController {
  constructor(private readonly httpService: HttpService) {}

  // Ruteo para obtener Categorías
  @Get('categoria')
  getCategorias(): Observable<any> {
    return this.httpService
      .get('http://localhost:3000/api/categoria')
      .pipe(map((response) => response.data));
  }

  // Ruteo para obtener Empleados
  @Get('empleado')
  getEmpleados(): Observable<any> {
    return this.httpService
      .get('http://localhost:3000/api/empleado')
      .pipe(map((response) => response.data));
  }

  // Ruta para obtener una categoría por ID
  @Get('categoria/:id')
  getCategoria(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`http://localhost:3000/api/categoria/${id}`)
      .pipe(map((response) => response.data));
  }

  // Ruta para obtener un empleado por ID
  @Get('empleado/:id')
  getEmpleado(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`http://localhost:3000/api/empleado/${id}`)
      .pipe(map((response) => response.data));
  }
}
