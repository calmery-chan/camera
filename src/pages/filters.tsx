import { NextPage } from "next";
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import { ControlBar } from "~/components/ControlBar";
import { FirstLanding } from "~/components/FirstLanding";
import { Horizontal } from "~/components/Horizontal";
import { InputRange } from "~/components/InputRange";
import { HorizontalInner } from "~/components/HorizontalInner";
import { Menu } from "~/components/Menu";
import { Page } from "~/components/Page";
import { PageColumn } from "~/components/PageColumn";
import { Tutorial } from "~/components/Tutorial";
import {
  TUNE_PAHE_WITH_IMAGE_SCENARIOS,
  PAGE_WITHOUT_IMAGE_SCENARIOS,
} from "~/constants/tutorials";
import { Canvas } from "~/containers/Canvas";
import { withRedux, State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import { actions as uiActions } from "~/domains/ui/actions";
import { Colors, GradientColors } from "~/styles/colors";
import { Constants } from "~/styles/constants";
import { Mixin } from "~/styles/mixin";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";
import { CanvasUserFilterType } from "~/types/CanvasUserFilterType";
import * as GA from "~/utils/google-analytics";

// Styles

const FiltersContainer = styled.div`
  margin: 0 ${Spacing.l}px;
  margin-bottom: ${Spacing.m}px;
`;

const FilterTypeContainer = styled.div`
  margin-bottom: ${Spacing.l}px;
  display: flex;
`;

const FilterType = styled.div<{ selected?: boolean }>`
  margin-right: ${Spacing.m}px;
  cursor: pointer;

  ${({ selected }) =>
    selected &&
    css`
      ${Mixin.clickable};
    `}
`;

const FilterTypeFree = styled.div<{ selected?: boolean }>`
  margin-right: ${Spacing.m}px;
  cursor: pointer;
  margin-left: ${Spacing.l}px;

  ${({ selected }) =>
    selected &&
    css`
      ${Mixin.clickable};
    `}
`;

const FilterTypeIcon = styled.div<{ selected?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ selected }) =>
    selected &&
    css`
      background: ${GradientColors.pinkToBlue};

      img {
        filter: brightness(0) invert(1);
      }
    `}
`;

const FilterTypeTitle = styled.div<{ selected?: boolean }>`
  ${Typography.XS};

  font-weight: bold;
  color: ${Colors.gray};
  text-align: center;
  margin-top: ${Spacing.xs}px;

  ${({ selected }) =>
    selected &&
    css`
      background: ${GradientColors.pinkToBlue};
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    `}
`;

const FilterTargetImages = styled.div`
  align-items: center;
  height: 54px;
  display: flex;
`;

const FilterTargetImage = styled.div<{ selected?: boolean }>`
  ${Mixin.clickable};

  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${Spacing.m}px;
  cursor: pointer;
  opacity: ${({ selected }) => (selected ? 1 : Constants.opacity)};

  &:first-child {
    margin-left: ${Spacing.l}px;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 2px;
    box-sizing: border-box;
    border: 1px solid ${Colors.lightGray};
  }
