import { Injectable } from '@angular/core';
import { ClientPendencies } from '../models/purchase.interface';
import { PixKey } from '../api/shared/pix-key.service';

@Injectable({
    providedIn: 'root'
})
export class WhatsappService {
    /**
     * @param client 
     * @param selectedPixKey  
     * @param orderUrl    
     */
    generatePendingItemsMessage(
        client: ClientPendencies,
        selectedPixKey: PixKey | null,
        orderUrl: string
    ): string {
        const itemsByDate = client.purchase_groups
            .filter(g => !g.is_paid)
            .map(g => ({
                date: this.formatDate(g.date),
                items: g.purchases.map(p => `- ${p.clothing}: R$ ${Number(p.price).toFixed(2)}`),
                total: g.total_amount
            }));

        const pendingSections = itemsByDate
            .map(g => `SACOLINHA DO DIA ${g.date}:\n${g.items.join('\n')}`)
            .join('\n\n');

        const totalAmount = itemsByDate.reduce((sum, g) => sum + g.total, 0);

        const message = `OI! SEUS ITENS ESTÃO ESPERANDO POR VOCÊ!

SUAS ROUPAS DO DIA ${itemsByDate[0]?.date}:
${itemsByDate[0]?.items.join('\n')}

PREÇO TOTAL: R$ ${totalAmount.toFixed(2)}

PARA RECEBER SUAS ROUPAS:
1. Relize o pagamento via PIX ou pelo app
2. Depois é só esperar chegar na sua casa!

>>> PARA PAGAR VIA PIX:
Pix: ${selectedPixKey ? selectedPixKey.key : ''}
Nome: ${selectedPixKey ? selectedPixKey.receptor_name : ''}

>>> PARA SOLICITAR A ENTREGA DO SEU PEDIDO:
1. Acesse o link: ${orderUrl}
2. Relize o login no app com o seu telefone: ${client.phone}
3. Clique em "Solicitar entrega" da sua sacolinha
4. Vamos receber a solicitação e agendar a entrega para segunda-feira

>>> EM CASO DE ENTREGA PELO CORREIO:
1. Assim que o pedido for enviado, o código de rastreio ficará disponível no app
2. Você pode acompanhar o rastreio pelo site do correio

>>> LEMBRETE IMPORTANTE:
* O pagamento deve ser realizado até meio dia
* As sacolinhas são enviadas toda segunda-feira`;

        return message.trim();
    }

    private formatDate(dateString: string): string {
        const date = new Date(dateString + 'T12:00:00');
        return date.toLocaleDateString('pt-BR');
    }
}