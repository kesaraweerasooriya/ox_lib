import { Button, Group, Modal, Stack } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import { Box, createStyles, Flex, Text } from '@mantine/core';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';

import ReactMarkdown from 'react-markdown';

import dayjs from 'dayjs';

export type FormValues = {
  test: {
    value: any;
  }[];
};

const useStyles = createStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '15%',
    right: '25%',
    width: 320,
    height: 580,
   
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
    
  },
  titleContainer: {
   display: 'inline-block',
   marginTop: '-55px',
   marginRight:'150px',
   position: 'absolute',
    backgroundColor: 'rgba(39, 116, 245, 1)',
    width:'200px',
    height:'50px',
    clipPath: 'polygon(0 0, 100% 4%, 100% 96%, 0% 100%)',
    zIndex: 1,
  },
  titleText: {
    color: 'white',
   display:'block',
   marginTop: '2px',
   fontFamily: 'Bebas Neue',
    padding: 6,
    fontSize: 25,
    textAlign: 'center',
  },
  buttonsContainer: {
    height: 560,
    
    overflowY: 'scroll',
  },
  buttonsFlexWrapper: {
    gap: 0.1,
    backgroundColor: 'rgb(0,19,42)',
    
  },
}));

const InputDialog: React.FC = () => {
  const { classes } = useStyles();
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      fieldForm.insert(
        index,
        {
          value:
            row.type !== 'checkbox'
              ? row.type === 'date' || row.type === 'date-range' || row.type === 'time'
                ? // Set date to current one if default is set to true
                  row.default === true
                  ? new Date().getTime()
                  : Array.isArray(row.default)
                  ? row.default.map((date) => new Date(date).getTime())
                  : row.default && new Date(row.default).getTime()
                : row.default
              : row.checked,
        } || { value: null }
      );
      // Backwards compat with new Select data type
      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });
  });

  useNuiEvent('closeInputDialog', async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);
    const values: any[] = [];
    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];

      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (!data.test[i]) continue;
        data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
      }
    }
    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    fetchNui('inputData', values);
  });

  return (
    <>
  
      <Modal
      
        opened={visible}
        onClose={handleClose}
        centered
        closeOnEscape={fields.options?.allowCancel !== false}
        style={{background: 'radial-gradient(circle, rgba(19,19,19,0.2539216370141807) 0%, rgba(19,19,19,0.6544818611038166) 50%)',
      }}
        closeOnClickOutside={false}
        size="xs"
        styles={{ 
          title: 
          { 
          textAlign: 'center', 
          position: 'relative',
          width: '100%', 
          fontSize: 20,
           
          display:'block',
          marginTop: '-2px',
          fontFamily: 'Bebas Neue',
           padding: 6,
         
        

        } }}

       
        withCloseButton={false}
        overlayOpacity={0.5}
        
        transition="fade"
        exitTransitionDuration={150}
      >   <Box  className={classes.titleContainer}>  <Text className={classes.titleText}>
      <ReactMarkdown>{fields.heading}</ReactMarkdown>
    </Text>
      </Box>
        
        <form  onSubmit={onSubmit}>
          <Stack> 
            {fieldForm.fields.map((item, index) => {
              const row = fields.rows[index];
              return (
                <React.Fragment key={item.id}>
                  {row.type === 'input' && (
                    <InputField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {row.type === 'checkbox' && (
                    <CheckboxField 
                    
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      
                      index={index}
                    />
                  )}
                  {(row.type === 'select' || row.type === 'multi-select') && (
                    <SelectField  row={row} index={index} control={form.control} />
                  )}
                  {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}
                  {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}
                  {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}
                  {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}
                  {row.type === 'date' || row.type === 'date-range' ? (
                    <DateField control={form.control} row={row} index={index} />
                  ) : null}
                  {row.type === 'textarea' && (
                    <TextareaField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                </React.Fragment>
              );
            })}
            <Group position="right" spacing={10}>
              <Button
                uppercase
                variant="light"
                onClick={() => handleClose()}
                mr={3}
                style={{clipPath: 'polygon(0 0, 100% 4%, 100% 96%, 0% 100%)',borderRadius:'1px'}}
                disabled={fields.options?.allowCancel === false}
              >
                {locale.ui.cancel}
              </Button>
              <Button uppercase   style={{clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 0 95%)',borderRadius:'1px', }}  type="submit">
                {locale.ui.confirm}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default InputDialog;