`;

// Components

const Filters: NextPage = () => {
  const dispatch = useDispatch();
  const { pathname } = useRouter();
  const { temporaries, userLayers } = useSelector(
    ({ canvas }: State) => canvas
  );
  const ui = useSelector(({ ui }: State) => ui);

  // States

  const [isTutorial, setTutorial] = useState(false);

  // Events

  const handleOnClickHelpButton = useCallback(() => {
    GA.playTutorial(pathname);
    setTutorial(true);
  }, []);

  const handleOnCompleteTutorial = useCallback(() => {
    setTutorial(false);
    GA.completeTutorial(pathname);
  }, []);

  const handleOnStopTutorial = useCallback(() => {
    setTutorial(false);
    GA.stopTutorial(pathname);
  }, []);

  const handleOnChangeBlurValue = useCallback(
    (value) => {
      dispatch(
        actions.updateCanvasUserLayerFilter(CanvasUserFilterType.blur, value)
      );
    },
    [dispatch]
  );

  const handleOnChangeHueValue = useCallback(
    (value) => {
      dispatch(
        actions.updateCanvasUserLayerFilter(CanvasUserFilterType.hue, value)
      );
    },
    [dispatch]
  );

  const handleOnChangeSaturateValue = useCallback(
    (value) => {
      dispatch(
        actions.updateCanvasUserLayerFilter(
          CanvasUserFilterType.saturate,
          value
        )
      );
    },
    [dispatch]
  );

  const handleOnChangeBlurFilterType = useCallback(() => {
    dispatch(uiActions.changeUiFilterType(CanvasUserFilterType.blur));
  }, [dispatch]);

  const handleOnChangeHueFilterType = useCallback(() => {
    dispatch(uiActions.changeUiFilterType(CanvasUserFilterType.hue));
  }, [dispatch]);

  const handleOnChangeSaturateFilterType = useCallback(() => {
    dispatch(uiActions.changeUiFilterType(CanvasUserFilterType.saturate));
  }, [dispatch]);

  const handleOnChangeTargetImage = useCallback(
    (i) => {
      dispatch(actions.startCanvasUserLayerFilter(i));
    },
    [dispatch]
  );

  // Render

  const isImageExists = userLayers.some((u) => u);

  let userLayer = userLayers[temporaries.selectedUserLayerFilterIndex];

  if (!userLayer) {
    const i = userLayers.findIndex((l) => !!l);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    userLayer = userLayers[i]!;
  }

  return (
    <>
      <Page>
        <PageColumn>
          <ControlBar onClickHelpButton={handleOnClickHelpButton} />
          <Canvas logo={false} stickers={false} />
          <Menu>
            {isImageExists && (
              <FiltersContainer id="tutorial-filters-inputs">
                <div
                  style={{
                    display:
                      CanvasUserFilterType.blur === ui.selectedFilterType
                        ? "block"
                        : "none",
                  }}
                >
                  <InputRange
                    min={0}
                    max={12}
                    step={1}
                    baseValue={0}
                    defaultValue={userLayer.blur}
                    onChange={handleOnChangeBlurValue}
                  />
                </div>
                <div
                  style={{
                    display:
                      CanvasUserFilterType.hue === ui.selectedFilterType
                        ? "block"
                        : "none",
                  }}
                >
                  <InputRange
                    min={0}
                    max={359}
                    step={1}
                    baseValue={0}
                    defaultValue={userLayer.hue}
                    onChange={handleOnChangeHueValue}
                  />
                </div>
                <div
                  style={{
                    display:
                      CanvasUserFilterType.saturate === ui.selectedFilterType
                        ? "block"
                        : "none",
                  }}
                >
                  <InputRange
                    min={-1}
                    max={2}
                    step={0.1}
                    baseValue={1}
                    defaultValue={userLayer.saturate}
                    onChange={handleOnChangeSaturateValue}
                  />
                </div>
              </FiltersContainer>
            )}
            {isImageExists && (
              <>
                <FilterTypeContainer>
                  <Horizontal>
                    <HorizontalInner>
                      <FilterTypeFree
                        selected={
                          ui.selectedFilterType === CanvasUserFilterType.blur
                        }
                        onClick={handleOnChangeBlurFilterType}
                      >
                        <FilterTypeIcon
                          selected={
                            ui.selectedFilterType === CanvasUserFilterType.blur
                          }
                        >
                          <img
                            src="/images/pages/filters/blur.svg"
                            alt="ぼかし"
                          />
                        </FilterTypeIcon>
                        <FilterTypeTitle
                          selected={
                            ui.selectedFilterType === CanvasUserFilterType.blur
                          }
                        >
                          ぼかし
                        </FilterTypeTitle>
                      </FilterTypeFree>
                      <FilterType
                        selected={
                          ui.selectedFilterType === CanvasUserFilterType.hue
                        }
                        onClick={handleOnChangeHueFilterType}
                      >
                        <FilterTypeIcon
                          selected={
                            ui.selectedFilterType === CanvasUserFilterType.hue
                          }
                        >
                          <img src="/images/pages/filters/hue.svg" alt="色相" />
                        </FilterTypeIcon>
                        <FilterTypeTitle
                          selected={
                            ui.selectedFilterType === CanvasUserFilterType.hue
                          }
                        >
                          色相
                        </FilterTypeTitle>
                      </FilterType>
                      <FilterType
                        selected={
                          ui.selectedFilterType ===
                          CanvasUserFilterType.saturate
                        }
                        onClick={handleOnChangeSaturateFilterType}
                      >
                        <FilterTypeIcon
                          selected={
                            ui.selectedFilterType ===
                            CanvasUserFilterType.saturate
                          }
                        >
                          <img
                            src="/images/pages/filters/saturate.svg"
                            alt="彩度"
                          />
                        </FilterTypeIcon>
                        <FilterTypeTitle
                          selected={
                            ui.selectedFilterType ===
                            CanvasUserFilterType.saturate
                          }
                        >
                          彩度
                        </FilterTypeTitle>
                      </FilterType>
                    </HorizontalInner>
                  </Horizontal>
                  <FilterTargetImages id="tutorial-filters-images">
                    {userLayers.map((userLayer, i) => {
                      if (!userLayer) {
                        return null;
                      }

                      return (
                        <FilterTargetImage
                          key={i}
                          onClick={() => handleOnChangeTargetImage(i)}
                          selected={
                            temporaries.selectedUserLayerFilterIndex === i
                          }
                        >
                          <img src={userLayer.dataUrl} alt="編集画像" />
                        </FilterTargetImage>
                      );
                    })}
                  </FilterTargetImages>
                </FilterTypeContainer>
              </>
            )}
          </Menu>
        </PageColumn>
      </Page>

      <FirstLanding />

      {isTutorial && (
        <Tutorial
          scenarios={
            isImageExists
              ? TUNE_PAHE_WITH_IMAGE_SCENARIOS
              : PAGE_WITHOUT_IMAGE_SCENARIOS
          }
          onComplete={handleOnCompleteTutorial}
          onStop={handleOnStopTutorial}
        />
      )}
    </>
  );
};

export default withRedux(Filters);