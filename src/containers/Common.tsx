import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { State, withRedux } from "~/domains";
import { actions as uiActions } from "~/domains/ui/actions";
import { DeviceOrientation } from "~/components/DeviceOrientation";
import { Loading } from "~/components/Loading";
import { Popup } from "~/components/Popup";
import { CanvasRestore } from "./CanvasRestore";

export const Common = withRedux(() => {
  const dispatch = useDispatch();
  const { isImageLoadError, loading } = useSelector(({ ui }: State) => ui);

  const handleOnClickResolveImageLoadError = useCallback(
    () => dispatch(uiActions.imageLoadError(false)),
    []
  );

  return (
    <>
      {isImageLoadError && (
        <Popup
          characterImageUrl="https://static.calmery.moe/s/2/6.png"
          onEnter={handleOnClickResolveImageLoadError}
        >
          画像の読み込みに失敗しました...！
          <br />
          何度も失敗するときは別の画像で試してみてね
        </Popup>
      )}
      {loading > 0 && <Loading />}
      <DeviceOrientation />
      <CanvasRestore />
    </>
  );
});
