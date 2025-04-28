import { Injectable } from '@angular/core';
import { ClientPendencies } from '../models/purchase.interface';

@Injectable({
    providedIn: 'root'
})
export class WhatsappService {
    generatePendingItemsMessage(client: ClientPendencies): string {
        const itemsByDate = client.purchase_groups
            .filter(group => !group.is_paid)
            .map(group => ({
                date: this.formatDate(group.date),
                items: group.purchases.map(p => `- ${p.clothing}: R$ ${Number(p.price).toFixed(2)}`),
                total: group.total_amount
            }));

        const pendingItemsSections = itemsByDate
            .map(group => `📅 SACOLINHA DO DIA ${group.date}:\n${group.items.join('\n')}`)
            .join('\n\n');
            
        const datesText = itemsByDate.length > 1 
            ? `DIAS ${itemsByDate.map(g => g.date).join(' e ')}`
            : `DIA ${itemsByDate[0]?.date}`;

        const totalAmount = itemsByDate.reduce((sum, group) => sum + group.total, 0);

        return encodeURIComponent(`COMPRA REALIZADA COM SUCESSO (${datesText})

Muito obrigada por acompanhar nossa live e realizar sua compra!

Seu pedido foi registrado com sucesso e está prontinho para ser finalizado.

ATENÇÃO:
A finalização do seu pedido deve ser feita exclusivamente pelo app.
É por lá que você realiza o pagamento e solicita o envio da sua sacolinha!

⸻

Confira o link do seu pedido:
[inserir link]

⸻

INFORMAÇÕES IMPORTANTES: 

* Finalize o pagamento pelo app. 
* ⁠Você pode optar por pagamento no pix ou no cartão de crédito. 
* ⁠O PAGAMENTO DEVE SER REALIZADO ATÉ MEIO DIA. 
* Após o pagamento, a solicitação de envio deve ser feita dentro do app.
* Enviamos para todo o Brasil com muito carinho!

Lembrete: os envios são feitos toda segunda-feira.

⸻

ITENS PENDENTES:
${pendingItemsSections}

💰 VALOR TOTAL: R$ ${totalAmount.toFixed(2)}

⸻

Qualquer dúvida, estamos à disposição!
Obrigada por comprar com a gente!`);
    }

    private formatDate(dateString: string): string {
        const date = new Date(dateString + 'T12:00:00'); 
        return date.toLocaleDateString('pt-BR');
    }
}
