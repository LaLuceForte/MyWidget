import React, { useState, useEffect, useCallback, RefObject } from 'react'
import styles from './Styles.module.css'
import ArrVarNamesWidget from './ArrVarNamesWidget'
import TemplateList from './TemplateList'
import MessagePreview from './MessagePreview/MessagePreview'
import { v4 as uuidv4 } from 'uuid'

// назначаем айди для определения уникальности templatelist
const id = uuidv4()

interface MessageTemplateEditorProps {
  handleShowMessageEditor: () => void
  arrVarNames: string[]
  template?: string | null
  callbackSave: (template: TemplateObject[]) => Promise<string>
}

export interface TextareaTemplateProps {
  arrVarNames?: string[] | undefined
  handleAddTextarea: (bluredIndex: number, buttonName: string, template: string, id: string | undefined, caretPosition?: number, textareaId?: string) => void
  bluredIndex: number
  template?: string
  buttonName?: string
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  clicked?: boolean,
  varClicked?: IVarParams,
  resetButtonClicked: () => void,
  handleClicked?: () => void,
  handleVarClicked: () => void
}

export interface TemplateObject {
  template?: string
  textareaRef: React.RefObject<HTMLTextAreaElement>
  id?: string | undefined
  ifThenElse?: IfThenElse | null
}

export interface IfThenElse {
  if: TemplateObject[] | null
  then: TemplateObject[] | null
  else: TemplateObject[] | null
}

export interface InputValues {
  id: number
  name: string
  value: string
  inputRef: React.RefObject<HTMLInputElement>
}

export interface IParamsToAddTextarea {
  bluredIndex: number,
  position: number,
  textareaId: string,
  id?:string
}

export interface ISetCursor{
  idLength: number,
  textareaId: TemplateObject
}

export interface IVarParams{
  touch: boolean,
  id: string
}

