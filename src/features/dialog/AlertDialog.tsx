import { Button, createStyles, Group, Modal, Stack, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import { Box, Flex, Text } from '@mantine/core';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles((theme) => ({
  contentStack: {
    color: 'theme.colors.dark[2]',
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
    color:'white',
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
    
    
  },

}));

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  return (
    <>
      <Modal
        opened={opened}
        centered={dialogData.centered}
        size={dialogData.size || 'md'}
        overflow={dialogData.overflow ? 'inside' : 'outside'}
        closeOnClickOutside={false}
        style={{background: 'radial-gradient(circle, rgba(19,19,19,0.2539216370141807) 0%, rgba(19,19,19,0.6544818611038166) 50%)',
      }}
        onClose={() => {
          setOpened(false);
          closeAlert('cancel');
        }}
        withCloseButton={false}
        overlayOpacity={0.5}
        exitTransitionDuration={150}
        transition="fade"
      
      >

<Box className={classes.titleContainer}>  <Text className={classes.titleText}>
      <ReactMarkdown>{dialogData.header}</ReactMarkdown>
    </Text>
      </Box>
        <Stack className={classes.contentStack}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            
            components={{
              ...MarkdownComponents,
              img: ({ ...props }) => <img style={{ maxWidth: '100%', maxHeight: '100%' }} {...props} />,
            }}
          >
            
            {dialogData.content}
          </ReactMarkdown>
          <Group position="right" spacing={10}>
            {dialogData.cancel && (
              <Button  style={{clipPath: 'polygon(0 0, 100% 4%, 100% 96%, 0% 100%)',borderRadius:'1px'}} uppercase variant="light" onClick={() => closeAlert('cancel')} mr={3}>
                {dialogData.labels?.cancel || locale.ui.cancel}
              </Button>
            )}
            <Button
              uppercase
              style={{clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 0 95%)',borderRadius:'1px', }}
              color={dialogData.cancel ? theme.primaryColor : undefined}
              onClick={() => closeAlert('confirm')}
            >
              {dialogData.labels?.confirm || locale.ui.confirm}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default AlertDialog;
