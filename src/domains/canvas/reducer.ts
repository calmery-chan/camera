import * as uuid from "uuid";
import {
  Actions,
  ADD_USER_IMAGE,
  REMOVE_USER_IMAGE,
  COMPLETE,
  UPDATE_DISPLAY_RATIO,
  SET_CANVAS_USER_LAYER_STARTING_POSITION,
  UPDATE_CANVAS_LAYER_POSITION,
  CHANGE_USER_LAYER_FILTER_VALUE,
  ADD_STICKER_LAYER,
  START_CANVAS_STICKER_LAYER_DRAG,
  START_CANVAS_STICKER_LAYER_TRANSFORM,
  START_CANVAS_STICKER_LAYER_MUTI_TOUCHING_TRANSFORM,
  CHANGE_ACTIVE_CANVAS_SRICKER_LAYER,
  REMOVE_CANVAS_SRICKER_LAYER,
  CHANGE_FRAME,
  TICK,
} from "./actions";
import { CanvasUserFrame } from "~/types/CanvasUserFrame";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";
import { CanvasStickerLayer } from "~/types/CanvasStickerLayer";

export enum CanvasUserLayerFrame {
  W3H4 = "3:4",
  W4H3 = "4:3",
}

export const canvasUserLayerFrame: {
  [_ in CanvasUserLayerFrame]: {
    width: number;
    height: number;
    frames: {
      width: number;
      height: number;
      x: number;
      y: number;
      d: string;
    }[][];
  };
} = {
  [CanvasUserLayerFrame.W3H4]: {
    width: 900,
    height: 1200,
    frames: [
      [
        {
          width: 852,
          height: 564,
          x: 24,
          y: 24,
          d: "M0 0H852V564H0V0Z",
        },
        {
          width: 852,
          height: 564,
          x: 24,
          y: 612,
          d: "M0 0H852V564H0V0Z",
        },
      ],
      [
        {
          width: 852,
          height: 752,
          x: 24,
          y: 24,
          d: "M0 0H852V752L0 376V0Z",
        },
        {
          width: 852,
          height: 752,
          x: 24,
          y: 424,
          d: "M0 0L852 376V752H0V0Z",
        },
      ],
      [
        {
          width: 852,
          height: 564,
          x: 24,
          y: 24,
          d: "M0 0H852V564H0V0Z",
        },
        {
          width: 414,
          height: 564,
          x: 24,
          y: 612,
          d: "M0 0H414V564H0V0Z",
        },
        {
          width: 414,
          height: 564,
          x: 462,
          y: 612,
          d: "M0 0H414V564H0V0Z",
        },
      ],
      [
        {
          width: 852,
          height: 368,
          x: 24,
          y: 24,
          d: "M0 0H852V368H0V0Z",
        },
        {
          width: 852,
          height: 368,
          x: 24,
          y: 416,
          d: "M0 0H852V368H0V0Z",
        },
        {
          width: 852,
          height: 368,
          x: 24,
          y: 808,
          d: "M0 0H852V368H0V0Z",
        },
      ],
    ],
  },
  [CanvasUserLayerFrame.W4H3]: {
    width: 1200,
    height: 900,
    frames: [
      [
        {
          width: 564,
          height: 852,
          x: 24,
          y: 24,
          d: "M0 0H564V852H0V0Z",
        },
        {
          width: 564,
          height: 852,
          x: 612,
          y: 24,
          d: "M0 0H564V852H0V0Z",
        },
      ],
      [
        {
          width: 752,
          height: 852,
          x: 24,
          y: 24,
          d: "M0 0H752L376 852H0V0Z",
        },
        {
          width: 752,
          height: 852,
          x: 424,
          y: 24,
          d: "M376 0H752V852H0L376 0Z",
        },
      ],
      [
        {
          width: 564,
          height: 852,
          x: 24,
          y: 24,
          d: "M0 0H564V852H0V0Z",
        },
        {
          width: 564,
          height: 414,
          x: 612,
          y: 24,
          d: "M0 0H564V414H0V0Z",
        },
        {
          width: 564,
          height: 414,
          x: 612,
          y: 462,
          d: "M0 0H564V414H0V0Z",
        },
      ],
      [
        {
          width: 368,
          height: 852,
          x: 24,
          y: 24,
          d: "M0 0H368V852H0V0Z",
        },
        {
          width: 368,
          height: 852,
          x: 416,
          y: 24,
          d: "M0 0H368V852H0V0Z",
        },
        {
          width: 368,
          height: 852,
          x: 808,
          y: 24,
          d: "M0 0H368V852H0V0Z",
        },
      ],
    ],
  },
};

