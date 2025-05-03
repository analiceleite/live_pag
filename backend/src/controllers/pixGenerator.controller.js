require('../../config/database');
/**
 * Gera um código PIX dinâmico com base na chave selecionada
 * @param {Object} req - Objeto de requisição com valor e ID da chave PIX (opcional)
 * @param {Object} res - Objeto de resposta
 */

exports.generatePix = async (req, res) => {
    const { valor, pixKeyId } = req.body;

    if (!valor || isNaN(valor) || Number(valor) <= 0) {
        return res.status(400).json({ error: 'Valor de pagamento inválido' });
    }

    try {
        let pixKey;

        if (pixKeyId) {
            pixKey = await PixKey.findById(pixKeyId);
            if (!pixKey) {
                return res.status(404).json({ error: 'Chave PIX não encontrada' });
            }
            if (!pixKey.ativo) {
                return res.status(400).json({ error: 'Essa chave PIX está inativa' });
            }
        } else {
            pixKey = await PixKey.findOne({ principal: true, ativo: true });
            if (!pixKey) {
                pixKey = await PixKey.findOne({ ativo: true });
                if (!pixKey) {
                    return res.status(404).json({ error: 'Nenhuma chave PIX ativa cadastrada' });
                }
            }
        }

        const chavePix = pixKey.chave.trim();
        const nomeRecebedor = pixKey.nomeRecebedor.trim();
        const cidade = pixKey.cidade.trim();
        const valorFormatado = Number(valor).toFixed(2);
        const txid = 'Sacolinha'; 

        function formatField(id, value) {
            const size = String(value.length).padStart(2, '0');
            return `${id}${size}${value}`;
        }

        const payloadSemCRC = [
            formatField('00', '01'),
            formatField('26',
                formatField('00', 'BR.GOV.BCB.PIX') +
                formatField('01', chavePix)
            ),
            formatField('52', '0000'),
            formatField('53', '986'),
            formatField('54', valorFormatado),
            formatField('58', 'BR'),
            formatField('59', nomeRecebedor),
            formatField('60', cidade),
            formatField('62',
                formatField('05', txid)
            )
        ].join('');

        const payloadComCRCBase = payloadSemCRC + '6304';

        function crc16(str) {
            let crc = 0xFFFF;
            for (let i = 0; i < str.length; i++) {
                crc ^= str.charCodeAt(i) << 8;
                for (let j = 0; j < 8; j++) {
                    if (crc & 0x8000) {
                        crc = (crc << 1) ^ 0x1021;
                    } else {
                        crc <<= 1;
                    }
                }
            }
            return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
        }

        const crc = crc16(payloadComCRCBase);
        const payloadFinal = payloadComCRCBase + crc;

        return res.json({
            payload: payloadFinal,
            pixKey: {
                id: pixKey._id,
                chave: pixKey.chave,
                nomeRecebedor: pixKey.nomeRecebedor
            },
            valor: valorFormatado,
            message: 'Código PIX gerado com sucesso'
        });
    } catch (err) {
        console.error('Erro ao gerar código PIX:', err);
        return res.status(500).json({
            error: 'Erro ao gerar código PIX',
            details: err.message
        });
    }
};