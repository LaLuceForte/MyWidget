import MessageGenerator from "./MessageGenerator";


const objectForTest1 = [
    {
        ifThenElse: {
            if: [{ template: '', textareaRef: { current: null } }],
            then: [{ template: '', textareaRef: { current: null } }],
            else: [{ template: '', textareaRef: { current: null } }]
        },
        template: `Hello, {firstname}!`,
        textareaRef: { current: null }
    }
]

const objectForTest2 = [
    {
        ifThenElse: {
            if: [{ template: '{company}', textareaRef: { current: null } }],
            then: [{ template: 'I know that you work at {company}', textareaRef: { current: null } }],
            else: [{ template: `I don't know where do you work`, textareaRef: { current: null } }]
        },
        template: `Hello, {firstname}!`,
        textareaRef: { current: null }
    }
]

const objectForTest3 = [
    {
        ifThenElse: {
            if: [{ template: '{company}', textareaRef: { current: null } }],
            then: [{
                template: 'I know that you work at {company}',
                textareaRef: { current: null },
                ifThenElse: {
                    if: [{ template: '{position}', textareaRef: { current: null } }],
                    then: [
                        { template: ' as {position}', textareaRef: { current: null } }
                    ],
                    else: [{ template: `, but what is your role?`, textareaRef: { current: null } }]
                }

            },
            { template: ';)', textareaRef: { current: null } }
            ],
            else: [{ template: `I don't know where do you work`, textareaRef: { current: null } }]
        },
        template: `Hello, {firstname}!`,
        textareaRef: { current: null }
    }
]

const objectForTest4 = [
    {
        ifThenElse: {
            if: [{ template: '{firstname}', textareaRef: { current: null } }],
            then: [{ template: 'I know that you are {firstname}', textareaRef: { current: null } }],
            else: [{ template: `tell me your name`, textareaRef: { current: null } }]
        },
        template: `Good morning!`,
        textareaRef: { current: null }
    },
    {
        ifThenElse: {
            if: [{ template: '{company}', textareaRef: { current: null } }],
            then: [{ template: 'I know that you work at {company}', textareaRef: { current: null } }],
            else: [{ template: `where do you work`, textareaRef: { current: null } }]
        },
        template: ``,
        textareaRef: { current: null }
    },
    {
        ifThenElse: {
            if: [{ template: '', textareaRef: { current: null } }],
            then: [{ template: '', textareaRef: { current: null } }],
            else: [{ template: ``, textareaRef: { current: null } }]
        },
        template: `\n\nBye, bye!`,
        textareaRef: { current: null }
    }
]

describe('generatorMessage', () => {
    it('Default case', () => {
        const message = MessageGenerator(
            objectForTest1,
            { firstname: 'Svetlana', lastname: '', company: '', position: '' }
        );

        expect(message).toMatch(`Hello, Svetlana!`);
    });


    it('With one condition with 2 variables given', () => {
        const message = MessageGenerator(
            objectForTest2,
            { firstname: '{lastname}', lastname: 'Bob', company: 'Google', position: '' }
        );

        expect(message).toMatch(`Hello, {lastname}!I know that you work at Google`);
    });

    it('With one condition with 1 variable given', () => {
        const message = MessageGenerator(
            objectForTest2,
            { firstname: 'Bob', lastname: '', company: '', position: '' }
        );
        expect(message).toMatch(`Hello, Bob!I don't know where do you work`);
    });

    it('With nested condition with 1 variable given', () => {
        const message = MessageGenerator(
            objectForTest3,
            { firstname: 'Bob', lastname: '', company: '', position: '' }
        );
        expect(message).toMatch(`Hello, Bob!I don't know where do you work`);
    });

    it('With nested condition with 2 variable given', () => {
        const message = MessageGenerator(
            objectForTest3,
            { firstname: 'Bob', lastname: '', company: 'Yandex', position: '' }
        );
        expect(message).toMatch(`Hello, Bob!I know that you work at Yandex, but what is your role?;)`);
    });

    it('With nested condition with 3 variables given', () => {
        const message = MessageGenerator(
            objectForTest3,
            { firstname: 'Bob', lastname: '', company: 'Yandex', position: 'manager' }
        );
        expect(message).toMatch(`Hello, Bob!I know that you work at Yandex as manager;)`);
    });

    it('With nested conditions with 3 variables given + extra variable lalala', () => {
        const message = MessageGenerator(
            objectForTest3,
            { firstname: 'Bob', lastname: '', company: 'Yandex', position: 'manager', lalala:'' }
        );
        expect(message).toMatch(`Hello, Bob!I know that you work at Yandex as manager;)`);
    });

    it('With two conditions with 0 variables given', () => {
        const message = MessageGenerator(
            objectForTest4,
            { firstname: '', lastname: '', company: '', position: '' }
        );
        expect(message).toMatch(`Good morning!tell me your namewhere do you work\n\nBye, bye!`);
    });

    it('With two conditions with 2 variables given', () => {
        const message = MessageGenerator(
            objectForTest4,
            { firstname: 'Mary', lastname: '', company: 'Tesla', position: '' }
        );
        expect(message).toMatch(`Good morning!I know that you are MaryI know that you work at Tesla\n\nBye, bye!`);
    });


});
