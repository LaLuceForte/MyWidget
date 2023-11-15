/* eslint-disable */

// функция для генерации сообщения
const MessageGenerator = (templateF: any, values: any): string => {
  let generatedMessage: string = ''

  const recurse = (template: any, insideCondition?: boolean) => {
    let message: string = ''
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
          const ifValue = recurse(template[i].ifThenElse?.if!, true)
          let inputIfValue = ifValue
          Object.keys(values).map(x => '{' + x + '}').forEach((el, index) => inputIfValue = inputIfValue.replace(el, values[el.slice(1, el.length - 1)] !== undefined ? values[el.slice(1, el.length - 1)] : ''))
          if (inputIfValue !== '') { // делаем ветку then, если в переменной непустая строка
            if (template[i].ifThenElse!.then !== null) {
              const thenValue = recurse(template[i].ifThenElse?.then!, true)
              let result = ''
              let str = ''
              let arr = Object.keys(values).map(x => '{' + x + '}')
              for (let i = 0; i < thenValue.length; i++) {
                str += thenValue[i]
                for (let k = 0; k < arr.length; k++) {
                  if (str.includes(arr[k])) {
                    str = str.replace(arr[k], values[arr[k].slice(1, arr[k].length - 1)])
                    result += str
                    str = ''
                  }
                }

              }
             message = message + result+str
            }
          } else {
            if (template[i].ifThenElse!.else !== null) {
              const elseValue = recurse(template[i].ifThenElse?.else!, true)
              let result = ''
              let str = ''
              let arr = Object.keys(values).map(x => '{' + x + '}')
              for (let i = 0; i < elseValue.length; i++) {
                str += elseValue[i]
                for (let k = 0; k < arr.length; k++) {
                  if (str.includes(arr[k])) {
                    str = str.replace(arr[k], values[arr[k].slice(1, arr[k].length - 1)])
                    result += str
                    str = ''
                  }
                }

              }
             message = message + result+str
            }
          }
        }
      }
    }
    return message
  }

  generatedMessage = recurse(templateF, false)

    let result = ''
  let str = ''
  let arr = Object.keys(values).map(x => '{' + x + '}')
  for (let i = 0; i< generatedMessage.length;i++){
    str+=generatedMessage[i]
    for (let k =0; k< arr.length; k++){
      if (str.includes(arr[k])){
        str = str.replace(arr[k], values[arr[k].slice(1, arr[k].length - 1)])
        result+=str
        str = ''
      }
    }

  }
  result+=str


  return result
}

export default MessageGenerator
