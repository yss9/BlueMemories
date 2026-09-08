import defaultDiaryImage from './pages/images/default.png';
import coverImage2 from './pages/sharedDiary/image/coverImage2.png';
import coverImage3 from './pages/sharedDiary/image/coverImage3.png';
import coverImage4 from './pages/sharedDiary/image/coverImage4.png';
import coverImage5 from './pages/sharedDiary/image/coverImage5.png';

export const DEFAULT_SHARED_DIARY_COVER = 'coverImage2';

export const sharedDiaryCoverOptions = [
    { key: 'coverImage2', image: coverImage2 },
    { key: 'coverImage3', image: coverImage3 },
    { key: 'coverImage4', image: coverImage4 },
    { key: 'coverImage5', image: coverImage5 },
];

const sharedDiaryCoverMap = sharedDiaryCoverOptions.reduce((covers, cover) => {
    covers[cover.key] = cover.image;
    return covers;
}, {});

const isExternalOrPublicPath = (value) => (
    /^https?:\/\//.test(value) ||
    value.startsWith('/') ||
    value.startsWith('data:')
);

const findSharedDiaryCoverKey = (value) => (
    sharedDiaryCoverOptions.find((cover) => value.includes(cover.key))?.key
);

export const getDiaryImageSrc = (imageUrl) => (
    imageUrl && imageUrl.trim() ? imageUrl : defaultDiaryImage
);

export const getSharedDiaryCoverSrc = (coverImageUrl) => {
    if (!coverImageUrl || !coverImageUrl.trim()) {
        return sharedDiaryCoverMap[DEFAULT_SHARED_DIARY_COVER];
    }

    const knownCoverKey = findSharedDiaryCoverKey(coverImageUrl);
    if (knownCoverKey) {
        return sharedDiaryCoverMap[knownCoverKey];
    }

    if (isExternalOrPublicPath(coverImageUrl)) {
        return coverImageUrl;
    }

    return sharedDiaryCoverMap[coverImageUrl] || sharedDiaryCoverMap[DEFAULT_SHARED_DIARY_COVER];
};
