import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../api.config';

@Injectable({ providedIn: 'root' })
export class ClothingApi {
  constructor(private http: HttpClient) { }

  private headers() {
    const role = localStorage.getItem('role') || 'user';
    return new HttpHeaders({ 'x-role': role });
  }

  getAll() {
    return this.http.get(ApiConfig.CLOTHING.LIST, { headers: this.headers() });
  }

  add(data: {
    name: string;
    price: number;
    queue_name: string;
    purchase_channel: string;
    purchase_type: string;
    discount: number;
  }) {
    return this.http.post(ApiConfig.CLOTHING.CREATE, data, {
      headers: this.headers()
    });
  }

  update(piece: any) {
    return this.http.put(ApiConfig.CLOTHING.UPDATE(piece.id), piece, { headers: this.headers() });
  }
  
  delete(id: number) {
    return this.http.delete(ApiConfig.CLOTHING.DELETE(id), { headers: this.headers() });
  }
}
