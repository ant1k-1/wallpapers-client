import React, { useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const CreatePostForm = () => {
    const [image, setImage] = useState(null);
    const [source, setSource] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagType, setTagType] = useState('tag');
    const [tagValue, setTagValue] = useState('');
    const { user } = useSelector((state) => state.user);
    const { info: userInfo, jwt: accessToken } = user ? user : JSON.parse(localStorage.getItem('user'));
    const [errorMessage, setErrorMessage] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSourceChange = (e) => {
        setSource(e.target.value);
    }

    const handleTagTypeChange = (e) => {
        setTagType(e.target.value);
    };

    const handleTagValueChange = (e) => {
        if (e.target.value.includes(' ')) {
            setErrorMessage('Tags cannot contain spaces. Use _underscores_ instead.');
        } else {
            setErrorMessage('')
        }
        setTagValue(e.target.value);
    };


    const addTag = () => {
        if (tagValue.trim() === '') return;
        if (tagValue.includes(' ')) {
            setErrorMessage('Tags cannot contain spaces. Use _underscores_ instead.');
            return;
        }
        setTags([...tags, `${tagType}:${tagValue}`]);
        setTagValue('');
    };

    const removeTag = (index) => {
        const updatedTags = [...tags];
        updatedTags.splice(index, 1);
        setTags(updatedTags);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('pic', image);
        formData.append('source', source);
        tags.forEach((tag, index) => {
            formData.append(`tag${index + 1}`, tag);
        });
        // // Логирование данных
        // console.log("Data being sent to API:");
        // for (let pair of formData.entries()) {
        //     console.log(`${pair[0]}: ${pair[1]}`);
        // }
        try {

            await axios.post('http://localhost:8080/api/posts/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + accessToken
                }
            });
            // Очистить форму после успешной отправки
            setSource(null);
            setImage(null);
            setTags([]);
        } catch (error) {
            console.error('Error uploading post:', error);
        }
    };

    return (
        <Container className='d-flex justify-content-md-center'>
            <form style={{ width: "50vw" }} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="imageFile" className="form-label">Image File:</label>
                    <input type="file" className="form-control" id="imageFile" accept="image/*" onChange={handleImageChange} required />
                </div>
                <div className='mb-3'>
                    <label htmlFor="source" className='form-label'>Source link:</label>
                    <input type="text" className='form-control' id='source' onChange={handleSourceChange} required />
                </div>
                <div className='d-flex'>
                    <div className="mb-3 me-3">
                        <label htmlFor="tagType" className="form-label">Tag Type:</label>
                        <select className="form-select" id="tagType" value={tagType} onChange={handleTagTypeChange}>
                            <option value="tag">Tag</option>
                            <option value="author">Author</option>
                            <option value="title">Title</option>
                        </select>
                    </div>
                    <div className="mb-3 me-3 flex-fill">
                        <label htmlFor="tagValue" className="form-label">Tag Value:</label>
                        <input type="text" className="form-control" id="tagValue" value={tagValue} onChange={handleTagValueChange} />
                    </div>

                    <div className="mb-3 d-flex align-items-end">
                        <button type="button" className="btn btn-primary" onClick={addTag}>Add Tag</button>
                    </div>
                </div>
                {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}

                <div className="mb-3">
                    <ul className="list-group">
                        {tags.map((tag, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                {tag}
                                <button type="button" className="btn-close" onClick={() => removeTag(index)} aria-label="Close"></button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button disabled={userInfo.status === "USER_ACTIVATED" ? ("") : "disabled"} type="submit" className="btn btn-success">Upload</button>
                {!(userInfo.status === "USER_ACTIVATED") &&
                    <div class="alert alert-warning mt-3" role="alert">
                        You cannot upload images now
                    </div>
                }
            </form>
        </Container>

    );
};

export default CreatePostForm;
