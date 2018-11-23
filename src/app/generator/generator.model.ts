export class QuizRTTemplate {
    Text: string;
    SparQL: string;
    Categ: string;
    CategName: string;
    Topic: string;
    TopicName: string;
    // Categ_Q_property:string;
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
