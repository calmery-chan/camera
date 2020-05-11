import { Dispatch } from "redux";
import blueimpLoadImage from "blueimp-load-image";
import { FeColorMatrix } from "~/types/FeColorMatrix";
import { CursorPosition } from "~/utils/convert-event-to-positions";

export const ADD_USER_IMAGE = "ADD_USER_IMAGE" as const;
export const REMOVE_USER_IMAGE = "REMOVE_USER_IMAGE" as const;
export const UPDATE_DISPLAY_RATIO = "UPDATE_DISPLAY_RATIO" as const;
export const UPDATE_CANVAS_LAYER_POSITION = "UPDATE_CANVAS_LAYER_POSITION" as const;
export const SET_CANVAS_USER_LAYER_STARTING_POSITION = "SET_CANVAS_USER_LAYER_STARTING_POSITION" as const;
export const COMPLETE = "CANVAS/COMPLETE" as const;
export const CHANGE_USER_LAYER_FILTER_VALUE = "CHANGE_USER_LAYER_FILTER_VALUE" as const;
export const ADD_STICKER_LAYER = "ADD_STICKER_LAYER" as const;
export const START_CANVAS_STICKER_LAYER_TRANSFORM = "START_CANVAS_STICKER_LAYER_TRANSFORM" as const;
export const START_CANVAS_STICKER_LAYER_MUTI_TOUCHING_TRANSFORM = "START_CANVAS_STICKER_LAYER_MUTI_TOUCHING_TRANSFORM" as const;
export const START_CANVAS_STICKER_LAYER_DRAG = "START_CANVAS_STICKER_LAYER_DRAG" as const;
export const CHANGE_ACTIVE_CANVAS_SRICKER_LAYER = "CHANGE_ACTIVE_CANVAS_SRICKER_LAYER" as const;
export const REMOVE_CANVAS_SRICKER_LAYER = "REMOVE_CANVAS_SRICKER_LAYER" as const;
export const CHANGE_FRAME = "CHANGE_FRAME" as const;
export const TICK = "CANVAS/TICK" as const;

// Actions

export const tick = (cursorPositions: CursorPosition[]) => ({
  type: TICK,
  payload: { cursorPositions },
});

export const changeFrame = (frame: any, index: number) => ({
  type: CHANGE_FRAME,
  payload: { frame, index },
});

export const removeCanvasStickerLayer = () => ({
  type: REMOVE_CANVAS_SRICKER_LAYER,
});

export const changeActiveCanvasStickerLayer = (index: number) => ({
  type: CHANGE_ACTIVE_CANVAS_SRICKER_LAYER,
  payload: { index },
});

export const startCanvasStickerLayerTransform = (
  index: number,
  x: number,
  y: number
) => ({
  type: START_CANVAS_STICKER_LAYER_TRANSFORM,
  payload: { index, x, y },
});

export const startCanvasStickerLayerDrag = (
  index: number,
  cursorPositions: CursorPosition[]
) => ({
  type: START_CANVAS_STICKER_LAYER_DRAG,
  payload: { index, cursorPositions },
});

export const addStickerLayer = (
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: ADD_STICKER_LAYER,
  payload: { dataUrl, width, height },
});

export const addUserImage = (
  index: number,
  dataUrl: string,
  width: number,
  height: number
) => ({
  type: ADD_USER_IMAGE,
  payload: {
    index,
    dataUrl,
    width,
    height,
  },
});

export const complete = () => ({
  type: COMPLETE,
});

export const removeUserImage = (index: number) => ({
  type: REMOVE_USER_IMAGE,
  payload: { index },
});

export const updateDisplayRatio = (
  displayX: number,
  displayY: number,
  displayWidth: number
) => ({
  type: UPDATE_DISPLAY_RATIO,
  payload: { displayX, displayY, displayWidth },
});

export const updateCanvasUserLayerPosition = (
  index: number,
  nextX: number,
  nextY: number
) => ({
  type: UPDATE_CANVAS_LAYER_POSITION,
  payload: { index, nextX, nextY },
});

export const setCanvasUserLayerStartingPosition = (
  index: number,
  differenceFromStartingX: number,
  differenceFromStartingY: number
) => ({
  type: SET_CANVAS_USER_LAYER_STARTING_POSITION,
  payload: { index, differenceFromStartingX, differenceFromStartingY },
});

export const changeUserLayerFilterValue = (
  index: number,
  type: FeColorMatrix,
  value: number
) => ({
  type: CHANGE_USER_LAYER_FILTER_VALUE,
  payload: {
    index,
    type,
    value,
  },
});

// Redux Thunk

const convertUrlToImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onerror = () => reject();
    image.onload = () => resolve(image);

    image.src = url;
  });
};

// TODO: `blueimpLoadImage` のエラー処理をちゃんとする
export const addUserImageFromFile = (file: File, index: number) => {
  return (dispatch: Dispatch) => {
    return new Promise((resolve) => {
      blueimpLoadImage(
        file,
        async (canvas) => {
          const dataUrl = (canvas as HTMLCanvasElement).toDataURL();
          const { width, height } = await convertUrlToImage(dataUrl);

          dispatch(addUserImage(index, dataUrl, width, height));

          resolve();
        },
        { canvas: true, orientation: true }
      );
    });
  };
};

export const addStickerLayerWithUrl = (url: string) => {
  return (dispatch: Dispatch) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onerror = () => reject();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;

        if (context === null) {
          return reject();
        }

        context.drawImage(image, 0, 0, image.width, image.height);
        dispatch(
          addStickerLayer(
            canvas.toDataURL("image/png"),
            image.width,
            image.height
          )
        );
      };

      image.src = url;
    });
  };
};

// Actions

export const actions = {
  addStickerLayer,
  addUserImage,
  removeUserImage,
  updateDisplayRatio,
  updateCanvasUserLayerPosition,
  setCanvasUserLayerStartingPosition,
  complete,
  changeUserLayerFilterValue,
  startCanvasStickerLayerTransform,
  startCanvasStickerLayerDrag,
  changeActiveCanvasStickerLayer,
  removeCanvasStickerLayer,
  changeFrame,
  tick,
};

export const thunkActions = {
  addUserImageFromFile,
};

export type Actions = ReturnType<typeof actions[keyof typeof actions]>;
