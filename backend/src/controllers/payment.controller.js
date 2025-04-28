const { sql } = require('../../config/database');
const Excel = require('exceljs');

exports.getAllPaymentMethods = async (req, res) => {
    try {
        const result = await sql`
            SELECT * FROM payment_method 
            ORDER BY name
        `;
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        return res.status(500).json({ error: 'Error fetching payment methods', details: error.message });
    }
};

exports.getActivePaymentMethod = async (req, res) => {
    try {
        const result = await sql`
            SELECT * FROM payment_method 
            WHERE active = true 
            LIMIT 1
        `;
        if (result.length === 0) {
            return res.status(404).json({ error: 'No active payment method found' });
        }
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error('Error fetching active payment method:', error);
        return res.status(500).json({ error: 'Error fetching active payment method', details: error.message });
    }
};

exports.setActivePaymentMethod = async (req, res) => {
    const { name } = req.body;

    try {
        await sql`UPDATE payment_method SET active = false`;
        
        const result = await sql`
            UPDATE payment_method 
            SET active = true 
            WHERE name = ${name} 
            RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ error: 'Payment method not found' });
        }

        return res.status(200).json(result[0]);
    } catch (error) {
        console.error('Error setting active payment method:', error);
        return res.status(500).json({ error: 'Error setting active payment method', details: error.message });
    }
};

exports.getMonthlyData = async (req, res) => {
    const { month, year } = req.query;
    const monthNumber = getMonthNumber(month);

    try {
        const result = await sql`
            SELECT 
                SUM(CASE WHEN pm.name = 'picpay' THEN cl.price ELSE 0 END) as picpay_amount,
                SUM(CASE WHEN pm.name = 'nubank' THEN cl.price ELSE 0 END) as nubank_amount,
                SUM(CASE WHEN p.is_paid = true THEN cl.price ELSE 0 END) as total_amount,
                (SELECT COALESCE(SUM(total_value), 0) FROM mining 
                 WHERE EXTRACT(MONTH FROM created_at) = ${monthNumber}
                 AND EXTRACT(YEAR FROM created_at) = ${year}) as investment_amount
            FROM purchases p
            JOIN payment_method pm ON p.payment_method_id = pm.id
            JOIN purchase_clothings pc ON p.id = pc.purchase_id
            JOIN clothings cl ON pc.clothing_id = cl.id
            WHERE EXTRACT(MONTH FROM p.created_at) = ${monthNumber}
            AND EXTRACT(YEAR FROM p.created_at) = ${year}
            AND p.is_paid = true
            AND p.is_deleted = false
        `;

        const monthlyData = {
            picpayAmount: parseFloat(result[0].picpay_amount) || 0,
            nubankAmount: parseFloat(result[0].nubank_amount) || 0,
            totalAmount: parseFloat(result[0].total_amount) || 0,
            investmentAmount: parseFloat(result[0].investment_amount) || 0
        };

        return res.status(200).json(monthlyData);
    } catch (error) {
        console.error('Error fetching monthly data:', error);
        return res.status(500).json({ error: 'Error fetching monthly data', details: error.message });
    }
};

exports.exportMonthlyData = async (req, res) => {
    const { month, year } = req.query;
    const monthNumber = getMonthNumber(month);

    try {
        const result = await sql`
            SELECT 
                SUM(CASE WHEN pm.name = 'picpay' THEN cl.price ELSE 0 END) as picpay_amount,
                SUM(CASE WHEN pm.name = 'nubank' THEN cl.price ELSE 0 END) as nubank_amount,
                SUM(CASE WHEN p.is_paid = true THEN cl.price ELSE 0 END) as total_amount,
                (SELECT COALESCE(SUM(total_value), 0) FROM mining 
                 WHERE EXTRACT(MONTH FROM created_at) = ${monthNumber}
                 AND EXTRACT(YEAR FROM created_at) = ${year}) as investment_amount
            FROM purchases p
            JOIN payment_method pm ON p.payment_method_id = pm.id
            JOIN purchase_clothings pc ON p.id = pc.purchase_id
            JOIN clothings cl ON pc.clothing_id = cl.id
            WHERE EXTRACT(MONTH FROM p.created_at) = ${monthNumber}
            AND EXTRACT(YEAR FROM p.created_at) = ${year}
            AND p.is_paid = true
            AND p.is_deleted = false
        `;

        // Extrair os dados do resumo mensal
        const monthlyData = {
            picpayAmount: parseFloat(result[0].picpay_amount) || 0,
            nubankAmount: parseFloat(result[0].nubank_amount) || 0,
            totalAmount: parseFloat(result[0].total_amount) || 0,
            investmentAmount: parseFloat(result[0].investment_amount) || 0
        };

        // Criar um novo workbook
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet(`Resumo ${month} ${year}`);

        // Configurações da página
        worksheet.pageSetup.paperSize = 9; // A4
        worksheet.pageSetup.orientation = 'portrait';
        worksheet.pageSetup.fitToPage = true;

        // Definir largura das colunas - ajustado para 3 colunas iguais
        worksheet.getColumn('A').width = 25;
        worksheet.getColumn('B').width = 15;
        worksheet.getColumn('C').width = 15;

        // Título do relatório - todas 3 colunas
        worksheet.mergeCells('A1:C1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = `Relatório Financeiro - ${month} de ${year}`;
        titleCell.font = {
            name: 'Arial',
            size: 16,
            bold: true,
            color: { argb: '002060' }
        };
        titleCell.alignment = { horizontal: 'center' };
        worksheet.getRow(1).height = 30;

        // Informações do relatório - todas 3 colunas
        worksheet.mergeCells('A3:C3');
        const infoCell = worksheet.getCell('A3');
        infoCell.value = `Data de geração: ${currentDate}`;
        infoCell.font = {
            italic: true,
            size: 10
        };
        infoCell.alignment = { horizontal: 'right' };

        // Cabeçalho do resumo financeiro - todas 3 colunas
        worksheet.mergeCells('A5:C5');
        const summaryHeaderCell = worksheet.getCell('A5');
        summaryHeaderCell.value = 'RESUMO FINANCEIRO';
        summaryHeaderCell.font = {
            bold: true,
            size: 12
        };
        summaryHeaderCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E0E0E0' }
        };
        summaryHeaderCell.alignment = { horizontal: 'center' };
        worksheet.getRow(5).height = 20;

        // Adicionar borda inferior ao cabeçalho principal
        ['A5', 'B5', 'C5'].forEach(cell => {
            worksheet.getCell(cell).border = {
                bottom: { style: 'thin' }
            };
        });

        // Cabeçalhos das colunas - utilizando as 3 colunas
        const headerRow = worksheet.getRow(6);
        headerRow.values = ['Item', 'Valor (R$)', 'Observação'];
        headerRow.font = { bold: true };
        headerRow.height = 18;
        
        // Alinhar cabeçalhos
        headerRow.getCell(1).alignment = { horizontal: 'left' };
        headerRow.getCell(2).alignment = { horizontal: 'right' };
        headerRow.getCell(3).alignment = { horizontal: 'left' };

        // Adicionar borda sutil aos cabeçalhos
        ['A6', 'B6', 'C6'].forEach(cell => {
            worksheet.getCell(cell).border = {
                bottom: { style: 'thin', color: { argb: 'CCCCCC' } }
            };
        });

        // Cálculos adicionais para a terceira coluna
        const picpayPercentage = monthlyData.totalAmount > 0 
            ? ((monthlyData.picpayAmount / monthlyData.totalAmount) * 100).toFixed(1) + '%' 
            : '0%';
        
        const nubankPercentage = monthlyData.totalAmount > 0 
            ? ((monthlyData.nubankAmount / monthlyData.totalAmount) * 100).toFixed(1) + '%' 
            : '0%';
        
        const resultStatus = (monthlyData.picpayAmount + monthlyData.nubankAmount) - monthlyData.investmentAmount >= 0 
            ? 'Lucro' 
            : 'Prejuízo';

        // Modificar formato da tabela para melhor visualização - agora usando 3 colunas
        const dataRows = [
            ['Receitas', '', ''],
            ['Vendas Picpay', monthlyData.picpayAmount, picpayPercentage],
            ['Vendas Nubank', monthlyData.nubankAmount, nubankPercentage],
            ['', '', ''],
            ['Despesas', '', ''],
            ['Investimento em Garimpo', monthlyData.investmentAmount, '100%'],
            ['', '', ''],
            ['Resumo Final', '', ''],
            ['Total Receitas', monthlyData.picpayAmount + monthlyData.nubankAmount, ''],
            ['Total Despesas', monthlyData.investmentAmount, ''],
            ['Resultado Final', (monthlyData.picpayAmount + monthlyData.nubankAmount) - monthlyData.investmentAmount, resultStatus]
        ];

        let rowIndex = 7;
        dataRows.forEach((rowData, index) => {
            const row = worksheet.getRow(rowIndex);
            row.values = rowData;
            
            // Estilização das seções principais utilizando todas as 3 colunas
            if (rowData[0] === 'Receitas' || rowData[0] === 'Despesas' || rowData[0] === 'Resumo Final') {
                row.font = { bold: true };
                
                // Aplicar preenchimento e estilo em todas as 3 colunas
                ['A', 'B', 'C'].forEach(col => {
                    row.getCell(col).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F5F5F5' }
                    };
                    
                    row.getCell(col).border = {
                        bottom: { style: 'thin', color: { argb: 'CCCCCC' } }
                    };
                });
            }
            
            // Destacar o resultado final em todas as 3 colunas
            if (rowData[0] === 'Resultado Final') {
                row.font = { bold: true };
                
                // Determinar a cor com base no resultado
                const resultColor = (monthlyData.picpayAmount + monthlyData.nubankAmount) - monthlyData.investmentAmount >= 0 
                    ? '0000FF'  // Azul para resultado positivo
                    : 'FF0000'; // Vermelho para resultado negativo
                
                row.getCell(2).font = { bold: true, color: { argb: resultColor } };
                row.getCell(3).font = { bold: true, color: { argb: resultColor } };
            }

            // Formato para células de valor
            if (rowData[1] !== '' && rowData[0] !== 'Receitas' && rowData[0] !== 'Despesas' && rowData[0] !== 'Resumo Final') {
                row.getCell(2).numFmt = '"R$" #,##0.00';
                row.getCell(2).alignment = { horizontal: 'right' };
            }
            
            // Alinhar a terceira coluna
            row.getCell(3).alignment = { horizontal: 'center' };

            rowIndex++;
        });

        // Adicionar borda final após o resumo em todas as 3 colunas
        const finalRow = worksheet.getRow(rowIndex - 1);
        ['A', 'B', 'C'].forEach(col => {
            finalRow.getCell(col).border = {
                bottom: { style: 'thin' }
            };
        });

        // Definir o cabeçalho de resposta para download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=relatorio_financeiro_${month.toLowerCase()}_${year}.xlsx`);

        // Escrever para a resposta HTTP
        await workbook.xlsx.write(res);
        
        // Finalizar a resposta
        res.end();
    } catch (error) {
        console.error('Error exporting monthly data to Excel:', error);
        return res.status(500).json({ error: 'Error exporting monthly data to Excel', details: error.message });
    }
};

function getMonthNumber(monthName) {
    const months = {
        'Janeiro': 1, 'Fevereiro': 2, 'Março': 3, 'Abril': 4,
        'Maio': 5, 'Junho': 6, 'Julho': 7, 'Agosto': 8,
        'Setembro': 9, 'Outubro': 10, 'Novembro': 11, 'Dezembro': 12
    };
    return months[monthName];
}