export type CanvasState = {
  width: number;
  height: number;
  x: number;
  y: number;
  frames: {
    users: CanvasUserFrame[];
  };
  layers: {
    users: (CanvasUserLayer | null)[];
    stickers: CanvasStickerLayer[];
  };
  displayRatio: number;
};

const initialState: CanvasState = {
  width: 900,
  height: 1200,
  x: 0,
  y: 0,
  frames: {
    users: [
      {
        id: uuid.v4(),
        width: 852,
        height: 612,
        x: 24,
        y: 24,
        d: "M0 0H852V519.623L0 612V0Z",
      },
      {
        id: uuid.v4(),
        width: 852,
        height: 612,
        x: 24,
        y: 564,
        d: "M0 96L852 0V612H0V96Z",
      },
    ],
  },
  layers: {
    users: [],
    stickers: [],
  },
  displayRatio: 1,
};

const progressCanvasStickerLayerDrag = (
  state: CanvasState,
  x: number,
  y: number
) => {
  const { layers } = state;
  const { stickers } = layers;
  const sticker = stickers[stickers.length - 1];

  stickers[stickers.length - 1] = {
    ...sticker,
    x,
    y,
  };

  return {
    ...state,
    layers: {
      ...state.layers,
      stickers,
    },
  };
};

const progressCanvasStickerLayerTransform = (
  state: CanvasState,
  x: number,
  y: number,
  nextScale: number,
  nextAngle: number
) => {
  const { layers } = state;
  const { stickers } = layers;
  const sticker = stickers[stickers.length - 1];

  stickers[stickers.length - 1] = {
    ...sticker,
    x,
    y,
    scale: {
      ...sticker.scale,
      current: nextScale,
    },
    rotate: {
      ...sticker.rotate,
      current: nextAngle,
    },
  };

  return {
    ...state,
    layers: {
      ...state.layers,
      stickers,
    },
  };
};

