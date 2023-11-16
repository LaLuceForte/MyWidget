/* eslint-disable */
import TextareaTemplate from './TextareaTemplate'
import IfThenElseSubwidget from './IfThenElseSubwidget'
import React, { useState, useEffect } from 'react'
import { type ISetCursor, type IfThenElse, type TemplateObject, type IParamsToAddTextarea, type IVarParams } from './MessageTemplateEditor'
import { v4 as uuidv4 } from 'uuid'
import styles from './Styles.module.css'

interface TemplateListProps {
  arrVarNames: string[] | undefined
  initialList: TemplateObject[]
  handleBlured: (list: TemplateObject[], textareaId?: string, buttonName?: string, id?: string, position?: number, textareaId2?: string) => void
  handleSetTextareaId: (textareaId: string) => void
  globalList?: TemplateObject[]
  innerId?: string
  conditionClicked?: boolean
  varClicked?: IVarParams
  resetConditionClick: () => void
  resetVarClick: () => void
  handleSetParams: (params: IParamsToAddTextarea, textareaId?: string) => void
  params: IParamsToAddTextarea

}

let params: IParamsToAddTextarea = { bluredIndex: 0, position: 0, textareaId: '', id: '' }

function TemplateList (props: TemplateListProps): JSX.Element {
  // массив объектов, хранящий в себе информацию про textarea
  const [list, setList] = useState<TemplateObject[]>(props.initialList)

  const handleAddTextarea = (bluredIndex: number, buttonName: string, template: string, id: string | undefined, position: number | undefined, textareaId: string | undefined): void => {
    console.log(props.innerId);
    props.handleBlured(list, undefined, undefined, id)
    if (id === undefined) {
      if (props.innerId !== '') {
        params = { bluredIndex, position: position!, textareaId: props.innerId!, id }
        props.handleSetParams({ bluredIndex, position: position!, textareaId: props.innerId!, id })
      }
      if (buttonName.slice(0, 8) === 'textarea') {
        props.handleSetTextareaId(buttonName)
      }
      if (buttonName === 'conditionButton') {
        if (bluredIndex > 0) {
          props.handleBlured(Object.assign(
            [...list.slice(0, bluredIndex),
              {
                ...list[bluredIndex],
                template: list[bluredIndex].textareaRef.current?.value.substring(0, position),
                ifThenElse: {
                  if: [{ textareaRef: React.createRef(), template: '' }],
                  then: [{ textareaRef: React.createRef(), template: '' }],
                  else: [{ textareaRef: React.createRef(), template: '' }]
                }
              },
              {
                ...list[bluredIndex],
                template: list[bluredIndex].textareaRef?.current?.value.substring(position!),
                textareaRef: React.createRef(),
                ifThenElse: list[bluredIndex].ifThenElse
              }, ...list.slice(bluredIndex + 1)]),
          textareaId, buttonName)
          setList(Object.assign([...list.slice(0, bluredIndex), { ...list[bluredIndex], template: list[bluredIndex].textareaRef.current?.value.substring(0, position), ifThenElse: { if: [{ textareaRef: React.createRef(), template: '' }], then: [{ textareaRef: React.createRef(), template: '' }], else: [{ textareaRef: React.createRef(), template: '' }] } }, { ...list[bluredIndex], template: list[bluredIndex].textareaRef?.current?.value.substring(position!), textareaRef: React.createRef(), ifThenElse: list[bluredIndex].ifThenElse }, ...list.slice(bluredIndex + 1)]))
        } else {
          props.handleBlured(Object.assign(
            [{
              ...list[0],
              template: list[0].textareaRef?.current?.value.substring(0, position),
              ifThenElse: {
                if: [{ textareaRef: React.createRef(), template: '' }],
                then: [{ textareaRef: React.createRef(), template: '' }],
                else: [{ textareaRef: React.createRef(), template: '' }]
              }
            },
            ...list.slice(1, bluredIndex + 1),
            {
              ...list[0],
              template: list[0].textareaRef?.current?.value.substring(position!),
              textareaRef: React.createRef(),
              ifThenElse: list[0].ifThenElse
            }, ...list.slice(bluredIndex + 1)]), textareaId, buttonName)
          setList(Object.assign([{ ...list[0], template: list[0].textareaRef?.current?.value.substring(0, position), ifThenElse: { if: [{ textareaRef: React.createRef(), template: '' }], then: [{ textareaRef: React.createRef(), template: '' }], else: [{ textareaRef: React.createRef(), template: '' }] } }, ...list.slice(1, bluredIndex + 1), { ...list[0], template: list[0].textareaRef?.current?.value.substring(position!), textareaRef: React.createRef(), ifThenElse: list[0].ifThenElse }, ...list.slice(bluredIndex + 1)]))
        }
      } else if (buttonName === `delete${bluredIndex + 1}`) {
        props.handleBlured(Object.assign([...([...list.slice(0, bluredIndex)]).map(
          (x: TemplateObject) => ({ ...x, template: x.textareaRef?.current?.value, ifThenElse: x.ifThenElse })),
        {
          ...list[bluredIndex],
          template: list[bluredIndex].textareaRef?.current?.value! + list[bluredIndex + 1].textareaRef?.current?.value,
          ifThenElse: list[bluredIndex + 1].ifThenElse
        },
        ...([...list.slice(bluredIndex + 2)]).map(
          (x: TemplateObject) => ({ ...x, template: x.textareaRef?.current?.value, ifThenElse: x.ifThenElse }))
        ]))
        setList(Object.assign([...([...list.slice(0, bluredIndex)]).map(
          (x: TemplateObject) => ({ ...x, template: x.textareaRef?.current?.value, ifThenElse: x.ifThenElse })),
        {
          ...list[bluredIndex],
          template: list[bluredIndex].textareaRef?.current?.value + list[bluredIndex + 1].textareaRef?.current?.value!,
          ifThenElse: list[bluredIndex + 1].ifThenElse
        },
        ...([...list.slice(bluredIndex + 2)]).map(
          (x: TemplateObject) => ({ ...x, template: x.textareaRef?.current?.value, ifThenElse: x.ifThenElse }))
        ]))
      } else {
        props.handleBlured(Object.assign([...list.slice(0, bluredIndex), { ...list[bluredIndex], template, textareaRef: list[bluredIndex].textareaRef }, ...list.slice(bluredIndex + 1)]))
        setList(Object.assign([...list.slice(0, bluredIndex), { ...list[bluredIndex], template, textareaRef: list[bluredIndex].textareaRef }, ...list.slice(bluredIndex + 1)]))
      }
    } else {
      if (props.innerId !== '') {
        params = { bluredIndex, position: position!, textareaId: props.innerId!, id }
        props.handleSetParams({ bluredIndex, position: position!, textareaId: props.innerId!, id })
      }
      props.handleBlured(Object.assign(
        [...list.slice(0, bluredIndex), {
          ...list[bluredIndex],
          template: template.substring(0, position) + '{' + id + '}' + template.substring(position!, template.length),
          textareaRef: list[bluredIndex].textareaRef
        }, ...list.slice(bluredIndex + 1)]), undefined, buttonName, id, position, textareaId)
      setList(Object.assign([...list.slice(0, bluredIndex),
        { ...list[bluredIndex], template: template.substring(0, position) + '{' + id + '}' + template.substring(position!, template.length), textareaRef: list[bluredIndex].textareaRef },
        ...list.slice(bluredIndex + 1)]))
    }
  }

  const handleSetIfThenElse = (ifThenElse: IfThenElse, index: number, textareaId: string, buttonName?: string, id?: string, position?: number, textareaId2?: string) => {
    props.handleBlured(Object.assign([...([...list.slice(0, index - 1)]).map((x: TemplateObject) => ({ ...x, template: x.textareaRef?.current?.value })), { ...list[index - 1], template: list[index - 1].textareaRef.current?.value, ifThenElse }, ...([...list.slice(index)]).map((x: TemplateObject) => ({ ...x, template: x.textareaRef?.current?.value }))]), textareaId, buttonName, id, position, textareaId2)
    setList(Object.assign([...([...list.slice(0, index - 1)]).map((x: TemplateObject) => ({ ...x, template: x.textareaRef?.current?.value })), { ...list[index - 1], template: list[index - 1].textareaRef.current?.value, ifThenElse }, ...([...list.slice(index)]).map((x: TemplateObject) => ({ ...x, template: x.textareaRef?.current?.value }))]))
  }

  const handleDeleteCondition = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    setList(Object.assign([...([...list.slice(0, index - 1)]).map
    ((x: TemplateObject) => ({ ...x, template: x.textareaRef?.current?.value })),
    {
      ...list[index - 1],
      template: list[index - 1].textareaRef.current?.value + list[index].textareaRef?.current?.value!,
      ifThenElse: list[index].ifThenElse
    }, ...([...list.slice(index + 1)]).map((x: TemplateObject) => ({ ...x, template: x.textareaRef?.current?.value }))]))
    props.handleBlured(Object.assign([...([...list.slice(0, index - 1)]).map((x: TemplateObject) => ({ ...x, template: x.textareaRef?.current?.value })), { ...list[index - 1], template: list[index - 1].textareaRef.current?.value + list[index].textareaRef?.current?.value!, ifThenElse: list[index].ifThenElse }, ...([...list.slice(index + 1)]).map((x: TemplateObject) => ({ ...x, template: x.textareaRef?.current?.value }))]))
  }

  const [obj, setObj] = useState<TemplateObject>()
  const [obj2, setObj2] = useState<ISetCursor>()

  const setId = (obj: TemplateObject): void => {
    setObj(obj)
  }

  const setId2 = (obj2: ISetCursor): void => {
    setObj2(obj2)
  }

  // отслеживаем нажатие на добавление блока if-then-else
  const handleClicked = (): void => {
    setTimeout(() => {
      // добавляем в начало, если курсор еще не указывался
      if (params.textareaId === '') {
        props.handleBlured(Object.assign(
          [{
            ...list[0],
            template: '',
            ifThenElse: {
              if: [{ textareaRef: React.createRef(), template: '' }],
              then: [{ textareaRef: React.createRef(), template: '' }],
              else: [{ textareaRef: React.createRef(), template: '' }]
            }
          },
          ...list.slice(1, 1),
          {
            ...list[0],
            template: list[0].textareaRef?.current?.value,
            textareaRef: React.createRef(),
            ifThenElse: list[0].ifThenElse
          }, ...list.slice(1)]))

        setList(Object.assign([{
          ...list[0],
          template: '',
          ifThenElse: {
            if: [{ textareaRef: React.createRef(), template: '' }],
            then: [{ textareaRef: React.createRef(), template: '' }],
            else: [{ textareaRef: React.createRef(), template: '' }]
          }
        },
        ...list.slice(1, 1), {
          ...list[0],
          template: list[0].textareaRef?.current?.value,
          textareaRef: React.createRef(),
          ifThenElse: list[0].ifThenElse
        }, ...list.slice(1)]))
      }

      // добавляем блок if-then-esle в место, где указывался курсор в последний раз
      if (props.innerId === params.textareaId) {
        props.handleBlured(Object.assign([...list.slice(0, params.bluredIndex), { ...list[params.bluredIndex], template: list[params.bluredIndex].textareaRef.current?.value.substring(0, params.position), ifThenElse: { if: [{ textareaRef: React.createRef(), template: '' }], then: [{ textareaRef: React.createRef(), template: '' }], else: [{ textareaRef: React.createRef(), template: '' }] } }, { ...list[params.bluredIndex], template: list[params.bluredIndex].textareaRef?.current?.value.substring(params.position), textareaRef: React.createRef(), ifThenElse: list[params.bluredIndex].ifThenElse }, ...list.slice(params.bluredIndex + 1)]), params.textareaId)
        setList(Object.assign([...list.slice(0, params.bluredIndex), { ...list[params.bluredIndex], template: list[params.bluredIndex].textareaRef.current?.value.substring(0, params.position), ifThenElse: { if: [{ textareaRef: React.createRef(), template: '' }], then: [{ textareaRef: React.createRef(), template: '' }], else: [{ textareaRef: React.createRef(), template: '' }] } }, { ...list[params.bluredIndex], template: list[params.bluredIndex].textareaRef?.current?.value.substring(params.position), textareaRef: React.createRef(), ifThenElse: list[params.bluredIndex].ifThenElse }, ...list.slice(params.bluredIndex + 1)]))
      }
      props.resetConditionClick()
    }, 0)
  }

  // отслеживаем нажатие на переменные
  const handleVarClicked = () => {
    setTimeout(() => {
      // добавляем в начало, если курсор еще не указывался
      if (params.textareaId === '') {
        props.handleBlured(Object.assign(
          [...list.slice(0, params.bluredIndex), {
            ...list[params.bluredIndex],
            template: list[params.bluredIndex].textareaRef.current?.value.substring(0, params.position) + '{' + props.varClicked?.id + '}' + list[params.bluredIndex].textareaRef.current?.value.substring(params.position, list[params.bluredIndex].textareaRef.current?.value.length),
            textareaRef: list[params.bluredIndex].textareaRef
          }, ...list.slice(params.bluredIndex + 1)]))
        setList(Object.assign(
          [...list.slice(0, params.bluredIndex), {
            ...list[params.bluredIndex],
            template: list[params.bluredIndex].textareaRef.current?.value.substring(0, params.position) + '{' + props.varClicked?.id + '}' + list[params.bluredIndex].textareaRef.current?.value.substring(params.position, list[params.bluredIndex].textareaRef.current?.value.length),
            textareaRef: list[params.bluredIndex].textareaRef
          }, ...list.slice(params.bluredIndex + 1)]))
      }

      // добавляем переменную в место, где указывался курсор в последний раз
      if (props.innerId === params.textareaId) {
        props.handleBlured(Object.assign(
          [...list.slice(0, params.bluredIndex), {
            ...list[params.bluredIndex],
            template: list[params.bluredIndex].textareaRef.current?.value.substring(0, params.position) + '{' + props.varClicked?.id + '}' + list[params.bluredIndex].textareaRef.current?.value.substring(params.position, list[params.bluredIndex].textareaRef.current?.value.length),
            textareaRef: list[params.bluredIndex].textareaRef
          }, ...list.slice(params.bluredIndex + 1)]))
        setList(Object.assign(
          [...list.slice(0, params.bluredIndex), {
            ...list[params.bluredIndex],
            template: list[params.bluredIndex].textareaRef.current?.value.substring(0, params.position) + '{' + props.varClicked?.id + '}' + list[params.bluredIndex].textareaRef.current?.value.substring(params.position, list[params.bluredIndex].textareaRef.current?.value.length),
            textareaRef: list[params.bluredIndex].textareaRef
          }, ...list.slice(params.bluredIndex + 1)]))
      }
      props.resetVarClick()
    }, 0)
  }

  useEffect(() => {
    obj?.textareaRef.current?.focus()
  }, [obj])

  useEffect(() => {
    if (obj2 !== undefined) {
      obj2?.textareaId.textareaRef.current?.focus()
      obj2?.textareaId.textareaRef.current?.setSelectionRange(obj2.idLength, obj2.idLength)
    }
  }, [obj2])

  return (
        <>
            {list !== undefined && (
              list.map((i) => {
                return (
                        <div
                            key={uuidv4()}
                        >
                            {list.indexOf(i) === 0 && (
                                <>
                                    <TextareaTemplate handleVarClicked={handleVarClicked} handleClicked={handleClicked} varClicked={props.varClicked} clicked={props.conditionClicked} resetButtonClicked={props.resetConditionClick} textareaRef={i.textareaRef} template={list[list.indexOf(i)].template} bluredIndex={list.indexOf(i)} handleAddTextarea={handleAddTextarea} arrVarNames={props.arrVarNames}></TextareaTemplate>
                                </>

                            )}
                            {list.indexOf(i) !== 0 && (
                                <>
                                    <button id={'delete' + list.indexOf(i)} className={styles.deleteButton} onMouseDown={(e) => { handleDeleteCondition(e, list.indexOf(i)) }}>Delete</button>
                                    <IfThenElseSubwidget clicked={props.conditionClicked} varClicked={props.varClicked} setId2={setId2} setId={setId} globalList={props.globalList} ifThenElseInitialTemplates={list[list.indexOf(i) - 1].ifThenElse!} index={list.indexOf(i)} handleSetIfThenElse={handleSetIfThenElse} arrVarNames={props.arrVarNames} list={list}></IfThenElseSubwidget>
                                    <TextareaTemplate handleVarClicked={handleVarClicked} handleClicked={handleClicked} varClicked={props.varClicked} clicked={props.conditionClicked} resetButtonClicked={props.resetConditionClick} textareaRef={i.textareaRef} template={list[list.indexOf(i)].template} bluredIndex={list.indexOf(i)} arrVarNames={props.arrVarNames} handleAddTextarea={handleAddTextarea}></TextareaTemplate>
                                </>

                            )}
                        </div>
                )
              })
            )

            }
        </>
  )
}

export default TemplateList