function MessageTemplateEditor(props: MessageTemplateEditorProps): JSX.Element {
  const [showPreview, setShowPreview] = useState(false)
  const initialList: TemplateObject[] = (props.template === undefined || props.template === null) ? [{ template: '', textareaRef: React.createRef() }] : JSON.parse(props.template)
  const [globalList, setGlobalList] = useState<TemplateObject[]>((props.template === undefined || props.template === null) ? [{ template: '', textareaRef: React.createRef() }] : JSON.parse(props.template))
  const [obj, setObj] = useState<TemplateObject>()
  const [obj2, setObj2] = useState<ISetCursor>()
  // state для textarea, из которой произошел blur
  const [textarea, setTextarea] = useState<TemplateObject>()
  //state для отслеживания нажатия на conditionButton
  const [touched, setTouched] = useState<boolean>(false)
  // state для отслеживания нажатия на одну из переменных
  const [varTouched, setVarTouched] = useState<IVarParams>({touch:false, id:''})
  const [blurOut, setBlurOut] = useState<boolean>(true)
  const [blurVarOut, setBlurVarOut] = useState<boolean>(true)
  const [paramsToAddTextarea, setParamsToAddTextarea] = useState<IParamsToAddTextarea>({ bluredIndex: 0, position: 0, textareaId: '' })

  const handleSaveTemplate = async (): Promise<any> => {
    await props.callbackSave(globalList)
  }

  const handleShowPreview = (): void => {
    setShowPreview(true)
  }
  const hidePreview = (): void => {
    setShowPreview(false)
  }

  const blured = (globalList: TemplateObject[], textareaId?: string, buttonName?: string, id?:string, position?:number, textareaId2?:string): void => {
      setBlurOut(true)
      setBlurVarOut(true)
      setGlobalList(globalList)
      if (textareaId !== undefined) {
        const recurse = (list: TemplateObject[], callback?: () => void): void => {
          for (let i = 0; i < list.length; i++) {
            if (list[i].textareaRef.current?.id === textareaId) {
              setTextarea(list[i])
            }
            if (list[i].ifThenElse !== undefined) {
              if (list[i].ifThenElse?.if !== null) {
                recurse(list[i].ifThenElse!.if!)
              }
              if (list[i].ifThenElse?.then !== null) {
                recurse(list[i].ifThenElse!.then!)
              }
              if (list[i].ifThenElse?.else !== null) {
                recurse(list[i].ifThenElse!.else!)
              }
            }
          }
        }
        recurse(globalList)
      }
  
      if (textareaId !== undefined) {
        setBlurOut(false)
      }
      if (id !== undefined){
        setBlurVarOut(false)
        const recurse = (list: TemplateObject[]): void => {
          for (let i = 0; i < list.length; i++) {
            if (list[i].textareaRef.current?.id === textareaId2) {
              setObj2({idLength:position!, textareaId: list[i]})
            }
            if (list[i].ifThenElse !== undefined) {
              if (list[i].ifThenElse?.if !== null) {
                recurse(list[i].ifThenElse!.if!)
              }
              if (list[i].ifThenElse?.then !== null) {
                recurse(list[i].ifThenElse!.then!)
              }
              if (list[i].ifThenElse?.else !== null) {
                recurse(list[i].ifThenElse!.else!)
              }
            }
          }
        }
        recurse(globalList)
      }
    
   
 
  }

  const handleSetTextareaId = (buttonName: string): void => {
    const recurse = (list: TemplateObject[]): void => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].textareaRef.current?.id === buttonName) {
          setObj(list[i])
        }
        if (list[i].ifThenElse !== undefined) {
          if (list[i].ifThenElse?.if !== null) {
            recurse(list[i].ifThenElse!.if!)
          }
          if (list[i].ifThenElse?.then !== null) {
            recurse(list[i].ifThenElse!.then!)
          }
          if (list[i].ifThenElse?.else !== null) {
            recurse(list[i].ifThenElse!.else!)
          }
        }
      }
    }
    recurse(globalList)
  }

  // определяем, что нажали на кнопку условия
  const handleConditionClick = () => {
    if (blurOut === true) {
      setTouched(true)
    }
  }

  
  // определяем, что нажали на одну из переменных для добавления ее в textarea
  const handleVarClick = (id: string) => {
    if (blurVarOut===true){
     setVarTouched({touch:true, id:id})
    }
   }

  // восстанавливаем кнопку на ненажатое состояние
  const resetConditionClick = () => {
    setTouched(false)
    setBlurOut(true)
  }

  const resetVarClick = () => {
    setVarTouched({...varTouched, touch:false})
    setBlurVarOut(true)
  }

  const handleSetParams = (params: IParamsToAddTextarea) => {
    setParamsToAddTextarea(params)
  }


  useEffect(() => {
    obj?.textareaRef.current?.focus();
  }, [obj])


  useEffect(()=>{
    obj2?.textareaId.textareaRef.current?.focus()
    obj2?.textareaId.textareaRef.current?.setSelectionRange(obj2.idLength,obj2.idLength)
  },[obj2])

  useEffect(() => {
    textarea?.textareaRef.current?.focus()
  }, [textarea])

  return (
    <>
      <div className={styles.header}> Message Template Editor</div>
      <ArrVarNamesWidget handleVarClick={handleVarClick} arrVarNames={props.arrVarNames}></ArrVarNamesWidget>
      <AddCondition handleConditionClick={handleConditionClick}></AddCondition>

      <div className={styles.textareaWrap}>
        <TemplateList params={paramsToAddTextarea} handleSetParams={handleSetParams} resetVarClick={resetVarClick} resetConditionClick={resetConditionClick} conditionClicked={touched} varClicked={varTouched} innerId={id} globalList={globalList} handleSetTextareaId={handleSetTextareaId} handleBlured={blured} arrVarNames={props.arrVarNames} initialList={initialList} />
      </div>
      <div className={styles.operationButtonsWrapper}>
        <button onClick={handleShowPreview} className={styles.operationButton}>Preview</button>
        <button
          className={styles.operationButton}
          onClick={handleSaveTemplate}
        >Save</button>
        <button
          className={styles.operationButton}
          onClick={props.handleShowMessageEditor}
        >Close</button>
      </div>
      <MessagePreview template={globalList} arrVarNames={props.arrVarNames} closeModal={hidePreview} displayModal={showPreview}></MessagePreview>
    </>
  )
}

function AddCondition(props: { handleConditionClick: () => void }): JSX.Element {
  return (
    <button
      id="conditionButton"
      className={styles.conditionButton}
      onClick={props.handleConditionClick}
    >
      Click to add: <span className={styles.condition}>IF</span>
      {' [{some_variable} or expression] '}
      <span className={styles.condition}>THEN</span>
      {' [then_value] '}
      <span className={styles.condition}>ELSE</span>
      {' [else_value]'}
    </button>
  )
}

export default MessageTemplateEditor
