import { CHAINS, ChefType, JSBI } from '@pangolindex/sdk';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BIG_INT_ZERO } from 'src/constants';
import { useChainId } from 'src/hooks';
import { usePangoChefInfosHook } from 'src/state/ppangoChef/hooks';
import { PangoChefInfo } from 'src/state/ppangoChef/types';
import { useMinichefStakingInfosHook } from 'src/state/pstake/hooks';
import { MinichefStakingInfo, PoolType } from 'src/state/pstake/types';
import { Box } from '../Box';
import Pool from './Pool';
import Sidebar, { MenuType } from './Sidebar';
import Wallet from './Wallet';
import { GridContainer, PageWrapper } from './styleds';

const PoolsUI = () => {
  const chainId = useChainId();
  const minichef = CHAINS[chainId].contracts?.mini_chef;

  const [activeMenu, setMenu] = useState<string>(MenuType.allFarm);

  const { t } = useTranslation();

  const usePangoChefInfos = usePangoChefInfosHook[chainId];
  const pangoChefStakingInfos = usePangoChefInfos();

  const useMiniChefStakingInfos = useMinichefStakingInfosHook[chainId];
  const miniChefStakingInfos = useMiniChefStakingInfos();

  const ownminiChefStakingInfos = useMemo(
    () =>
      (miniChefStakingInfos || []).filter((stakingInfo: MinichefStakingInfo) => {
        return Boolean(stakingInfo.stakedAmount.greaterThan('0'));
      }),
    [miniChefStakingInfos],
  );

  const ownPangoCheftStakingInfo = useMemo(
    () =>
      (pangoChefStakingInfos || []).filter((stakingInfo: MinichefStakingInfo) => {
        return Boolean(stakingInfo.stakedAmount.greaterThan('0'));
      }),
    [pangoChefStakingInfos],
  );

  const pangoChefStakingLength = (pangoChefStakingInfos || []).length;
  const superFarms = useMemo(() => {
    if (pangoChefStakingLength > 0) {
      return (pangoChefStakingInfos || [])?.filter(
        (item: PangoChefInfo) =>
          (item?.rewardTokensAddress?.length || 0) > 0 && JSBI.greaterThan(item.multiplier, BIG_INT_ZERO),
      );
    }
    return (miniChefStakingInfos || []).filter(
      (item: MinichefStakingInfo) =>
        (item?.rewardTokensAddress?.length || 0) > 0 && JSBI.greaterThan(item.multiplier, BIG_INT_ZERO),
    );
  }, [miniChefStakingInfos, pangoChefStakingInfos, pangoChefStakingLength]);

  const menuItems: Array<{ label: string; value: string }> = useMemo(() => {
    const _menuItems = [
      {
        label: `${t('pool.allFarms')}`,
        value: MenuType.allFarm,
      },
    ];

    // add own v2
    if (ownminiChefStakingInfos.length > 0) {
      _menuItems.push({
        label: `${t('pool.yourFarms')}`,
        value: MenuType.yourFarm,
      });
    }
    // add own pangochef
    if (ownPangoCheftStakingInfo.length > 0) {
      _menuItems.push({
        label: `${t('pool.yourFarms')}`,
        value: MenuType.yourFarm,
      });
    }
    // add superfarm
    if (superFarms.length > 0) {
      _menuItems.push({
        label: 'Super Farms',
        value: MenuType.superFarm,
      });
    }

    _menuItems.push({
      label: `${t('pool.yourPools')}`,
      value: MenuType.yourPool,
    });

    return _menuItems;
  }, [ownminiChefStakingInfos, ownPangoCheftStakingInfo, superFarms]);

  const handleSetMenu = useCallback(
    (value: string) => {
      setMenu(value);
    },
    [setMenu],
  );

  const getVersion = useCallback(() => {
    const chefType = minichef?.type;
    switch (chefType) {
      case ChefType.MINI_CHEF:
        return 1;
      case ChefType.MINI_CHEF_V2:
        return 2;
      case ChefType.PANGO_CHEF:
        return 3;
      default:
        return 2;
    }
  }, [minichef]);

  const version = getVersion();

  return (
    <PageWrapper>
      <GridContainer>
        <Box display="flex" height="100%">
          <Sidebar
            activeMenu={activeMenu}
            setMenu={handleSetMenu}
            menuItems={menuItems}
            onManagePoolsClick={() => {
              setMenu(MenuType.yourPool);
            }}
          />

          {(activeMenu === MenuType.allFarm ||
            activeMenu === MenuType.yourFarm ||
            activeMenu === MenuType.superFarm) && (
            <Pool
              type={
                activeMenu === MenuType.allFarm
                  ? PoolType.all
                  : activeMenu === MenuType.superFarm
                  ? PoolType.superFarms
                  : PoolType.own
              }
              version={version}
              stakingInfoV1={[]}
              miniChefStakingInfo={miniChefStakingInfos}
              pangoChefStakingInfo={pangoChefStakingInfos}
              activeMenu={activeMenu}
              setMenu={handleSetMenu}
              menuItems={menuItems}
            />
          )}
          {activeMenu === MenuType.yourPool && (
            <Wallet activeMenu={activeMenu} setMenu={handleSetMenu} menuItems={menuItems} />
          )}
        </Box>
      </GridContainer>
    </PageWrapper>
  );
};
export default PoolsUI;
