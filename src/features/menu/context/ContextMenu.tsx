import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Flex, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '15%',
    right: '25%',
    width: 320,
    height: 580,
    zIndex: 2,
   
  },

  gradientOverlay: {
    content: '""',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'linear-gradient(90deg, rgba(18,18,18,0) 27%, rgba(7,40,74,0.8085434857536764) 100%)', // Semi-transparent black gradient from right to left
    zIndex: 1,
    display: 'none', // Initially hide the overlay
  },
  gradientOverlayVisible: {
    display: 'block', // Show the overlay when the menu is visible
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
    
  },
  titleContainer: {
   display: 'inline-block',
   marginTop: '25px',
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
    gap: 5,
   
    
    
  },
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  // Hides the context menu on ESC
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (

    <>
      <Box className={`${classes.gradientOverlay} ${visible ? classes.gradientOverlayVisible : ''}`} />
      <Box className={classes.container}>
        <ScaleFade visible={visible}>
          <Flex className={classes.header}>
            {contextMenu.menu && (
              <HeaderButton icon="chevron-left" iconSize={16} handleClick={() => openMenu(contextMenu.menu)} />
            )}
            <Box className={classes.titleContainer}>
              <Text className={classes.titleText}>
                <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
              </Text>
            </Box>
            <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={18} handleClick={closeContext} />
          </Flex>
          <Box className={classes.buttonsContainer}>
            <Stack className={classes.buttonsFlexWrapper}>
              {Object.entries(contextMenu.options).map((option, index) => (
                <ContextButton option={option} key={`context-item-${index}`} />
              ))}
            </Stack>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default ContextMenu;
