import { Controller, Post, Body } from '@nestjs/common';
import { PerdidasService } from './perdidas.service';
import type { Perdida } from 'src/core/models/perdida.model';


@Controller('perdidas')
export class PerdidasController {

    constructor(private readonly perdidaService:PerdidasService){}
    
    @Post()
    async createPerdida(@Body() perdida: Perdida){
        const result = this.perdidaService.createPerdida(perdida);
        return result;
    }
}
