import { Component, ElementRef, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface Pokemon {
  name: string;
  url: string;
}
  
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbModalConfig, NgbModal, DecimalPipe]
})
export class HomeComponent implements OnInit {

  public dataPokemon;
  public pokemonDetails;
  public typePokemon;
  filter = new FormControl('');
  dataPokemon$: Observable<Pokemon[]>;

  POKEMONS: Pokemon[] = []

  SearchPokemon = new FormGroup({
    type: new FormControl('',[Validators.required])
  });

  @ViewChild('detailModal', {static: true}) detailModal: ElementRef;

  constructor(
    private _homeService: HomeService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    pipe: DecimalPipe,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    
    this.dataPokemon$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, pipe))
    );
    this.dataHome();
  }


  ngOnInit(): void {

    
    
  }
  
  ngDoCheck() {
    
  }

  search(text: string, pipe: PipeTransform): Pokemon[] {
    return this.POKEMONS.filter(pokemon => {
      const term = text.toLowerCase();
      return pokemon.name.toLowerCase().includes(term)
    });
  }

  dataHome() {
    this._homeService.home().subscribe(
      response =>{
        console.log(response.results);
        for(let i=0; i<response.results.length; i++) {
          this.POKEMONS.push(response.results[i]);
        }
      },
      error =>{
        console.log(error)
      }
    );
  }

  dataType() {
    
    this._homeService.searchType().subscribe(
      response =>{
        this.typePokemon = response.results;
        console.log(this.typePokemon)
      },
      error =>{
        console.log(error)
      }
    );
  }

  details(url) {
    console.log(url)
    this._homeService.details(url).subscribe(
      response =>{
        this.pokemonDetails = response;
        this.modalService.dismissAll();
        console.log(this.pokemonDetails);
        this.open(this.detailModal);
      },
      error =>{
        console.log(error)
      }
    );
  }

  open(content) {
    this.modalService.open(content);
  }

  onSubmitFilter() {

    let name = this.SearchPokemon.value.type;
    this._homeService.filterByType(name).subscribe(
      response =>{
        let data = response.pokemon;
        this.formatingData(data);
      }, error =>{
        console.log(error)
      }
    );
  }

  formatingData(data) {

    for(let i=0; i<data.length; i++) {
      this.POKEMONS.push(data[i]);
    }

  }

}
