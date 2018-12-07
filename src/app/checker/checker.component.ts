import { Component, OnInit } from '@angular/core';
import { WikidataService } from '../services/wikidata.service';
import { QuizRTTemplate, Questions, Options } from '../generator/generator.model';
@Component({
  selector: 'app-checker',
  templateUrl: './checker.component.html',
  styleUrls: ['./checker.component.scss']
})
export class CheckerComponent implements OnInit {

  constructor( private wikidata : WikidataService) { }

  ngOnInit() {
    this.getAllTemplate();
  }

  listTemplate :any={}

  getAllTemplate(){
    this.wikidata.getAllTempalte().subscribe(
      data => {
        console.log(data)
        this.listTemplate = data
      }
    )
  }
  
  refresh_template(result:string){
    var quizrt_renewal_object = new QuizRTTemplate();
    console.log("-RESULT-: "+result)
    quizrt_renewal_object.CategoryName="";
    quizrt_renewal_object.TopicName="";
    quizrt_renewal_object.Text=result;
    
    this.wikidata.postEntityObject(quizrt_renewal_object).subscribe(
      data => {
        console.log("data-renewed-successful")
      }
    )
  }

}
