import { Component, OnInit } from '@angular/core';
import { WikidataService } from '../services/wikidata.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  total_count :number =0;
  all_questions_object :any=[];

  constructor( private wikidata: WikidataService ) { }

  ngOnInit() {
    this.wikidata.generate_Number_of_questions().subscribe(data =>{
      this.all_questions_object=data;
      console.log(data);
      this.total_count=0;
     // this.total_count += this.all_questions_object(x => {return x.questionlist.length})
      for(var i=0;i< this.all_questions_object.length;i++)
      {
        if(this.all_questions_object[i].questionsList!=null)
        {
        console.log(this.all_questions_object[i].questionsList.length);
        this.total_count = this.total_count+this.all_questions_object[i].questionsList.length;
        console.log(this.total_count+"   \t Count-Updating");
        }
      }
      console.log("Total_count  :"+this.total_count);
    });
  }

}
