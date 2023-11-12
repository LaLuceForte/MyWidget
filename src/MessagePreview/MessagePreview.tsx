import React, { useEffect, useState } from 'react'
import styles from './MessagePreview.module.css'
import appStyles from '../Styles.module.css'
import { v4 as uuidv4 } from 'uuid'
import { type TemplateObject } from '../MessageTemplateEditor'
import MessageGenerator from '../MessageGenerator'

// пропсы для виджета предпросмотра сообщений
interface MessagePreviewProps {
  displayModal: boolean
  closeModal: () => void
  arrVarNames: string[]
  template: TemplateObject[]
}

// тип для хранения массива объектов со значениями из инпутов+их рефы для удобства
interface IInputValue {
  ref: React.RefObject<HTMLInputElement>
  value: string
  key: string
}

function MessagePreview (props: MessagePreviewProps): JSX.Element {
  // state для хранения значений из инпутов
  const [inputValues, setInputValues] = useState<IInputValue[]>(props.arrVarNames.map(x => Object.assign({ ref: React.createRef(), value: '', key: x })))

  // state для установки фокуса в нужном инпуте после рендеринга
  const [inputValueTofocus, setInputValueTofocus] = useState<IInputValue>()

  // для отображения или скрытия модульного окна с виджетом предпросмотра сообщений
  const divStyle = {
    display: props.displayModal ? 'block' : 'none'
  }

  function closeModal (e: React.MouseEvent<HTMLButtonElement>): void {
    e.stopPropagation()
    props.closeModal()
  }

  // изменяем содержимое массива с переменными-объектами при взаимодействии пользователя с ними
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    setInputValues(Object.assign([...inputValues.slice(0, index), { ...inputValues[index], value: e.target.value }, ...inputValues.slice(index + 1)]))
    setInputValueTofocus(inputValues[index])
  }

  // устанавливаем фокус при изменении значений в инпутах
  useEffect(() => {
    inputValueTofocus?.ref.current?.focus()
  }, [inputValueTofocus])

  return (
    <div className={styles.modal}
      style={divStyle}
    >
      <div className={styles.modalContent}
        onClick={e => { e.stopPropagation() }}>
        <div className={`${appStyles.header} ${styles.header}`}>Message Preview</div>
        <div className={styles.message}>
          {MessageGenerator((props.template), inputValues.reduce((acc, el) => { return { ...acc, [el.key]: el.value } }, {}))}
        </div>
        <span className={`${appStyles.header} ${styles.header}`}>Variables:</span>
        {props.arrVarNames?.map((name) => {
          return (
            <span key={uuidv4()}>
              <input
                className={styles.inputs}
                type="text"
                placeholder={name}
                id={uuidv4()}
                ref={inputValues[props.arrVarNames.indexOf(name)].ref}
                value={inputValues[props.arrVarNames.indexOf(name)].value}
                onChange={(e) => { handleInputChange(e, props.arrVarNames.indexOf(name)) }}
              />
            </span>

          )
        })}

        <div className={styles.closeWrap}>
          <span className={appStyles.operationButton}
            onClick={closeModal}>Close</span>
        </div>

      </div>
    </div>
  )
}

export default MessagePreview
