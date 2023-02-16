import React, {useEffect, useState} from 'react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import {useCMA, useSDK} from '@contentful/react-apps-toolkit';
import { Select } from '@contentful/f36-components';

const Field = () => {
  const [entries, setEntries] = useState([])
  const [selectValue, setSelectValue] = useState('')
  const [defaultLocale, setDefaultLocale] = useState('')
  const [displayField, setDisplayField] = useState('')
  const sdk = useSDK<FieldExtensionSDK>();
  const cma = useCMA();

  useEffect( () => {
    sdk.window.startAutoResizer();
    setDefaultLocale(sdk.locales.default)

    const linkContentTypes = sdk.field.validations[0].linkContentType
    const entityType = (linkContentTypes) ? linkContentTypes[0] : ''

    const init : any = async () => {
      //Retrieve the ContentType defintion to get displayField
      const df = await cma.contentType.get({
        contentTypeId: entityType
      })
      setDisplayField(df.displayField)

      const fv:any = await cma.entry.get({
        entryId: sdk.field.getValue().sys.id
      })
      setSelectValue(fv.sys.id)

      const entries: any = await cma.entry.getPublished({
        query: {
          content_type: entityType,
          order: `fields.${df.displayField}`
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

  const optionLabel = (entry:any) => {
    if(entry.fields.label) {
      if(entry.fields.label[sdk.field.locale] ) return entry.fields.label[sdk.field.locale]
      else return entry.fields.label[defaultLocale]
    }
    if(entry.fields.title) {
      if(entry.fields.title[sdk.field.locale] ) return entry.fields.title[sdk.field.locale]
      else return entry.fields.title[defaultLocale]
    }

    if(entry.fields[displayField][sdk.field.locale] ) return entry.fields[displayField][sdk.field.locale]
    else return entry.fields[displayField][defaultLocale]
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
