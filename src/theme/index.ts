import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Roboto',
  shadows: { sm: '1px 1px 3px rgba(0, 0, 0, 0.5)' },
  components: {
    Modal: {
      styles: {
        modal: {
         
          backgroundColor: 'rgb(0,19,42)',
        },
      },
    },

    TextInput: {
      styles: {
        input: {
          backgroundColor: 'rgb(0,12,27)',
          border:'solid 1px rgba(255,255,255,0.2)',
        },
      },
    },
    
    TimeInput: {
      styles: {
        input: {
          backgroundColor: 'rgb(0,12,27)',
          border:'solid 1px rgba(255,255,255,0.2)',
        },
      },
    },

    Select: {
      styles: {
        input: {
          backgroundColor: 'rgb(0,12,27)',
          border:'solid 1px rgba(255,255,255,0.2)',
        },
      },
    },


    MultiSelect: {
      styles: {
        input: {
          backgroundColor: 'rgb(0,12,27)',
          border:'solid 1px rgba(255,255,255,0.2)',
        },
      },
    },

    NumberInput: {
      styles: {
        input: {
          backgroundColor: 'rgb(0,12,27)',
          border:'solid 1px rgba(255,255,255,0.2)',
        },

        
      },
    },

    Checkbox: {
      styles: {
        input: {
          color:'white',
          backgroundColor: 'rgb(0,12,27)',
          border:'solid 1px rgba(255,255,255,0.2)',
        },
      },
    },

    PasswordInput: {
      styles: {
        input: {
          backgroundColor: 'rgb(0,12,27)',
          border:'solid 1px rgba(255,255,255,0.2)',
        },
        icon: {
          backgroundColor: '#007aff',
          border:'solid 1px rgba(255,255,255,0.2)',
          color:'white',
        },
      },
    },

    Button: {
      styles: {
        root: {
          border: 'none',
        },
      },
    },
  },
};
