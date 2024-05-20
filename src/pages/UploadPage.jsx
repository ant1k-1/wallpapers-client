import { Card } from "react-bootstrap"
import CreatePostForm from "../components/Forms/CreatePostForm"

const UploadPage = () => {
    return (
        <>
        <Card className="p-5">
            <h1>Upload image</h1>
            <CreatePostForm />
        </Card>
        </>
    )
}

export {UploadPage}