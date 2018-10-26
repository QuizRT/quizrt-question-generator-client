import { Component, Input, Output, OnInit } from '@angular/core';
import { WikidataService } from '../services/wikidata.service';
import { QuizRTTemplate, Questions, Options } from './generator.model';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {

  searchObject$: any={}
  searchEntity$: any={}
  getQuestion$: any={}
  getOptions$: any={}
  searchOccupation$: any={}
  subject:string = ""
  propertyId: string = ""
  selector: string = ""
  occupation = []
  occupationName = []

  currentTopic:string = ""
  currentTopicName:string = ""
  currentCateg:string = ""
  currentCategName:string = ""

  sparQL: string = ""
  queryQues = []
  NumberOfQuestions: number = 10

  optionNumber: number = 3
  optionArr = []

  constructor( private wikidata : WikidataService ) { }

  ngOnInit() {
  }

  searchObject() {
    this.wikidata.getSearchObject(this.subject).subscribe(
      data => {
        this.searchObject$ = data
      }
    );
  }

  searchEntity(entityId : string) {

    this.occupation = []
    this.occupationName = []

    this.wikidata.getSearchEntity(entityId).subscribe(
      data => {
        this.searchEntity$ = data
        this.propertyId = this.searchEntity$.entities[entityId].claims.P31[0].mainsnak.datavalue.value.id

        if(this.propertyId == "Q5") { //for human

          this.selector = "human"

          this.currentTopic = "P106"
          this.currentTopicName = "Occupation"

          for(let i = 0; i < this.searchEntity$.entities[entityId].claims.P106.length; i++) {
            this.occupation.push(this.searchEntity$.entities[entityId].claims.P106[i])
          }
          
          for(let i in this.occupation) {
            this.wikidata.getSearchEntity(this.occupation[i].mainsnak.datavalue.value.id).subscribe(
              data => {
                // console.log(data)
                this.searchOccupation$ = data

                for(var x in this.searchOccupation$.entities){
                  this.occupationName.push({
                    key: x,
                    value: this.searchOccupation$.entities[x].labels.en.value
                  })
                  break
                }
                  
              }
            );
          }

        }
      // human property ends here

      }
    );
    // first subscribe ends here

  }
  // search entity ends here

  // for generating Sample Questions and Options for user review
  generateQuesReview(entityKey : string, entityValue : string) {
    this.currentCateg = entityKey
    this.currentCategName = entityValue

    this.queryQues = [] // for storing set of Questions along with Options
    this.sparQL = "SELECT ?personLabel WHERE { ?person wdt:"+this.currentTopic+" wd:"+entityKey+" . SERVICE wikibase:label { bd:serviceParam wikibase:language 'en' . } }LIMIT "+this.NumberOfQuestions+"";
    // Subscribing to get Questions based on clicked Topic
    this.wikidata.generateEntityQuesOption(this.sparQL).subscribe(
      data => {
        this.getQuestion$ = data;
        for(let i=0; i < this.getQuestion$.results.bindings.length; i++){          

          this.sparQL = "SELECT ?cid ?options WHERE {?cid wdt:P31 wd:Q28640. OPTIONAL {?cid rdfs:label ?options filter (lang(?options) = 'en') . }}Limit "+this.NumberOfQuestions*20+"";
          // Subscribing to get related Options based on clicked Topic for each generated sample Question
          this.wikidata.generateEntityQuesOption(this.sparQL).subscribe(
            data => {
              this.getOptions$ = data
              // console.log(this.getOptions$)
              var ques = new Questions()
              ques.QuestionGiven = "What is "+this.getQuestion$.results.bindings[i].personLabel.value+" "+this.currentTopicName+"?";
              ques.Topic = this.currentTopicName
              ques.Categ = entityValue
              ques.Options = this.randomizeOptions(this.getOptions$.results.bindings,entityValue)
              // console.log(ques.Options)
              this.queryQues.push(ques)
            } 
          )
          
        }
        // console.log(this.queryQues)
      } 
    )

  }

  randomizeOptions(getQuestionOptions$ : any[], entityValue : string) {
    // generating n distinct random numbers
    let randomNummber: number[] = this.getRandonNumber(getQuestionOptions$.length)
    this.optionArr = []
    for(let i=0; i < randomNummber.length; i++) {
      // making check to not get options that is equal to Correct Option
      if(getQuestionOptions$[randomNummber[i]]["options"]["value"] != entityValue){
        var ops = new Options();
        ops.OptionGiven = getQuestionOptions$[randomNummber[i]]["options"]["value"]
        this.optionArr.push(ops)
      }
      else
        this.randomizeOptions(getQuestionOptions$,entityValue)
    }
    // Inserting correct option
    var opsCorrect = new Options()
    opsCorrect.OptionGiven = entityValue
    this.optionArr.push(opsCorrect)
    // shuffling the option to create randomness
    this.optionArr = this.shuffle(this.optionArr)
    // console.log(this.optionArr)
    return this.optionArr
  }

  getRandonNumber(num: number) {
    var arr = []
    while(arr.length < this.optionNumber){
        var randomnumber = Math.floor(Math.random()*(num)) + 1;
        if(arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
    }
    return arr;
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex
    // While there remain elements to shuffle
    while (0 !== currentIndex) {
      // Pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      // And swap it with the current element
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  }

  generateQuesPost() {
    let CategTopic = {
      categ : this.currentCateg,
      topic : this.currentTopic,
      categName : this.currentCategName,
      topicName : this.currentTopicName
    }
    this.wikidata.postEntityObject(CategTopic).subscribe(
      data => {
        console.log(data)
      }
    )
  }
}
