import * as uuid from "uuid";
import {
  Actions,
  COMPLETE,
  SET_FRAME,
  ADD_USER_IMAGE_AND_SET_FRAME,
  SET_DEFAULT_FRAME,
} from "~/domains/canvas/actions";
import {
  ADD,
  REMOVE,
  START_DRAG,
  SET_POSITION,
  FILTER_SET_VALUE,
} from "./actions";
import { CanvasUserFrame } from "~/types/CanvasUserFrame";
import { CanvasUserLayer } from "~/types/CanvasUserLayer";
import { canvasUserLayerFrame } from "../frames";

export type CanvasUsersState = {
  isDragging: boolean;
  canDragging: boolean;
  differenceFromStartingX: number;
  differenceFromStartingY: number;
  layers: (CanvasUserLayer | null)[];
  frames: CanvasUserFrame[];
};

const initialState: CanvasUsersState = {
  isDragging: false,
  canDragging: false,
  differenceFromStartingX: 0,
  differenceFromStartingY: 0,
  layers: [],
  frames: [],
};

const calculateCanvasUserLayerRelativeCoordinates = (
  displayRatio: number,
  clipPathX: number,
  clipPathY: number,
  x: number,
  y: number
) => ({
  x: (x - clipPathX) * displayRatio,
  y: (y - clipPathY) * displayRatio,
});

export default (state = initialState, action: Actions): CanvasUsersState => {
  switch (action.type) {
    case SET_DEFAULT_FRAME: {
      const { layers } = state;
      const { width, height } = action.payload;

      // ToDo: 1 枚目の画像の他のフレームでの座標位置が消えてしまう
      if (layers[0]) {
        layers[0] = {
          ...layers[0],
          x: 0,
          y: 0,
        };
      }

      return {
        ...state,
        canDragging: false,
        layers,
        frames: [
          {
            id: uuid.v4(),
            width,
            height,
            x: 0,
            y: 0,
            d: `M0 0H${width}V${height}H0V0Z`,
          },
        ],
      };
    }

    case ADD_USER_IMAGE_AND_SET_FRAME: {
      const { frames, layers } = state;
      const { dataUrl, width, height } = action.payload;

      layers[0] = {
        dataUrl,
        width,
        height,
        x: 0,
        y: 0,
        filter: {
          blur: 0,
          hueRotate: 0,
          luminanceToAlpha: false,
          saturate: 1,
        },
      };

      frames[0] = {
        id: uuid.v4(),
        width,
        height,
        x: 0,
        y: 0,
        d: `M0 0H${width}V${height}H0V0Z`,
      };

      return {
        ...state,
        frames,
        layers,
      };
    }

    case ADD: {
      const { layers } = state;
      const { index, dataUrl, width, height } = action.payload;

      layers[index] = {
        dataUrl,
        width,
        height,
        x: 0,
        y: 0,
        filter: {
          blur: 0,
          hueRotate: 0,
          luminanceToAlpha: false,
          saturate: 1,
        },
      };

      return {
        ...state,
        layers,
      };
    }

    case REMOVE: {
      const { layers } = state;
      const { index } = action.payload;

      layers[index] = null;

      return {
        ...state,
        layers,
      };
    }

    case START_DRAG: {
      const { layers } = state;
      const {
        index,
        cursorPositions,
        clipPathX,
        clipPathY,
        displayRatio,
      } = action.payload;
      const userLayer = layers[index];

      if (userLayer === null) {
        return state;
      }

      const { x, y } = calculateCanvasUserLayerRelativeCoordinates(
        displayRatio,
        clipPathX,
        clipPathY,
        cursorPositions[0].x,
        cursorPositions[0].y
      );

      return {
        ...state,
        differenceFromStartingX: x - userLayer.x,
        differenceFromStartingY: y - userLayer.y,
        isDragging: true,
      };
    }

    case SET_POSITION: {
      const {
        layers,
        isDragging,
        differenceFromStartingX,
        differenceFromStartingY,
        canDragging,
      } = state;
      const {
        index,
        clipPathX,
        clipPathY,
        cursorPositions,
        displayRatio,
      } = action.payload;
      const user = layers[index];

      if (!user || !canDragging) {
        return state;
      }

      const [{ x, y }] = cursorPositions;

      if (isDragging) {
        const {
          x: currentX,
          y: currentY,
        } = calculateCanvasUserLayerRelativeCoordinates(
          displayRatio,
          clipPathX,
          clipPathY,
          x,
          y
        );

        layers[index] = {
          ...user,
          x: currentX - differenceFromStartingX,
          y: currentY - differenceFromStartingY,
        };

        return {
          ...state,
          layers,
        };
      }

      return state;
    }

    //

    case FILTER_SET_VALUE: {
      const { layers } = state;
      const { index, type, value } = action.payload;
      const userLayer = layers[index];

      if (userLayer) {
        layers[index] = {
          ...userLayer,
          filter: {
            ...userLayer.filter,
            [type]: value,
          },
        };
      }

      return {
        ...state,
        layers,
      };
    }

    case SET_FRAME: {
      const { frame, index } = action.payload;
      const canvasUserFrame = canvasUserLayerFrame[frame];

      // ToDo: 表示サイズが変わるので Svg の Rect を取得し直す必要がある
      // ToDo: container にも必要！
      return {
        ...state,
        canDragging: true,
        frames: canvasUserFrame.frames[index].map((f) => ({
          ...f,
          id: uuid.v4(),
        })),
      };
    }

    case COMPLETE: {
      return {
        ...state,
        isDragging: false,
      };
    }

    default:
      return state;
  }
};