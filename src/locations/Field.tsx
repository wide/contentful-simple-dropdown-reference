import React, {useEffect, useState} from 'react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import {useCMA, useSDK} from '@contentful/react-apps-toolkit';
import { Select } from '@contentful/f36-components';

const Field = () => {
  const [entries, setEntries] = useState([])
  const [selectValue, setSelectValue] = useState('')
  const [defaultLocale, setDefaultLocale] = useState('')
  const [displayFields, setDisplayFields] = useState([])
  const sdk = useSDK<FieldExtensionSDK>();
  const cma = useCMA();

  useEffect( () => {
    sdk.window.startAutoResizer();
    setDefaultLocale(sdk.locales.default)

    const linkContentTypes: string[] = sdk.field.validations[0].linkContentType || []

    const init : any = async () => {
      let dfs: any = []
      // retrieve displayField for each content type and store it into displayFields
      for (const contentType of linkContentTypes) {
        const df = await cma.contentType.get({
          contentTypeId: contentType
        })
        dfs[contentType] = df.displayField
      }
      setDisplayFields(dfs)

      const fv:any = await cma.entry.get({
        entryId: sdk.field.getValue().sys.id
      })
      setSelectValue(fv.sys.id)

      const entries: any = await cma.entry.getPublished({
        query: {
          'sys.contentType.sys.id[in]': linkContentTypes.join(',')
        }
      })
      setEntries(entries.items)
    }

    if(sdk.field.getValue()) init()

    return () => {
      sdk.window.stopAutoResizer();
    };
  }, [cma.entry, sdk.editor, sdk.field, sdk.field.validations, sdk.locales.default, sdk.window])


  const handleOnChange = (event:any) => {
    setSelectValue(event.target.value)
    sdk.field.setValue({
      sys: {
        id: event.target.value,
        linkType: "Entry",
        type: "Link"
      }
    }).then(() => {
        console.log('selected')
    })
  }

  const optionLabel =  (entry: any) => {
    let df = displayFields[entry.sys.contentType.sys.id]
    if (entry.fields[df][sdk.field.locale]) return entry.fields[df][sdk.field.locale]
    else return entry.fields[df][defaultLocale]
  }

  return (
      <div>
        <Select id={sdk.field.id} name={sdk.field.id} value={selectValue} onChange={handleOnChange}>
          {entries.map((entry:any) => (
              <Select.Option key={entry.sys.id} value={entry.sys.id}>{optionLabel(entry)}</Select.Option>
          ))}
        </Select>
      </div>
  )
};

export default Field;
