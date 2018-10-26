export class QuizRTTemplate {
    Text: string;
    SparQL: string;
    Categ: string;
    CategName: string;
    Topic: string;
    TopicName: string;
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