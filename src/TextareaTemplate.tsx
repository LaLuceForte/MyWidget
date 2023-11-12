import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from './Styles.module.css'
import { type TextareaTemplateProps } from './MessageTemplateEditor'

function TextareaTemplate (props: TextareaTemplateProps): JSX.Element {
  // state для хранения значения из текущей textarea
  const [templateValue, setTemplateValue] = useState<string>(props.template ?? '')
  // state для обозначения того, что мы добавили переменную в textarea
  const [arrAdded, setArrAdded] = useState<boolean>(false)
  // позиция курсора в момент добавления переменной
  const [cursorPosition, setCursorPosition] = useState<number>(0)
  // state для хранения ref у текущей textarea (берем из родительского компонента)
  const textareaRef = props.textareaRef

  // функция, которая обрабатывает нажатия на добавление переменных или условия
  const handleBlur = (e: React.FocusEvent, handleValue: string): void => {
    setArrAdded(false)
    // переменная - название нажатой кнопки по айди
    let buttonName: string = ''
    e.relatedTarget !== null ? buttonName = e.relatedTarget.id : buttonName = ''
    let arrVarNames: string[] | undefined
    let id: string | undefined = ''
    props.arrVarNames !== null ? arrVarNames = props.arrVarNames : arrVarNames = []
    if (arrVarNames !== undefined) {
      id = arrVarNames.find(x => x === buttonName)
    }
    // при нажатии на условие - формируем новую textarea с новым айди
    props.handleAddTextarea(props.bluredIndex, buttonName, templateValue, id,getCaretPosition(), e.target.id)

    // если нажали кнопку с добавлением условия
    if (buttonName === 'conditionButton') {
      // переменная для позиции курсора - определяем, как разрезать строку в textarea
      let position: number | undefined = 0
      getCaretPosition() !== undefined ? position = getCaretPosition() : position = 0
      props.handleAddTextarea(props.bluredIndex, buttonName, templateValue, id, position, e.target.id)
    }

    // далее обрабатываем нажатие на переменные для того, чтобы добавить их в текущую textarea
     if (id !== undefined) {
    //   let position: number = 0
    //   getCaretPosition() !== undefined ? position = getCaretPosition() : position = 0
    //   setTemplateValue(templateValue?.substring(0, position) + '{' + buttonName + '}' + templateValue?.substring(position, templateValue.length))
    //   if (textareaRef?.current !== undefined) textareaRef?.current?.focus()
    //   setArrAdded(true) 
    //   setCursorPosition(position)
    console.log(getCaretPosition());
     }
  }

  // функция для определения положения каретки
  const getCaretPosition = (): number => {
    if (textareaRef?.current !== null) {
      const { selectionStart = 0 } = textareaRef?.current
      return selectionStart
    }
    return 0
  }

  // обновление значения в текущей textarea  при внесении изменений
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target?.value
    setTemplateValue(value)
  }

  const [height, setHeight] = useState<string>()

  useEffect(() => {
    if (textareaRef.current !== null) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textareaRef.current.style.height = '0px'
      const scrollHeight = textareaRef.current.scrollHeight

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textareaRef.current.style.height = scrollHeight - 30 + 'px'
      setHeight(scrollHeight - 30 + 'px')
    }
  }, [textareaRef.current, templateValue])

  if (arrAdded===true){
    textareaRef.current!.setSelectionRange(cursorPosition,cursorPosition)
  }
  
  if (props.clicked){
    props.handleClicked!()
  }

  if (props.varClicked?.touch){
    props.handleVarClicked!()
  }

  return (
    <>
      <textarea
        onBlur={(e) => { handleBlur(e, templateValue) }}
        id={'textarea' + uuidv4()}
        className={styles.textarea}
        ref={textareaRef}
        rows={1}
        onChange={(e) => { handleChange(e) }}
        value={templateValue}
        maxLength={10000}
        style={{ height }}
         onFocus={(e)=>e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
      ></textarea>
    </>
  )
}

export default TextareaTemplate
