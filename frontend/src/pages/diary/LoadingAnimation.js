import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoadingImage = styled.img`
  width: 100px;
  height: 100px;
`;

const images = [
    require('../images/loading1.png'),
    require('../images/loading2.png'),
    require('../images/loading3.png'),
    require('../images/loading4.png')
];

const LoadingAnimation = () => {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 500); // 0.5초마다 이미지 변경

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }, []);

    return (
        <LoadingContainer>
            <LoadingImage src={images[currentImage]} alt="Loading" />
        </LoadingContainer>
    );
};

export default LoadingAnimation;