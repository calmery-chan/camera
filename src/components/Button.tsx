import React from "react";
import styled, { css } from "styled-components";
import { Colors, GradientColors } from "~/styles/colors";
import { Mixin } from "~/styles/mixin";
import { Spacing } from "~/styles/spacing";
import { Typography } from "~/styles/typography";

const Container = styled.div<Pick<ButtonProps, "disabled" | "round">>`
  ${Typography.M};

  background: ${GradientColors.pinkToBlue};
  border-radius: ${({ round }) => (round ? "50vh" : "4px")};
  box-sizing: border-box;
  padding: 2px;
  text-align: center;
  width: 100%;
  opacity: 0.48;
  cursor: not-allowed;

  ${({ disabled }) =>
    !disabled &&
    css`
      ${Mixin.clickable};
      opacity: 1;
      cursor: pointer;
    `};
`;

const Body = styled.div<Pick<ButtonProps, "primary" | "round">>`
  background: ${({ primary }) => (primary ? "transparent" : Colors.white)};
  border-radius: ${({ round }) => (round ? "50vh" : "4px")};
  padding: ${Spacing.m - 2}px ${Spacing.l - 2}px;
  position: relative;
`;

const Text = styled.div<Pick<ButtonProps, "primary">>`
  color: ${Colors.white};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ primary }) =>
    !primary &&
    css`
      background: ${GradientColors.pinkToBlue};
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    `};
`;

type ButtonProps = {
  children: string | React.ReactNode[];
  disabled?: boolean;
  primary?: boolean;
  round?: boolean;
  onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = (props: ButtonProps) =>
  props.children ? (
    <Container
      round={props.round === undefined ? true : props.round}
      disabled={props.disabled}
      onClick={() => props.onClick && props.onClick()}
    >
      <Body {...props} round={props.round === undefined ? true : props.round}>
        <Text {...props}>{props.children}</Text>
      </Body>
    </Container>
  ) : null;
