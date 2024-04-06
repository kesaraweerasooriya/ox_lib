import { Box, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import ScaleFade from '../../../transitions/ScaleFade';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  sector: {
    fill: 'rgba(0,19,42,0.6)',
    color: 'white',

    '&:hover': {
       fill: 'rgba(255,255,255,0.3)',
       transition: 'fill 0.5s ease',
      '> g > text, > g > svg > path': {
        fill: '#fff',
        color: 'white',
      },
    },
    '> g > text': {
      fill: '#fff',
      color: 'white',
    },
  },
  backgroundCircle: {
    fill: theme.colors.dark[6],
  },
  centerCircle: {
    fill: 'rgba(0,123,255,1)',
    color: '#fff',
    stroke: 'rgba(255,255,255,0.65)',
    strokeWidth: 4,
    '&:hover': {
      fill: theme.colors[theme.primaryColor][theme.fn.primaryShade() - 1],
    },
  },
  centerIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  centerIcon: {
    color: '#fff',
  },
}));

// includes More... button
const PAGE_ITEMS = 8;

const degToRad = (deg: number) => deg * (Math.PI / 180);

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [menu, setMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });

  const changePage = async (increment?: boolean) => {
    setVisible(false);

    const didTransition: boolean = await fetchNui('radialTransition');

    if (!didTransition) return;

    setVisible(true);
    setMenu({ ...menu, page: increment ? menu.page + 1 : menu.page - 1 });
  };

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) return setMenuItems(menu.items);
    const items = menu.items.slice(
      PAGE_ITEMS * (menu.page - 1) - (menu.page - 1),
      PAGE_ITEMS * menu.page - menu.page + 1
    );
    if (PAGE_ITEMS * menu.page - menu.page + 1 < menu.items.length) {
      items[items.length - 1] = { icon: 'ellipsis-h', label: locale.ui.more, isMore: true };
    }
    setMenuItems(items);
  }, [menu.items, menu.page]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) return setVisible(false);
    let initialPage = 1;
    if (data.option) {
      data.items.findIndex(
        (item, index) => item.menu == data.option && (initialPage = Math.floor(index / PAGE_ITEMS) + 1)
      );
    }
    setMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu({ ...menu, items: data });
  });

  return (
    <>
    {visible && (
        <div
          className="overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(19,19,19,0.2539216370141807) 0%, rgba(19,19,19,0.6544818611038166) 50%)',
            zIndex: 0,
          }}
        />
      )}
      <Box
        className={classes.wrapper}
        onContextMenu={async () => {
          if (menu.page > 1) await changePage();
          else if (menu.sub) fetchNui('radialBack');
        }}
      >
        <ScaleFade visible={visible}>
          <svg width="350px" height="350px" transform="rotate(90)">
            {/*Fixed issues with background circle extending the circle when there's less than 3 items*/}
           
            {menuItems.map((item, index) => {
              // Always draw full circle to avoid elipse circles with 2 or less items
              const pieAngle = 360 / (menuItems.length < 3 ? 3 : menuItems.length);
              const angle = degToRad(pieAngle / 2 + 90);
              const gap = 0;
              const radius = 175 * 0.65 - gap;
              const sinAngle = Math.sin(angle);
              const cosAngle = Math.cos(angle);
              const iconX = 175 + sinAngle * radius;
              const iconY = 175 + cosAngle * radius;

              return (
                <>
                  <g
                    transform={`rotate(-${index * pieAngle} 175 175) translate(${sinAngle * gap}, ${cosAngle * gap})`}
                    className={classes.sector}
                    onClick={async () => {
                      const clickIndex =
                        menu.page === 1 ? index : PAGE_ITEMS * (menu.page - 1) - (menu.page - 1) + index;
                      if (!item.isMore) fetchNui('radialClick', clickIndex);
                      else {
                        await changePage(true);
                      }
                    }}
                  >
                    <path
                      d={`M175.01,175.01 l${175 - gap},0 A175.01,175.01 0 0,0 ${
                        175 + (175 - gap) * Math.cos(-degToRad(pieAngle))
                      }, ${175 + (175 - gap) * Math.sin(-degToRad(pieAngle))} z`}
                    />
                    <g transform={`rotate(${index * pieAngle - 90} ${iconX} ${iconY})`} pointerEvents="none">
                      <LibIcon x={iconX - 12.5} y={iconY - 17.5} icon={item.icon} width={25} height={25} fixedWidth />
                      <text
                        x={iconX}
                        y={iconY + (item.label.includes('  \n') ? 7 : 25)}
                        fill="#fff"
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {item.label.includes('  \n')
                          ? item.label.split('  \n').map((value) => (
                              <tspan x={iconX} dy="1.2em">
                                {value}
                              </tspan>
                            ))
                          : item.label}
                      </text>
                    </g>
                  </g>
                </>
              );
            })}
<g
  transform={`translate(175, 175)`}
  onClick={async () => {
    if (menu.page > 1) await changePage();
    else {
      if (menu.sub) fetchNui('radialBack');
      else {
        setVisible(false);
        fetchNui('radialClose');
      }
    }
  }}
>
  <path
    d="M32,0 L64,16 L64,48 L32,64 L0,48 L0,16 Z"
    className={classes.centerCircle}
    transform="translate(-32, -32)" // Adjust the translation to center the hexagon
  />
</g>
          </svg>
          <div className={classes.centerIconContainer}>
            <LibIcon
              icon={!menu.sub && menu.page < 2 ? 'xmark' : 'arrow-rotate-left'}
              fixedWidth
              className={classes.centerIcon}
              color="#fff"
              size="2x"
            />
          </div>
        </ScaleFade>
         {/* Rest of your component */}
      </Box>
    </>
  );
};

export default RadialMenu;
