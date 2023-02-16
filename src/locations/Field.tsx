import React, {useEffect, useState} from 'react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import {useCMA, useSDK} from '@contentful/react-apps-toolkit';
import { Select } from '@contentful/f36-components';

const Field = () => {
  const [entries, setEntries] = useState([])
  const [selectValue, setSelectValue] = useState('')
  const [defaultLocale, setDefaultLocale] = useState('')
  const sdk = useSDK<FieldExtensionSDK>();
  const cma = useCMA();

  useEffect( () => {
    sdk.window.startAutoResizer();
    setDefaultLocale(sdk.locales.default)

    const linkContentTypes = sdk.field.validations[0].linkContentType
    const entityType = (linkContentTypes) ? linkContentTypes[0] : ''

    // get current field value if exists
    if(sdk.field.getValue()) {
      Promise.resolve(cma.entry.get({
        entryId: sdk.field.getValue().sys.id
      })).then(data => {
        setSelectValue(data.sys.id)
      })
    }

    Promise.resolve(cma.entry.getPublished({
      query: {
        content_type: entityType,
        order: 'fields.label'
      }
    }))
        .then((data:any) => {
          setEntries(data.items)
        })
    return () => {
      sdk.window.stopAutoResizer();
    };

  }, [cma.entry, sdk.editor, sdk.field, sdk.field.validations, sdk.locales.default, sdk.window])


  const handleOnChange = (event:any) => {
    setSelectValue(event.target.value)
    const selectedEntry: any = entries.find((entry:any) => entry.sys.id === event.target.value)
    const reference = {
      sys: {
        id: selectedEntry.sys.id,
        linkType: "Entry",
        type: "Link"
      }
    }
    sdk.field.setValue(reference).then(data => {
      console.log('selected')
    })
  }

  return (
      <div>
        <Select id={sdk.field.id} name={sdk.field.id} value={selectValue} onChange={handleOnChange}>
          {entries.map((entry:any) => (
              <Select.Option key={entry.sys.id} value={entry.sys.id}>{entry.fields.label[sdk.field.locale] ? entry.fields.label[sdk.field.locale] : entry.fields.label[defaultLocale]}</Select.Option>
          ))}
        </Select>
      </div>
  )
};

export default Field;
