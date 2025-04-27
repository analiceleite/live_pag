import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { PaymentApi, PaymentMethod, MonthlyData } from '../../../../@services/api/shared/payment.api';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

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
  isLoading: boolean = true;

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
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.isLoading = true;
    
    const paymentMethods$ = this.paymentService.getAll();
    const activePaymentMethod$ = this.paymentService.getActive();
    
    forkJoin({
      paymentMethods: paymentMethods$,
      activeMethod: activePaymentMethod$
    }).subscribe({
      next: ({ paymentMethods, activeMethod }) => {
        this.paymentMethods = paymentMethods;
        this.activePaymentMethod = activeMethod;
        this.selectedPaymentMethod = activeMethod?.name?.toLowerCase() || '';
        this.selectedPaymentMethodId = activeMethod?.id;
        this.loadMonthlyData();
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
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

  // Modificar o loadMonthlyData para manter o loading
  loadMonthlyData(): void {
    this.isLoading = true;
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
      },
      complete: () => {
        this.isLoading = false;
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
}