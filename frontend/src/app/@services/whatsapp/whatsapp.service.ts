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
            .map(g => `[SACOLINHA DO DIA ${g.date}]:\n${g.items.join('\n')}`)
            .join('\n\n');

        const datesText = itemsByDate.length > 1
            ? `DIAS ${itemsByDate.map(g => g.date).join(' e ')}`
            : `DIA ${itemsByDate[0]?.date}`;
        const totalAmount = itemsByDate.reduce((sum, g) => sum + g.total, 0);

        const pixCopyPaste = selectedPixKey ? selectedPixKey.key : '';

        const message = `
        
COMPRA REALIZADA COM SUCESSO (${datesText})

Muito obrigada por acompanhar nossa live e realizar sua compra!

Seu pedido foi registrado com sucesso e está prontinho para ser finalizado.

ATENÇÃO:
A finalização do seu pedido deve ser feita exclusivamente pelo app.
É por lá que você realiza o pagamento e solicita o envio da sua sacolinha!

----------

Confira o link do seu pedido:
${orderUrl}

----------

Para acompanhar o status deste pedido e ver todos os detalhes (itens, pagamentos futuros e rastreamento), basta:
1. Abrir o nosso app.
2. Fazer login com o seu telefone cadastrado: **${client.phone}**
3. Navegar pelas abas "Em aberto" e "Histórico de Compras".

----------


INFORMAÇÕES IMPORTANTES:

* Finalize o pagamento pelo app.
${selectedPixKey ? `
[DADOS PARA PAGAMENTO VIA PIX]
> Tipo: ${selectedPixKey.type === 'ALEATORIA' ? 'Chave Aleatória' : selectedPixKey.type}
> Chave: ${selectedPixKey.key}
> Nome: ${selectedPixKey.receptor_name}
> Cidade: ${selectedPixKey.city}
> Copia-cola: ${pixCopyPaste}
` : ''}
* O PAGAMENTO DEVE SER REALIZADO ATÉ MEIO DIA.
* Após o pagamento, a solicitação de envio deve ser feita dentro do app.
* Enviamos para todo o Brasil com muito carinho!

Lembrete: os envios são feitos toda segunda-feira.

----------

ITENS PENDENTES:
${pendingSections}

[VALOR TOTAL]: R$ ${totalAmount.toFixed(2)}

----------

Qualquer dúvida, estamos à disposição!
Obrigada por comprar com a gente!`;

        return message.trim();  
    }

    private formatDate(dateString: string): string {
        const date = new Date(dateString + 'T12:00:00');
        return date.toLocaleDateString('pt-BR');
    }
}