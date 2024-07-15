import React, { useEffect } from "react";
import { useState } from "react";
import axios from 'axios';

const Home = () => {
    const [publications, setPublications] = useState([]);
    const [authors, setAuthors] = useState([]);

    const [publicationEditIndex, setPublicationEditIndex] = useState();
    // Array: [title, year, first name, last name]
    const [publicationEditData, setPublicationEditData] = useState({
        id:"",
        title:"",
        year:"",
        first_name:"",
        last_name:""
    });

    const [publicationCreatedata, setPublicationCreateData] = useState({
        title:"",
        year: "",
        authorID: "",
    });

    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState(<></>);

    const [fetch, setFetch] = useState(true);

    function getPublicationFromID(id) {
        return publications.find((pub) => 
            pub.id == id
        )
    }

    function handleSelectionChange(e) {
        if (e.target.value != "")
            setPublicationEditIndex(e.target.value);
    }

    function getEditButtons() {
        if (getPublicationFromID(publicationEditIndex) != null){
            return <>
                <span className="clarification-text">Empty fields will remain unchanged</span>
                <div>
                    <span className="update-data-button edit-field-button" onClick={handleUpdateDataPressed}>Update Data</span>
                    <span className="delete-data-button edit-field-button" onClick={handleDeleteDataPressed}>Delete Publication</span>
                </div>
            </>;
        }
        return <></>
    }

    function handleUpdateDataPressed() {
        let newData = publicationEditData;
        let oldData = getPublicationFromID(publicationEditIndex);
        console.log(oldData);
        if (newData.title == null || newData.title.length < 1) {
            newData.title = oldData.title;
        }

        if (newData.year == null || newData.year.toString().length < 1) {
            newData.year = oldData.year;
        } else {
            newData.year = parseInt(newData.year);
        }

        newData.id = oldData.id;
        newData.first_name = oldData.first_name;
        newData.last_name = oldData.last_name;
        

        setPublicationEditData(newData);
        setPopupContent(<>
            <span className="popup-container-title">Are you sure you want to continue?</span>
            <div className="edit-data-preview">
                <span>{oldData.title}</span>
                <span>{oldData.year}</span>
                <span>{oldData.first_name}</span>
                <span>{oldData.last_name}</span>
            </div>
            <span>will be replaced with</span>
            <div className="edit-data-preview">
                <span>{newData.title}</span>
                <span>{newData.year}</span>
                <span>{newData.first_name}</span>
                <span>{newData.last_name}</span>
            </div>
            <div className="confirmation-buttons-container">
                <span onClick={confirmDataUpdate} className="update-data-button edit-field-button">Confirm</span>
                <span onClick={clearAndClosePopup} className="delete-data-button edit-field-button">Cancel</span>
            </div>
            
        </>)
        setShowPopup(true);

    }

    async function confirmDataUpdate() {
        await axios.post('http://localhost:8800/update', publicationEditData)
        .then(function (response) {
            console.log(response);
            setPopupContent(<>
                <span className="popup-container-title">Publication updated succesfully</span>
                <span onClick={clearAndClosePopup} className="update-data-button edit-field-button">Close</span>
            </>)
        })
        .catch(function (error) {
            showErrorPopup(error.message)
        })

        setFetch(true);
    }

    function clearAndClosePopup() {
        setPopupContent(<></>);
        setShowPopup(false);
    }

    function handleDeleteDataPressed() {
        let oldData = getPublicationFromID(publicationEditIndex);
        setPopupContent(<>
            <span className="popup-container-title">Are you sure you want to continue?</span>
            <div className="edit-data-preview">
                <span>{oldData.title}</span>
                <span>{oldData.year}</span>
                <span>{oldData.first_name}</span>
                <span>{oldData.last_name}</span>
            </div>
            <span className="deletion-clarification-text">will be deleted.</span>
            <div className="confirmation-buttons-container">
            <span onClick={confirmDataDelete} className="update-data-button edit-field-button">Confirm</span>
            <span onClick={clearAndClosePopup} className="delete-data-button edit-field-button">Cancel</span>
            </div>
        </>)
        setShowPopup(true);
    }

    async function confirmDataDelete() {
        await axios.post('http://localhost:8800/delete', getPublicationFromID(publicationEditIndex))
        .then(function (response) {
            console.log(response);
            setPopupContent(<>
                <span className="popup-container-title">Publication deleted succesfully</span>
                <span onClick={clearAndClosePopup} className="update-data-button edit-field-button">Close</span>
            </>)
        })
        .catch(function (error) {
            setPopupContent(<>
                <span className="popup-container-title">An error has occurred</span>
                <span className="error-message">{error.message}</span>
                <span onClick={clearAndClosePopup} className="delete-data-button edit-field-button">Close</span>
            </>)
        })
        setPublicationEditData(0)
        setFetch(true);
    }

    function handlePublicationEdit(e) {
        setPublicationEditData((previous) => ({...previous, [e.target.name]: e.target.value})); 
    }

    function getPopup() {
        if (showPopup) {
            return <div className="popup-container">
                <div className="popup-content-container">
                    {popupContent}
                </div>
            </div>
        }
    }

    useEffect(() => {
        if (fetch) {
            const fetchAllBooks = async () => {
                try {
                    const response = await axios.get("http://localhost:8800/publications");
                    setPublications(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.log(error);
                }
            };
    
            fetchAllBooks();
    
            const fetchAuthors = async () => {
                try {
                    const response = await axios.get("http://localhost:8800/authors");
                    setAuthors(response.data);
                } catch (error) {
                    console.log(error);
                }
            }
    
            fetchAuthors();

            setFetch(false);
        }
        
    }, [fetch]);

    function showErrorPopup(message) {
        setPopupContent(<>
            <span className="popup-container-title">An error has occurred</span>
            <span className="error-message">{message}</span>
            <span onClick={clearAndClosePopup} className="delete-data-button edit-field-button">Close</span>
        </>)
        setShowPopup(true);
    }

    function handlePublicationCreateUpdate(e) {
        setPublicationCreateData((previous) => ({...previous, [e.target.name]: e.target.value}));
    }

    function handleCreatePressed() {
        let pubData = publicationCreatedata;
        if (pubData.title.length < 1)
            showErrorPopup("Invalid title")
        if (pubData.year.length < 1 || parseInt(pubData.year) == NaN)
            showErrorPopup("Invalid year")

        console.log(pubData);
        confirmCreate();
    }

    async function confirmCreate() {
        await axios.post('http://localhost:8800/create', publicationCreatedata)
        .then(function (response) {
            console.log(response);
            setPopupContent(<>
                <span className="popup-container-title">Publication updated succesfully</span>
                <span onClick={clearAndClosePopup} className="update-data-button edit-field-button">Close</span>
            </>)
        })
        .catch(function (error) {
            showErrorPopup(error.message)
        })

        setFetch(true);
    }

    return <div className="page-container">
            <span className="page-title">Publication CRUD application</span>
            <span className="section-header">View publications</span>
            <table className="publication-table">
                <tbody className="publication-table-body">
                    <tr key="0" className="publication-table-row publication-table-header">
                        <th>ID</th>
                        <th>Title</th>
                        <th>Year</th>
                        <th>Author First Name</th>
                        <th>Author Last Name</th>
                    </tr>
                    {publications.map(pub => {
                        return <tr key={pub.id} className="publication-table-row">
                            <td>{pub.id}</td>
                            <td>{pub.title}</td>
                            <td>{pub.year}</td>
                            <td>{pub.first_name}</td>
                            <td>{pub.last_name}</td>
                        </tr>
                    })}
                </tbody>
            </table>
            <div className="edit-section-container">
                <span className="section-header">Edit/Delete Publication</span>
                <div className="edit-dropdown-container">
                    <select className="edit-dropdown" defaultValue="" onClick={handleSelectionChange} onInput={handleSelectionChange}>
                        <option key="0" value="" disabled hidden>Select publication to edit</option>
                        {publications.map(pub => {
                            return <option key={pub.id} value={pub.id}>{`${pub.title} (${pub.year}) - ${pub.first_name} ${pub.last_name}`}</option>
                        })}
                    </select>
                </div>
                <table className="publication-table">
                    <tbody className="publication-table-body">
                        <tr key="0">
                            <th></th>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Year</th>
                            <th>Author First Name</th>
                            <th>Author Last Name</th>
                        </tr>
                        {[getPublicationFromID(publicationEditIndex)].map(pub => {
                            if (pub != null)
                            return <>
                                <tr key={pub.id}>
                                    <td>Old Data</td>
                                    <td>{pub.id}</td>
                                    <td>{pub.title}</td>
                                    <td>{pub.year}</td>
                                    <td>{pub.first_name}</td>
                                    <td>{pub.last_name}</td>
                                </tr>
                                <tr key={pub.id + 1}>
                                    <td>New Data</td>
                                    <td>{pub.id}</td>
                                    <td><input onInput={handlePublicationEdit} className="edit-field-text-box" type="text" name="title"/></td>
                                    <td><input onInput={handlePublicationEdit} className="edit-field-text-box" type="number" name="year"/></td>
                                    <td>{pub.first_name}</td>
                                    <td>{pub.last_name}</td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </table>
                {getEditButtons()}
                {getPopup()}
            </div>
            <div className="create-section-container">
                <span className="section-header">Create Publication</span>
                <table className="publication-table">
                    <tbody>
                        <tr key="0">
                            <th>Title</th>
                            <th>Year</th>
                            <th>Author</th>
                        </tr>
                        <tr key="1">
                            <td><input onInput={handlePublicationCreateUpdate} className="edit-field-text-box" type="text" name="title"/></td>
                            <td><input onInput={handlePublicationCreateUpdate} className="edit-field-text-box" type="number" name="year"/></td>
                            <td>
                                <select onInput={handlePublicationCreateUpdate} defaultValue="" name="authorID">
                                    <option key="0" value="" disabled hidden>Select author</option>
                                    {authors.map(author => {
                                        return <option key={author.id} value={author.id}>{`${author.first_name} ${author.last_name}`}</option>
                                    })}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <span className="update-data-button edit-field-button" onClick={handleCreatePressed}>Create Publication</span>
            </div>
    </div>
}

export default Home