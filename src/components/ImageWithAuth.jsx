import React, { useEffect, useRef, useState } from 'react';
import logo from '../assets/25.gif'
import useRequest from '../services/Requests';
import Loading from './Loading';

const cache = {};

const ImageWithAuth = ({ url }) => {
    const [fetchedImage, setFetchedImage] = useState();
    const imgRef = useRef(null);
    const [fetchDataApi, fetchDataAuth] = useRequest();
    const config = {
        responseType: 'arraybuffer',
        headers: {},
        withCredentials: true,
    }

    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (cache[url]) {
                    setFetchedImage(cache[url]);
                    // console.log("cache img");
                } else {
                    const res = await fetchDataApi("GET", url, null, config);
                    const blob = new Blob([res.data], { type: 'image/webp' });
                    const objectURL = URL.createObjectURL(blob);
                    cache[url] = objectURL;
                    setFetchedImage(objectURL);
                }
            } catch (error) {
                console.error('Error fetching the image:', error);
            }
        };

        fetchImage();
    }, [url]);

    useEffect(() => {
        if (imgRef.current && fetchedImage) {
            imgRef.current.src = fetchedImage;
        }
    }, [fetchedImage]);

    return (
        <img
            src={''}
            alt={'Loading...'}
            ref={imgRef}
            style={{ maxWidth: '100%', maxHeight: '20rem', objectFit: 'contain' }}
        />
    );
};

export default ImageWithAuth;