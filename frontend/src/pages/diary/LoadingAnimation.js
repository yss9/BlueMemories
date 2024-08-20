import React from 'react';
import styled from 'styled-components';


const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  text-align: center;
  background-color: rgba(115, 115, 115, 0.8);
  
  
`;

const LoadingImage = styled.img`
  margin-top:9%;
  width: 55%;
  height: 60%;
`;

const LoadingAnimation = () => {
    return (
        <LoadingContainer>
            <LoadingImage src={require('../diary/images/loading.gif')} alt="Loading" />
        </LoadingContainer>
    );
};

export default LoadingAnimation;