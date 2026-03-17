import { Injectable } from '@nestjs/common';
import { EmailOptions } from 'src/core/models/email-options.model';
import { Perdida } from 'src/core/models/perdida.model';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class PerdidasService {

    constructor(private readonly emailService : EmailService){}

    async createPerdida(perdida:Perdida): Promise<Boolean>{
        const options : EmailOptions = {
            to: "amezquitavg@gmail.com",
            subject: perdida.description,
            htmlBody: `<h1>${perdida.description}</h1>ENCONTRAMOS!!`
        }
        const result = await this.emailService.sendEmail(options);
        return result;
    }
}
