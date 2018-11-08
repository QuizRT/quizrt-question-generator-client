import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WikidataService {    

  constructor( private httpcaller : HttpClient ) {
  }

  getSearchObject(subject : string) {
    return this.httpcaller.get('https://www.wikidata.org/w/api.php?origin=*&action=wbsearchentities&search='+subject+'&language=en&format=json')
  }

  getSearchEntity(entityId : string) {
    return this.httpcaller.get('https://www.wikidata.org/w/api.php?origin=*&action=wbgetentities&ids='+entityId+'&languages=en&format=json')
  }

  postEntityObject(entityObject : {}) {
    // return this.httpcaller.post('http://localhost:5000/api/quizrt',entityObject)
    return this.httpcaller.post('http://172.23.238.164:8080/api/quizrt',entityObject)
  }

  generateEntityQuesOption(sparQL : string) {
    return this.httpcaller.get('https://query.wikidata.org/sparql?query='+sparQL+'&format=json')
  }

}
