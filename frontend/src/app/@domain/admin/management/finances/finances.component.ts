import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentApi, PaymentMethod } from '../../../../@services/api/payment.api';

@Component({
  selector: 'app-finances',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './finances.component.html'
})
export class FinancesComponent implements OnInit {
  // Dados de Controle
  selectedMonth: string = 'Abril';
  selectedYear: number = 2025;
  
  // Métodos de pagamento
  selectedPaymentMethod: string = 'nubank';
  paymentMethods: PaymentMethod[] = [];
  activePaymentMethod: PaymentMethod | null = null;
  selectedPaymentMethodId: number | null = null;

  // Valores de vendas
  pixAmount: number = 15000.75;
  cardAmount: number = 8500.50;
  cashAmount: number = 330.00;
  percentChange: number = 12;

  // Valores de Garimpo
  investmentAmount: number = 8750.00;
  investmentCount: number = 3;
  investmentCategories = [
    { name: 'Vestidos', amount: 3500.00 },
    { name: 'Blusas', amount: 2750.00 },
    { name: 'Acessórios', amount: 2500.00 }
  ];

  // Pendências
  pendingAmount: number = 3845.50;
  pendingShipments: number = 7;

  // Controle por data
  startDate: string = '2025-04-01';
  endDate: string = '2025-04-30';
  
  // Dados do período
  periodTotalReceived: number = 24650.80;
  periodTotalPending: number = 3845.50;
  periodReceivedPercent: number = 32;
  periodPendingPercent: number = 15;
  periodSalesCount: number = 38;
  periodNewSales: number = 8;
  periodDeliveriesCount: number = 24;
  periodDeliveryOnTimePercent: number = 93;

  // Relatório de pendências de clientes
  pendingClients = [
    {
      name: 'Ana Maria Silva',
      initials: 'AM',
      items: '3 vestidos',
      totalOpen: 1250.00,
      dueDate: '15/04/2025',
      status: 'Em atraso (3 dias)',
      isLate: true
    },
    {
      name: 'Carla Costa',
      initials: 'CC',
      items: '1 conjunto',
      totalOpen: 890.50,
      dueDate: '20/04/2025',
      status: 'No prazo',
      isLate: false
    },
    {
      name: 'Joana Santos',
      initials: 'JS',
      items: '2 blusas, 1 calça',
      totalOpen: 745.00,
      dueDate: '25/04/2025',
      status: 'No prazo',
      isLate: false
    },
    {
      name: 'Roberto Ferreira',
      initials: 'RF',
      items: '5 camisas',
      totalOpen: 960.00,
      dueDate: '30/04/2025',
      status: 'No prazo',
      isLate: false
    }
  ];

  constructor(private paymentService: PaymentApi) {}

  ngOnInit(): void {
    this.initializeCharts();
    this.loadPaymentMethods();
    this.loadActivePaymentMethod();
  }

  loadPaymentMethods(): void {
    this.paymentService.getAll().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        console.log('Métodos de pagamento carregados com sucesso');
      },
      error: (error) => {
        console.error('Erro ao carregar métodos de pagamento:', error);
      }
    });
  }

  loadActivePaymentMethod(): void {
    this.paymentService.getActive().subscribe({
      next: (method) => {
        this.activePaymentMethod = method;
        this.selectedPaymentMethod = method?.name?.toLowerCase() || '';
        this.selectedPaymentMethodId = method.id;
        console.log('Método de pagamento ativo carregado com sucesso');
      },
      error: (error) => {
        console.error('Erro ao carregar método de pagamento ativo:', error);
      }
    });
  }

  onPaymentMethodChange(): void {
    this.paymentService.setActive(this.selectedPaymentMethod).subscribe({
      next: () => {
        console.log('Método de pagamento atualizado com sucesso');
        this.loadActivePaymentMethod();
      },
      error: (error) => {
        console.error('Erro ao atualizar método de pagamento:', error);
      }
    });
  }

  exportToExcel(): void {
    console.log('Exportando dados para Excel...');
  }

  processPayment(amount: number): void {
    if (this.activePaymentMethod) {
      this.processPaymentMethod(amount);
    }
  }

  private processPaymentMethod(amount: number): void {
    console.log(`Processando pagamento de R$ ${amount} via ${this.activePaymentMethod?.name}`);
  }

  applyDateFilter(): void {
    console.log(`Aplicando filtro de data: ${this.startDate} até ${this.endDate}`);
    this.updateDateRangeChart();
  }

  private initializeCharts(): void {    
    setTimeout(() => {
      this.initPurchaseChart();
      this.initInvestmentChart();
      this.initDateRangeChart();
    }, 0);
  }

  private initPurchaseChart(): void {
    console.log('Initializing purchase chart');
  }

  private initInvestmentChart(): void {
    console.log('Initializing investment chart');
  }

  private initDateRangeChart(): void {
    console.log('Initializing date range chart');
  }

  private updateDateRangeChart(): void {
    console.log('Updating date range chart');
  }
}