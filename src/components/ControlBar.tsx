import React, { useState } from "react";
import styled from "styled-components";
import { Modal } from "~/containers/Modal";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";
import { Colors } from "~/styles/colors";
import { Button } from "./Button";

const Container = styled.div`
  height: 16px;
  padding: ${Spacing.l}px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;

  img {
    height: 16px;
  }
`;

const ModalTitle = styled.div`
  ${Typography.L}

  color: ${Colors.black};
  font-family: SmartFontUI, sans-serif;
  margin-bottom: ${Spacing.s}px;
`;

const ModalText = styled.div`
  ${Typography.S}

  color: ${Colors.black};
  font-family: SmartFontUI, sans-serif;

  a {
    color: ${Colors.black};
    font-family: Roboto, sans-serif;
    font-weight: bold;
    text-decoration: none;
  }
`;

const ModalTextRoboto = styled.span`
  color: ${Colors.black};
  font-family: Roboto, sans-serif;
`;

const ModalConfig = styled.div`
  display: flex;
  margin-bottom: ${Spacing.l}px;

  > *:first-child {
    margin-right: ${Spacing.m}px;
  }
`;

const ModalConfigTitle = styled.div`
  ${Typography.L}

  line-height: 32px;
  color: ${Colors.black};
  font-family: SmartFontUI, sans-serif;
`;

const ModalConfigDescription = styled.div`
  ${Typography.XS}

  color: ${Colors.gray};
  font-family: SmartFontUI, sans-serif;
`;

export const ControlBar: React.FC<{
  onClickHelpButton?: () => void;
}> = ({ onClickHelpButton }) => {
  const [isOpenBetaMenu, setOpenBetaMenu] = useState(false);

  return (
    <>
      <Container>
        <img src="/images/close.svg" />
        <img
          id="tutorial-control-bar-beta"
          onClick={() => setOpenBetaMenu(true)}
          src="/images/beta.svg"
        />
        <img
          id="tutorial-control-bar-usage"
          src="/images/help.svg"
          onClick={onClickHelpButton}
        />
      </Container>
      <Modal
        visible={isOpenBetaMenu}
        onClickCloseButton={() => setOpenBetaMenu(false)}
      >
        <ModalConfig>
          <div>
            <ModalTitle>お問い合わせ</ModalTitle>
            <ModalText>
              ご感想や不具合の報告、機能やフレームのリクエストは以下の{" "}
              <ModalTextRoboto>Google</ModalTextRoboto>{" "}
              フォームよりお願いします。
              <br />
              <a
                href="https://forms.gle/37ucm5pkdZV7L4HAA"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://forms.gle/37ucm5pkdZV7L4HAA
              </a>
            </ModalText>
          </div>
        </ModalConfig>
        <ModalConfig>
          <div>
            <ModalConfigTitle>
              ローカルストレージの内容を削除する
            </ModalConfigTitle>
            <ModalConfigDescription>
              デバッグ用です。ローカルストレージに保存している全てのデータを削除、トップページに移動します。
            </ModalConfigDescription>
          </div>
        </ModalConfig>
        <Button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          ローカルストレージの内容を削除する
        </Button>
      </Modal>
    </>
  );
};
