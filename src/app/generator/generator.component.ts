import { Component, Input, Output, OnInit } from '@angular/core';
import { WikidataService } from '../services/wikidata.service';
import { QuizRTTemplate, Questions, Options, General } from './generator.model';
import { fakeAsync } from '@angular/core/testing';
import { strictEqual } from 'assert';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {
  APIEndPoint = environment.APIEndPoint;

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

  searchObject() {console.log("-----"+this.APIEndPoint);
    this.quesTemp = false // To Hide Template Form from UI
    this.searchPropertyCheck = false
    this.generateQuesCheck = false

    this.wikidata.getSearchObject(this.subject).subscribe(
      data => {
        this.searchObject$ = data
        this.searchEntityCheck = true
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
    // let CategTopic = {
    //   categ : this.currentCateg,
    //   topic : this.currentTopic,
    //   categName : this.currentCategName,
    //   topicName : this.currentTopicName
    // };
    var templateObject = new QuizRTTemplate();
    templateObject.CategoryId = this.currentCateg;
    templateObject.TopicId = this.currentTopic;
    templateObject.CategoryName = this.currentCategName;
    templateObject.TopicName = this.currentTopicName;
    this.wikidata.postEntityObject(templateObject).subscribe(
      data => {
        // console.log(data)
      }
    )
  }

  // -----------------------------------------

  quesTemp : boolean = false
  searchEntityCheck : boolean = false  
  searchPropertyCheck : boolean = false
  generateQuesCheck : boolean = false

  arrOfGeneral = []
  instanceOfValue : string = ""
  
  template : string = ""
  getSampleQuestion$: any={}
  questionObject = []
  optionObject = []
  topic : string = ""
  category : string = ""
  categoryId : string = ""
  categoryId_Qproperty : string = ""
  getOptionId$: any={}
  getOptionsList$: any={}

  searchEntityNew(entityId : string) {
    this.generateQuesCheck = false
    this.quesTemp = false
    
    this.arrOfGeneral = []

    this.wikidata.getSearchEntityNew(entityId).subscribe(
      data => {
        this.searchEntity$ = data
        for( let i = 0; i < this.searchEntity$.results.bindings.length; i++){
          var genObject = new General();
          var idVariable = this.searchEntity$.results.bindings[i].propUrl.value
          genObject.SubjectId = idVariable.split('/')[5];
          genObject.Subject = this.searchEntity$.results.bindings[i].propLabel.value
          if(genObject.Subject == "instance of") {
            var instanceOfVariable = this.searchEntity$.results.bindings[i].valUrl.value
            this.instanceOfValue = instanceOfVariable.split('/')[4]
            this.topic = this.searchEntity$.results.bindings[i].valLabel.value
          }
          genObject.Value = this.searchEntity$.results.bindings[i].valLabel.value
          this.arrOfGeneral.push(genObject)
        }
        this.searchPropertyCheck = true
      }
    );
    // subscribe ends here
  }
  // search entity new ends here

  // for generating Sample Questions for user review
  generateQuesReviewNew(currentSubjectId : string, currentSubject : string) {
    console.log("Inside - generateQuesReviewNew: "+" currentSubjectId-"+currentSubjectId+" currentSubject-"+currentSubject)
    
    this.quesTemp = false
    this.generateQuesCheck = false
    
    this.category = currentSubject
    this.categoryId = currentSubjectId
    // console.log(this.categoryId)
    this.queryQues = [] // for storing set of Questions along with Options
    console.log("instanceOfValue-"+this.instanceOfValue)
    this.sparQL = "SELECT ?cidLabel ?authortitleLabel WHERE {?cid wdt:P31 wd:"+this.instanceOfValue+".?cid wdt:"+currentSubjectId+" ?authortitle .SERVICE wikibase:label { bd:serviceParam wikibase:language 'en' . }}Limit 10";
    // Subscribing to get Questions based on clicked Topic
    this.wikidata.generateEntityQuesOption(this.sparQL).subscribe(
      data => {
        this.getSampleQuestion$ = data
        // this.quesTemp = true
        // console.log("getSampleQuestion-"+data)
        this.generateOptionId(currentSubject)
      }
    )

  }

  generateOptionId(currentSubject : string){
    // Subscribing to get Option Id based on clicked Topic
    this.wikidata.getSearchObject(currentSubject).subscribe(
      data => {
        this.getOptionId$ = data;
        console.log("getOptionId - "+this.getOptionId$.search.length)
        for(let i=0; i < this.getOptionId$.search.length; i++){
          if( this.getOptionId$.search[i].id.indexOf('Q') > -1) {
            this.categoryId_Qproperty=this.getOptionId$.search[i].id
            this.sparQL = "SELECT ?cidLabel WHERE {?cid wdt:P31 wd:"+this.getOptionId$.search[i].id+" .SERVICE wikibase:label { bd:serviceParam wikibase:language 'en' . }}Limit 10";
            // console.log("currentSubject ID - "+this.getOptionId$.search[i].id)
            // Subscribing to get related Options based on clicked Topic for each generated sample Question
            this.wikidata.generateEntityQuesOption(this.sparQL).subscribe(
              data => {
                this.getOptionsList$ = data
                for(let i = 0; i < this.getOptionsList$.results.bindings.length; i++){
                  var eachOption = new String(this.getOptionsList$.results.bindings[i].cidLabel.value)
                  if(this.getOptionsList$.results.bindings.length > 0 && eachOption != "" && !(eachOption[0] == 'Q' && /^\d+$/.test(eachOption.substring(1)))) {
                    // console.log("------"+eachOption)
                    this.optionObject.push(this.getOptionsList$.results.bindings[i].cidLabel.value)
                  }
                }
                this.quesTemp = true
              }
            )

          }
        }
      } 
    )
  }

  searchTemplate(){
    this.questionObject = []
    var subjectPart = this.template.substring(
      this.template.lastIndexOf("["),
      this.template.lastIndexOf("]") + 1
    )
    var optionPart = this.template.substring(
      this.template.lastIndexOf("("),
      this.template.lastIndexOf(")") + 1
    )
    var optionReplacement = this.template.substring(
      this.template.lastIndexOf("(") + 1,
      this.template.lastIndexOf(")")
    )
    for(let i=0; i < this.getSampleQuestion$.results.bindings.length; i++) {
      if(!(this.getSampleQuestion$.results.bindings[i].cidLabel.value[0] == 'Q' && 
              /^\d+$/.test(this.getSampleQuestion$.results.bindings[i].cidLabel.value.substring(1)) )) {
        var ques = new Questions()
        ques.QuestionGiven = this.template
                              .replace(subjectPart,this.getSampleQuestion$.results.bindings[i].cidLabel.value)
                              .replace(optionPart,optionReplacement)
        ques.Topic = this.topic
        ques.Categ = this.category
        // console.log(this.getSampleQuestion$.results.bindings[i].authortitleLabel.value)
        ques.Options = this.randomizeOptionsNew(this.optionObject,this.getSampleQuestion$.results.bindings[i].authortitleLabel.value)
        this.questionObject.push(ques)
        // console.log(ques)
      }
    }
    this.generateQuesCheck = true
  }

  randomizeOptionsNew(getQuestionOptions$ : any[], entityValue : string) {
    // generating n distinct random numbers
    let randomNummber: number[] = this.getRandonNumberNew(getQuestionOptions$.length)
    this.optionArr = []
    // for(let i=0; i < randomNummber.length; i++) console.log(randomNummber[i])
    for(let i=0; i < randomNummber.length; i++) {
      // making check to not get options that is equal to Correct Option
      if(getQuestionOptions$[randomNummber[i]] != entityValue) {
        var ops = new Options();
        ops.OptionGiven = getQuestionOptions$[randomNummber[i]]
        this.optionArr.push(ops)
      }
      else
        this.randomizeOptionsNew(getQuestionOptions$,entityValue)
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

  getRandonNumberNew(num: number) {
    var arr = []
    while(arr.length < this.optionNumber){
        var randomnumber = Math.floor(Math.random()*(num)) + 1;
        if(arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
    }
    return arr;
  }

  generateQuesPostNew() {
    var templateObject = new QuizRTTemplate()
    var subjectPart = this.template.substring(
      this.template.lastIndexOf("[") + 1,
      this.template.lastIndexOf("]")
    )
    var optionPart = this.template.substring(
      this.template.lastIndexOf("(") + 1,
      this.template.lastIndexOf(")")
    )
    this.template = this.template
                        .replace(subjectPart,"P31:"+this.instanceOfValue).replace(optionPart,this.categoryId)

    templateObject.Text = this.template
    templateObject.CategoryId = this.categoryId
    templateObject.TopicId = this.instanceOfValue
    templateObject.CategoryName = this.category
    templateObject.TopicName = this.topic

    console.log(templateObject)
    this.wikidata.postEntityObject(templateObject).subscribe(
      data => {
        console.log("data-post-successful")
      }
    )
  }

}
