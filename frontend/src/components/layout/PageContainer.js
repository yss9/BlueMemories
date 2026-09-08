import styled from 'styled-components';

const PageContainer = styled.main`
  width: 100%;
  max-width: ${(props) => props.$maxWidth || '1100px'};
  margin: ${(props) => props.$margin || '0 auto'};
  padding: ${(props) => props.$padding || '40px 24px'};
  min-height: ${(props) => props.$minHeight || 'auto'};
  box-sizing: border-box;
  position: ${(props) => props.$position || 'relative'};
  z-index: ${(props) => props.$zIndex || 'auto'};
  font-family: ${(props) => props.$fontFamily || 'inherit'};
  text-align: ${(props) => props.$textAlign || 'initial'};

  @media (max-width: 768px) {
    padding: ${(props) => props.$mobilePadding || '24px 16px'};
  }
`;

export default PageContainer;
