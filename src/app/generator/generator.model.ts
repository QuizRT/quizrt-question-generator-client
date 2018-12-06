export class QuizRTTemplate {
    Text: string;
    CategoryId: string;
    CategoryName: string;
    TopicId: string;
    TopicName: string;
    QuestionList:string;
}

export class Questions {
    Categ: string;
    Topic: string;
    QuestionGiven: string;
    Options: any[];
}

export class Options {
    OptionGiven: string;
    IsCorrect: boolean;
}

export class General {
    Subject: string;
    Value: string;
    SubjectId: string;
}
