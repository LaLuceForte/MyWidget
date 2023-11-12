import React, { useState } from 'react'
import styles from './Styles.module.css'
import MessageTemplateEditor, { type TemplateObject } from './MessageTemplateEditor'

function App (): JSX.Element {
  // булевая переменная для открытия шаблона редактирования сообщениц (изначально - он закрыт)
  const [showTemplateEditor, setShowTemplateEditor] = useState<boolean>(false)

  // берем из localStorage arrVarNames, если нет - запишем шаблонные переменные туда
  let arrVarNames: string[] = []

  const arrVarNamesFromStorage = localStorage.getItem('arrVarNames')
  if (arrVarNamesFromStorage !== null) {
    arrVarNames = JSON.parse(arrVarNamesFromStorage)
  } else {
    localStorage.setItem('arrVarNames', JSON.stringify(['firstname', 'lastname', 'company', 'position']))
    const arrVarNamesFromStorage = localStorage.getItem('arrVarNames')
    if (arrVarNamesFromStorage !== null) {
      arrVarNames = JSON.parse(arrVarNamesFromStorage)
    }
  }

  // строка шаблона сообщения
  const template: string | null = localStorage.getItem('template')

  // открываем или закрывает виджет шаблона сообщений
  const handleShowMessageEditor = (): void => {
    setShowTemplateEditor(!showTemplateEditor)
  }

  const callbackSave = async (template: TemplateObject[]): Promise<string> => {
    // функция для обработки кастомного json с циклической структурой (рекурсивно)
    function stringifyCircularJsonStructure (json: TemplateObject[]): string {
      let stringifiedJsonArray = ''
      stringifiedJsonArray += '['
      for (let i = 0; i < json.length; i++) {
        const ifThenElse = json[i].ifThenElse
        if (ifThenElse !== null) {
          let ifThenElseIf: TemplateObject[] = []
          if (ifThenElse?.if !== undefined && ifThenElse.if !== null) {
            ifThenElseIf = ifThenElse.if
          }
          let ifThenElseThen: TemplateObject[] = []
          if (ifThenElse?.then !== undefined && ifThenElse.then !== null) {
            ifThenElseThen = ifThenElse.then
          }
          let ifThenElseElse: TemplateObject[] = []
          if (ifThenElse?.else !== undefined && ifThenElse.else !== null) {
            ifThenElseElse = ifThenElse.else
          }

          stringifiedJsonArray += `{"template":${JSON.stringify(json[i].template)},"textareaRef":{"current":null}, "ifThenElse":{

              "if":${stringifyCircularJsonStructure(ifThenElseIf)}, 
                "then":${stringifyCircularJsonStructure(ifThenElseThen)}, 
              "else":${stringifyCircularJsonStructure(ifThenElseElse)}
            
            }}`
        } else {
          stringifiedJsonArray += `{"template":${JSON.stringify(json[i].template)},"textareaRef":{"current":null}}`
        }
        if (i !== json.length - 1) {
          stringifiedJsonArray += ','
        }
      }
      stringifiedJsonArray += ']'
      return stringifiedJsonArray
    }

    // записываем новый шаблон для редактора сообщений в localStorage
    return await new Promise(() => {
      localStorage.setItem('template', stringifyCircularJsonStructure(template))
    })
  }

  // показываем кнопку для открытия шаблона редактирования сообщений
  if (!showTemplateEditor) {
    return (
      <button
        className={styles.appButton}
        onClick={handleShowMessageEditor}
      >Message Editor</button>
    )
  }

  return (
    <>
      <MessageTemplateEditor handleShowMessageEditor={handleShowMessageEditor} arrVarNames={arrVarNames} template={template} callbackSave={callbackSave}></MessageTemplateEditor>
    </>

  )
}

export default App
