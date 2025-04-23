import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { PaymentApi, PaymentMethod, MonthlyData } from '../../../../@services/api/shared/payment.api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-finances',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './finances.component.html'
})
export class FinancesComponent implements OnInit {
  // Controle de período
  selectedMonth: string = 'Abril';
  selectedYear: number = 2025;
  months: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  years: number[] = [2023, 2024, 2025];

  // Métodos de pagamento
  selectedPaymentMethod: string = 'nubank';
  selectedPaymentMethodId: number | null = null;
  paymentMethods: PaymentMethod[] = [];
  activePaymentMethod: PaymentMethod | null = null;

  // Valores financeiros
  picpayAmount: number = 0;
  nubankAmount: number = 0;
  investmentAmount: number = 0;
  monthlyTotal: number = 0;

  constructor(private paymentService: PaymentApi) {}

  ngOnInit(): void {
    this.loadPaymentMethods();
    this.loadMonthlyData();
  }

  loadPaymentMethods(): void {
    this.paymentService.getAll().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
      },
      error: (error) => console.error('Erro:', error)
    });
  }

  onPaymentMethodChange(): void {
    this.paymentService.setActive(this.selectedPaymentMethod).subscribe({
      next: () => this.loadMonthlyData(),
      error: (error) => console.error('Erro:', error)
    });
  }

  onPeriodChange(): void {
    this.loadMonthlyData();
  }

  loadMonthlyData(): void {
    const period = {
      month: this.selectedMonth,
      year: this.selectedYear
    };

    this.paymentService.getMonthlyData(period).subscribe({
      next: (data) => {
        this.picpayAmount = data.picpayAmount;
        this.nubankAmount = data.nubankAmount;
        this.investmentAmount = data.investmentAmount;
        this.monthlyTotal = data.totalAmount || (data.picpayAmount + data.nubankAmount);
      },
      error: (error) => {
        console.error('Erro ao carregar dados mensais:', error);
        // Zerar os valores em caso de erro
        this.picpayAmount = 0;
        this.nubankAmount = 0;
        this.investmentAmount = 0;
        this.monthlyTotal = 0;
      }
    });
  }

  exportToExcel(): void {
    const period = {
      month: this.selectedMonth,
      year: this.selectedYear
    };

    this.paymentService.exportMonthlyData(period).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `financeiro-${this.selectedMonth}-${this.selectedYear}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => console.error('Erro:', error)
    });
  }

  loadActivePaymentMethod(): void {
    this.paymentService.getActive().subscribe({
      next: (method) => {
        this.activePaymentMethod = method;
        this.selectedPaymentMethod = method?.name?.toLowerCase() || '';
        this.selectedPaymentMethodId = method.id;
        this.loadMonthlyData();
      },
      error: (error) => console.error('Erro:', error)
    });
  }
}