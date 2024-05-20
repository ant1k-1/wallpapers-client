import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const TagSearch = ({ accessToken: accessToken, handleSelectTags:handleSelectTags, handleSearch: handleSearch, handleReset: handleReset }) => {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const trimmedSearchText = searchText.trim();
        if (!trimmedSearchText) {
            setSearchResults([]);
            return;
        }

        axios.get(`http://localhost:8080/api/tags/${trimmedSearchText}`, {
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            withCredentials: true,
        })
            .then(response => {
                setSearchResults(response.data);
            })
            .catch(error => {
                console.error('Error fetching tags:', error);
            });
    }, [searchText, accessToken]);

    useEffect(() => {
        handleSelectTags(selectedTags.map(tag => `${tag.tagType.toLowerCase()}:${tag.tagName}`));
        
    }, [selectedTags]);

    const handleTagClick = (tag) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags(prevTags => [...prevTags, tag]);
        }
        setSearchText('');
        setSearchResults([]);
    };

    const removeTag = (toRemoveTag) => {
        setSelectedTags(prevTags => prevTags.filter(tag => tag.tagName !== toRemoveTag.tagName));
    };

    //{tagId: 12, tagType: 'TITLE', tagName: 'someanime', usageCount: 0}
    const chooseColor = (tagType) => {
        switch (tagType) {
            case 'TITLE': return "#1303fb";
            case 'TAG': return "#6d757d";
            case 'AUTHOR': return "#e91aff";
            default: return "6d757d";
        }
    }

    return (
        <div className="mb-3 mx-3">
            <Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="artist, title, tag..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="me-2 flex-grow-1"
                    aria-label="Search"
                />
                <Button variant="primary" onClick={handleSearch}>Search</Button>
                <Button variant="outline-primary ms-2" onClick={handleReset}>Reset</Button>
            </Form>
            <div className="list-group" style={{position: "absolute", width: "73%"}}>
                {searchResults.map(tag => (
                    <button
                        key={tag.tagId}
                        type="button"
                        className="list-group-item list-group-item-action"
                        onClick={() => handleTagClick(tag)}
                    >
                        <div className='d-flex justify-content-between'>
                            <div>
                                {tag.tagType === 'TAG' ? <span></span> : <span style={{color: chooseColor(tag.tagType).toString()}} >{tag.tagType.toLowerCase()}:</span>}
                                <span>{tag.tagName}</span>
                            </div>
                            <span>({tag.usageCount})</span>
                        </div>
                    </button>
                ))}
            </div>
            <div className="mt-3">
                {selectedTags.map((tag, index) => (
                    <span style={{backgroundColor: chooseColor(tag.tagType).toString()}} key={index} className="badge me-2 mb-1">
                        {tag.tagName}
                        <button type="button" className="btn-close btn-close-white ms-2" aria-label="Close" onClick={() => removeTag(tag)}></button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TagSearch;