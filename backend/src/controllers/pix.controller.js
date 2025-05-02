require('../../config/database');

exports.generatePix = async (req, res) => {
    const { valor } = req.body;

    if (!valor || isNaN(valor) || valor <= 0) {
        return res.status(400).json({ error: 'Invalid amount value' });
    }

    try {
        const chavePix = '+5547999257969';
        const nomeRecebedor = 'Carlos';
        const cidade = 'JOINVILLE';
        const valorFormatado = Number(valor).toFixed(2);
        const txid = 'SACOLINHA-FLORADA';

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
            message: 'PIX code generated successfully'
        });
    } catch (err) {
        console.error('Error generating manual PIX:', err);
        return res.status(500).json({ 
            error: 'Error generating manual PIX', 
            details: err.message 
        });
    }
};


