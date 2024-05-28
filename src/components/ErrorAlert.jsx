

export const ErrorAlert = ({ error: error }) => {
    return (
        <>
            {error && (
                <div className="mt-3">
                    {error.map((err, index) => (
                        <div key={index} className="alert alert-danger" role="alert">
                            {err}
                        </div>
                    ))}
                </div>
            )}
        </>
    )

}

export default ErrorAlert;