import styled from 'styled-components';
import { Box } from 'src/components';

export const CompoundWrapper = styled(Box)`
  width: 100%;
  height: 100%;
`;
export const Root = styled(Box)`
  height: 100%;
  display: grid;
  grid-gap: 8px;
  grid-template-rows: 4fr 1fr
  padding: 10px;
`;

export const RewardWrapper = styled(Box)`
  display: grid;
  grid-gap: 8px;
  justify-content: center;
`;

export const ErrorWrapper = styled(Box)`
  display: grid;
  grid-template-rows: auto max-content;
  height: 100%;
`;

export const ErrorBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const Buttons = styled(Box)`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  grid-gap: 10px;
  align-self: end;
`;