export default (state = initialState, action: Actions): CanvasState => {
  switch (action.type) {
    case TICK: {
      const { layers, displayRatio } = state;
      const canvas = state;
      const { stickers } = layers;

      const positions = action.payload.cursorPositions;

      if (!stickers.length) {
        return state;
      }

      const sticker = stickers[stickers.length - 1];
      const { isMultiTouching, isDragging, isTransforming } = sticker;

      if (isTransforming && isMultiTouching) {
        const nextAngle =
          sticker.rotate.previous +
          (Math.atan2(
            positions[1].y - positions[0].y,
            positions[1].x - positions[0].x
          ) *
            (180 / Math.PI) -
            sticker.rotate.reference);
        const currentLength = Math.pow(
          Math.pow(positions[1].x - positions[0].x, 2) +
            Math.pow(positions[1].y - positions[0].y, 2),
          0.5
        );
        const nextScale =
          (currentLength / sticker.scale.reference) * sticker.scale.previous;

        let nextX = sticker.x;
        let nextY = sticker.y;

        // 最小値を見て縮小するかどうかを決める
        if (
          sticker.width * nextScale > 200 &&
          sticker.height * nextScale > 200
        ) {
          nextX =
            sticker.x +
            (sticker.width * sticker.scale.current -
              sticker.width * nextScale) /
              2;
          nextY =
            sticker.y +
            (sticker.height * sticker.scale.current -
              sticker.height * nextScale) /
              2;

          return progressCanvasStickerLayerTransform(
            state,
            nextX,
            nextY,
            nextScale,
            nextAngle
          );
        }

        return progressCanvasStickerLayerTransform(
          state,
          nextX,
          nextY,
          sticker.scale.current,
          nextAngle
        );
      }

      if (isTransforming) {
        const [{ x, y }] = positions;
        const centerX = sticker.x + (sticker.width * sticker.scale.current) / 2;
        const centerY =
          sticker.y + (sticker.height * sticker.scale.current) / 2;
        const relativeX = (x - canvas.x) * displayRatio;
        const relativeY = (y - canvas.y) * displayRatio;

        // 回転ボタン初期位置と中心座標の度の差を求めて足す
        const nextAngle =
          Math.atan2(relativeX - centerX, relativeY - centerY) *
            (180 / Math.PI) *
            -1 +
          Math.atan2(
            sticker.x + sticker.width * sticker.scale.current - centerX,
            sticker.y + sticker.height * sticker.scale.current - centerY
          ) *
            (180 / Math.PI);
        const nextScale =
          (Math.pow(
            Math.pow(relativeX - centerX, 2) + Math.pow(relativeY - centerY, 2),
            0.5
          ) /
            sticker.scale.reference) *
          sticker.scale.previous;

        let nextX = sticker.x;
        let nextY = sticker.y;

        // 最小値を見て縮小するかどうかを決める
        if (
          sticker.width * nextScale > 200 &&
          sticker.height * nextScale > 200
        ) {
          nextX =
            sticker.x +
            (sticker.width * sticker.scale.current -
              sticker.width * nextScale) /
              2;
          nextY =
            sticker.y +
            (sticker.height * sticker.scale.current -
              sticker.height * nextScale) /
              2;

          return progressCanvasStickerLayerTransform(
            state,
            nextX,
            nextY,
            nextScale,
            nextAngle
          );
        }

        return progressCanvasStickerLayerTransform(
          state,
          nextX,
          nextY,
          sticker.scale.current,
          nextAngle
        );
      }

      if (isDragging) {
        const [{ x, y }] = positions;
        const relativeX = (x - canvas.x) * displayRatio;
        const relativeY = (y - canvas.y) * displayRatio;
        const nextX = relativeX - sticker.referenceX;
        const nextY = relativeY - sticker.referenceY;

        return progressCanvasStickerLayerDrag(state, nextX, nextY);
      }

      return state;
    }

    case REMOVE_CANVAS_SRICKER_LAYER: {
      return {
        ...state,
        layers: {
          ...state.layers,
          stickers: state.layers.stickers.slice(
            0,
            state.layers.stickers.length - 1
          ),
        },
      };
    }

    case CHANGE_FRAME: {
      const canvasUserFrame =
        canvasUserLayerFrame[action.payload.frame as CanvasUserLayerFrame];
      const users: CanvasUserFrame[] = canvasUserFrame.frames[
        action.payload.index
      ].map((f) => ({
        ...f,
        id: uuid.v4(),
      }));

      return {
        ...state,
        width: canvasUserFrame.width,
        height: canvasUserFrame.height,
        frames: {
          users,
        },
      };
    }

    case CHANGE_ACTIVE_CANVAS_SRICKER_LAYER: {
      const { stickers } = state.layers;
      const nextStickers = [
        ...stickers.filter((_, i) => i !== action.payload.index),
        stickers[action.payload.index],
      ];

      return {
        ...state,
        layers: {
          ...state.layers,
          stickers: nextStickers,
        },
      };
    }

    case START_CANVAS_STICKER_LAYER_DRAG: {
      const { layers } = state;
      const sticker = layers.stickers[layers.stickers.length - 1];

      layers.stickers[layers.stickers.length - 1] = {
        ...sticker,
        ...action.payload,
        isDragging: true,
      };

      return {
        ...state,
        layers,
      };
    }

    case START_CANVAS_STICKER_LAYER_TRANSFORM: {
      const { layers } = state;
      const sticker = layers.stickers[layers.stickers.length - 1];

      layers.stickers[layers.stickers.length - 1] = {
        ...sticker,
        scale: {
          ...sticker.scale,
          reference: action.payload.previousLength,
        },
        isTransforming: true,
      };

      return {
        ...state,
        layers,
      };
    }

    case START_CANVAS_STICKER_LAYER_MUTI_TOUCHING_TRANSFORM: {
      const { layers } = state;
      const sticker = layers.stickers[layers.stickers.length - 1];

      layers.stickers[layers.stickers.length - 1] = {
        ...sticker,
        scale: {
          ...sticker.scale,
          reference: action.payload.previousLength,
        },
        rotate: {
          ...sticker.rotate,
          previous: sticker.rotate.current,
          reference: action.payload.startingAngle,
        },
        isTransforming: true,
        isMultiTouching: true,
      };

      return {
        ...state,
        layers,
      };
    }

    case ADD_STICKER_LAYER: {
      const { dataUrl, width, height } = action.payload;
      const { layers } = state;

      return {
        ...state,
        layers: {
          ...layers,
          stickers: [
            ...layers.stickers,
            {
              dataUrl,
              width,
              height,
              x: 0,
              y: 0,
              isDragging: false,
              isTransforming: false,
              isMultiTouching: false,
              referenceX: 0,
              referenceY: 0,
              scale: {
                current: 1,
                previous: 1,
                reference: 0,
              },
              rotate: {
                current: 1,
                previous: 1,
                reference: 0,
              },
            },
          ],
        },
      };
    }

    case ADD_USER_IMAGE: {
      const userFrames = state.frames.users;
      const userLayers = state.layers.users;
      const nextUserLayers = [];

      userFrames.forEach((_, i) => (nextUserLayers[i] = userLayers[i] || null));
      nextUserLayers[action.payload.index] = {
        ...action.payload,
        x: 0,
        y: 0,
        isDragging: false,
        differenceFromStartingX: 0,
        differenceFromStartingY: 0,
        filter: {
          blur: 0,
          hueRotate: 0,
          luminanceToAlpha: false,
          saturate: 1,
        },
      };

      return {
        ...state,
        layers: {
          ...state.layers,
          users: nextUserLayers,
        },
      };
    }

    case REMOVE_USER_IMAGE: {
      const userLayers = state.layers.users;

      return {
        ...state,
        layers: {
          ...state.layers,
          users: userLayers.map((userLayer, i) =>
            i === action.payload.index ? null : userLayer
          ),
        },
      };
    }

    case UPDATE_DISPLAY_RATIO: {
      const { width } = state;

      return {
        ...state,
        displayRatio: width / action.payload.displayWidth,
        x: action.payload.displayX,
        y: action.payload.displayY,
      };
    }

    case UPDATE_CANVAS_LAYER_POSITION: {
      const { users } = state.layers;
      const user = users[action.payload.index];

      if (user === null) {
        return state;
      }

      users[action.payload.index] = {
        ...user,
        x: action.payload.nextX,
        y: action.payload.nextY,
      };

      return {
        ...state,
        layers: {
          ...state.layers,
          users,
        },
      };
    }

    case SET_CANVAS_USER_LAYER_STARTING_POSITION: {
      const { users } = state.layers;
      const user = users[action.payload.index];

      if (user === null) {
        return state;
      }

      users[action.payload.index] = {
        ...user,
        differenceFromStartingX: action.payload.differenceFromStartingX,
        differenceFromStartingY: action.payload.differenceFromStartingY,
        isDragging: true,
      };

      return {
        ...state,
        layers: {
          ...state.layers,
          users,
        },
      };
    }

    case COMPLETE: {
      const { users, stickers } = state.layers;
      const nextUsers = users.map((user) => {
        if (!user) {
          return user;
        }

        user.isDragging = false;

        return user;
      });
      const nextStickers = stickers.map((sticker) => ({
        ...sticker,
        isDragging: false,
        isMultiTouching: false,
        isTransforming: false,
        scale: {
          ...sticker.scale,
          previous: sticker.scale.current,
        },
      }));

      return {
        ...state,
        layers: {
          stickers: nextStickers,
          users: nextUsers,
        },
      };
    }

    case CHANGE_USER_LAYER_FILTER_VALUE: {
      const { layers } = state;
      const userLayer = layers.users[action.payload.index];

      if (userLayer) {
        layers.users[action.payload.index] = {
          ...userLayer,
          filter: {
            ...userLayer.filter,
            [action.payload.type]: action.payload.value,
          },
        };
      }

      return {
        ...state,
        layers,
      };
    }

    default:
      return state;
  }
};
