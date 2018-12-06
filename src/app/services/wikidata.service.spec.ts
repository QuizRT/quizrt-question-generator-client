import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule,HttpTestingController} from '@angular/common/http/testing';
import { WikidataService } from './wikidata.service';
import { AppComponent } from '../app.component';
import { QuizRTTemplate, Questions, Options } from '../generator/generator.model';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; //added for wikidata service
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { GeneratorComponent } from '../generator/generator.component';
import { HomeComponent } from '../home/home.component';
import { CheckerComponent } from '../checker/checker.component';
import {} from 'jasmine';
//import { GeneratorComponent } from '../generator/generator.component';
import { createStylingContextTemplate } from '@angular/core/src/render3/styling';

describe('WikidataService', () => {
  let service:WikidataService;
  let httpMock:HttpTestingController;
  let Sparql:string="";
  let Sparql_Object:QuizRTTemplate={Text: "Who is the (P84) of [P31:Q162875]?", CategoryId: "P84", TopicId: "Q162875", CategoryName: "architect", TopicName: "mausoleum",QuestionList:""};
  let Sparql_Object_mock:any={name:"harsha"};
 // let Testarray=["Rahul Dravid","Rahul Dravid:Timeless Steel","List of awarda and acheivements"];
  beforeEach(() => {TestBed.configureTestingModule({
    providers: [WikidataService,{provide: APP_BASE_HREF, useValue: '/'}],
    declarations: [AppComponent,
      GeneratorComponent,
      HomeComponent,
      CheckerComponent],
    imports:[HttpClientTestingModule,
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule]
  }); 
  service=TestBed.get(WikidataService);
  httpMock=TestBed.get(HttpTestingController);
});

  afterEach(()=>{
    httpMock.verify();
  })

  it('should retrive the data from the API via getTemplate', () => {

    service.getAllTempalte().subscribe(input=>{
      //console.log('input.name.length', input.name.length);
      expect(input).toBeDefined;
      Sparql_Object_mock=input;
      console.log(Sparql_Object_mock.name.count+"----------------")
      expect(Sparql_Object_mock.name.length).toBe(1)
    })
    const request = httpMock.expectOne(`${service.APIEndPoint}/templates`,'call to api')
    expect(request.request.method).toBe("GET");
    request.flush({name:["Who is the (P276) of [P31:Q162875] ?"]});
  });

  // it('should throw an error if trying to search for not supported `what`', () => {
  //   service.generateEntityQuesOptionss("unknown")
  //     .subscribe(() => {}, err => {
  //       expect(err).toBe(`1`);
  //     });

  //   httpMock.expectNone(`https://query.wikidata.org/sparql?query=unknown&format=json`);
  // });


  it('should retrive the data from the API via PostTemplate', () => {

    service.postEntityObject(Sparql_Object).subscribe(input=>{
      expect(input).toBeDefined;
    })
    const request = httpMock.expectOne(`${service.APIEndPoint}`,'post to api');
    expect(request.request.method).toBe("POST");
    request.flush(Sparql_Object_mock);
  });

  it('should retrive the data from the API for search Objects', () => {

    service.getSearchObject("Rahul Dravid").subscribe(input=>{
      expect(input).toBeDefined;
      //Testarray=input;
      // console.log(input.name.length+"-------++++++")
      Sparql_Object_mock=input;
      expect(Sparql_Object_mock.name.length).toBe(3);
    })
    const request = httpMock.expectOne(`https://www.wikidata.org/w/api.php?origin=*&action=wbsearchentities&search=Rahul Dravid&language=en&format=json`,'call to api');
    expect(request.request.method).toBe("GET");
    request.flush({name:["Rahul Dravid","Rahul Dravid:Timeless Stell","Rahul Dravid:List of Awards"]});
  });

  it('should retrive the instance value data from the API for search Entities', () => {

    service.getSearchEntity("Q5").subscribe(input=>{
      expect(input).toBeDefined;
      //Testarray=input;
      // console.log(input.name.length+"-------++++++")
      Sparql_Object_mock=input;
      expect(Sparql_Object_mock.name).toBe("human");
    })
    const request = httpMock.expectOne(`https://www.wikidata.org/w/api.php?origin=*&action=wbgetentities&ids=Q5&languages=en&format=json`,'call to api');
    expect(request.request.method).toBe("GET");
    request.flush({name:"human"});
  });

  it('should retrive the Complete data from the API for search Entities', () => {

    service.getSearchEntityNew("Q12345").subscribe(input=>{
      expect(input).toBeDefined;
      //Testarray=input;
      // console.log(input.value+"-------++++++")
      Sparql_Object_mock=input;
      expect(Sparql_Object_mock.value.length).toBe(4);
    })
    const request = httpMock.expectOne(`https://query.wikidata.org/sparql?query=PREFIX entity: <http://www.wikidata.org/entity/> SELECT ?propUrl ?propLabel ?valUrl ?valLabel ?picture WHERE { hint:Query hint:optimizer 'None' . {    BIND(entity:Q12345 AS ?valUrl) . BIND('N/A' AS ?propUrl ) . BIND('identity'@en AS ?propLabel ) . } UNION {    entity:Q12345 ?propUrl ?valUrl . ?property ?ref ?propUrl . ?property rdf:type wikibase:Property . ?property rdfs:label ?propLabel } ?valUrl rdfs:label ?valLabel FILTER (LANG(?valLabel) = 'en') . OPTIONAL{ ?valUrl wdt:P18 ?picture .} FILTER (lang(?propLabel) = 'en' ) } ORDER BY ?propUrl ?valUrl LIMIT 200&format=json`,'call to api');
    expect(request.request.method).toBe("GET");
    request.flush({value: [ {instance_of : "Human"} , {sex_or_gender : "male"} ,{ country : "United Kingdom"} ,{ family_name : "adams"} ]});
  });

  it('should retrive the data from the API for get options', () => {

    service.generateEntityQuesOption("restaurant").subscribe(input=>{
      expect(input).toBeDefined;
      //Testarray=input;
      // console.log(input.value+"-------++++++")
      Sparql_Object_mock=input;
      expect(Sparql_Object_mock.value.length).toBe(4);
    })
    const request = httpMock.expectOne(`https://query.wikidata.org/sparql?query=restaurant&format=json`,'call to api');
    expect(request.request.method).toBe("GET");
    request.flush({value: [ "GrandBay","Taj","Novotel","Dolphin"]});
  });
});
