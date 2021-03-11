import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  public url: string;

  constructor(	public _http: HttpClient ) {
    this.url = "https://pokeapi.co/api/v2/";
  }

  home(): Observable<any> {
    console.log("hola")
    return this._http.get(this.url + 'pokemon');
  }

  details(url): Observable<any> {
    return this._http.get(url);
  }

  searchType(): Observable<any> {
    return this._http.get(this.url + 'type');
  }

  filterByType(data): Observable<any> {
    return this._http.get(this.url + 'type/'+ data);
  }

}
