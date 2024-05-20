import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import logo from '../assets/25.gif'
import useUpdateToken from '../services/requests';

const cache = {};

async function memoFetch(index) {
    if (cache[index]) {
        return cache[index];
    }
    const data = fetchData(index);
    cache[index] = data;
    return data;
}

const ImageWithAuth = ({ url, token }) => {
    const [fetchedImage, setFetchedImage] = useState();
    const imgRef = useRef(null);
    const updateAccessToken = useUpdateToken();

    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (cache[url]) {
                    setFetchedImage(cache[url]);
                    // console.log("cache img");
                } else {
                    const res = await axios.get(url, {
                        responseType: 'arraybuffer',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });
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
    }, [url, token]);

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