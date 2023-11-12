// функция для генерации сообщения
const MessageGenerator = (templateF: any, values: any): string => {
    let generatedMessage: string = ''
    console.log(templateF);
    const recurse = (template: any, insideCondition?: boolean) => {

        let message: string = ""
        for (let i = 0; i < template.length; i++) {
            if (insideCondition === false) {
                if (i === 0) {
                    message = message + template[i].template
                } else {
                    message = message + template[i].template
                }

            } else {
                message = message + template[i].template
            }
            if (template[i].ifThenElse !== undefined) {
                if (template[i].ifThenElse!.if !== null) {
                    let ifValue = recurse(template[i].ifThenElse?.if!, true)
                    let inputIfValue = ifValue
                    Object.keys(values).map(x => '{' + x + '}').forEach((el, index) => inputIfValue = inputIfValue.replace(el, values[el.slice(1, el.length - 1)] !== undefined ? values[el.slice(1, el.length - 1)] : ''))
                        if (inputIfValue!== '') {   // делаем ветку then, если в переменной непустая строка
                            if (template[i].ifThenElse!.then !== null) {
                                let thenValue = recurse(template[i].ifThenElse?.then!, true)
                                message += thenValue
                                Object.keys(values).map(x => '{' + x + '}').forEach((el, index) => message =
                                    message.replace(el, values[el.slice(1, el.length - 1)] !== undefined ? values[el.slice(1, el.length - 1)] : ''))
                            }
                        }
                        else {
                            if (template[i].ifThenElse!.else !== null) {
                                let elseValue = recurse(template[i].ifThenElse?.else!, true)
                                message += elseValue
                                Object.keys(values).map(x => '{' + x + '}').forEach((el, index) => message = message.replace(el, values[el.slice(1, el.length - 1)] !== undefined ? values[el.slice(1, el.length - 1)] : ''))

                            }
                        }
                }
            }

        }
        return message
    }


    generatedMessage = recurse(templateF, false)
    return generatedMessage
}

export default MessageGenerator
