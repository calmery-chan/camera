import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "~/domains";
import { actions } from "~/domains/cropper/actions";
import { convertEventToCursorPositions } from "~/utils/convert-event-to-cursor-positions";
import { getColorByDominantColorLightness } from "~/utils/canvas";

export const CropperOperator: React.FC = () => {
  const dispatch = useDispatch();
  const { container, cropper, image } = useSelector(
    ({ cropper }: State) => cropper
  );

  // Refs

  const circleRef = useRef<SVGCircleElement>(null);

  // Events

  const handleOnStartCropperTransform = useCallback(
    (event: React.MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      dispatch(
        actions.startCropperCropperTransform(
          convertEventToCursorPositions(event)
        )
      );
    },
    [dispatch]
  );

  // Hooks

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const c = circleRef.current!;

    c.addEventListener("touchstart", handleOnStartCropperTransform, {
      passive: false,
    });

    return () => {
      c.removeEventListener("touchstart", handleOnStartCropperTransform);
    };
  }, [circleRef]);

  // Render

  const { displayMagnification } = container;

  let sx = cropper.scaleX.current;
  let sy = cropper.scaleY.current;

  if (!cropper.freeAspect) {
    sx = cropper.scale.current;
    sy = cropper.scale.current;
  }

  const x = cropper.position.x;
  const y = cropper.position.y;
  const width = cropper.width * sx;
  const height = cropper.height * sy;

  const cx = x + width;
  const cy = y + height;
  const r = 12 * displayMagnification;

  const dark = getColorByDominantColorLightness(1);
  const light = getColorByDominantColorLightness(0);

  return (
    <>
      <clipPath id="cropper-operator-clip-path">
        <rect
          width={image.width * image.scale.current}
          height={image.height * image.scale.current}
          x={image.position.x}
          y={image.position.y}
          transform={`rotate(${image.rotate.current}, ${image.width / 2}, ${
            image.height / 2
          })`}
        />
      </clipPath>

      <g>
        <rect
          fillOpacity="0"
          stroke={dark}
          strokeWidth="2"
          strokeDasharray="8 8"
          width={width}
          height={height}
          x={x}
          y={y}
        ></rect>

        <circle fill={dark} cx={cx} cy={cy} r={r}></circle>
      </g>

      <g clipPath="url(#cropper-operator-clip-path)">
        <rect
          fillOpacity="0"
          stroke={light}
          strokeWidth="2"
          strokeDasharray="8 8"
          width={width}
          height={height}
          x={x}
          y={y}
        ></rect>

        <circle fill={light} cx={cx} cy={cy} r={r}></circle>
      </g>

      <image
        xlinkHref="/images/containers/resize.svg"
        width={r}
        height={r}
        x={x + width - r / 2}
        y={y + height - r / 2}
      />

      <circle
        ref={circleRef}
        fillOpacity="0"
        cx={cx}
        cy={cy}
        r={r}
        onMouseDown={handleOnStartCropperTransform}
      ></circle>
    </>
  );
};
