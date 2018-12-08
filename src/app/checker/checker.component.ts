import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WikidataService } from '../services/wikidata.service';
import { QuizRTTemplate, Questions, Options } from '../generator/generator.model';

@Component({
  selector: 'app-checker',
  templateUrl: './checker.component.html',
  styleUrls: ['./checker.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CheckerComponent implements OnInit {
  sample:boolean = false;
  constructor( private wikidata : WikidataService) { }
sample_questions =[];
  ngOnInit() {
    this.getAllTemplate();
  }

  listTemplate :any={}
  get_first_ten :any=[];
  checkLoader : number = 0;
  unlock_sample()
  {
    this.sample=!this.sample;
  }


  get_10(result:any=[]){
    this.checkLoader = 1;
    this.get_first_ten = result;
    console.log(this.get_first_ten[0].question+"---------------");
  }
  getAllTemplate(){
    this.wikidata.getAllTempalte().subscribe(
      data => { 
        this.listTemplate = data;
        console.log(this.listTemplate[0].coressponding_questions);
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
