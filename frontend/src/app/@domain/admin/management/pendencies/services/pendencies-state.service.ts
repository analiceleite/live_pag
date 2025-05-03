import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PurchaseTab } from '../../../../../@services/models/purchase.interface';

@Injectable({
  providedIn: 'root'
})
export class PendenciesStateService {
  // Loading state
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  // Tab state
  private selectedTabSubject = new BehaviorSubject<PurchaseTab>('open');
  public selectedTab$ = this.selectedTabSubject.asObservable();

  // Filter state
  private filterSubject = new BehaviorSubject<string>('');
  public filter$ = this.filterSubject.asObservable();

  // Selected client state
  private selectedClientCpfSubject = new BehaviorSubject<string | null>(null);
  public selectedClientCpf$ = this.selectedClientCpfSubject.asObservable();

  // Tracking dialog state
  private showTrackingDialogSubject = new BehaviorSubject<boolean>(false);
  public showTrackingDialog$ = this.showTrackingDialogSubject.asObservable();

  private trackingCodeSubject = new BehaviorSubject<string>('');
  public trackingCode$ = this.trackingCodeSubject.asObservable();

  private selectedGroupDateSubject = new BehaviorSubject<string>('');
  public selectedGroupDate$ = this.selectedGroupDateSubject.asObservable();

  private selectedClientForTrackingSubject = new BehaviorSubject<string>('');
  public selectedClientForTracking$ = this.selectedClientForTrackingSubject.asObservable();

  constructor() { }

  // Loading state methods
  setLoading(isLoading: boolean): void {
    this.isLoadingSubject.next(isLoading);
  }

  // Tab state methods
  setSelectedTab(tab: PurchaseTab): void {
    this.selectedTabSubject.next(tab);
  }

  getSelectedTab(): PurchaseTab {
    return this.selectedTabSubject.getValue();
  }

  // Filter state methods
  setFilter(filter: string): void {
    this.filterSubject.next(filter);
  }

  getFilter(): string {
    return this.filterSubject.getValue();
  }

  // Selected client state methods
  toggleSelectedClient(cpf: string): void {
    const currentCpf = this.selectedClientCpfSubject.getValue();
    this.selectedClientCpfSubject.next(currentCpf === cpf ? null : cpf);
  }

  getSelectedClientCpf(): string | null {
    return this.selectedClientCpfSubject.getValue();
  }

  // Tracking dialog state methods
  openTrackingDialog(date: string, cpf: string): void {
    this.selectedGroupDateSubject.next(date);
    this.selectedClientForTrackingSubject.next(cpf);
    this.trackingCodeSubject.next('');
    this.showTrackingDialogSubject.next(true);
  }

  cancelTracking(): void {
    this.showTrackingDialogSubject.next(false);
    this.trackingCodeSubject.next('');
    this.selectedGroupDateSubject.next('');
    this.selectedClientForTrackingSubject.next('');
  }

  setTrackingCode(code: string): void {
    this.trackingCodeSubject.next(code);
  }

  getTrackingCode(): string {
    return this.trackingCodeSubject.getValue();
  }

  getSelectedGroupDate(): string {
    return this.selectedGroupDateSubject.getValue();
  }

  getSelectedClientForTracking(): string {
    return this.selectedClientForTrackingSubject.getValue();
  }
}