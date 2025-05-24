import { Component, OnInit, Version } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VersionComponent } from '../../../../@common/components/version/version.component';

// Interface para Chave Pix
interface PixKey {
  id: number;
  type: 'CPF' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA';
  value: string;
  isDefault: boolean;
}

// Interface para Link de Pagamento
interface PaymentLink {
  id: number;
  name: string;
  url: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-pix-keys',
  standalone: true,
  imports: [CommonModule, FormsModule, VersionComponent, RouterLink],
  templateUrl: './pix-keys.component.html'
})
export class PixKeysComponent implements OnInit {
  // Estado da tela
  activeTab: 'nubank' | 'picpay' = 'nubank';

  // Modal states
  showAddPixKeyModal = false;
  showAddPaymentLinkModal = false;

  // Toast notification
  showToast = false;
  toastMessage = '';

  // Dados
  pixKeys: PixKey[] = [];
  paymentLinks: PaymentLink[] = [];

  // Formulários
  pixKeyForm: Partial<PixKey> = {
    type: 'CPF',
    value: '',
    isDefault: false
  };

  paymentLinkForm: Partial<PaymentLink> = {
    name: '',
    url: '',
    isDefault: false
  };

  // Estado de edição
  editingPixKey: PixKey | null = null;
  editingPaymentLink: PaymentLink | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Carregar dados do localStorage ou API
    this.loadData();
  }

  // Métodos para carregar e salvar dados
  private loadData(): void {
    try {
      const pixKeysData = localStorage.getItem('pixKeys');
      if (pixKeysData) {
        this.pixKeys = JSON.parse(pixKeysData);
      } else {
        // Dados de exemplo se não houver nada salvo
        this.pixKeys = [
          { id: 1, type: 'CPF', value: '123.456.789-00', isDefault: true },
          { id: 2, type: 'EMAIL', value: 'exemplo@email.com', isDefault: false },
          { id: 3, type: 'TELEFONE', value: '(11) 98765-4321', isDefault: false }
        ];
      }

      const paymentLinksData = localStorage.getItem('paymentLinks');
      if (paymentLinksData) {
        this.paymentLinks = JSON.parse(paymentLinksData);
      } else {
        // Dados de exemplo se não houver nada salvo
        this.paymentLinks = [
          { id: 1, name: 'PicPay Principal', url: 'https://picpay.me/usuario/200', isDefault: true },
          { id: 2, name: 'Link Produtos', url: 'https://picpay.me/usuario/produtos', isDefault: false }
        ];
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.showToastMessage('Erro ao carregar dados');
    }
  }

  private savePixKeysToStorage(): void {
    localStorage.setItem('pixKeys', JSON.stringify(this.pixKeys));
  }

  private savePaymentLinksToStorage(): void {
    localStorage.setItem('paymentLinks', JSON.stringify(this.paymentLinks));
  }

  // Métodos para gerenciar chaves Pix
  setDefaultPixKey(id: number): void {
    this.pixKeys = this.pixKeys.map(key => ({
      ...key,
      isDefault: key.id === id
    }));
    this.savePixKeysToStorage();
    this.showToastMessage('Chave principal atualizada');
  }

  editPixKey(key: PixKey): void {
    this.editingPixKey = key;
    this.pixKeyForm = { ...key };
    this.showAddPixKeyModal = true;
  }

  deletePixKey(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta chave?')) {
      const wasDefault = this.pixKeys.find(key => key.id === id)?.isDefault;
      this.pixKeys = this.pixKeys.filter(key => key.id !== id);

      // Se a chave excluída era a padrão, define a primeira como padrão (se houver)
      if (wasDefault && this.pixKeys.length > 0) {
        this.pixKeys[0].isDefault = true;
      }

      this.savePixKeysToStorage();
      this.showToastMessage('Chave Pix excluída');
    }
  }

  savePixKey(): void {
    if (!this.pixKeyForm.value || this.pixKeyForm.value.trim() === '') {
      this.showToastMessage('Preencha o valor da chave');
      return;
    }

    if (this.editingPixKey) {
      // Atualização de chave existente
      this.pixKeys = this.pixKeys.map(key => {
        if (key.id === this.editingPixKey!.id) {
          return {
            ...key,
            type: this.pixKeyForm.type as 'CPF' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA',
            value: this.pixKeyForm.value!,
            isDefault: this.pixKeyForm.isDefault!
          };
        }
        // Se a chave atual estiver sendo definida como padrão, as outras não serão padrão
        if (this.pixKeyForm.isDefault) {
          return {
            ...key,
            isDefault: false
          };
        }
        return key;
      });
      this.showToastMessage('Chave Pix atualizada');
    } else {
      // Nova chave
      const newId = this.pixKeys.length > 0 ? Math.max(...this.pixKeys.map(key => key.id)) + 1 : 1;

      // Se está definindo a nova chave como padrão, remova o padrão das outras
      if (this.pixKeyForm.isDefault) {
        this.pixKeys = this.pixKeys.map(key => ({
          ...key,
          isDefault: false
        }));
      }

      // Adicionar nova chave
      this.pixKeys.push({
        id: newId,
        type: this.pixKeyForm.type as 'CPF' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA',
        value: this.pixKeyForm.value!,
        isDefault: this.pixKeyForm.isDefault!
      });

      this.showToastMessage('Chave Pix adicionada');
    }

    this.savePixKeysToStorage();
    this.cancelPixKeyModal();
  }

  cancelPixKeyModal(): void {
    this.showAddPixKeyModal = false;
    this.editingPixKey = null;
    this.pixKeyForm = {
      type: 'CPF',
      value: '',
      isDefault: false
    };
  }

  // Métodos para gerenciar links de pagamento
  setDefaultPaymentLink(id: number): void {
    this.paymentLinks = this.paymentLinks.map(link => ({
      ...link,
      isDefault: link.id === id
    }));
    this.savePaymentLinksToStorage();
    this.showToastMessage('Link principal atualizado');
  }

  editPaymentLink(link: PaymentLink): void {
    this.editingPaymentLink = link;
    this.paymentLinkForm = { ...link };
    this.showAddPaymentLinkModal = true;
  }

  deletePaymentLink(id: number): void {
    if (confirm('Tem certeza que deseja excluir este link?')) {
      const wasDefault = this.paymentLinks.find(link => link.id === id)?.isDefault;
      this.paymentLinks = this.paymentLinks.filter(link => link.id !== id);

      // Se o link excluído era o padrão, define o primeiro como padrão (se houver)
      if (wasDefault && this.paymentLinks.length > 0) {
        this.paymentLinks[0].isDefault = true;
      }

      this.savePaymentLinksToStorage();
      this.showToastMessage('Link de pagamento excluído');
    }
  }

  savePaymentLink(): void {
    if (!this.paymentLinkForm.name || this.paymentLinkForm.name.trim() === '') {
      this.showToastMessage('Preencha o nome do link');
      return;
    }

    if (!this.paymentLinkForm.url || this.paymentLinkForm.url.trim() === '') {
      this.showToastMessage('Preencha a URL do link');
      return;
    }

    if (this.editingPaymentLink) {
      // Atualização de link existente
      this.paymentLinks = this.paymentLinks.map(link => {
        if (link.id === this.editingPaymentLink!.id) {
          return {
            ...link,
            name: this.paymentLinkForm.name!,
            url: this.paymentLinkForm.url!,
            isDefault: this.paymentLinkForm.isDefault!
          };
        }
        // Se o link atual estiver sendo definido como padrão, os outros não serão padrão
        if (this.paymentLinkForm.isDefault) {
          return {
            ...link,
            isDefault: false
          };
        }
        return link;
      });
      this.showToastMessage('Link de pagamento atualizado');
    } else {
      // Novo link
      const newId = this.paymentLinks.length > 0 ? Math.max(...this.paymentLinks.map(link => link.id)) + 1 : 1;

      // Se está definindo o novo link como padrão, remova o padrão dos outros
      if (this.paymentLinkForm.isDefault) {
        this.paymentLinks = this.paymentLinks.map(link => ({
          ...link,
          isDefault: false
        }));
      }

      // Adicionar novo link
      this.paymentLinks.push({
        id: newId,
        name: this.paymentLinkForm.name!,
        url: this.paymentLinkForm.url!,
        isDefault: this.paymentLinkForm.isDefault!
      });

      this.showToastMessage('Link de pagamento adicionado');
    }

    this.savePaymentLinksToStorage();
    this.cancelPaymentLinkModal();
  }

  cancelPaymentLinkModal(): void {
    this.showAddPaymentLinkModal = false;
    this.editingPaymentLink = null;
    this.paymentLinkForm = {
      name: '',
      url: '',
      isDefault: false
    };
  }

  // Utilitários
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.showToastMessage('Link copiado para área de transferência');
    }).catch(err => {
      console.error('Erro ao copiar texto: ', err);
      this.showToastMessage('Erro ao copiar link');
    });
  }

  showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  // Navegação
  navigateBack(): void {
    this.router.navigate(['/admin']);
  }
}