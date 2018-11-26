import { Component, OnInit } from '@angular/core';
import { WikidataService } from '../services/wikidata.service';

@Component({
  selector: 'app-checker',
  templateUrl: './checker.component.html',
  styleUrls: ['./checker.component.scss']
})
export class CheckerComponent implements OnInit {

  constructor( private wikidata : WikidataService ) { }

  ngOnInit() {
    this.getAllTemplate();
  }

  listTemplate : any={}

  getAllTemplate(){
    this.wikidata.getAllTempalte().subscribe(
      data => {
        console.log(data)
        this.listTemplate = data
      }
    )
  }

}
